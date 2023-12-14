<template>
  <v-simple-table
    id="main-container"
    :items="data"
    :headers="headers"
    hide-default-footer
    hide-default-header
    class="table"
    @scroll.passive="handleScroll"
  >
    <template #default>
      <thead>
        <tr>
          <th
            v-for="head in headers"
            :key="head.text"
            :class="`text-${head.align || 'left'}`"
          >
            {{ head.text }}
          </th>
        </tr>
      </thead>
      <tbody id="table-rows-container" ref="table-rows-container">
        <tr v-for="(row, i) in data" :key="i" @click="onRowClick(row)">
          <td
            v-for="(head, j) in headers"
            :key="`${row[head.value]}${j}`"
            :class="`text-${head.align || 'left'} ${
              row['stock'] <= 10 ? 'red' : 'black'
            }--text`"
          >
            {{ head.parser(row[head.value]) }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from "vue";
import { debounce } from "~/utils/FunctionUtil";

export default Vue.extend({
  name: "Table",
  // eslint-disable-next-line
  props: ["data", "headers"],
  created() {
    this.loadMore = debounce(this.loadMore);
  },
  mounted() {
    const mainContainer: any = document.getElementById("main-container");
    mainContainer.addEventListener("scroll", this.loadMore);
  },
  beforeDestroy() {
    const mainContainer: any = document.getElementById("main-container");
    mainContainer?.removeEventListener("scroll", this.loadMore);
  },
  methods: {
    loadMore() {
      const itemContainer: any = document.querySelector("#main-container");
      const pageOffset = itemContainer.scrollTop + itemContainer.clientHeight;

      // 10 is added as offset
      if (pageOffset + 10 >= itemContainer.scrollHeight) {
        this.$emit("load-more");
      }
    },
    onRowClick(row: any) {
      this.$emit("on-row-click", row);
    },
  },
});
</script>

<style lang="scss" scoped>
@use 'styles/abstracts/' as *;

.table {
  $table-height: calc(100vh - 170px);
  @include setup_size();
  height: $table-height;
  max-height: $table-height;
  overflow: auto;
}
</style>
