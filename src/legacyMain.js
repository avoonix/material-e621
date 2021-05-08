import Vue from "vue";
import { createStore } from "./store";
import Vuex from "vuex";

Vue.use(Vuex);

const store = createStore();

export { store };
