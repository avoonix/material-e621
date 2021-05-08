// The Vue build version to load with the `import` command (runtime-only or
// standalone) has been set in webpack.base.conf with an alias.
import "intersection-observer";
import "typeface-roboto";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.min.css";

import Vue from "vue";
import { createStore } from "./store";
import Vuex from "vuex";
import MyPlugin from "./utilities/vuePlugin";
import Meta from "vue-meta";

Vue.use(Vuex);
Vue.use(MyPlugin);
Vue.use(Meta, {
  tagIDKeyName: "vmid",
  attribute: "data-vue-meta",
  keyName: "metaInfo",
});

const store = createStore();

// window.addEventListener("beforeinstallprompt", () => {
//   if (navigator.storage && navigator.storage.persist)
//     navigator.storage.persist().then((granted) => {
//       if (granted) {
//         console.log(
//           "Storage will not be cleared except by explicit user action",
//         );
//       } else {
//         console.log("Storage may be cleared by the UA under storage pressure.");
//       }
//     });
// });

export { store };
