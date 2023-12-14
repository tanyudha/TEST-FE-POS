<template>
  <global-container :title="title" datepicker>
    <template slot="default">
      <div class="ma-2">
        <Table
          v-if="data.length"
          :data="data"
          :headers="headers"
          @on-row-click="onRowClick"
        />
        <div v-else class="grey--text text-center pa-2 empty-table">
          Tidak ditemukan shift yang sesuai. Silakan ubah tanggal atau filter
          yang digunakan.
        </div>
      </div>
    </template>
    <template v-if="showChild" slot="right">
      <nuxt-child />
    </template>
  </global-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

import { ITEM_HEADERS } from "~/utils/tables/shift";
import Table from "~/components/tables/daftar-barang.vue";
import GlobalContainer from "~/components/global/global-container.vue";

import { displayTime } from "~/utils/TextUtil";

export default Vue.extend({
  name: "DaftarTransaksi",
  components: { Table, GlobalContainer },
  middleware: ["authenticated", "is-admin"],
  data() {
    return {
      data: [] as any,
      headers: ITEM_HEADERS,
      showChild: false,
    };
  },
  computed: {
    ...mapGetters("global", ["date"]),
    title(): string {
      return !this.showChild ? "Daftar Shift" : "Detail Shift";
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
      await this.fetchData();
    },
  },
  async mounted() {
    this.$modified.setVal(false);
    await this.fetchData();
    this.showChild = !!this.$route.params.id;
  },
  methods: {
    async fetchData() {
      try {
        const url = `shift/all-shift?starting_shift=${this.date}`;
        const res = await this.$axios.$get(url);
        this.data = res.map((item: any) => ({
          ...item,
          ending_shift: item.ending_shift
            ? displayTime(item.ending_shift)
            : "Belum berakhir",
        }));
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    onRowClick({ id }: any): void {
      this.$router.push(`/shift/${id}`);
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
