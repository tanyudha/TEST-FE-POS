<template>
  <DiscountForm
    :initial-data="discount"
    :loading-props="loading"
    @delete="$emit('delete', $event)"
    @update="$emit('update', $event)"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { getDiscountDetail } from "~/API/discount";
import DiscountForm from "~/components/forms/discount-form.vue";

export default Vue.extend({
  components: { DiscountForm },
  data() {
    return {
      discount: {
        id: 0,
        name: "",
        isPercentage : false,
        amount : 0,
        percentage : 0,
        isActive : false
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
        const res = await getDiscountDetail(this, id);

        this.discount = res;
      } catch (e) {
        this.$toast.global.asyncError(e);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
