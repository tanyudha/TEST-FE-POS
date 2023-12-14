<template>
  <PurchaseOrderForm
    :initial-data="purchaseorder"
    :loading-props="loading"
    @delete="$emit('delete', $event)"
    @update="$emit('update', $event)"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { getPurchaseOrderDetail } from "~/API/purchase-order";
import {convertToStringDate} from "~/utils/TextUtil"
import PurchaseOrderForm from "~/components/forms/purchase-order-form.vue";

export default Vue.extend({
  components: { PurchaseOrderForm },
  data() {
    return {
      purchaseorder: {
        id: 0,
        createdAt: "",
        supplier : "",
        purchase_order_details : [],
      },
      loading: false,
    };
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
    async fetchData() {
      this.loading = true;
      try {
        const id = this.$route.params.id;
        const res = await getPurchaseOrderDetail(this, id);
        res.data.createdAt = convertToStringDate(res.data.createdAt);
        this.purchaseorder = res.data;
      } catch (e) {
        this.$toast.global.asyncError(e);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
