<template>
  <v-card elevation="0">
    <v-form ref="form" :disabled="isLoading" @submit.prevent="saveAdjustment">
      <v-card-text>
        <v-text-field
          v-if="false"
          v-model="adjustment.createdAt"
          label="Tanggal"
          outlined
          disabled
        />
        <v-text-field
          v-model="adjustment.description"
          label="Notes"
          outlined
          :disabled="isEdit"
        />
        <v-label v-if="adjustment.adjustment_details.length"
          >Daftar Item</v-label
        >
        <Table
          v-if="adjustment.adjustment_details.length"
          :data="adjustment.adjustment_details"
          :headers="headers"
          :deletable-row="true"
        />
        <ItemAdder
          v-if="!isEdit"
          label="Tambah Barang"
          :is-reset="isReset"
          @add-item="addItem"
        />
      </v-card-text>
      <v-col class="pa-4">
        <v-btn
          v-if="!isEdit"
          color="primary"
          type="submit"
          class="mb-2"
          block
          large
          :disabled="saveDisabled"
          >Buat Adjustment</v-btn
        >
        <v-btn
          v-if="!isEdit"
          color="secondary"
          text
          large
          outlined
          block
          @click="cancel"
          >Batal</v-btn
        >
        <v-btn
          v-else
          color="red"
          text
          large
          outlined
          block
          @click="deleteDialog = true"
          >Hapus Adjustment</v-btn
        >
      </v-col>
    </v-form>
    <v-dialog v-model="deleteDialog" max-width="300px">
      <v-card>
        <v-card-title>Hapus Adjustment</v-card-title>
        <v-card-text
          >Apakah Anda yakin akan menghapus data ini? Tindakan ini tidak dapat
          dibatalkan.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="deleteDialog = false"
            >Batal</v-btn
          >
          <v-btn color="red" text @click="onDelete">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
// eslint-disable-next-line
import Vue, { VueConstructor } from "vue";
import Table from "~/components/Table.vue";
import ItemAdder from "~/components/control/ItemAdder.vue";
import { todayDate } from "~/utils/TimeUtil";

import { ADJUSTMENT_DETAILS_HEADERS } from "~/utils/tables/adjustment";
import { createAdjustment, deleteAdjustment } from "~/API/adjustment";

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        form: {
          validate: Function;
          reset: Function;
        };
      };
    }
  >
).extend({
  components: { Table, ItemAdder },
  props: {
    initialData: {
      type: Object,
      default: () => ({}),
    },
    loadingProps: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      adjustment: {
        id: 0,
        createdAt: todayDate(),
        description: "",
        item_names: "",
        item_count: 0,
        total_count: 0,
        adjustment_details: [] as any,
      },
      headers: ADJUSTMENT_DETAILS_HEADERS,
      saveDialog: false,
      deleteDialog: false,
      loading: false,
      isReset: false,
    };
  },
  computed: {
    isLoading(): boolean {
      return this.loading || this.loadingProps;
    },
    isEdit(): boolean {
      return !!this.$route.params.id && this.$route.params.id !== "buat-baru";
    },
    _adjustment(): Object {
      const adjustment = {
        createdAt: this.adjustment.createdAt,
        description: this.adjustment.description,
        item_names: this.adjustment.item_names,
        item_count: this.adjustment.item_count,
        total_count: this.adjustment.total_count,
        items: this.adjustment.adjustment_details.map((row: any) => {
          const { name } = row.item;
          return { ...row, name };
        }),
      } as any;

      if (this.isEdit) {
        adjustment.id = this.adjustment.id;
      } else {
        delete adjustment.id;
      }

      return adjustment;
    },
    saveDisabled(): boolean {
      return !this.$modified.value;
    },
  },
  watch: {
    initialData: {
      deep: true,
      handler(value) {
        this.adjustment = value;
      },
    },
    adjustment: {
      deep: true,
      handler(newVal, oldVal) {
        if (
          !this.$modified.value &&
          newVal.id === oldVal.id &&
          !this.$route.params.id
        ) {
          this.$modified.setVal(true);
        }
      },
    },
  },
  mounted() {
    if (this.initialData?.id) {
      this.adjustment = this.initialData;
    }
  },
  methods: {
    cancel() {
      this.$modified.setVal(false);
      this.$router.push("/adjustment");
    },
    async saveAdjustment() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        const res = await createAdjustment(this, this._adjustment);
        this.$emit("create", res.data);
        this.isReset = true;
        this.isReset = false;
        this.$refs.form.reset();

        this.adjustment.adjustment_details = [];
        this.$toast.show("Data berhasil disimpan");
        setTimeout(() => {
          this.$modified.setVal(false);
        }, 50);
      } catch (error) {
        this.$toast.global.asyncError(error);
      } finally {
        this.loading = false;
      }
    },
    async onDelete() {
      this.loading = true;
      try {
        await deleteAdjustment(this, this.adjustment.id);

        this.$toast.show("Data berhasil dihapus");
        this.$emit("delete", this.adjustment.id);
        this.$modified.setVal(false);
        this.$router.push("/adjustment");
      } catch (error) {
        this.$toast.global.asyncError(error);
      } finally {
        this.loading = false;
      }
    },
    addItem(newItem: any) {
      newItem = {
        item_id: newItem.item.id,
        item_name: newItem.item.name,
        ...newItem,
      };
      this.adjustment.adjustment_details = [
        ...this.adjustment.adjustment_details,
        newItem,
      ];
    },
  },
});
</script>
