import { toCategory, toColor } from "../config/colorTagMapping";

const appName = "Material e621";
const baseUrl = document.location.origin;

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
