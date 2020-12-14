import { computed, reactive, readonly } from "@vue/composition-api";
import clone from "clone";

export enum BlacklistMode {
  hide,
  blur,
  blackout,
}

export interface ISettingsServiceState {
  blacklist: {
    mode: BlacklistMode;
    tags: string[];
  };
}

const defaultSettings: ISettingsServiceState = {
  blacklist: {
    mode: BlacklistMode.blur,
    tags: ["rating:explicit"],
  },
};

export const state = reactive<ISettingsServiceState>(clone(defaultSettings));

export const useSettingsServiceState = () => ({
  state: computed(() => readonly(state)),
});
