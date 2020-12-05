import VueRouter from "vue-router";

const tagColorMappingId: { [idx: string]: string | undefined } = {
  "1": "yellow",
  "4": "green",
  "3": "purple",
  "5": "orange",
  "0": "grey",
};

const tagColorMapping: { [idx: string]: string | undefined } = {
  artist: "yellow",
  // "1": "yellow",

  character: "green",
  // "4": "green",

  copyright: "purple",
  // "3": "purple",

  species: "orange",
  // "5": "orange",

  pool: "pink",

  general: "grey",
  // "0": "grey",
  default: "grey",
};

export const updateRouterQuery = (
  router: VueRouter,
  newQuery: { [idx: string]: string | undefined },
) => {
  router.push({
    query: { ...router.currentRoute.query, ...newQuery },
  });
};

export const getTagColorFromCategory = (category: string) => {
  return tagColorMapping[category] || tagColorMapping.default!;
};

export const getTagColorFromCategoryId = (categoryId: number) => {
  return tagColorMappingId[categoryId] || tagColorMapping.default!;
};

export const UtilitiesPlugin = {
  install(Vue: any) {
    Vue.prototype.$notify = (...args: any[]) => {
      console.log("notify", ...args);
    };
  },
};
