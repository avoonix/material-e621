import { GETTERS } from "./constants";

const mathMinMaxDefault = (min, max, def, cur) => {
  if (!cur && cur !== 0) return def;
  if (cur < min) return min;
  if (cur > max) return max;
  return cur;
};

const settingsModule = {
  state: {
    loggedIn: false,
    username: "",
    apiKey: "",
    proxy: "",
  },
  getters: {
    [GETTERS.IS_LOGGED_IN](state) {
      return state.loggedIn;
    },
    [GETTERS.POST_COMPACTNESS](state, getters, rootState) {
      return rootState.routerModule.query.compactness || "more";
    },
    [GETTERS.POST_LAYOUT](state, getters, rootState) {
      return rootState.routerModule.query.layout || "blog";
    },
    [GETTERS.IS_LOW_RESOLUTION_MODE](state, getters, rootState) {
      return (
        rootState.routerModule.query.mobile === "true" ||
        rootState.routerModule.query.mobile === true
      );
    },
    [GETTERS.IS_DESCRIPTIVE_FILENAME](state, getters, rootState) {
      return (
        rootState.routerModule.query.fname === "true" ||
        rootState.routerModule.query.fname === true
      );
    },
    [GETTERS.IS_FAST_LOAD_MODE](state, getters, rootState) {
      return !(
        rootState.routerModule.query.fload === "false" ||
        rootState.routerModule.query.fload === false
      );
    },
    [GETTERS.IS_COMPACT_MODE](state, getters, rootState) {
      return (
        rootState.routerModule.query.cm === "true" ||
        rootState.routerModule.query.cm === true
      );
    },
    [GETTERS.POST_FETCH_COUNT](state, getters, rootState) {
      return mathMinMaxDefault(10, 320, 25, rootState.routerModule.query.count);
    },
    [GETTERS.TAG_FETCH_COUNT](state, getters, rootState) {
      return mathMinMaxDefault(10, 50, 20, rootState.routerModule.query.tcount);
    },
    [GETTERS.SUGGESTION_COUNT](state, getters, rootState) {
      const count = mathMinMaxDefault(
        5,
        50,
        15,
        rootState.routerModule.query.scount,
      );
      return Math.round(count / 5) * 5;
    },
  },
  actions: {
    // [ACTIONS.LOG_IN]({ commit }, options) {
    //   // Logs in user or restores previous saved login information
    //   if (
    //     options &&
    //     typeof options.username === "string" &&
    //     typeof options.apiKey === "string" &&
    //     typeof options.proxy === "string"
    //   ) {
    //     commit(MUTATIONS.SET_AUTHENTICATION, {
    //       loggedIn: true,
    //       username: options.username,
    //       apiKey: options.apiKey,
    //       proxy: options.proxy,
    //     });
    //     store.set("user_data", {
    //       // Base64 encoded
    //       loggedIn: true,
    //       username: btoa(options.username),
    //       apiKey: btoa(options.apiKey),
    //       proxy: options.proxy,
    //     });
    //   } else {
    //     if (store.get("user_data")) {
    //       commit(MUTATIONS.SET_AUTHENTICATION, {
    //         loggedIn: store.get("user_data").loggedIn,
    //         username: atob(store.get("user_data").username),
    //         apiKey: atob(store.get("user_data").apiKey),
    //         proxy: store.get("user_data").proxy,
    //       });
    //     }
    //   }
    // },
    // [ACTIONS.LOG_OUT]({ commit }) {
    //   commit(MUTATIONS.SET_AUTHENTICATION, {
    //     loggedIn: false,
    //     username: "",
    //     key: "",
    //     proxy: "",
    //   });
    //   store.remove("user_data");
    // },
  },
};

export default settingsModule;
