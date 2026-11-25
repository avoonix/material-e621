import { defineStore } from "pinia";
import { computed } from "vue";
import { useMainStore } from "./state";

export const useUrlStore = defineStore("url", () => {
  const main = useMainStore();

  const e621Url = computed({
    get() {
      return main.misc.urls.e621;
    },
    set(value) {
      main.misc.urls.e621 = value;
    },
  });

  return {
    e621Url,
  };
});
