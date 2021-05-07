import { historyService } from "@/services";
import { computed } from "@vue/composition-api";

export const useHistory = () => {
  const historyEntries = computed(() => historyService.entries);
  const addHistoryEntry = (tags: string[]) => historyService.addEntry(tags);
  const removeHistoryEntry = (idx: number) => historyService.deleteEntry(idx);

  return {
    historyEntries,
    addHistoryEntry,
    removeHistoryEntry,
  };
};
