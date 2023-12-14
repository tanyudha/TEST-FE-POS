<template>
  <v-list-item class="nav">
    <NuxtLink :to="data.url" class="link">
      <v-icon class="mr-2">{{ data.icon }}</v-icon>
      {{ convertRouteToTitle(data.url) }}
    </NuxtLink>
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { convertRouteToTitle } from '~/utils/TextUtil'

export default Vue.extend({
  name: 'NavigationRow',
  props: ['data'],
  methods: { convertRouteToTitle }
})
</script>

<style lang="scss" scoped>
@use 'styles/abstracts/' as *;
