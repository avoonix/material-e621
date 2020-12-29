import "./plugins";
import { store } from "./legacyMain.js";
import { showConsoleMessage } from "./utilities/consoleMessage";
import { registerServiceWorker } from "./worker/serviceWorker/register";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ExternalLink from "./components/updated/dumb/ExternalLink.vue";
import { persistanceService, state } from "./services";
import { watch } from "@vue/composition-api";

registerServiceWorker();

Vue.component("external-link", ExternalLink);

process.env.NODE_ENV !== "development" && showConsoleMessage();

persistanceService.loadState().then(() => {
  watch(state, () => persistanceService.saveState(), { deep: true });
});

new (Vue as any)({
  router,
  render: (h: any) => h(App),
  store,
  metaInfo: {
    titleTemplate: "%s",
    title: "Material e621",
  },
}).$mount("#app");
