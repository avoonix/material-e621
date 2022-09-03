import { defineStore } from "pinia";
import { computed } from "vue";
import { useMainStore } from "./state";

export const useAccountStore = defineStore("account", () => {
  const main = useMainStore();
  const username = computed({
    get() {
      return main.account.username;
    },
    set(value) {
      main.account.username = value;
    },
  });
  const apiKey = computed({
    get() {
      return main.account.apiKey;
    },
    set(value) {
      main.account.apiKey = value;
    },
  });
  const auth = computed(() =>
    main.account.apiKey && main.account.username
      ? {
          login: main.account.username,
          api_key: main.account.apiKey,
        }
      : undefined,
  );

  return {
    username,
    apiKey,
    auth,
  };
});
