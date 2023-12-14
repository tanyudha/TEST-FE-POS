<template>
  <AdjustmentForm
    :initial-data="adjustment"
    :loading-props="loading"
    @delete="$emit('delete', $event)"
    @update="$emit('update', $event)"
  />
</template>

<script lang="ts">
import Vue from "vue";
import AdjustmentForm from "~/components/forms/adjustment-form.vue";

import {convertToStringDate} from "~/utils/TextUtil"
import { getAdjustmentDetail } from "~/API/adjustment";

export default Vue.extend({
  components: { AdjustmentForm },
  data() {
    return {
      adjustment: {
        id: 0,
        createdAt: "",
        description : "",
        item_names : "",
        item_count : 0,
        total_count : 0,
        adjustment_details : [],
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
        const res = await getAdjustmentDetail(this, id);
        res.data.createdAt = convertToStringDate(res.data.createdAt);
        console.log(res);
        this.adjustment = res.data;
      } catch (e) {
        this.$toast.global.asyncError(e);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
