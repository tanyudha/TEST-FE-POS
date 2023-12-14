<template>
  <v-card elevation="0">
    <v-form ref="form" :disabled="isLoading" @submit.prevent="saveItem">
      <v-card-text>
        <v-text-field
          v-model="item.name"
          label="Nama barang"
          max-length="70"
          outlined
          :rules="[rules.required, rules.max(70)]"
        />
        <v-text-field
          v-model="item.retailPrice"
          label="Harga eceran"
          type="number"
          min="0"
          step="1000"
          outlined
          :rules="[rules.required, rules.minValue(0)]"
        />
        <v-text-field
          v-model="item.wholesalePrice"
          label="Harga grosir"
          type="number"
          min="0"
          step="1000"
          outlined
          :rules="[rules.required, rules.minValue(0)]"
        />
        <v-text-field
          v-model="item.stock"
          label="Stok barang"
          type="number"
          min="0"
          outlined
          :rules="[rules.required]"
          :disabled="isEdit"
        />
      </v-card-text>
      <v-col class="pa-4">
        <v-btn
          color="primary"
          type="submit"
          class="mb-2"
          block
          :disabled="saveDisabled"
          >{{ isEdit ? "Simpan Perubahan" : "Buat Barang" }}</v-btn
        >
        <v-btn
          v-if="!isEdit"
          color="secondary"
          text
          outlined
          block
          @click="cancel"
          >Batal</v-btn
        >
        <v-btn
          v-else
          color="red"
          text
          outlined
          block
          @click="deleteDialog = true"
          >Hapus Barang</v-btn
        >
      </v-col>
    </v-form>
    <v-dialog v-model="deleteDialog" max-width="300px">
      <v-card>
        <v-card-title>Hapus Barang</v-card-title>
        <v-card-text
          >Apakah Anda yakin akan menghapus data ini? Tindakan ini tidak dapat
          dibatalkan.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="deleteDialog = false"
            >Batal</v-btn
          >
          <v-btn color="red" text @click="deleteItem">Hapus</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
// eslint-disable-next-line
import Vue, { VueConstructor } from "vue";
import { createItem, deleteItem, updateItem } from "~/API/item";

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
      item: {
        id: 0,
        name: "",
        retailPrice: 0,
        wholesalePrice: 0,
        stock: 0,
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
    _item(): Object {
      const item = {
        name: this.item.name,
        price_retail: +this.item.retailPrice,
        price_wholesale: +this.item.wholesalePrice,
      } as any;

      if (this.isEdit) {
        item.id = this.item.id;
        delete item.stock;
      } else {
        item.stock = +this.item.stock;
        delete item.id;
      }

      return item;
    },
    saveDisabled(): boolean {
      return !this.$modified.value;
    },
  },
  watch: {
    initialData: {
      deep: true,
      handler(value) {
        this.item = value;
      },
    },
    item: {
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
      this.item = this.initialData;
    }
  },
  methods: {
    cancel() {
      this.$modified.setVal(false);
      this.$router.push("/daftar-barang");
    },
    async saveItem() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        if (this.isEdit) {
          await updateItem(this, this._item);
          this.$emit("update", this._item);
        } else {
          const res = await createItem(this, this._item);
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
    async deleteItem() {
      this.loading = true;
      try {
        await deleteItem(this, this.item.id)

        this.$toast.show("Data berhasil dihapus");
        this.$emit("delete", this.item.id);
        this.$modified.setVal(false);
        this.$router.push("/daftar-barang");
      } catch (error) {
        this.$toast.global.asyncError(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
