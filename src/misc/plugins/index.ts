import Vue from "vue";
import PortalVue from "portal-vue";
import Meta from "vue-meta";
import "./vue";
export * from "./vuetify";
import "./mousetrap";

Vue.use(PortalVue);
Vue.use(Meta, {
  tagIDKeyName: "vmid",
  attribute: "data-vue-meta",
  keyName: "metaInfo",
});
