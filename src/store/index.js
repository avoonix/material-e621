import Vuex from "vuex";
import settingsModule from "./settings";

const createStore = () => {
  const store = new Vuex.Store({
    modules: {
      settings: settingsModule,
      routerModule: { state: { query: {} } },
    },
  });
  return store;
};

export { createStore };
