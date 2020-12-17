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

const getTagColor = (type) => {
  return toColor[type] || toColor["default"];
};

const getTagCategory = (type) => {
  if (typeof type == "string") type = type.toLowerCase();
  return toCategory[type] || toCategory["default"];
};

const MyPlugin = {
  install(Vue) {
    Vue.prototype.$getTagColor = getTagColor;
    Vue.prototype.$getTagCategory = getTagCategory;
    Vue.prototype.$appName = appName;
    Vue.prototype.$baseUrl = baseUrl;
  },
};

export default MyPlugin;
export { getTagColor, getTagCategory };
