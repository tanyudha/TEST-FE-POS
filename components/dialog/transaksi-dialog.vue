<template>
  <v-dialog :value="value" max-width="300px" persistent @input="close">
    <v-card>
      <v-card-title>Filter</v-card-title>
      <v-card elevation="0" class="py-2 px-6">
        <v-autocomplete
          v-model="customer.selected"
          :items="customer.options"
          :loading="customerLoading"
          :search-input.sync="customerQuery"
          outlined
          clearable
          label="Pembeli"
          placeholder="Cari pembeli"
          persistent-placeholder
          hide-details
          full-width
          return-object
          item-text="name"
          item-value="id"
          type="object"
          class="mb-8"
        >
          <template #item="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-item-content>{{ data.item }}</v-list-item-content>
            </template>
            <template v-else>
              <v-list-item-content>
                <v-list-item-title>{{ data.item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  data.item.phone
                }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{
                  data.item.description
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </template>
          <template #no-data>
            <v-list-item>
              <v-list-item-title> Data tidak ditemukan </v-list-item-title>
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-select
          v-model="cashier.selected"
          :items="cashier.options"
          :loading="userLoading"
          label="Kasir"
          item-text="name"
          item-value="id"
          return-object
          cache-items
          outlined
        ></v-select>
        <v-select
          v-model="employee.selected"
          :loading="userLoading"
          :items="employee.options"
          label="Pegawai"
          item-text="name"
          item-value="username"
          return-object
          cache-items
          outlined
        ></v-select>
        <v-select
          v-model="transactionMethod.selected"
          :items="transactionMethod.options"
          label="Metode Pembayaran"
          item-text="label"
          item-value="value"
          return-object
          cache-items
          outlined
        ></v-select>
        <v-select
          v-model="refundStatus.selected"
          :items="refundStatus.options"
          label="Status Refund"
          item-text="label"
          item-value="value"
          return-object
          cache-items
          outlined
        ></v-select>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="close">Batal</v-btn>
        <v-btn color="primary" text @click="proceed">Terapkan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ALL,
  CASH,
  TRANSFER,
  INVOICE,
  REFUND_STATUS,
} from "~/utils/const/payment-method";

const DEFAULT_USER_DATA = {
  name: "Semua",
  username: "",
  id: 0,
};
const DEFAULT_CUSTOMER_DATA = {
  name: "Semua",
  id: 0,
};

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userLoading: false,
      customerLoading: false,
      customerQuery: "",
      customer: {
        options: [] as any[],
        selected: DEFAULT_CUSTOMER_DATA,
        prev: DEFAULT_CUSTOMER_DATA,
      },
      cashier: {
        options: [] as any[],
        selected: DEFAULT_USER_DATA,
        prev: DEFAULT_USER_DATA,
      },
      employee: {
        options: [] as any[],
        selected: DEFAULT_USER_DATA,
        prev: DEFAULT_USER_DATA,
      },
      transactionMethod: {
        options: [ALL, CASH, TRANSFER, INVOICE],
        selected: ALL,
        prev: ALL,
      },
      refundStatus: {
        options: [
          REFUND_STATUS.ALL,
          REFUND_STATUS.REFUND,
          REFUND_STATUS.NON_REFUND,
        ],
        selected: REFUND_STATUS.ALL,
        prev: REFUND_STATUS.ALL,
      },
    };
  },
  watch: {
    async customerQuery(val) {
      if (!val) this.customer.selected = DEFAULT_CUSTOMER_DATA;
      this.customerLoading = true;
      try {
        let url = "/customer";
        if (val) url += "/?query" + val;
        this.customer.options = (await this.$axios.$get(url)) as any;
      } catch (e) {
        this.$toast.global.asyncError(e);
      } finally {
        this.customerLoading = false;
      }
    },
  },
  mounted() {
    this.fetchUser();
    this.fetchCustomer();
  },
  methods: {
    async fetchUser() {
      this.userLoading = true;
      try {
        const { users } = await this.$axios.$get("/user");
        this.employee.options = [DEFAULT_USER_DATA, ...users];
        this.cashier.options = [
          DEFAULT_USER_DATA,
          ...users.filter((user: any) => user.role === "Kasir"),
        ];
      } catch (e) {
        this.$toast.global.asyncError(e);
      } finally {
        this.userLoading = false;
      }
    },
    async fetchCustomer() {
      this.customerLoading = true;
      try {
        const users = await this.$axios.$get("/customer");
        this.customer.options = [DEFAULT_CUSTOMER_DATA, ...users];
      } catch (e) {
        this.$toast.global.asyncError(e);
      } finally {
        this.customerLoading = false;
      }
    },
    close() {
      this.customer.selected = this.customer.prev;
      this.cashier.selected = this.cashier.prev;
      this.employee.selected = this.employee.prev;
      this.transactionMethod.selected = this.transactionMethod.prev;
      this.refundStatus.selected = this.refundStatus.prev;
      this.$emit("input", false);
    },
    proceed() {
      this.customer.prev = this.customer.selected;
      this.cashier.prev = this.cashier.selected;
      this.employee.prev = this.employee.selected;
      this.transactionMethod.prev = this.transactionMethod.selected;

      let query = "";
      if (this.customer.selected.id)
        query += `&customer_id=${this.customer.selected.id}`;
      if (this.employee.selected.id)
        query += `&employee_id=${this.employee.selected.id}`;
      if (this.cashier.selected.id)
        query += `&cashier_id=${this.cashier.selected.id}`;
      if (this.transactionMethod.selected.value)
        query += `&transaction_method=${this.transactionMethod.selected.value}`;
      this.$emit("filter", query);
      this.$emit("input", false);
    },
  },
});
</script>
