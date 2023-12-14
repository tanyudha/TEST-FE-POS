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
    <v-divider class="mt-6" />
    <div
      class="text-uppercase text-center my-2 font-weight-medium"
      :class="invoiceStatus.color"
    >
      {{ invoiceStatus.text }}
    </div>
    <v-divider class="mb-6" />
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
        v-if="isInvoicePaid"
        :disabled="loading"
        color="primary"
        class="mb-2"
        block
        @click="cancel"
        >Kembali</v-btn
      >
      <v-btn
        v-else
        :disabled="loading"
        color="primary"
        class="mb-2"
        block
        @click="paymentDialog = true"
        >Konfirmasi Pembayaran</v-btn
      >
      <v-btn
        :loading="loading"
        color="red"
        class="mb-2"
        text
        block
        outlined
        @click="deleteDialog = true"
        >Hapus Invoice</v-btn
      >
    </v-col>
    <v-dialog v-model="paymentDialog" max-width="300px">
      <v-card>
        <v-card-title>Konfirmasi Pembayaran</v-card-title>
        <v-card-text>
          Pilih metode pembayaran berikut
          <v-btn-toggle v-model="selectedMethod" style="width: 100%">
            <v-btn class="flex-grow-1 mt-2" outlined> Cash </v-btn>
            <v-btn class="flex-grow-1 mt-2" outlined> BCA </v-btn>
          </v-btn-toggle>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="paymentDialog = false"
            >Batal</v-btn
          >
          <v-btn
            :disabled="selectedMethod === undefined"
            color="primary"
            text
            @click="purchase"
            >Konfirmasi</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" max-width="300px">
      <v-card>
        <v-card-title>Hapus Invoice</v-card-title>
        <v-card-text
          >Apakah Anda yakin akan menghapus invoice ini? Tindakan ini tidak
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
  calcDueDate,
} from "~/utils/TextUtil";
import { header } from "~/utils/Table";
import Table from "~/components/Table.vue";

const TRANSACTION_METHODS = ["Cash", "Transfer"];

export default Vue.extend({
  components: { Table },
  data() {
    return {
      data: {} as any,
      loading: false,
      deleteDialog: false,
      paymentDialog: false,
      selectedMethod: undefined,
    };
  },
  computed: {
    invoiceStatus(): any {
      const status = {
        text: "",
        color: "",
      };
      const { invoice } = this.data;
      const dueDate = invoice?.invoice_due_date;

      if (invoice.invoice_status === "Paid") {
        status.text = "Sudah Dibayar";
        status.color = "black--text";
      } else if (new Date(dueDate) < new Date()) {
        status.text = `Overdue ${Math.abs(+calcDueDate(dueDate))} hari`;
        status.color = "red--text text--darken-1";
      } else {
        status.text = `${Math.abs(
          +calcDueDate(dueDate)
        )} hari lagi (${displayDate(dueDate, "D MMMM YYYY")})`;
        status.color = "orange--text text--darken-1";
      }
      return status;
    },
    isInvoicePaid(): boolean {
      return this.data.invoice?.invoice_status === "Paid";
    },
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
    this.setDate(this.data.invoice.createdAt);
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
      this.$router.push("/invoice");
    },
    async purchase() {
      const idx = this.selectedMethod;
      if (idx === undefined) return;
      this.loading = true;
      try {
        const payload = {
          id: this.data.invoice.id,
          invoice_payment_method: TRANSACTION_METHODS[idx],
          transaction_id: this.data.id,
        };
        await this.$axios.$put("/invoice/pay-invoice", payload);
        this.$toast.show("Invoice berhasil dibayar");
        this.$emit("purchase", payload);
        this.paymentDialog = false;
        this.loading = false;
        this.$router.push("/invoice");
      } catch (e) {
        this.$toast.global.asyncError(e);
        this.loading = false;
      }
    },
    deleteItem() {
      this.loading = true;
      try {
        const id = this.data.id;
        // await this.$axios.$delete("/transaction/delete-transaction/" + id);
        this.$toast.show("Invoice berhasil dihapus");
        this.$emit("delete", id);
        this.deleteDialog = false;
        this.loading = false;
        this.$router.push("/invoice");
      } catch (e) {
        this.$toast.global.asyncError(e);
        this.loading = false;
      }
    },
  },
});
</script>
