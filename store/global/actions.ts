// eslint-disable-next-line
import { ActionTree } from "vuex";

import { RootState } from "..";
import { GlobalState } from ".";

const actions: ActionTree<GlobalState, RootState> = {
  setDate({ commit }, payload) {
    const date = new Date(payload);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    commit("setDate", `${year}-${month}-${day}`);
  },
};

export default actions;
