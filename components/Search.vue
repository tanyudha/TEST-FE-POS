<template>
  <v-card elevation="0" class="pa-4">
    <div class="d-flex">
      <v-text-field
        v-model="query"
        :label="label"
        append-icon="mdi-magnify"
        hide-details="auto"
        @input="triggerSearch"
      ></v-text-field>
      <v-btn
        v-if="createNewButton"
        small
        outlined
        color="grey darken-1"
        height="56px"
        min-width="70px"
        class="ml-4 px-2"
        @click="createNew"
      >
        <div class="d-flex flex-column">
          <v-icon>mdi-plus</v-icon>
          <div class="text-caption">Buat Baru</div>
        </div>
      </v-btn>
    </div>
    <div v-if="filter" class="d-flex justify-end">
      <v-btn
        text
        large
        color="primary filter-button"
        @click.stop="$emit('open-filter')"
        >Filter</v-btn
      >
    </div>
    <unsaved-dialog v-model="unsavedDialog" @proceed="_createNew" />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { debounce } from "~/utils/FunctionUtil";

export default Vue.extend({
  name: "Search",
  props: {
    label: {
      type: String,
      default: "",
    },
    timeout: {
      type: Number,
      required: true,
    },
    createNewButton: {
      type: Boolean,
      default: false,
    },
    filter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      query: "",
      unsavedDialog: false,
    };
  },
  mounted() {
    this.triggerSearch = debounce(this.triggerSearch);
  },
  methods: {
    triggerSearch() {
      this.$emit("on-search", this.query);
    },
    _createNew() {
      this.$router.push(this.$route.matched[0].path + "/buat-baru");
      this.unsavedDialog = false;
    },
    createNew(): void {
      if (this.$modified.value) {
        this.unsavedDialog = true;
        return;
      }
      this._createNew();
    },
  },
});
</script>

<style lang="scss" scoped>
.v-btn.text--filter-button {
  padding: 0 0 0 20px !important;
}
</style>
