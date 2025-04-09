import { isEmpty } from "lodash";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useMainStore } from "./state";

export const useFavoritesStore = defineStore("favorites", () => {
  const main = useMainStore();
  const tags = computed(() => main.favorites.tags);
  const hasFavorites = computed(() => !isEmpty(main.favorites.tags));
  const isFavorited = computed(
    () => (name: string, category: string) =>
      !!main.favorites.tags[category]?.[name],
  );
  const setFavorite = (
    name: string,
    category: string,
    favorite: boolean,
    display?: string,
  ) => {
    if (favorite) {
      if (!main.favorites.tags[category]) {
        main.favorites.tags[category] = {};
      }
      main.favorites.tags[category][name] = display && display !== name ? display : true;
    } else {
      delete main.favorites.tags[category][name];
      if (isEmpty(main.favorites.tags[category])) {
        delete main.favorites.tags[category];
      }
    }
  };
  return {
    tags,
    hasFavorites,
    isFavorited,
    setFavorite,
  };
});
