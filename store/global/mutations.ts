// eslint-disable-next-line
import { MutationTree } from "vuex";
import { GlobalState } from ".";

const mutations: MutationTree<GlobalState> = {
  setDate: (state, payload) => {
    state.date = payload;
  },
};

export default mutations;
