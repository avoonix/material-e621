import { MUTATIONS, GETTERS, ACTIONS } from "./constants";
import store from "store";
import router from "../router";

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
  mutations: {
    [MUTATIONS.SET_AUTHENTICATION](
      state,
      { loggedIn, username, apiKey, proxy },
    ) {
      state.loggedIn = loggedIn;
      state.username = username;
      state.apiKey = apiKey;
      state.proxy = proxy;
    },
  },
  getters: {
    [GETTERS.IS_LOGGED_IN](state) {
      return state.loggedIn;
    },
    [GETTERS.FULLSCREEN_PREVIOUS_NEXT_LAYOUT](state, getters, rootState) {
      return rootState.routerModule.query.fpnb || "zoom";
    },
    [GETTERS.MASCOT_STYLE](state, getters, rootState) {
      return rootState.routerModule.query.msct || "default";
    },
    [GETTERS.POST_COMPACTNESS](state, getters, rootState) {
      return rootState.routerModule.query.compactness || "more";
    },
    [GETTERS.FULLSCREEN_BUTTONS_LAYOUT](state, getters, rootState) {
      return rootState.routerModule.query.fsl || "br";
    },
    [GETTERS.POST_BUTTONS_LAYOUT](state, getters, rootState) {
      const downloadButton = {
        icon: "mdi-image",
        id: 0,
        active: true,
        activeFullscreen: true,
        name: "download",
        description: "Download",
      };
      const openOnE621Button = {
        icon: "mdi-open-in-new",
        id: 1,
        active: true,
        activeFullscreen: true,
        name: "e621",
        description: "Open with e621",
      };
      const infoButton = {
        icon: "mdi-information",
        id: 3,
        active: true,
        activeFullscreen: true,
        name: "info",
        description: "Information",
      };
      const favoriteButton = {
        icon: "mdi-heart-outline",
        id: 4,
        active: true,
        activeFullscreen: true,
        name: "favorite",
        description: "Favoriting",
      };
      const openInNewTabButton = {
        icon: "mdi-tab",
        id: 6,
        active: false,
        activeFullscreen: false,
        name: "new_tab",
        description: "Open in new tab",
      };
      const openPostsFromAuthorButton = {
        icon: "mdi-brush",
        id: 7,
        active: false,
        activeFullscreen: false,
        name: "new_tab_author",
        description: "Posts from author",
      };
      const postScoreButton = {
        icon: "mdi-counter",
        id: 8,
        active: true,
        activeFullscreen: true,
        name: "post_score",
        description: "Suggestion score",
      };
      const buttons = [
        postScoreButton,
        downloadButton,
        openOnE621Button,
        infoButton,
        favoriteButton,
        openInNewTabButton,
        openPostsFromAuthorButton,
      ];
      const list = (rootState.routerModule.query.btnl || "")
        .split("_")
        .map((str) => {
          if (!str) return;
          const num = parseInt(str.replace(/[tf]$/, ""));
          const active = !str.substr(-2, 1).endsWith("f");
          const activeFullscreen = !str.substr(-1, 1).endsWith("f");
          for (const btn of buttons) {
            if (num == btn.id && !btn.disabled)
              return {
                ...btn,
                active: active,
                activeFullscreen: activeFullscreen,
              };
          }
        })
        .filter((btn) => !!btn);
      // add remaining buttons (won't be visible after update otherwise)
      for (const button of buttons) {
        if (
          list.findIndex((btn) => btn.id == button.id) < 0 &&
          !button.disabled
        ) {
          list.push(button);
        }
      }
      return list;
    },
    [GETTERS.NAVIGATION_TYPE](state, getters, rootState) {
      return rootState.routerModule.query.nav || "sidebar";
    },
    [GETTERS.POST_LAYOUT](state, getters, rootState) {
      return rootState.routerModule.query.layout || "blog";
    },
    [GETTERS.IS_PAGINATED_MODE](state, getters, rootState) {
      return (
        rootState.routerModule.query.pagination === "true" ||
        rootState.routerModule.query.pagination === true
      );
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
    [GETTERS.IS_SUGGESTION_ORDERED](state, getters, rootState) {
      return !(
        rootState.routerModule.query.sorder === "false" ||
        rootState.routerModule.query.sorder === false
      );
    },
    [GETTERS.IS_DOWNLOAD_PROGRESS](state, getters, rootState) {
      return (
        rootState.routerModule.query.dp === "true" ||
        rootState.routerModule.query.dp === true
      );
    },
    [GETTERS.IS_CONCURRENT_DOWNLOADS](state, getters, rootState) {
      return !(
        rootState.routerModule.query.cd === "false" ||
        rootState.routerModule.query.cd === false
      );
    },
    [GETTERS.IS_AUTO_LOAD](state, getters, rootState) {
      if (getters[GETTERS.IS_PAGINATED_MODE]) return false;
      return (
        rootState.routerModule.query.aload === "true" ||
        rootState.routerModule.query.aload === true
      );
    },
    [GETTERS.IS_BACKGROUND_COLORED](state, getters, rootState) {
      return !(
        rootState.routerModule.query.rbg === "false" ||
        rootState.routerModule.query.rbg === false
      );
    },
    [GETTERS.IS_COMPACT_MODE](state, getters, rootState) {
      return (
        rootState.routerModule.query.cm === "true" ||
        rootState.routerModule.query.cm === true
      );
    },
    [GETTERS.IS_BOTTOM_LOAD](state, getters, rootState) {
      if (getters[GETTERS.IS_PAGINATED_MODE]) return false;
      return !(
        rootState.routerModule.query.bload === "false" ||
        rootState.routerModule.query.bload === false
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
    [GETTERS.GET_CURRENT_PAGE_NUMBER](state, getters, rootState) {
      return parseInt(
        mathMinMaxDefault(1, 750, 1, rootState.routerModule.query.page),
      );
    },
    [GETTERS.GET_MAX_PAGE_NUMBER](state, getters, rootState) {
      const pages = Math.max(
        getters[GETTERS.GET_CURRENT_PAGE_NUMBER],
        parseInt(
          mathMinMaxDefault(1, 750, 1, rootState.routerModule.query.mpages), //max pages
        ),
      );
      return parseInt(mathMinMaxDefault(1, 750, 1, pages));
    },
  },
  actions: {
    [ACTIONS.SET_CURRENT_PAGE_NUMBER]({ rootState }, id) {
      router.push({
        query: {
          ...rootState.routerModule.query,
          page: id,
        },
      });
    },
    [ACTIONS.SET_MAX_PAGE_NUMBER]({ rootState }, num) {
      router.push({
        query: {
          ...rootState.routerModule.query,
          mpages: num,
        },
      });
    },
    [ACTIONS.SET_FULLSCREEN_POST_ID]({ rootState }, id) {
      router.push({
        query: {
          ...rootState.routerModule.query,
          fspost: id,
        },
      });
    },
    [ACTIONS.LOG_IN]({ commit }, options) {
      // Logs in user or restores previous saved login information
      if (
        options &&
        typeof options.username === "string" &&
        typeof options.apiKey === "string" &&
        typeof options.proxy === "string"
      ) {
        commit(MUTATIONS.SET_AUTHENTICATION, {
          loggedIn: true,
          username: options.username,
          apiKey: options.apiKey,
          proxy: options.proxy,
        });
        store.set("user_data", {
          // Base64 encoded
          loggedIn: true,
          username: btoa(options.username),
          apiKey: btoa(options.apiKey),
          proxy: options.proxy,
        });
      } else {
        if (store.get("user_data")) {
          commit(MUTATIONS.SET_AUTHENTICATION, {
            loggedIn: store.get("user_data").loggedIn,
            username: atob(store.get("user_data").username),
            apiKey: atob(store.get("user_data").apiKey),
            proxy: store.get("user_data").proxy,
          });
        }
      }
    },
    [ACTIONS.LOG_OUT]({ commit }) {
      commit(MUTATIONS.SET_AUTHENTICATION, {
        loggedIn: false,
        username: "",
        key: "",
        proxy: "",
      });
      store.remove("user_data");
    },
  },
};

export default settingsModule;
