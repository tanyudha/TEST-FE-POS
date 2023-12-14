<template>
  <item-form
    :initial-data="item"
    :loading-props="loading"
    @delete="$emit('delete', $event)"
    @update="$emit('update', $event)"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { getItemDetail } from "~/API/item";
import ItemForm from "~/components/forms/item-form.vue";

export default Vue.extend({
  components: { ItemForm },
  data() {
    return {
      item: {
        id: 0,
        name: "",
        retailPrice: 0,
        wholesalePrice: 0,
        stock: 0,
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
        const res = await getItemDetail(this, id);
        this.item = res;
      } catch (e) {
        this.$toast.global.asyncError(e);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
