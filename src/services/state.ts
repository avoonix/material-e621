import { isMobile } from "@/misc/util/mobile";
import { computed, reactive, readonly } from "@vue/composition-api";
import clone from "clone";
import {
  BlacklistMode,
  DataSaverType,
  FullscreenZoomUiMode,
  ISettingsServiceState,
} from "./types";

export const defaultSettings: ISettingsServiceState = {
  configVersion: 2,
  shortcuts: [
    // { action: "favorite_post", sequence: "f p" },
    // { action: "toggle_fullscreen", sequence: "t f" },
    // { action: "toggle_infos", sequence: "t i" },
    // { action: "go_to_next_post", sequence: "n p" },
    // { action: "go_to_previous_post", sequence: "p p" },
    // { action: "open_on_e621_net", sequence: "o e" },

    { action: "go_to_posts", sequence: "g p" },
    { action: "go_to_settings", sequence: "g s" },

    { action: "focus_search", sequence: "f s" },

    { action: "fullscreen_exit", sequence: "esc" },

    { action: "fullscreen_exit", sequence: "down" },
    { action: "fullscreen_next_post", sequence: "right" },
    { action: "fullscreen_previous_post", sequence: "left" },

    { action: "fullscreen_exit", sequence: "s" },
    { action: "fullscreen_next_post", sequence: "d" },
    { action: "fullscreen_previous_post", sequence: "a" },

    { action: "fullscreen_exit", sequence: "j" },
    { action: "fullscreen_next_post", sequence: "l" },
    { action: "fullscreen_previous_post", sequence: "h" },
  ],
  blacklist: {
    mode: BlacklistMode.blur,
    // tags: ["rating:explicit", "rating:questionable"],
    tags: [],
  },
  appearance: {
    primary: "#1976d2",
    secondary: "#001325",
    accent: "#82b1ff",
    background: "#102442",
    sidebar: "#001325",
    toolbar: "#020c1c",
    dark: true,
    transition: {
      fullscreen: "slide",
      route: "fade",
    },
    coloredRatingStripe: true,
    navigationType: "sidebar",
    logoStyle: "face",
    hideInstallPrompt: false,
  },
  history: {
    entries: [],
    maxLength: 100,
  },
  snackbar: null,
  account: {
    apiKey: null,
    username: null,
  },
  posts: {
    buttons: ["info", "fullscreen", "external", "favorite"],
    fullscreenButtons: ["external", "info", "favorite"],
    detailsButtons: ["external", "favorite"],
    fullscreenZoomUiMode: isMobile
      ? FullscreenZoomUiMode.alwaysHide
      : FullscreenZoomUiMode.hideWhileZoomed,
    postListFetchLimit: 30,
    sidebarSuggestionLimit: 40,
    tagFetchLimit: 30,
    goFullscreen: false,
    dataSaver: DataSaverType.auto,
  },
};

export const state = reactive<ISettingsServiceState>(clone(defaultSettings));

export const useSettingsServiceState = () => ({
  state: computed(() => readonly(state)),
});
