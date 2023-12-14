<template>
  <EmployeeForm @create="$emit('create', $event)" />
</template>

<script lang="ts">
import Vue from "vue";
import EmployeeForm from "~/components/forms/employee-form.vue";

export default Vue.extend({
  components: { EmployeeForm },
});
</script>
