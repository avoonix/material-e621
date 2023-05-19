import { defineStore } from "pinia";
import { computed } from "vue";
import { useMainStore } from "./state";

export const useSavedSearchStore = defineStore("saved-search", () => {
  const main = useMainStore();
  const entries = computed(() => main.searches.entries);
  const deleteEntry = (index: number) => {
    main.searches.entries.splice(index, 1);
  };
  const addEntry = (tags: string[], name: string) => {
    main.searches.entries.push({ name, tags });
  };
  // const updateEntry = (index: number, name: string) => {
  //   main.searches.entries.splice(index, 1);
  // };

  return {
    entries,
    deleteEntry,
    addEntry,
  };
});
