import { defineStore } from "pinia";
import { computed } from "vue";
import { useMainStore } from "./state";
import type { Shortcut } from "./types";

export const useShortcutStore = defineStore("shortcuts", () => {
  const main = useMainStore();

  const shortcuts = computed(() => main.shortcuts);

  const deleteShortcut = (index: number) => {
    main.shortcuts.splice(index, 1);
  };

  const addShortcut = (shortcut: Shortcut) => {
    main.shortcuts.unshift(shortcut);
  };

  const updateShortcut = (index: number, shortcut: Shortcut) => {
    Object.assign(main.shortcuts[index], shortcut);
  };

  return {
    shortcuts,
    deleteShortcut,
    addShortcut,
    updateShortcut,
  };
});
