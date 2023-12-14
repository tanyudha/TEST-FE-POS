import css from "./config/css";
import head from "./config/head";
import plugins from "./config/plugins";
import serverMiddleware from "./config/server-middleware";
import { modules, buildModules } from "./config/modules";
import { publicRuntimeConfig } from "./config/env";

export default {
  head,
  css,
  plugins,
  components: true,
  serverMiddleware,
  buildModules,
  publicRuntimeConfig,
  modules,
  build: {},
};
