import { Plugin } from "@nuxt/types";

interface ModifiedPlugin {
  value: boolean;
  setVal: (val: boolean) => void;
}

declare module "vue/types/vue" {
  interface Vue {
    $modified: ModifiedPlugin;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $modified: ModifiedPlugin;
  }
}

declare module "vuex/types/index" {
  // eslint-disable-next-line
  interface Store<S> {
    $modified: ModifiedPlugin;
  }
}

const modified: Plugin = ({ store }, inject) => {
  const moduleName = "modified-module";

  store.registerModule(moduleName, {
    namespaced: true,
    state: {
      value: false,
    },
    mutations: {
      setVal(state, payload) {
        state.value = payload;
      },
    },
  });

  const modifiedPlugin: ModifiedPlugin = {
    get value(): boolean {
      return store.state[moduleName].value;
    },
    setVal(payload: boolean): void {
      store.commit(`${moduleName}/setVal`, payload);
    },
  };

  inject("modified", modifiedPlugin);
};

export default modified;
