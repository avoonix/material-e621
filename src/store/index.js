import Vuex from "vuex";
import uniq from "lodash.uniq";
import {
  favoritePost,
  downloadPost,
  loadComments,
  createQuery,
  normalizePosts,
} from "./api";
import snackbarModule from "./snackbar";
import settingsModule from "./settings";
import { MUTATIONS, GETTERS, ACTIONS } from "./constants";
import JSZip from "jszip";
import { bitrate } from "../utilities/bitrate";
import { getApiService } from "../worker/services";

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
      snackbar: snackbarModule,
      settings: settingsModule,
    },
    state: {
      comments: {},
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
      async downloadPage({ state, getters, dispatch }) {
        state.zip.loading = true;
        try {
          const zip = new JSZip();
          const visiblePosts = getters[GETTERS.GET_VISIBLE_POSTS];
          const promises = [];
          const concurrent = getters[GETTERS.IS_CONCURRENT_DOWNLOADS];

          state.zip.timeRemaining = 0;
          const smoothingFactor = 0.05;
          const startTime = Date.now();
          let averageBitrate = 0;
          const calculateAverage = () => {
            const currentTime = Date.now();
            const percentageDone = (() => {
              let allFileSize = 0;
              let doneFileSize = 0;
              for (let i = 0; i < visiblePosts.length; i++) {
                allFileSize += visiblePosts[i].file_size;
                doneFileSize +=
                  visiblePosts[i].file_size * (state.zip.progressArr[i] / 100);
              }
              const currentBitrate = bitrate(
                doneFileSize,
                (currentTime - startTime) / 1000,
                "MB/s", // mb/s
              );
              if (averageBitrate == 0) averageBitrate = currentBitrate;
              const bitrateSmooting = 0.05;
              averageBitrate =
                bitrateSmooting * currentBitrate +
                (1 - smoothingFactor) * averageBitrate;
              state.zip.bitrate = averageBitrate.toFixed(2) + " MB/s";
              state.zip.rawBitrate = currentBitrate;
              state.zip.rawAllByteSize = allFileSize;
              return doneFileSize / allFileSize;
            })();

            state.zip.timeRemaining =
              Math.round(
                (state.zip.rawAllByteSize * (1 - percentageDone)) /
                  1e6 /
                  state.zip.rawBitrate /
                  5,
              ) * 5;
          };

          state.zip.progressArr = [...new Array(visiblePosts.length)].map(
            () => 0,
          );
          for (let current = 0; current < visiblePosts.length; current++) {
            const post = visiblePosts[current];
            promises.push(
              (async () => {
                const image = await downloadPost({
                  url: "https://cors-anywhere.herokuapp.com/" + post.file_url,
                  progress: (percentage) => {
                    state.zip.progressArr[current] = percentage; // 0-100
                    state.zip.progressArr = [...state.zip.progressArr]; // trigger update
                    calculateAverage();
                  },
                });
                state.zip.progressArr[current] = 100; // make sure progress is really 100
                state.zip.progressArr = [...state.zip.progressArr]; // trigger update
                calculateAverage();
                const allTags = Object.values(post.tags) // TODO: use GET_POST getter's all tags instead
                  .reduceRight((prev, cur) => [...cur, ...prev], [])
                  .join(" ");
                const filename = getters[GETTERS.IS_DESCRIPTIVE_FILENAME]
                  ? post.id + " " + allTags + "." + post.file_ext
                  : post.file_url.split("/").slice(-1)[0];
                zip.file(filename, image);
              })(),
            );
            if (!concurrent) {
              await Promise.all(promises); // awaits each promise individually
            }
          }
          await Promise.all(promises); // awaits all promises
          const zipBlob = await zip.generateAsync({ type: "blob" });
          state.zip.ready = true;
          window.zipBlob = zipBlob;
        } catch (error) {
          dispatch(ACTIONS.ADD_MESSAGE, error.message || error);
        }
        state.zip.loading = false;
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
                commit(
                  MUTATIONS.ADD_MESSAGE,
                  "Your login information is wrong. Please check the API key and username",
                );
              } else {
                commit(MUTATIONS.ADD_MESSAGE, message);
              }
              return;
            }
            if (alreadyExists) {
              commit(MUTATIONS.ADD_MESSAGE, "You already favorited this");
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
                tags: createQuery(
                  getters[GETTERS.BLACKLIST_MODE],
                  getters[GETTERS.GET_BLACKLIST_STRING],
                  state.routerModule.query.tags || "",
                  // state.allTags,
                ),
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
      [ACTIONS.LOAD_COMMENTS]({ state, getters }, { id }) {
        if (!(state.allPosts[id] || {}).has_comments) {
          state.comments = { ...state.comments, [id]: Object.seal([]) };
          return;
        }
        loadComments({
          id: id,
        })
          .then((comments) => {
            state.comments = { ...state.comments, [id]: Object.seal(comments) }; // array of comments or empty array
          })
          .catch(() => {});
      },
    },
    getters: {
      [GETTERS.GET_COMMENTS](state) {
        return (id) => state.comments[id] || false; // TODO:
      },
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
