import "intersection-observer";
import "typeface-roboto";
import Vue from "vue";
import App from "./App.vue";
import { pinia, vuetify } from "./misc/plugins";
import "./misc/serviceWorker/register";
import { showConsoleMessage } from "./misc/util/consoleMessage";
import router from "./router";
import { useSnackbarStore } from "./services";

if (import.meta.env.PROD) showConsoleMessage();

new Vue({
  router,
  vuetify,
  pinia,
  render: (h: any) => h(App),
  metaInfo: {
    titleTemplate: "%s",
    title: "Material e621",
  },
}).$mount("#app");

Vue.config.errorHandler = (err, vm, info) => {
  const snackbar = useSnackbarStore();
  console.error(err, vm, info);
  snackbar.addMessage(`Error: ${err.message}`);
};

export { router };
