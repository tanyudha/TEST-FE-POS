<template>
  <global-container title="Statistik Pegawai">
    <template slot="default">
      <div class="mx-3 mt-6">
        <v-menu
          v-model="datepicker"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="dateRangeText"
              label="Rentang tanggal"
              append-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              outlined
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dates"
            range
            @input="selectDate"
          ></v-date-picker>
        </v-menu>
      </div>
      <Table v-if="data.length" :data="data" :headers="headers" />
    </template>
  </global-container>
</template>

<script lang="ts">
import Vue from "vue";

import dayjs from "dayjs";
import { getEmployeeAnalytics } from "~/API/user";

import { EMPLOYEE_ANALYTICS_HEADERS } from "~/utils/tables/employee";
import { getDefaultDateRange } from "~/utils/TextUtil";
import { parseUserAnalytics } from "~/utils/MiscUtil";

import Table from "~/components/tables/daftar-barang.vue";
import GlobalContainer from "~/components/global/global-container.vue";

export default Vue.extend({
  name: "DaftarPegawai",
  components: { Table, GlobalContainer },
  middleware: ["authenticated", "is-admin"],
  data() {
    return {
      data: [] as any,
      headers: EMPLOYEE_ANALYTICS_HEADERS,
      datepicker: false,
      dates: getDefaultDateRange(),
    };
  },
  computed: {
    dateRangeText(): string {
      return this.dates
        .map((date) => dayjs(date).format("DD/MM/YYYY"))
        .join(" ~ ");
    },
  },
  async mounted() {
    this.$modified.setVal(false);
    await this.fetchInit();
  },
  methods: {
    async fetchInit() {
      try {
        const res = await getEmployeeAnalytics(this, this.dates);
        const { cashiers, employees } = parseUserAnalytics(res.data);
        this.data = [...cashiers, ...employees];
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
    selectDate(dates: string[]) {
      if (dates.length === 2) {
        this.datepicker = false;
      }
    },
  },
});
</script>
