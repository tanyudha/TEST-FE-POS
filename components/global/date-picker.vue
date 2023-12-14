<template>
  <v-menu
    v-model="showDatePicker"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        :value="date"
        :dense="!isMobile"
        label="Tanggal"
        :class="isMobile ? 'px-4 pt-4' : 'pa-2'"
        append-icon="mdi-calendar"
        readonly
        outlined
        v-bind="attrs"
        hide-details
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      :value="date"
      :max="todayDate"
      @input="selectDate"
    ></v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import { todayDate } from "~/utils/TimeUtil";

export default Vue.extend({
  name: "DatePicker",
  data() {
    return { showDatePicker: false };
  },
  computed: {
    ...mapGetters("global", ["date"]),
    todayDate,
    isMobile(): boolean {
      return this.$vuetify.breakpoint.mobile;
    },
  },
  methods: {
    ...mapActions("global", ["setDate"]),
    selectDate(val: any) {
      this.showDatePicker = false;
      this.setDate(val);
    },
  },
});
</script>
