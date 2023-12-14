<template>
  <v-app>
    <div class="content">
      <nuxt />
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "none"
});
</script>

<style lang="scss" scoped>
@use 'styles/abstracts/' as *;

.content {
  @include setup_size();
}
</style>
