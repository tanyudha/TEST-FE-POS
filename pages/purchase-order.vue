<template>
  <global-container :title="title" datepicker>
    <template slot="default">
      <div>
        <Search
          label="Cari Purchase Order"
          :timeout="5000"
          create-new-button
          @on-search="onSearch"
        />
      </div>
      <Table
        v-if="data.length"
        :data="data"
        :headers="headers"
        @on-row-click="onRowClick"
        @load-more="onLoadMore"
      />
      <div v-else class="grey--text text-center pa-2 empty-table">
        Tidak ditemukan purchase order yang sesuai. Silakan ubah tanggal atau
        filter yang digunakan.
      </div>
    </template>
    <template v-if="showChild" slot="right">
      <nuxt-child @delete="onDelete" @create="onCreate" @update="onUpdate" />
    </template>
    <unsaved-dialog v-model="unsavedDialog" @proceed="selectRow" />
  </global-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

import { getAllPurchaseOrder } from "~/API/purchase-order";
import { PO_HEADERS, updatePO, deletePO } from "~/utils/tables/purchase-order";

import Search from "~/components/Search.vue";
import Table from "~/components/tables/daftar-barang.vue";
import GlobalContainer from "~/components/global/global-container.vue";

const DEFAULT_PO_LENGTH = 50;

export default Vue.extend({
  name: "PurchaseOrder",
  components: { Search, Table, GlobalContainer },
  middleware: ["authenticated"],
  data() {
    return {
      data: [] as any,
      page: 0,
      dataCounts: 0,
      headers: PO_HEADERS,
      query: "",
      showChild: false,
      unsavedDialog: false,
      activeId: 0,
    };
  },
  computed: {
    ...mapGetters("global", ["date"]),
    title(): string {
      return !this.showChild
        ? "Daftar Purchase Order"
        : this.$route.fullPath.includes("buat-baru")
        ? "Buat Purchase Order"
        : "Edit Purchase Order";
    },
    url(): string {
      let text = `?date=${this.date}`;
      text += `&page=${this.page}&limit=${DEFAULT_PO_LENGTH}`;
      text += `&query=${this.query}`;
      return text;
    },
  },
  watch: {
    $route: {
      deep: true,
      handler(val) {
        this.showChild = !!val.params.id || val.fullPath.includes("buat-baru");
      },
    },
    async date() {
      await this.onSearch("");
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
        const res = await getAllPurchaseOrder(this, this.url);

        this.data = [...res.purchaseOrders];
        this.dataCounts = res.totalPurchaseOrder;
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    async onLoadMore(): Promise<void> {
      try {
        if (this.data?.length >= this.dataCounts) return;

        this.page = this.page + 1;
        const res = await getAllPurchaseOrder(this, this.url);

        this.data = [...this.data, ...res.purchaseOrders];
        this.dataCounts = res.totalPurchaseOrder;
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    async onSearch(query: string): Promise<void> {
      try {
        this.page = 0;
        const res = await getAllPurchaseOrder(this, this.url);

        this.query = query;
        this.data = res.purchaseOrders;
        this.dataCounts = res.totalPurchaseOrder;
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    onCreate() {
      this.$modified.setVal(false);
      this.reset();
      this.fetchInit();
    },
    onUpdate(PO: any) {
      updatePO(this, PO);
    },
    onDelete(id: number) {
      deletePO(this, id);
    },
    onRowClick({ id }: any): void {
      if (this.$modified.value) {
        this.unsavedDialog = true;
        this.activeId = id;
        return;
      }
      this.$router.push(`/purchase-order/${id}`);
    },
    selectRow() {
      this.unsavedDialog = false;
      this.$router.push(`/purchase-order/${this.activeId}`);
    },
    reset() {
      this.data = [];
      this.page = 0;
      this.dataCounts = 0;
      this.query = "";
      this.activeId = 0;
    },
  },
});
</script>

<style lang="scss" scoped>
.empty-table {
  max-width: 400px;
  margin: 0 auto;
}
</style>
