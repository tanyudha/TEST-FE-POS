<template>
  <v-card elevation="0">
    <v-form ref="form" :disabled="isLoading" @submit.prevent="savePO">
      <v-card-text>
        <v-text-field
          v-if="false"
          v-model="purchaseorder.createdAt"
          label="Tanggal"
          outlined
          disabled
        />
        <v-text-field
          v-model="purchaseorder.supplier"
          label="Supplier"
          placeholder=""
          outlined
          persistent-placeholder
          :disabled="isEdit"
        />
        <v-label v-if="purchaseorder.purchase_order_details.length"
          >Daftar Item</v-label
        >
        <Table
          v-if="purchaseorder.purchase_order_details.length"
          :data="purchaseorder.purchase_order_details"
          :headers="headers"
          :deletable-row="true"
        />
        <br v-if="purchaseorder.purchase_order_details.length" />
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
          >Buat Purchase Order</v-btn
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
          >Hapus Purchase Order</v-btn
        >
      </v-col>
    </v-form>
    <v-dialog v-model="deleteDialog" max-width="300px">
      <v-card>
        <v-card-title>Hapus Purchase Order</v-card-title>
        <v-card-text
          >Apakah Anda yakin akan menghapus data ini? Tindakan ini tidak dapat
          dibatalkan.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="deleteDialog = false"
            >Batal</v-btn
          >
          <v-btn color="red" text @click="deletePO">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
// eslint-disable-next-line
import Vue, { VueConstructor } from "vue";

import { PO_DETAILS_HEADERS } from "~/utils/tables/purchase-order";
import { required, max, minValue, maxValue } from "~/utils/FormUtil";
import Table from "~/components/Table.vue";
import { todayDate } from "~/utils/TimeUtil";

import ItemAdder from "~/components/control/ItemAdder.vue";
import { createPurchaseOrder, deletePurchaseOrder } from "~/API/purchase-order";

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
      purchaseorder: {
        id: this.initialData.id || 0,
        createdAt: todayDate(),
        supplier: "",
        purchase_order_details: [] as any,
      },
      headers: PO_DETAILS_HEADERS,
      saveDialog: false,
      deleteDialog: false,
      loading: false,
      isReset: false,
      rules: { required, max, minValue, maxValue },
    };
  },
  computed: {
    isLoading(): boolean {
      return this.loading || this.loadingProps;
    },
    isEdit(): boolean {
      return !!this.$route.params.id && this.$route.params.id !== "buat-baru";
    },
    _purchaseorder(): Object {
      const purchaseorder = {
        supplier: this.purchaseorder.supplier,
        createdAt: this.purchaseorder.createdAt,
        items: this.purchaseorder.purchase_order_details.map((row: any) => {
          const { name } = row.item;
          return { ...row, name };
        }),
      } as any;

      if (this.isEdit) {
        purchaseorder.id = this.purchaseorder.id;
      } else {
        delete purchaseorder.id;
      }

      return purchaseorder;
    },
    saveDisabled(): boolean {
      return (
        !this.$modified.value ||
        !this.purchaseorder.purchase_order_details.length
      );
    },
  },
  watch: {
    initialData: {
      deep: true,
      handler(value) {
        this.purchaseorder = value;
      },
    },
    purchaseorder: {
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
      this.purchaseorder = this.initialData;
    }
  },
  methods: {
    cancel() {
      this.$modified.setVal(false);
      this.$router.push("/purchase-order");
    },
    async savePO() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        const res = await createPurchaseOrder(this, this._purchaseorder);
        this.$emit("create", res.data);
        this.isReset = true;
        this.isReset = false;
        this.$refs.form.reset();

        this.purchaseorder.purchase_order_details = [];
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
    async deletePO() {
      this.loading = true;
      try {
        await deletePurchaseOrder(this, this.purchaseorder.id);

        this.$toast.show("Data berhasil dihapus");
        this.$emit("delete", this.purchaseorder.id);
        this.$modified.setVal(false);
        this.$router.push("/purchase-order");
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
      this.purchaseorder.purchase_order_details = [
        ...this.purchaseorder.purchase_order_details,
        newItem,
      ];
    },
  },
});
</script>
