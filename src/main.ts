import "./plugins";
import { store } from "./legacyMain.js";
import { showConsoleMessage } from "./utilities/consoleMessage";
import { registerServiceWorker } from "./worker/serviceWorker/register";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";

registerServiceWorker();

process.env.NODE_ENV !== "development" && showConsoleMessage();

new (Vue as any)({
  router,
  render: (h: any) => h(App),
  store,
  metaInfo: {
    titleTemplate: "%s",
    title: "Material e621",
  },
}).$mount("#app");
