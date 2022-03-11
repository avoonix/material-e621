import Vuetify from "vuetify";
import Vue from "vue";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.min.css";
import { defaultSettings } from "@/services/defaultSettings";

Vue.use(Vuetify);

export const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    options: {
      customProperties: true,
    },
    dark: defaultSettings.appearance.dark,
    themes: {
      dark: {
        primary: defaultSettings.appearance.primary,
        secondary: defaultSettings.appearance.secondary,
        accent: defaultSettings.appearance.accent,
      },
      light: {
        primary: defaultSettings.appearance.primary,
        secondary: defaultSettings.appearance.secondary,
        accent: defaultSettings.appearance.accent,
      },
    },
  },
});
