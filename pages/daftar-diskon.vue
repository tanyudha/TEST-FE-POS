<template>
  <global-container :title="title">
    <template slot="default">
      <div class="control">
        <Search
          label="Cari Diskon"
          :timeout="5000"
          create-new-button
          @on-search="onSearch"
        />
      </div>
      <Table
        v-if="data.length"
        :data="parseDiscounts(data)"
        :headers="headers"
        @on-row-click="onRowClick"
        @load-more="onLoadMore"
      />
    </template>
    <template v-if="showChild" slot="right">
      <nuxt-child @delete="onDelete" @create="onCreate" @update="onUpdate" />
    </template>
    <unsaved-dialog v-model="unsavedDialog" @proceed="selectRow" />
  </global-container>
</template>

<script lang="ts">
import Vue from "vue";

import { getAllDiscounts } from "~/API/discount";

import {
  DISCOUNT_HEADERS,
  parseDiscounts,
  updateDiscount,
  deleteDiscount,
} from "~/utils/tables/daftar-diskon";
import { buildQuery } from "~/utils/ApiUtils";

import Search from "~/components/Search.vue";
import Table from "~/components/tables/daftar-barang.vue";
import GlobalContainer from "~/components/global/global-container.vue";

const DEFAULT_DISCOUNT_LENGTH = 20;

export default Vue.extend({
  name: "DaftarDiskon",
  components: { Search, Table, GlobalContainer },
  middleware: ["authenticated", "is-admin"],
  data() {
    return {
      data: [] as any,
      page: 0,
      dataCounts: 0,
      headers: DISCOUNT_HEADERS,
      query: "",
      showChild: false,
      unsavedDialog: false,
      activeId: 0,
    };
  },
  computed: {
    title(): string {
      return !this.showChild
        ? "Daftar Diskon"
        : this.$route.fullPath.includes("buat-baru")
        ? "Buat Diskon"
        : "Edit Diskon";
    },
  },
  watch: {
    $route: {
      deep: true,
      handler(val) {
        this.showChild = !!val.params.id || val.fullPath.includes("buat-baru");
      },
    },
  },
  async mounted() {
    this.$modified.setVal(false);
    await this.fetchInit();
    this.showChild =
      !!this.$route.params.id || this.$route.fullPath.includes("buat-baru");
    if (this.$route.params.id) this.activeId = parseInt(this.$route.params.id);
  },
  methods: {
    async fetchInit() {
      try {
        const params = buildQuery(
          undefined,
          undefined,
          this.page,
          DEFAULT_DISCOUNT_LENGTH
        );
        const res = await getAllDiscounts(this, params);

        this.data = [...res.discounts];
        this.dataCounts = res.totalDiscounts;
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    async onLoadMore(): Promise<void> {
      try {
        if (this.data.length >= this.dataCounts) return;

        this.page = this.page + 1;

        const q = this.query ? { query: this.query } : undefined;
        const params = buildQuery(
          q,
          undefined,
          this.page,
          DEFAULT_DISCOUNT_LENGTH
        );
        const res = await getAllDiscounts(this, params);

        this.data = [...this.data, ...res.items];
        this.dataCounts = res.totalItems;
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    async onSearch(query: string): Promise<void> {
      try {
        this.page = 0;

        const q = query ? { query } : undefined;
        const params = buildQuery(
          q,
          undefined,
          this.page,
          DEFAULT_DISCOUNT_LENGTH
        );
        const res = await getAllDiscounts(this, params);

        this.query = query;
        this.data = res.items;
        this.dataCounts = res.totalItems;
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    onCreate() {
      this.reset();
      this.fetchInit();
    },
    onUpdate(discount: any) {
      updateDiscount(this, discount);
    },
    onDelete(id: number) {
      deleteDiscount(this, id);
    },
    onRowClick({ id }: any): void {
      if (this.$modified.value) {
        this.unsavedDialog = true;
        this.activeId = id;
        return;
      }
      this.$router.push(`/daftar-diskon/${id}`);
    },
    selectRow() {
      this.unsavedDialog = false;
      this.$router.push(`/daftar-diskon/${this.activeId}`);
    },
    reset() {
      this.data = [];
      this.page = 0;
      this.dataCounts = 0;
      this.query = "";
      this.activeId = 0;
    },
    parseDiscounts,
  },
});
</script>
