import "intersection-observer";
import "typeface-roboto";
import "./misc/plugins";
import { showConsoleMessage } from "./misc/util/consoleMessage";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ExternalLink from "./components/updated/dumb/ExternalLink.vue";
import { persistanceService, snackbarService } from "./services";
import {
  registerServiceWorker,
  unregister,
} from "./worker/serviceWorker/register";

window.addEventListener("load", async () => {
  if (process.env.NODE_ENV === "development") {
    await unregister();
    console.log("skipped service worker registration");
  } else {
    await registerServiceWorker();
    await navigator.serviceWorker.ready;
    console.log("service worker ready");
  }
});

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

Vue.config.errorHandler = (err, vm, info) => {
  console.error(err, vm, info);
  snackbarService.addMessage(`Error: ${err.message}`);
};
