<template>
  <AdjustmentForm
    :initial-data="adjustment"
    :loading-props="loading"
    @create="$emit('create', $event)"
  />
</template>

<script lang="ts">
import Vue from "vue";
import AdjustmentForm from "~/components/forms/adjustment-form.vue";

export default Vue.extend({
  components: { AdjustmentForm },
  data() {
    return {
      adjustment: {
        id: 0,
        createdAt: "",
        description : "",
        item_names : "",
        item_count : "",
        total_count : "",
        adjustment_details : [],
      },
      loading: false,
    };
  },
});
</script>