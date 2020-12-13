// The Vue build version to load with the `import` command (runtime-only or
// standalone) has been set in webpack.base.conf with an alias.
import "intersection-observer";
import "typeface-roboto";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.min.css";

import Vue from "vue";
import App from "./App";
import router from "./router";
import { createStore } from "./store";
import Vuex from "vuex";
import { sync } from "vuex-router-sync";
import MyPlugin from "./utilities/vuePlugin";
import VueLazyload from "vue-lazyload";
import Meta from "vue-meta";
import { runWorker } from "./worker";
import ExternalLink from "./components/ExternalLink";
import Vuetify from "vuetify";
import { UtilitiesPlugin } from "./utilities/utilities";

import PortalVue from "portal-vue";
Vue.use(PortalVue);
Vue.use(UtilitiesPlugin);

Vue.use(Vuetify, {
  iconfont: "mdi",
});

Vue.component("external-link", ExternalLink);

Vue.config.devtools = true;

Vue.use(Vuex);
Vue.use(MyPlugin);
Vue.use(VueLazyload, {
  // preLoad: 1.3, error: "dist/error.png", loading: "dist/loading.gif",
  attempt: 9999,
  // observer: true
});
Vue.use(Meta, {
  tagIDKeyName: "vmid",
  attribute: "data-vue-meta",
  keyName: "metaInfo",
});

const store = createStore();
sync(store, router, { moduleName: "routerModule" });

runWorker(store);

Vue.config.productionTip = false;

window.addEventListener("beforeinstallprompt", () => {
  if (navigator.storage && navigator.storage.persist)
    navigator.storage.persist().then((granted) => {
      if (granted) {
        console.log(
          "Storage will not be cleared except by explicit user action",
        );
      } else {
        console.log("Storage may be cleared by the UA under storage pressure.");
      }
    });
});

const app = new Vue({
  router,
  render: (h) => h(App),
  store,
  metaInfo: {
    titleTemplate: "%s",
    title: "Material e621",
  },
}).$mount("#app");

export default app;
