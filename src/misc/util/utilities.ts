import VueRouter from "vue-router";

export const getAppName = () => "Material e621";
export const getBaseUrl = () => document.location.origin;

const tagColorMapping: { [idx: string]: string | undefined } = {
  character: "light-green",
  copyright: "purple",
  general: "blue-grey",
  invalid: "red",
  default: "grey",
  species: "deep-orange",
  artist: "orange",
  lore: "green",
  pool: "pink",
  meta: "grey",
};

export const categoryIdToCategoryName = (id: number) => {
  const categories: { [idx: string]: string | undefined } = {
    0: "general",
    1: "artist",
    3: "copyright",
    4: "character",
    5: "species",
    6: "invalid",
    7: "meta",
    8: "lore",
  };
  return categories[id] || "invalid";
};

export const updateRouterQuery = (
  router: VueRouter,
  newQuery: { [idx: string]: string | undefined },
) => {
  router.push({
    query: { ...router.currentRoute.query, ...newQuery },
  });
};

export const removeRouterQuery = (router: VueRouter, keys: string[]) => {
  router.push({
    query: {
      ...Object.fromEntries(
        Object.entries(router.currentRoute.query).filter(
          (e) => !keys.includes(e[0]),
        ),
      ),
    },
  });
};

export const getTagColorFromCategory = (category: string) => {
  return tagColorMapping[category] || tagColorMapping.default!;
};
