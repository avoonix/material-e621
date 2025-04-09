import { defineStore } from "pinia";
import { computed } from "vue";
import { useMainStore } from "./state";

const stripTag = (tag: string) =>
  tag.trim().toLowerCase().replaceAll(/^--/g, "");

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
  const addTag = (index: number, tag: string) => {
    removeTag(index, tag);
    if (!main.blacklist.tags[index]) {
      main.blacklist.tags[index] = [];
    }
    main.blacklist.tags[index].push(stripTag(tag));
  };

  const removeTag = (index: number, tag: string) => {
    console.log(index, tag);
    if (!main.blacklist.tags[index]) return;
    const idx = main.blacklist.tags[index].indexOf(stripTag(tag));
    if (idx >= 0) {
      main.blacklist.tags[index].splice(idx, 1);
    }
    if(main.blacklist.tags[index].length === 0) {
      main.blacklist.tags.splice(index, 1);
    }
  };


  const hideServerSideBlacklisted = computed({
    get() { return main.blacklist.hideServerSideBlacklisted; },
    set(value) { main.blacklist.hideServerSideBlacklisted = value; },
  });

  // only count tag as blacklisted if every occurrence of the tag (= single row in blacklist) is blacklisted
  const tagIsBlacklisted = computed(
    () => (tag: string) => !!main.blacklist.tags.find(tags => tags.length === 1 && tags[0] === stripTag(tag)),
  );

  return {
    mode,
    tags,
    addTag,
    removeTag,
    tagIsBlacklisted,
    hideServerSideBlacklisted,
  };
});
