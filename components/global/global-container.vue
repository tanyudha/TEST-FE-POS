<template>
  <div>
    <sidebar v-model="drawer" />
    <v-app-bar color="white" clipped-left fixed app>
      <v-app-bar-nav-icon
        v-if="!isMobile || !showChild"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-nav-icon v-else @click.stop="goToPrevPage"
        ><v-icon>mdi-chevron-left</v-icon></v-app-bar-nav-icon
      >
      <v-toolbar-title class="pl-2">{{
        isMobile ? computedPageTitle : "Aleya Frozen"
      }}</v-toolbar-title>
      <v-spacer />
      <v-spacer />
      <v-spacer />
      <date-picker v-if="!isMobile && datepicker" />
    </v-app-bar>
    <v-main>
      <v-container fluid class="outer-container pa-0 ma-0">
        <v-container class="global-container ma-0 pa-0" fill-height>
          <div v-if="showLeftContainer" class="left-container">
            <date-picker v-if="isMobile && datepicker" />
            <slot />
          </div>
          <div v-if="!!$slots.right" class="right-container">
            <slot name="right" />
          </div>
        </v-container>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { convertRouteToTitle } from "~/utils/TextUtil";
import Sidebar from "~/components/global/sidebar.vue";

export default Vue.extend({
  name: "GlobalContainer",
  components: { Sidebar },
  props: {
    title: {
      type: String,
      default: "",
    },
    datepicker: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showChild: false,
      pageTitle: "",
      drawer: false,
    };
  },
  computed: {
    isMobile(): boolean {
      return this.$vuetify.breakpoint.mobile;
    },
    showLeftContainer(): boolean {
      return !this.isMobile || !this.showChild || !this.$slots.right;
    },
    computedPageTitle(): string {
      return this.title || this.pageTitle;
    },
  },
  watch: {
    $route: {
      deep: true,
      handler(val) {
        this.showChild =
          !this.isMobile ||
          !!val.params.id ||
          val.fullPath.includes("buat-baru");

        this.pageTitle = convertRouteToTitle(this.$route.path);
      },
    },
  },
  created() {
    const val = this.$route;
    this.showChild =
      !this.isMobile || !!val.params.id || val.fullPath.includes("buat-baru");
    this.pageTitle = convertRouteToTitle(this.$route.path);
    this.drawer = !this.isMobile;
  },
  methods: {
    convertRouteToTitle,
    goToPrevPage() {
      this.$router.push(this.$route.matched[0].path);
    },
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

<style lang="scss" scoped>
.outer-container {
  max-height: calc(100vh - 56px) !important;
  overflow: hidden;
}
.global-container {
  margin: 0;
  padding: 0;
  display: flex;
  height: 100%;
  flex-direction: row !important;
  max-width: unset !important;
  overflow: hidden !important;
}
.left-container,
.right-container {
  height: calc(100vh - 64px);
  min-height: 100%;
  overflow: auto;
  padding: 8px;
}
.left-container {
  border-right: 1.5px solid #ebebeb;
  flex-grow: 1;
}
.right-container {
  width: 500px;

  @media screen and (max-width: 800px) {
    width: 100vw;
  }
}
</style>
