import { useHistoryStore } from "@/services";
import { computed } from "vue";

export const useHistory = () => {
  const history = useHistoryStore();
  const historyEntries = computed(() => history.entries);
  const addHistoryEntry = (tags: string[]) => history.addEntry(tags);
  const removeHistoryEntry = (idx: number) => history.deleteEntry(idx);

  return {
    historyEntries,
    addHistoryEntry,
    removeHistoryEntry,
  };
};
