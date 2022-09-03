import clone from "clone";
import { defineStore } from 'pinia';
import { defaultSettings } from "./defaultSettings";

export const useMainStore = defineStore('main', {
  state: () => clone(defaultSettings)
})
