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
const tagIconMapping: { [idx: string]: string | undefined } = {
  default: "mdi-tag",
  pool: "mdi-format-list-text",
  artist: "mdi-palette",
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

export const updateRouterQuery = async (newQuery: {
  [idx: string]: string | undefined;
}) => {
  const { appRouter } = await import("@/misc/util/router");
  appRouter.push({
    query: { ...appRouter.currentRoute.query, ...newQuery },
  });
};

export const removeRouterQuery = async (keys: string[]) => {
  const { appRouter } = await import("@/misc/util/router");
  appRouter.push({
    query: {
      ...Object.fromEntries(
        Object.entries(appRouter.currentRoute.query).filter(
          (e) => !keys.includes(e[0]),
        ),
      ),
    },
  });
};

export const getTagColorFromCategory = (category?: string) => {
  return category
    ? tagColorMapping[category] || tagColorMapping.default!
    : tagColorMapping.default!;
};

export const getTagIconFromCategory = (category?: string) => {
  return category
    ? tagIconMapping[category] || tagIconMapping.default!
    : tagIconMapping.default!;
};
