<template>
  <UserForm
    :initial-data="employee"
    :loading-props="loading"
    @delete="$emit('delete', $event)"
    @update="$emit('update', $event)"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { getUserDetail } from "~/API/user";
import UserForm from "~/components/forms/employee-form.vue";

export default Vue.extend({
  components: { UserForm },
  data() {
    return {
      employee: {
        id: 0,
        name: "",
        username : "",
        password : "",
        role : "",
        shifts : [],
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
        const res = await getUserDetail(this, id);
        this.employee = res;
      } catch (e) {
        this.$toast.global.asyncError(e);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
