import { computed, reactive, readonly } from "@vue/composition-api";
import clone from "clone";
import { BlacklistMode, ISettingsServiceState } from "./types";

export const defaultSettings: ISettingsServiceState = {
  blacklist: {
    mode: BlacklistMode.blur,
    // tags: ["rating:explicit", "rating:questionable"],
    tags: [],
  },
  appearance: {
    primary: "#1976d2",
    secondary: "#424242",
    accent: "#82b1ff",
    background: "#102442",
    sidebar: "#001325",
    dark: true,
    transition: {
      fullscreen: "slide",
      route: "fade",
    },
    coloredRatingStripe: true,
    navigationType: "sidebar",
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
    hideFullscreenUiOnZoom: true,
  },
};

export const state = reactive<ISettingsServiceState>(clone(defaultSettings));

export const useSettingsServiceState = () => ({
  state: computed(() => readonly(state)),
});
