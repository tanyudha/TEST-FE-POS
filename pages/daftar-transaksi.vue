<template>
  <global-container :title="title" datepicker>
    <template slot="default">
      <div>
        <Search
          label="Cari Transaksi"
          :timeout="5000"
          filter
          @open-filter="filterDialog = true"
          @on-search="onSearch"
        />
      </div>
      <Table
        v-if="data.length"
        :data="data"
        :headers="headers"
        :shrink="showChild"
        @on-row-click="onRowClick"
        @load-more="fetchItems"
      />
      <div v-else class="grey--text text-center pa-2 empty-table">
        Tidak ditemukan transaksi yang sesuai. Silakan ubah tanggal atau filter
        yang digunakan.
      </div>
      <v-overlay :value="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <transaksi-dialog v-model="filterDialog" @filter="onFilter" />
    </template>
    <template v-if="showChild" slot="right">
      <nuxt-child @delete="deleteItem" />
    </template>
  </global-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { ITEM_HEADERS } from "~/utils/tables/daftar-transaksi";

import Search from "~/components/Search.vue";
import Table from "~/components/Table.vue";
import GlobalContainer from "~/components/global/global-container.vue";
import TransaksiDialog from "~/components/dialog/transaksi-dialog.vue";

const DEFAULT_ITEMS_PER_PAGE = 30;
const DEFAULT_PAGE = 0;

export default Vue.extend({
  name: "DaftarTransaksi",
  components: { Search, Table, GlobalContainer, TransaksiDialog },
  middleware: ["authenticated", "is-admin"],
  data() {
    return {
      data: [] as any,
      page: DEFAULT_PAGE,
      dataCounts: 0,
      filter: "",
      query: "",
      showChild: false,
      filterDialog: false,
      headers: ITEM_HEADERS,
      loading: false,
    };
  },
  computed: {
    ...mapGetters("global", ["date"]),
    title(): string {
      return !this.showChild ? "Daftar Transaksi" : "Detail Transaksi";
    },
    url(): string {
      let text = `/transaction?with_invoice=1&createdAt=${this.date}`;
      text += `&page=${this.page}&limit=${DEFAULT_ITEMS_PER_PAGE}`;
      text += `${this.filter}&query=${this.query}`;
      return text;
    },
  },
  watch: {
    $route: {
      deep: true,
      handler(val) {
        this.showChild = !!val.params.id;
      },
    },
    async date() {
      this.page = 0;
      await this.fetchItems();
    },
  },
  async mounted() {
    this.$modified.setVal(false);
    this.loading = true;
    try {
      const res = await this.$axios.$get(this.url);
      this.data = [...res.transactions];
      this.dataCounts = res.totalItems;
      this.showChild = !!this.$route.params.id;
    } catch (e) {
      this.$toast.global.asyncError(e);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    onRowClick({ id }: any): void {
      this.$router.push(`/daftar-transaksi/${id}`);
    },
    async fetchItems(): Promise<void> {
      this.loading = true;
      try {
        if (this.dataCounts && this.data.length >= this.dataCounts) return;
        const res = await this.$axios.$get(this.url);
        if (this.page) this.data = [...this.data, ...res.transactions];
        else this.data = [...res.transactions];
        this.page = this.page + 1;
      } catch (e) {
        this.$toast.global.asyncError(e);
      } finally {
        this.loading = false;
      }
    },
    async onSearch(query: string): Promise<void> {
      this.page = 0;
      this.query = query;
      await this.fetchItems();
    },
    async onFilter(query: string): Promise<void> {
      this.page = 0;
      this.filter = query;
      await this.fetchItems();
    },
    deleteItem(id: number) {
      this.data = this.data.filter((item: any) => item.id !== id);
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
