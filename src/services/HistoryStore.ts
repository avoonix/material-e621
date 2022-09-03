import { isEqual } from "lodash";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useMainStore } from "./state";

export const useHistoryStore = defineStore("history", () => {
  const main = useMainStore();
  const maxLength = computed({
    get() {
      return main.history.maxLength;
    },
    set(value) {
      main.history.maxLength = value;
    },
  });
  const entries = computed(() => main.history.entries);
  const deleteEntry = (index: number) => {
    main.history.entries.splice(index, 1);
  };
  const addEntry = (tags: string[]) => {
    if (isEqual(tags, main.history.entries[0])) {
      return;
    }
    main.history.entries.unshift([...tags]);

    if (main.history.entries.length > maxLength.value) {
      main.history.entries.splice(maxLength.value, main.history.entries.length);
    }
  };

  return {
    maxLength,
    entries,
    deleteEntry,
    addEntry,
  };
});
