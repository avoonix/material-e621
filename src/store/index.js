import Vuex from "vuex";
import uniq from "lodash.uniq";
import { favoritePost, downloadPost, normalizePosts } from "./api";
import settingsModule from "./settings";
import { MUTATIONS, GETTERS, ACTIONS } from "./constants";
import JSZip from "jszip";
import { bitrate } from "../utilities/bitrate";
import { getApiService } from "../worker/services";
import { blacklistService } from "@/services";
import { snackbarService } from "@/services";

const wait = (t) => {
  // eslint-disable-next-line
  return new Promise((r) => setTimeout(r, t));
};

// store.state.route.path   // current path (string)
// store.state.route.params // current params (object)
// store.state.route.query  // current query (object)

const createStore = () => {
  const store = new Vuex.Store({
    modules: {
      settings: settingsModule,
    },
    state: {
      pages: {}, // page number => array of ids
      visiblePostList: [], // array of ids
      visiblePostListDialog: [], // array of ids
      allPosts: {}, // posts themselves
      favoritedPosts: [], // only contains ids
      fullscreen: 0,
      detailed: 0, // details view
      noResults: false,
      queryHistory: [], // string[]
      zip: {
        loading: false,
        ready: false,
        progressArr: [],
        timeRemaining: 0,
        bitrate: "? MB/s",
        rawBitrate: 0,
        rawAllByteSize: 1,
      },
      WORKER_GET_POST: {}, // id => post
    },
    mutations: {
      updateFavoritedPosts(state, { operation, postId }) {
        if (operation == "add") {
          if (!state.favoritedPosts.find((id) => id == postId))
            state.favoritedPosts.push(postId);
        }
        if (operation == "remove") {
          state.favoritedPosts = state.favoritedPosts.filter(
            (id) => id != postId,
          );
        }
      },
      addPosts(state, { posts, shouldContain, page }) {
        // console.log(posts);
        // return;
        state.noResults =
          posts.result.length === 0 || posts.result.length < shouldContain;
        state.visiblePostList = uniq(
          state.visiblePostList.concat(posts.result),
        ); // TODO: verify it really works
        state.pages = { ...state.pages, [page]: posts.result };
        state.allPosts = Object.seal({ ...posts.posts, ...state.allPosts });
      },
      resetPosts(state) {
        state.noResults = false;
        state.visiblePostList = [];
        state.pages = {};

        state.allPosts = {};

        for (const key in state.allPosts) {
          if (state.allPosts.hasOwnProperty(key)) {
            delete state.allPosts[key];
          }
        }
      },
      [MUTATIONS.SET_DETAILS_VIEW](state, { id }) {
        state.detailed = id;
      },
      resetNoResults(state) {
        state.noResults = false;
      },
      [MUTATIONS.SET_VISIBLE_POSTS_DIALOG](state, { posts }) {
        state.visiblePostListDialog = posts;
      },
      [MUTATIONS.ADD_VISIBLE_POSTS_DIALOG](state, posts) {
        state.visiblePostListDialog.push(...posts);
      },
    },
    actions: {
      [ACTIONS.SET_VISIBLE_POSTS_DIALOG]({ commit }, { posts }) {
        commit(MUTATIONS.SET_VISIBLE_POSTS_DIALOG, { posts });
      },
      [ACTIONS.ADD_VISIBLE_POSTS_DIALOG]({ commit }, posts) {
        commit(MUTATIONS.ADD_VISIBLE_POSTS_DIALOG, posts);
      },
      resetNoResults({ commit }) {
        commit("resetNoResults");
      },
      [ACTIONS.SET_DETAILS_VIEW]({ commit }, { id }) {
        commit(MUTATIONS.SET_DETAILS_VIEW, { id });
      },
      async favoritePost({ commit, state }, { action, postId }) {
        favoritePost({
          postId,
          action,
          username: state.settings.username,
          key: state.settings.apiKey,
          proxy: state.settings.proxy,
          callback: ({
            data,
            notAuthenticated,
            alreadyExists,
            otherError,
            message,
          }) => {
            console.log(data.message);
            if (notAuthenticated || otherError) {
              if (notAuthenticated) {
                snackbarService.addMessage(
                  "Your login information is wrong. Please check the API key and username",
                );
              } else {
                snackbarService.addMessage(message);
              }
              return;
            }
            if (alreadyExists) {
              snackbarService.addMessage("You already favorited this");
            }
            let operation;
            if (action == "create") {
              operation = "add";
            } else {
              operation = "remove";
            }
            commit("updateFavoritedPosts", { postId, operation });
          },
        });
      },
      resetPosts({ commit, dispatch }) {
        commit("resetPosts");
        dispatch(ACTIONS.SET_MAX_PAGE_NUMBER, 1);
        dispatch(ACTIONS.SET_CURRENT_PAGE_NUMBER, 1);
      },
      async fetchFavorites({ state }) {
        const fetchPart = (beforeId) =>
          getApiService().then((service) =>
            service
              .getPosts({
                limit: 320,
                tags: `fav:${state.settings.username}`,
                postsBefore: beforeId,
              })
              .then((posts) => normalizePosts(posts)),
          );
        state.favoritedPosts = [];
        let lastFetch;
        do {
          const beforeId =
            lastFetch && lastFetch.result
              ? lastFetch.result[lastFetch.result.length - 1]
              : false;
          lastFetch = await fetchPart(beforeId);
          state.favoritedPosts = [...state.favoritedPosts, ...lastFetch.result];
          wait(300);
        } while (
          lastFetch.result.length == 320 &&
          state.favoritedPosts.length < 6400
        );
        setTimeout(() => {
          // resolve();
        }, 4000);
      },
      async loadPosts(
        { commit, state, getters, dispatch },
        { reset, resetNoResults },
      ) {
        state.queryHistory = state.queryHistory.filter(
          (t) => t !== state.routerModule.query.tags,
        );
        state.queryHistory.unshift(state.routerModule.query.tags);

        if (resetNoResults) state.noResults = false;
        if (getters.noResults) return;
        if (reset) dispatch("resetPosts");
        const before_id =
          getters[GETTERS.GET_VISIBLE_POSTS].length != 0
            ? getters[GETTERS.GET_VISIBLE_POSTS][
                getters[GETTERS.GET_VISIBLE_POSTS].length - 1
              ].id
            : false;

        const page = getters[GETTERS.GET_CURRENT_PAGE_NUMBER];

        await getApiService()
          .then((service) =>
            service
              .getPosts({
                limit: getters[GETTERS.POST_FETCH_COUNT],
                // tags: createQuery(
                //   getters[GETTERS.BLACKLIST_MODE],
                //   blacklistService.tags.join(" "),
                tags: state.routerModule.query.tags || "",
                // state.allTags,
                // ),
                page: getters[GETTERS.IS_PAGINATED_MODE] ? page : undefined,
                postsBefore: !getters[GETTERS.IS_PAGINATED_MODE]
                  ? before_id
                  : undefined,
              })
              .then((posts) => normalizePosts(posts)),
          )
          .then((normalizedPosts) => {
            commit("addPosts", {
              posts: normalizedPosts,
              shouldContain: getters[GETTERS.POST_FETCH_COUNT],
              page: page,
            });
            if (normalizedPosts.result.length > 0) {
              dispatch(
                ACTIONS.SET_MAX_PAGE_NUMBER,
                Math.max(
                  page,
                  getters[GETTERS.GET_CURRENT_PAGE_NUMBER],
                  getters[GETTERS.GET_MAX_PAGE_NUMBER],
                ),
              );
            }
            // dispatch("addTagsFromPost", { normalizedPosts });
          })
          .catch(console.log);
      },
    },
    getters: {
      [GETTERS.GET_CURRENT_PAGE_LOADED](state, getters) {
        return (
          state.pages[getters[GETTERS.GET_CURRENT_PAGE_NUMBER]] !== undefined
        );
      },
      [GETTERS.GET_VISIBLE_POSTS_BLACKLISTED](state, getters) {
        let postList;
        if (getters[GETTERS.IS_PAGINATED_MODE]) {
          postList =
            state.pages[getters[GETTERS.GET_CURRENT_PAGE_NUMBER]] || [];
        } else {
          postList = state.visiblePostList;
        }
        return postList // FIXME: 3.5 ms js profiler
          .map((postId) => getters[GETTERS.GET_POST](postId))
          .filter((post) => !post || !post.id).length;
      },
      [GETTERS.GET_VISIBLE_POSTS](state, getters) {
        let postList;
        if (getters[GETTERS.IS_PAGINATED_MODE]) {
          postList =
            state.pages[getters[GETTERS.GET_CURRENT_PAGE_NUMBER]] || [];
        } else {
          postList = state.visiblePostList;
        }
        let enhancedPostList = postList
          .map((postId) => getters[GETTERS.GET_POST](postId))
          .filter((post) => post && post.id);
        return enhancedPostList;
      },
      [GETTERS.GET_VISIBLE_POSTS_DIALOG](state, getters) {
        return state.visiblePostListDialog
          .map((postId) => getters[GETTERS.GET_POST](postId))
          .filter((post) => post && post.id);
      },
      [GETTERS.GET_NOT_YET_LOADED_POSTS_DIALOG](state) {
        return state.visiblePostListDialog.filter((postId) => {
          const post = state.allPosts[postId];
          return !post;
        });
      },
      [GETTERS.GET_POST](state) {
        return (id) => {
          return state.WORKER_GET_POST[id] || false;
        };
      },
      noMorePosts(state, getters) {
        return state.noResults && getters[GETTERS.GET_VISIBLE_POSTS].length > 0;
      },
      noResults(state) {
        return state.noResults;
      },
      [GETTERS.GET_FULLSCREEN_POST](state, getters) {
        return getters[GETTERS.GET_POST](
          getters[GETTERS.GET_FULLSCREEN_POST_ID],
        );
      },
      [GETTERS.GET_FULLSCREEN_POST_ID](state) {
        return parseInt(state.routerModule.query.fspost || 0);
      },
      [GETTERS.GET_DETAILS_VIEW_POST](state, getters) {
        return getters[GETTERS.GET_POST](state.detailed);
      },
    },
  });
  return store;
};

export { createStore };
