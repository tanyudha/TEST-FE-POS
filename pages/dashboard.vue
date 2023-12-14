<template>
  <global-container title="Dashboard" datepicker>
    <div class="container">
      <div class="report gross">
        <p class="title">GROSS SALES</p>
        <p class="result">{{ displayAsCurrency(grossSales) }}</p>
      </div>
      <div class="report expenses">
        <p class="title">EXPENSES</p>
        <p class="result">{{ displayAsCurrency(expenses) }}</p>
      </div>
      <div class="report net">
        <p class="title">NET SALES</p>
        <p class="result">{{ displayAsCurrency(netSales) }}</p>
      </div>
    </div>
  </global-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { displayAsCurrency } from "~/utils/TextUtil";

export default Vue.extend({
  name: "Dashboard",
  middleware: ["authenticated", "is-admin"],
  data() {
    return {
      data: {} as any,
      checkData: undefined as any,
    };
  },
  computed: {
    ...mapGetters("global", ["date"]),
    grossSales(): number {
      return +this.data.sales || 0;
    },
    expenses(): number {
      return +this.data.expenses || 0;
    },
    netSales(): number {
      return this.grossSales - this.expenses;
    },
  },
  watch: {
    async date() {
      await this.fetchData();
    },
  },
  created() {
    this.checkData = setInterval(() => {
      this.fetchData();
    }, 60 * 1000);
  },
  mounted() {
    this.$modified.setVal(false);
    this.fetchData();
  },
  beforeDestroy() {
    clearInterval(this.checkData);
  },
  methods: {
    displayAsCurrency,
    async fetchData() {
      try {
        const url = `shift/dashboard-info?starting_shift=${this.date}`;
        this.data = await this.$axios.$get(url);
      } catch (e) {
        this.$toast.global.asyncError(e);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@use 'styles/abstracts/' as *;

.container {
  @include setup_size(100%, auto);
  @include flex_center(column, 10px);
  padding: $padding-med;
  & > * {
    @include setup_size();
  }
  .report {
    @include drop_shadow(0, 0);
    padding: $padding-med;
    .title {
      @include typo_h5();
    }
    .result {
      @include typo_h3();
    }
  }
  .gross .result {
    color: $primary;
  }
  .expenses .result {
    color: $red;
  }
  .net .result {
    color: $green;
  }
}
</style>
