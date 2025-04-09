import { defineStore } from "pinia";
import { computed } from "vue";
import { useMainStore } from "./state";
import type { ButtonType } from "./types";

export const usePostsStore = defineStore("posts", () => {
  const main = useMainStore();
  const buttons = computed({
    get() {
      return [...main.posts.buttons];
    },
    set(value) {
      main.posts.buttons = [...value];
    },
  });
  const fullscreenButtons = computed({
    get() {
      return [...main.posts.fullscreenButtons];
    },
    set(value) {
      main.posts.fullscreenButtons = [...value];
    },
  });
  const detailsButtons = computed({
    get() {
      return [...main.posts.detailsButtons];
    },
    set(value) {
      main.posts.detailsButtons = [...value];
    },
  });
  const fullscreenZoomUiMode = computed({
    get() {
      return main.posts.fullscreenZoomUiMode;
    },
    set(value) {
      main.posts.fullscreenZoomUiMode = value;
    },
  });
  const postListFetchLimit = computed({
    get() {
      return main.posts.postListFetchLimit;
    },
    set(value) {
      main.posts.postListFetchLimit = value;
    },
  });
  const sidebarSuggestionLimit = computed({
    get() {
      return main.posts.sidebarSuggestionLimit;
    },
    set(value) {
      main.posts.sidebarSuggestionLimit = value;
    },
  });
  const tagFetchLimit = computed({
    get() {
      return main.posts.tagFetchLimit;
    },
    set(value) {
      main.posts.tagFetchLimit = value;
    },
  });
  const goFullscreen = computed({
    get() {
      return main.posts.goFullscreen;
    },
    set(value) {
      main.posts.goFullscreen = value;
    },
  });
  const dataSaver = computed({
    get() {
      return main.posts.dataSaver;
    },
    set(value) {
      main.posts.dataSaver = value;
    },
  });
  const lazyLoad = computed({
    get() {
      return main.posts.lazyLoadImages;
    },
    set(value) {
      main.posts.lazyLoadImages = value;
    },
  });
  const autoLoad = computed({
    get() {
      return main.posts.autoLoadNext;
    },
    set(value) {
      main.posts.autoLoadNext = value;
    },
  });
  const allButtonTypes = computed<ButtonType[]>(() => [
    "info",
    "fullscreen",
    "external",
    "favorite",
  ]);

  return {
    buttons,
    fullscreenButtons,
    detailsButtons,
    fullscreenZoomUiMode,
    postListFetchLimit,
    sidebarSuggestionLimit,
    tagFetchLimit,
    goFullscreen,
    dataSaver,
    lazyLoad,
    autoLoad,
    allButtonTypes,
  };
});
