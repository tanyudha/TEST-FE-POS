<template>
  <v-card elevation="0">
    <v-form ref="form" :disabled="isLoading" @submit.prevent="saveDiscount">
      <v-card-text>
        <v-text-field
          v-model="discount.name"
          label="Nama diskon"
          max-length="70"
          outlined
          :rules="[rules.required, rules.max(70)]"
        />
        <v-switch
          v-model="discount.isPercentage"
          :label="discount.isPercentage ? 'Berupa Persentase' : 'Berupa Nominal'"
          outlined
        />
        <v-text-field
          v-model="discount.percentage"
          label="Persentase Potongan"
          suffix="%"
          type="number"
          min="0"
          step="1"
          outlined
          :rules="[rules.required, rules.minValue(0)]"
          :disabled="!discount.isPercentage"
        />
        <v-text-field
          v-model="discount.amount"
          label="Nominal Potongan"
          prefix="Rp."
          type="number"
          min="0"
          outlined
          step="1000"
          :rules="[rules.required, rules.minValue(0)]"
          :disabled="discount.isPercentage"
        />
        <v-switch
          v-model="discount.isActive"
          :label="discount.isActive ? 'Status : Aktif' : 'Status : NonAktif'"
          outlined
        />
      </v-card-text>
      <v-col class="pa-4">
        <v-btn
          color="primary"
          type="submit"
          class="mb-2"
          block
          large
          :disabled="saveDisabled"
          >{{ isEdit ? "Simpan Perubahan" : "Buat Diskon" }}</v-btn
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
          >Hapus Diskon</v-btn
        >
      </v-col>
    </v-form>
    <v-dialog v-model="deleteDialog" max-width="300px">
      <v-card>
        <v-card-title>Hapus Diskon</v-card-title>
        <v-card-text
          >Apakah Anda yakin akan menghapus data ini? Tindakan ini tidak dapat
          dibatalkan.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="deleteDialog = false"
            >Batal</v-btn
          >
          <v-btn color="red" text @click="deleteDiscount">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
// eslint-disable-next-line
import Vue, { VueConstructor } from "vue";
import { createDiscount, updateDiscount, deleteDiscount } from "~/API/discount";

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
      discount: {
        id: 0,
        name: "",
        isPercentage : false,
        amount : 0,
        percentage : 0,
        isActive : false
      },
      saveDialog: false,
      deleteDialog: false,
      loading: false,
      rules: {
        required: (value: string) =>
          !!value || +value >= 0 || "Tidak boleh kosong",
        max: (length: number) => (value: string) =>
          (value && value.length <= length) ||
          `Tidak boleh lebih dari ${length} karakter`,
        minValue: (number: number) => (value: number) =>
          value >= number || `Minimal ${number}`,
        maxValue: (number: number) => (value: number) =>
          value <= number || `Maximal ${number}`,
      },
    };
  },
  computed: {
    isLoading(): boolean {
      return this.loading || this.loadingProps;
    },
    isEdit(): boolean {
      return !!this.$route.params.id;
    },
    _discount(): Object {
      const discount = {
        name: this.discount.name,
        is_percentage: +this.discount.isPercentage,
        amount: +this.discount.amount,
        percentage: +this.discount.percentage,
        isActive: +this.discount.isActive,
      } as any;

      if (this.isEdit) {
        discount.id = this.discount.id;
      } else {
        delete discount.id;
      }

      return discount;
    },
    saveDisabled(): boolean {
      return !this.$modified.value;
    },
  },
  watch: {
    initialData: {
      deep: true,
      handler(value) {
        this.discount = value;
      },
    },
    discount: {
      deep: true,
      handler(newVal, oldVal) {
        if (!this.$modified.value && newVal.id === oldVal.id) {
          this.$modified.setVal(true);
        }
      },
    },
  },
  mounted() {
    if (this.initialData?.id) {
      this.discount = this.initialData;
    }
  },
  methods: {
    cancel() {
      this.$modified.setVal(false);
      this.$router.push("/daftar-barang");
    },
    async saveDiscount() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        if (this.isEdit) {
          await updateDiscount(this, this._discount);
          this.$emit("update", this._discount);
        } else {
          const res = await createDiscount(this, this._discount);
          this.$emit("create", res.data);
          this.$refs.form.reset();
        }

        this.$toast.show("Data berhasil disimpan");
        this.$modified.setVal(false);
      } catch (error) {
        this.$toast.global.asyncError(error);
      } finally {
        this.loading = false;
      }
    },
    async deleteDiscount() {
      this.loading = true;
      try {
        await deleteDiscount(this, this.discount.id)

        this.$toast.show("Data berhasil dihapus");
        this.$emit("delete", this.discount.id);
        this.$modified.setVal(false);
        this.$router.push("/daftar-diskon");
      } catch (error) {
        this.$toast.global.asyncError(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
