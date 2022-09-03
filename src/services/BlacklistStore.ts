import { defineStore } from "pinia";
import { computed } from "vue";
import { useMainStore } from "./state";

const stripTag = (tag: string) =>
  tag.trim().toLowerCase().replaceAll(/^-/g, "");

export const useBlacklistStore = defineStore("blacklist", () => {
  const main = useMainStore();
  const mode = computed({
    get() {
      return main.blacklist.mode;
    },
    set(value) {
      main.blacklist.mode = value;
    },
  });
  const tags = computed(() => main.blacklist.tags);
  const addTag = (tag: string) => {
    removeTag(tag);
    main.blacklist.tags.push(stripTag(tag));
  };

  const removeTag = (tag: string) => {
    const idx = main.blacklist.tags.indexOf(stripTag(tag));
    if (idx >= 0) {
      main.blacklist.tags.splice(idx, 1);
    }
  };

  const tagIsBlacklisted = computed(
    () => (tag: string) => main.blacklist.tags.includes(stripTag(tag)),
  );

  return {
    mode,
    tags,
    addTag,
    removeTag,
    tagIsBlacklisted,
  };
});
