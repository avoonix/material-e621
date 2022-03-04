import "intersection-observer";
import "typeface-roboto";
import { vuetify } from "./misc/plugins";
import { showConsoleMessage } from "./misc/util/consoleMessage";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { persistanceService, snackbarService } from "./services";
import "./misc/serviceWorker/register";

if (import.meta.env.PROD) showConsoleMessage();

persistanceService.persist();

new (Vue as any)({
  router,
  vuetify,
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

export { router };
