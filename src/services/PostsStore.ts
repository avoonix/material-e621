import { defineStore } from "pinia";
import { computed } from "vue";
import { useMainStore } from "./state";
import type { ButtonType } from "./types";
import { defaultSettings } from "./defaultSettings";
import { toWholeNumber, type Range } from "./wholeNumber";

export const postLimitRanges = {
  postListFetchLimit: { min: 10, max: 320 },
  tagFetchLimit: { min: 10, max: 500 },
  sidebarSuggestionLimit: { min: 0, max: 500 },
} satisfies Record<string, Range>;

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
  const postListFetchLimit = computed<number>({
    get() {
      return toWholeNumber(main.posts.postListFetchLimit, postLimitRanges.postListFetchLimit, defaultSettings.posts.postListFetchLimit);
    },
    set(value) {
      main.posts.postListFetchLimit = toWholeNumber(value, postLimitRanges.postListFetchLimit, postListFetchLimit.value);
    },
  });
  const sidebarSuggestionLimit = computed<number>({
    get() {
      return toWholeNumber(main.posts.sidebarSuggestionLimit, postLimitRanges.sidebarSuggestionLimit, defaultSettings.posts.sidebarSuggestionLimit);
    },
    set(value) {
      main.posts.sidebarSuggestionLimit = toWholeNumber(value, postLimitRanges.sidebarSuggestionLimit, sidebarSuggestionLimit.value);
    },
  });
  const tagFetchLimit = computed<number>({
    get() {
      return toWholeNumber(main.posts.tagFetchLimit, postLimitRanges.tagFetchLimit, defaultSettings.posts.tagFetchLimit);
    },
    set(value) {
      main.posts.tagFetchLimit = toWholeNumber(value, postLimitRanges.tagFetchLimit, tagFetchLimit.value);
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
