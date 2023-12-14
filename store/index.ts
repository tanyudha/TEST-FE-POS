import { ActionTree } from "vuex";

export const state = () => ({});

export type RootState = ReturnType<typeof state>;

export const actions: ActionTree<RootState, RootState> = {
  nuxtServerInit(_ctx, { req }) {
    const { currentUser } = req.session;

    if (currentUser) {
      this.$auth.setUser(currentUser);
    }
  },
};
