<template>
  <v-navigation-drawer
    :value="value"
    class="pl-2"
    fixed
    clipped
    app
    @input="$emit('input', value)"
  >
    <v-list-item v-if="isMobile">
      <v-list-item-content>
        <v-list-item-title class="text-h6 pt-12">
          Aleya Frozen | Admin
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider v-if="isMobile" class="my-4" />
    <v-list nav class="nav-container mt-4">
      <v-list-item-group
        v-model="group"
        active-class="blue--text text--accent-2"
      >
        <v-list-item
          v-for="data in navigationLinks"
          :key="data.icon"
          :to="data.url"
          class="nav"
        >
          <v-icon class="mr-2">{{ data.icon }}</v-icon>
          {{ convertRouteToTitle(data.url) }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <template #append>
      <div class="pa-4 pb-6">
        <v-btn outlined block @click="onLogout"> Logout </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";

import { NAVIGATION_MENU } from "~/utils/Contants";
import { convertRouteToTitle } from "~/utils/TextUtil";

export default Vue.extend({
  name: "GlobalContainer",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      group: null,
    };
  },
  computed: {
    isMobile(): boolean {
      return this.$vuetify.breakpoint.mobile;
    },
    isAdmin(): boolean {
      return this.$auth.isAdmin;
    },
    navigationLinks(): any[] {
      return NAVIGATION_MENU.filter((item) => {
        return this.isAdmin || !item.onlyAdmin;
      });
    },
  },
  methods: {
    convertRouteToTitle,
    onLogout() {
      this.$auth.logout();
      // prevent routing error by giving a subtle delay
      setTimeout(() => {
        this.$router.push("/");
      }, 50);
    },
  },
});
</script>
