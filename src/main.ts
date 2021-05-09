import "intersection-observer";
import "typeface-roboto";
import "./misc/plugins";
import { showConsoleMessage } from "./misc/util/consoleMessage";
import { registerServiceWorker } from "./worker/serviceWorker/registerServiceWorker";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ExternalLink from "./components/updated/dumb/ExternalLink.vue";
import { persistanceService } from "./services";

registerServiceWorker();

Vue.component("external-link", ExternalLink);

process.env.NODE_ENV !== "development" && showConsoleMessage();

persistanceService.persist();

new (Vue as any)({
  router,
  render: (h: any) => h(App),
  metaInfo: {
    titleTemplate: "%s",
    title: "Material e621",
  },
}).$mount("#app");
