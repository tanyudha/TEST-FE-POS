<template>
  <div v-if="!data.id && loading" class="d-flex pt-12 justify-center">
    <v-progress-circular indeterminate color="primary" size="50" />
  </div>
  <div v-else-if="!data.id" class="grey--text text-center ma-12">
    Transaksi tidak ditemukan atau telah dihapus.
  </div>
  <v-card v-else elevation="0" class="pa-6 pt-8">
    <v-row v-for="item in info" :key="item.label">
      <v-col class="font-weight-medium py-2">{{ item.label }}</v-col>
      <v-col class="text-right py-2">{{ item.value || "-" }}</v-col>
    </v-row>
    <v-divider class="my-6" />
    <v-row>
      <v-col class="font-weight-medium py-2"> Daftar Barang </v-col>
    </v-row>
    <div class="ml-4 mt-2">
      <Table :data="details" :headers="headers" />
    </div>
    <v-divider class="ml-4 mt-0 mb-4" />
    <v-row class="pl-8 blue--text text--darken-1">
      <v-col class="text-h6 py-2"> Total </v-col>
      <v-col class="text-h6 text-right py-2 pr-6">{{
        displayAsCurrency(data.total)
      }}</v-col>
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
      <v-btn
        :loading="loading"
        color="red"
        class="mb-2"
        text
        block
        outlined
        @click="deleteDialog = true"
        >Hapus Transaksi</v-btn
      >
    </v-col>
    <v-dialog v-model="deleteDialog" max-width="300px">
      <v-card>
        <v-card-title>Hapus Transaksi</v-card-title>
        <v-card-text
          >Apakah Anda yakin akan menghapus transaksi ini? Tindakan ini tidak
          dapat dibatalkan.</v-card-text
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
import Vue from "vue";
import { mapActions } from "vuex";

import {
  displayId,
  displayDate,
  displayTransactionMethod,
  displayAsCurrency,
} from "~/utils/TextUtil";
import { header } from "~/utils/Table";
import Table from "~/components/Table.vue";

export default Vue.extend({
  components: { Table },
  data() {
    return {
      data: {} as any,
      loading: false,
      deleteDialog: false,
    };
  },
  computed: {
    info(): any[] {
      return [
        {
          label: "Kode Transaksi",
          value: this.displayId(this.data.id),
        },
        {
          label: "Tanggal",
          value: this.displayDate(this.data.createdAt),
        },
        {
          label: "Nama Pembeli",
          value: this.data.customer_name,
        },
        {
          label: "Nomor Telepon",
          value: this.data.customer_phone,
        },
        {
          label: "Nama Pegawai",
          value: this.data.employee_name,
        },
        {
          label: "Nama Kasir",
          value: this.data.cashier_name,
        },
        {
          label: "Pembayaran",
          value: this.displayTransactionMethod(
            this.data.transaction_method,
            this.data.is_invoice
          ),
        },
        {
          label: "Status Transaksi",
          value: this.data?.refundedAt
            ? this.displayDate(this.data.refundedAt)
            : "-",
        },
      ];
    },
    details(): any[] {
      if (!this.data.transaction_details) return [];
      return this.data.transaction_details.map((detail: any) => ({
        qty: detail.qty,
        name: detail.item.name,
        total: this.displayAsCurrency(detail.price_final),
      }));
    },
    headers(): any[] {
      return [
        header("Qty", "qty"),
        header("Nama", "name"),
        header("Total", "total", "right"),
      ];
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
  async mounted() {
    await this.fetchData();
    this.setDate(this.data.createdAt);
  },
  methods: {
    ...mapActions("global", ["setDate"]),
    displayId,
    displayDate,
    displayTransactionMethod,
    displayAsCurrency,
    async fetchData() {
      this.loading = true;
      try {
        const id = this.$route.params.id;
        this.data = await this.$axios.$get("/transaction/detail/" + id);
      } catch (e) {
        this.$toast.global.asyncError(e);
      } finally {
        this.loading = false;
      }
    },
    cancel() {
      this.$router.push("/daftar-transaksi");
    },
    async deleteItem() {
      this.loading = true;
      try {
        const id = this.data.id;
        await this.$axios.$delete("/transaction/delete-transaction/" + id);
        this.$toast.show("Transaksi berhasil dihapus");
        this.$emit("delete", this.data.id);
        this.deleteDialog = false;
        this.loading = false;
        this.$router.push("/daftar-transaksi");
      } catch (e) {
        this.$toast.global.asyncError(e);
        this.loading = false;
      }
    },
  },
});
</script>
