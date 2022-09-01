import { computed, reactive, readonly } from "vue";
import clone from "clone";
import { defaultSettings } from "./defaultSettings";
import { ISettingsServiceState } from "./types";

export const state = reactive<ISettingsServiceState>(clone(defaultSettings));

export const useSettingsServiceState = () => ({
  state: computed(() => readonly(state)),
});
