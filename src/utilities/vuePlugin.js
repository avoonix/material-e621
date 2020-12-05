import localforage from "localforage";
import { toCategory, toColor } from "../config/colorTagMapping";

const appName = "Material e621";
const baseUrl = document.location.origin;

localforage.config({
  description: "",
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  name: "material-e621",
  storeName: "material_e631",
});

// export const saveToLocalStorage = <T>(key: string, value: T): Promise<T> =>
//   localforage.setItem<T>(key, value);

// export const getFromLocalStorage = <T>(key: string): Promise<T> =>
//   localforage.getItem<T>(key);

// export const deleteFromLocalStorage = (key: string): Promise<void> =>
//   localforage.removeItem(key);

const wait = (time) => {
  // eslint-disable-next-line
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

const getTagColor = (type) => {
  return toColor[type] || toColor["default"];
};

const getTagCategory = (type) => {
  if (typeof type == "string") type = type.toLowerCase();
  return toCategory[type] || toCategory["default"];
};

const saveSettings = async function() {
  let query = this.$store.state.routerModule.query;
  query = { ...query, tags: undefined };
  try {
    await localforage.setItem("page_settings", query);
    await localforage.setItem("favorites", this.$store.state.favoritedPosts);
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
};

const shouldRestoreSettings = (query) => {
  const keys = Object.keys(query);
  const allowed = ["tags", "fspost", "agree", "pagination", "page", "mpages"];

  for (const key of keys) {
    if (allowed.indexOf(key) < 0) {
      return false;
    }
  }
  return true;
};

const restoreSettings = async function(settingsToForceRestore) {
  const settings = settingsToForceRestore
    ? settingsToForceRestore
    : await localforage.getItem("page_settings");
  const favorites = await localforage.getItem("favorites");
  if (favorites) {
    this.$store.state.favoritedPosts = favorites;
  }
  if (settings) {
    await wait(10);
    if (
      settingsToForceRestore ||
      shouldRestoreSettings(this.$store.state.routerModule.query)
    ) {
      // restore settings if the user was already on the site and doesn't have a query
      this.$router.push({
        query: {
          ...settings,
          tags: this.$store.state.routerModule.query.tags,
          fspost: this.$store.state.routerModule.query.fspost,
          mpages: this.$store.state.routerModule.query.mpages,
          page: this.$store.state.routerModule.query.page,
        },
      });
    }
  }
};

const MyPlugin = {
  install(Vue) {
    Vue.prototype.$getTagColor = getTagColor;
    Vue.prototype.$getTagCategory = getTagCategory;
    Vue.prototype.$saveSettings = saveSettings;
    Vue.prototype.$restoreSettings = restoreSettings;
    Vue.prototype.$appName = appName;
    Vue.prototype.$baseUrl = baseUrl;
  },
};

export default MyPlugin;
export { getTagColor, getTagCategory, saveSettings, restoreSettings };
