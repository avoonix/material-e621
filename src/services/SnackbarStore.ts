import { defineStore } from "pinia";
import { computed } from "vue";
import { useMainStore } from "./state";

export const useSnackbarStore = defineStore("snackbar", () => {
  const main = useMainStore();
  const message = computed(() => main.snackbar);
  const addMessage = (message: string) => (main.snackbar = message);
  const clearMessage = () => (main.snackbar = null);

  return {
    message,
    addMessage,
    clearMessage,
  };
});
