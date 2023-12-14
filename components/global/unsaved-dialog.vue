<template>
  <v-dialog :value="value" max-width="300px" @input="close">
    <v-card>
      <v-card-title>Perubahan data</v-card-title>
      <v-card-text
        >Perubahan data terakhir belum disimpan. Jika anda memilih untuk
        melanjutkan, perubahan terakhir akan dibatalkan.</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="close">Batal</v-btn>
        <v-btn color="primary" text @click="proceed">Lanjut</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "UnsavedDialog",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit("input", false);
    },
    proceed() {
      this.$modified.setVal(false);
      this.$emit("proceed");
    },
  },
});
</script>
