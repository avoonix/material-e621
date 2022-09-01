import { readonly } from "vue";
import { isEmpty, isEqual } from "lodash";
import Vue from "vue";
import { state } from "./state";

class FavoriteService {
  public get tags() {
    return state.favorites.tags;
  }
  public get hasFavorites() {
    return !isEmpty(state.favorites.tags);
  }
  public isFavorited(name: string, category: string) {
    return !!state.favorites.tags[category]?.[name];
  }
  public setFavorite(
    name: string,
    category: string,
    favorite: boolean,
    display?: string,
  ) {
    if (favorite) {
      if (!state.favorites.tags[category]) {
        Vue.set(state.favorites.tags, category, {});
      }
      Vue.set(
        state.favorites.tags[category],
        name,
        display && display !== name ? display : true,
      );
    } else {
      Vue.delete(state.favorites.tags[category], name);
      if (isEmpty(state.favorites.tags[category])) {
        Vue.delete(state.favorites.tags, category);
      }
    }
  }
}

export const favoriteService = new FavoriteService();
