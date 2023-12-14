import { Middleware } from "@nuxt/types";

const notAuthenticated: Middleware = ({ app, redirect }) => {
  if (app.$auth.loggedIn) {
    return redirect(app.$auth.isAdmin ? "/dashboard" : "/purchase-order");
  }
};

export default notAuthenticated;
