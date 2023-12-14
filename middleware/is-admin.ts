import { Middleware } from "@nuxt/types";

const isCashier: Middleware = ({ app, redirect }) => {
  if (!app.$auth.isAdmin) {
    return redirect("/");
  }
};

export default isCashier;
