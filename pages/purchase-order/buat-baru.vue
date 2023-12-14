<template>
  <PurchaseOrderForm
    :initial-data="purchaseorder"
    :loading-props="loading"
    @create="$emit('create', $event)"
  />
</template>

<script lang="ts">
import Vue from "vue";
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
});
</script>