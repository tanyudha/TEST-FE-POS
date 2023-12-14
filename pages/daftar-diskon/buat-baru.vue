<template>
  <DiscountForm @create="$emit('create', $event)" />
</template>

<script lang="ts">
import Vue from "vue";
import DiscountForm from "~/components/forms/discount-form.vue";

export default Vue.extend({
  components: { DiscountForm },
});
</script>
