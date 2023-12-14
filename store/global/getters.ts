// eslint-disable-next-line
import { GetterTree } from "vuex";

import { RootState } from "..";
import { GlobalState } from ".";

const getters: GetterTree<GlobalState, RootState> = {
  date: (state) => state.date,
};

export default getters;
