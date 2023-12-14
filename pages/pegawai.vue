<template>
  <global-container :title="title">
    <template slot="default">
      <div>
        <Search
          label="Cari pegawai"
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
    </template>
    <template v-if="showChild" slot="right">
      <nuxt-child
        @delete="deleteItem"
        @create="createItem"
        @update="updateItem"
      />
    </template>
    <unsaved-dialog v-model="unsavedDialog" @proceed="selectRow" />
  </global-container>
</template>

<script lang="ts">
import Vue from "vue";

import { getAllUser } from "~/API/user";

import { EMPLOYEE_HEADERS } from "~/utils/tables/employee";
import { buildQuery } from "~/utils/ApiUtils";

import Search from "~/components/Search.vue";
import Table from "~/components/tables/daftar-barang.vue";
import GlobalContainer from "~/components/global/global-container.vue";

const DEFAULT_ITEMS_LENGTH = 20;

export default Vue.extend({
  name: "DaftarPegawai",
  components: { Search, Table, GlobalContainer },
  middleware: ["authenticated", "is-admin"],
  data() {
    return {
      data: [] as any,
      page: 0,
      dataCounts: 0,
      headers: EMPLOYEE_HEADERS,
      query: "",
      showChild: false,
      unsavedDialog: false,
      activeId: 0,
    };
  },
  computed: {
    title(): string {
      return !this.showChild
        ? "Daftar Pegawai"
        : this.$route.fullPath.includes("buat-baru")
        ? "Buat Pegawai"
        : "Edit Pegawai";
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
          DEFAULT_ITEMS_LENGTH
        );
        const res = await getAllUser(this, params);
        this.data = [...res.users];
        this.dataCounts = res.totalUsers;
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    reset() {
      this.data = [];
      this.page = 0;
      this.dataCounts = 0;
      this.query = "";
      this.activeId = 0;
    },
    onRowClick({ id }: any): void {
      if (this.$modified.value) {
        this.unsavedDialog = true;
        this.activeId = id;
        return;
      }
      this.$router.push(`/pegawai/${id}`);
    },
    selectRow() {
      this.unsavedDialog = false;
      this.$router.push(`/pegawai/${this.activeId}`);
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
          DEFAULT_ITEMS_LENGTH
        );
        const res = await getAllUser(this, params);

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
          DEFAULT_ITEMS_LENGTH
        );
        const res = await getAllUser(this, params);

        this.query = query;
        this.data = res.items;
        this.dataCounts = res.totalItems;
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    deleteItem(id: number) {
      this.data = this.data.filter((item: any) => item.id !== id);
      this.dataCounts--;
    },
    updateItem(item: any) {
      const idx = this.data.find((i: any) => i.id === item.id);
      idx.name = item.name;
      idx.price_retail = item.price_retail;
      idx.price_wholesale = item.price_wholesale;
    },
    createItem() {
      this.reset();
      this.fetchInit();
    },
  },
});
</script>
