<template>
  <div :class="{ 'table-container': shrink }">
    <div :class="{ 'table-inner-container': shrink }">
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
            <tr v-for="row in data" :key="row.id" @click="onRowClick(row)">
              <td
                v-for="(head, i) in headers"
                :key="i"
                :class="`text-${head.align || 'left'}`"
              >
                {{ head.parser(row[head.value]) }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { debounce } from "~/utils/FunctionUtil";

// @scroll="loadMore"

export default Vue.extend({
  name: "Table",
  props: {
    data: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    shrink: {
      type: Boolean,
      default: false,
    },
  },
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
$table-height: calc(100vh - 170px);

.table {
  max-height: $table-height;
  overflow: auto;
}

@media (min-width: 800px) {
  .table-container {
    max-height: $table-height;
    overflow-x: scroll;
    width: calc(100vw - 500px - 274px);
  }
  .table-inner-container {
    min-width: calc(100vw - 600px);
  }
}
</style>
