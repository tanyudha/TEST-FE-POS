<template>
  <div>
    <v-label>{{ label }}</v-label>
    <div class="container">
      <v-autocomplete
        v-model="data.item"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        cache-items
        flat
        hide-no-data
        hide-details
        outlined
        label="Nama Barang"
        placeholder="-"
        persistent-placeholder
        item-text="name"
        item-value="name"
        return-object
      ></v-autocomplete>
      <v-text-field
        v-model="data.qty"
        label="Jumlah Barang"
        type="number"
        min="0"
        outlined
        step="1"
        :rules="[rules.required, rules.minValue(0)]"
      />
    </div>
    <v-btn text large outlined block :disabled="!allowAddItem" @click="onAdd"
      >Tambah Barang</v-btn
    >
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { debounce } from "~/utils/FunctionUtil";
import { minValue, required } from "~/utils/FormUtil";
import { buildQuery } from "~/utils/ApiUtils";
import { getAllItems } from "~/API/item";

const DEFAULT_ITEMS_LENGTH = 5;

export default Vue.extend({
  props: {
    label: {
      type: String,
      default: "Tambah Barang",
    },
    isReset: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      search: null,
      items: [],
      data: {
        item: { name: "" },
        qty: 0,
      },
      rules: {
        minValue,
        required,
      },
    };
  },
  computed: {
    allowAddItem(): boolean {
      return !!(this.data.item?.name && this.data.qty > 0);
    },
  },
  watch: {
    search(query) {
      query && query !== this.data.item.name && this.triggerSearch(query);
    },
    isReset(value) {
      if (value)
        this.data = {
          item: { name: "" },
          qty: 0,
        };
    },
  },
  mounted() {
    this.triggerSearch = debounce(this.triggerSearch);
  },
  methods: {
    async triggerSearch(query: string) {
      this.loading = true;

      const q = query ? { query } : "";
      const params = buildQuery(q, undefined, 0, DEFAULT_ITEMS_LENGTH);
      const res = await getAllItems(this, params);

      this.items = res.items;
      this.loading = false;
    },
    onAdd() {
      this.$emit("add-item", { ...this.data, qty: +this.data.qty });
      this.data = {
        item: { name: "" },
        qty: 0,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
@use 'styles/abstracts/' as *;

.container {
  @include flex_center(row, 0px, flex-start);
  padding: 12px 0 0 0;
}
</style>
