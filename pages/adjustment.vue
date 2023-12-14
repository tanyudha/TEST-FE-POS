<template>
  <global-container :title="title" datepicker>
    <template slot="default">
      <div>
        <Search
          label="Cari Adjustment"
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
        Tidak ditemukan adjustment yang sesuai. Silakan ubah tanggal atau filter
        yang digunakan.
      </div>
    </template>
    <template v-if="showChild" slot="right">
      <nuxt-child @delete="onDelete" @create="onCreate" />
    </template>
    <unsaved-dialog v-model="unsavedDialog" @proceed="selectRow" />
  </global-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

import { getAllAdjustment } from "~/API/adjustment";

import {
  ADJUSTMENT_HEADERS,
  deleteAdjustment,
} from "~/utils/tables/adjustment";

import Search from "~/components/Search.vue";
import Table from "~/components/tables/daftar-barang.vue";
import GlobalContainer from "~/components/global/global-container.vue";

const DEFAULT_ADJUSTMENT_LENGTH = 50;

export default Vue.extend({
  name: "Adjustment",
  components: { Search, Table, GlobalContainer },
  middleware: ["authenticated"],
  data() {
    return {
      data: [] as any,
      page: 0,
      dataCounts: 0,
      headers: ADJUSTMENT_HEADERS,
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
        ? "Daftar Adjustment"
        : this.$route.fullPath.includes("buat-baru")
        ? "Buat Adjustment"
        : "Edit Adjustment";
    },
    url(): string {
      let text = `?date=${this.date}`;
      text += `&page=${this.page}&limit=${DEFAULT_ADJUSTMENT_LENGTH}`;
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
      this.page = 0;
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
        const res = await getAllAdjustment(this, this.url);

        this.data = [...res.adjustments];
        this.dataCounts = res.totalAdjustment;
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    async onLoadMore(): Promise<void> {
      try {
        if (this.data.length >= this.dataCounts) return;

        this.page = this.page + 1;
        const res = await getAllAdjustment(this, this.url);

        this.data = [...this.data, ...res.adjustments];
        this.dataCounts = res.totalAdjustment;
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    async onSearch(query: string): Promise<void> {
      try {
        this.page = 0;
        const res = await getAllAdjustment(this, this.url);

        this.query = query;
        this.data = res.adjustments;
        this.dataCounts = res.totalAdjustment;
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    onCreate() {
      this.$modified.setVal(false);
      this.reset();
      this.fetchInit();
    },
    onDelete(id: number) {
      deleteAdjustment(this, id);
    },
    onRowClick({ id }: any): void {
      if (this.$modified.value) {
        this.unsavedDialog = true;
        this.activeId = id;
        return;
      }
      this.$router.push(`/adjustment/${id}`);
    },
    selectRow() {
      this.unsavedDialog = false;
      this.$router.push(`/adjustment/${this.activeId}`);
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
