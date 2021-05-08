import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
import Fragment from "vue-fragment";
import PortalVue from "portal-vue";
import Meta from "vue-meta";
import "./vue";
import "./vuetify";

Vue.use(VueCompositionAPI);
Vue.use(Fragment.Plugin);
Vue.use(PortalVue);
Vue.use(Meta, {
  tagIDKeyName: "vmid",
  attribute: "data-vue-meta",
  keyName: "metaInfo",
});
