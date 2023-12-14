<template>
  <item-form @create="$emit('create', $event)" />
</template>

<script lang="ts">
import Vue from "vue";
import ItemForm from "~/components/forms/item-form.vue";

export default Vue.extend({
  components: { ItemForm },
});
</script>
