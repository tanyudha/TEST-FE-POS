<template>
  <div v-if="!data.id && loading" class="d-flex pt-12 justify-center">
    <v-progress-circular indeterminate color="primary" size="50" />
  </div>
  <div v-else-if="!data.id" class="grey--text text-center ma-12">
    Transaksi tidak ditemukan atau telah dihapus.
  </div>
  <v-card v-else elevation="0" class="pa-6 pt-8">
    <v-row v-for="item in info1" :key="item.label">
      <v-col class="font-weight-medium py-2">{{ item.label }}</v-col>
      <v-col class="text-right py-2">{{ item.value || "-" }}</v-col>
    </v-row>
    <v-divider class="my-6" />
    <v-row v-for="item in info2" :key="item.label">
      <v-col class="font-weight-medium py-2">{{ item.label }}</v-col>
      <v-col class="text-right py-2">{{ item.value || "-" }}</v-col>
    </v-row>
    <v-divider v-if="data.expenses.length" class="my-6" />
    <v-row v-if="data.expenses.length">
      <v-col class="font-weight-medium py-2"> Pengeluaran </v-col>
    </v-row>
    <div v-if="data.expenses.length" class="ml-4 mt-2">
      <Table :data="data.expenses" :headers="headers" />
    </div>
    <v-divider class="mt-2 mb-4" />
    <v-row class="pl-0 blue--text text--darken-1">
      <v-col class="py-2"> Expected Total </v-col>
      <v-col class="text-right py-2 pr-3">{{
        displayAsCurrency(total.cash + total.invoice)
      }}</v-col>
    </v-row>
    <v-row class="pl-0 blue--text text--darken-1">
      <v-col class="py-2"> Actual Total </v-col>
      <v-col class="text-right py-2 pr-3">{{ actualEndingCash }}</v-col>
    </v-row>
    <v-col class="pt-12 px-0">
      <v-btn
        :disabled="loading"
        color="primary"
        class="mb-2"
        block
        @click="cancel"
        >Kembali</v-btn
      >
    </v-col>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

import { displayDate, displayAsCurrency } from "~/utils/TextUtil";
import { header } from "~/utils/Table";
import Table from "~/components/Table.vue";

export default Vue.extend({
  components: { Table },
  data() {
    return {
      data: {} as any,
      loading: false,
    };
  },
  computed: {
    total(): any {
      const sum = {
        cash: 0,
        invoice: 0,
      };
      this.data.transactions.forEach(
        ({ is_invoice: isInv, transaction_method: tfMethod, total }: any) => {
          const isPaid = tfMethod === "Cash" || tfMethod === "Transfer";
          if (isPaid) {
            if (isInv) sum.invoice += +total;
            else sum.cash += +total;
          }
        }
      );
      return sum;
    },
    info1(): any[] {
      const {
        cashier_name: name,
        starting_shift: startShift,
        ending_shift: endShift,
      } = this.data;
      return [
        {
          label: "Nama Kasir",
          value: name,
        },
        {
          label: "Shift Mulai",
          value: displayDate(startShift),
        },
        {
          label: "Shift Selesai",
          value: endShift ? displayDate(endShift) : "Shift belum berakhir",
        },
      ];
    },
    info2(): any[] {
      return [
        {
          label: "Modal Awal",
          value: displayAsCurrency(this.data.starting_cash),
        },
        {
          label: "Pemasukan Cash",
          value: displayAsCurrency(this.total.cash),
        },
        {
          label: "Pemasukan Invoice",
          value: displayAsCurrency(this.total.invoice),
        },
      ];
    },
    headers(): any[] {
      return [
        header("Judul", "judul"),
        header("Total", "total", "right", displayAsCurrency),
      ];
    },
    actualEndingCash(): string {
      const amount = this.data.actual_ending_cash;
      const isShiftEnded = this.data.ending_shift;
      return isShiftEnded ? displayAsCurrency(amount) : "Shift belum berakhir";
    },
  },
  watch: {
    $route: {
      deep: true,
      handler() {
        this.fetchData();
      },
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    displayAsCurrency,
    ...mapActions("global", ["setDate"]),
    async fetchData() {
      this.loading = true;
      try {
        const id = this.$route.params.id;
        this.data = await this.$axios.$get("/shift/detail/" + id);
        this.setDate(this.data.starting_shift);
      } catch (e) {
        this.$toast.global.asyncError(e);
      } finally {
        this.loading = false;
      }
    },
    cancel() {
      this.$router.push("/shift");
    },
  },
});
</script>
