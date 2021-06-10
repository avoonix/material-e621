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
    buttons: ["info", "fullscreen", "external"],
    fullscreenButtons: ["external", "info"],
    detailsButtons: ["external"],
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
