import { GETTERS } from "../store/constants";

const settingsComputedPropertiesMapping = [
  { value: "nav", getter: GETTERS.NAVIGATION_TYPE, query: "nav" },
  { value: "layout", getter: GETTERS.POST_LAYOUT, query: "layout" },
  { value: "bottomLoad", getter: GETTERS.IS_BOTTOM_LOAD, query: "bload" },
  { value: "autoLoad", getter: GETTERS.IS_AUTO_LOAD, query: "aload" },
  {
    value: "ratingBackground",
    getter: GETTERS.IS_BACKGROUND_COLORED,
    query: "rbg",
  },
  { value: "compactMode", getter: GETTERS.IS_COMPACT_MODE, query: "cm" },
  {
    value: "orderedSuggestions",
    getter: GETTERS.IS_SUGGESTION_ORDERED,
    query: "sorder",
  },
  {
    value: "descriptiveFilenames",
    getter: GETTERS.IS_DESCRIPTIVE_FILENAME,
    query: "fname",
  },
  {
    value: "transition",
    getter: GETTERS.ROUTE_TRANSITION,
    query: "transition",
  },
  {
    value: "fullscreenTransition",
    getter: GETTERS.FULLSCREEN_TRANSITION,
    query: "fstransition",
  },
  {
    value: "downloadProgress",
    getter: GETTERS.IS_DOWNLOAD_PROGRESS,
    query: "dp",
  },
  {
    value: "concurrentDownloads",
    getter: GETTERS.IS_CONCURRENT_DOWNLOADS,
    query: "cd",
  },
  {
    value: "pagination",
    getter: GETTERS.IS_PAGINATED_MODE,
    query: "pagination",
  },
  {
    value: "enableDtext",
    getter: GETTERS.IS_DTEXT_PARSER_ENABLED,
    query: "dtxt",
  },
  { value: "postSlider", getter: GETTERS.POST_FETCH_COUNT, query: "count" },
  { value: "tagSlider", getter: GETTERS.TAG_FETCH_COUNT, query: "tcount" },
  {
    value: "suggestionSlider",
    getter: GETTERS.SUGGESTION_COUNT,
    query: "scount",
  },

  { value: "backgroundColor", getter: GETTERS.BACKGROUND_COLOR, query: "bcol" },
  { value: "mascot", getter: GETTERS.MASCOT_STYLE, query: "msct" },
  {
    value: "compactness",
    getter: GETTERS.POST_COMPACTNESS,
    query: "compactness",
  },
  { value: "blacklistMode", getter: GETTERS.BLACKLIST_MODE, query: "blm" },
  {
    value: "fullscreenNextPrevious",
    getter: GETTERS.FULLSCREEN_PREVIOUS_NEXT_LAYOUT,
    query: "fpnb",
  },
  {
    value: "fullscreenModeLayout",
    getter: GETTERS.FULLSCREEN_BUTTONS_LAYOUT,
    query: "fsl",
  },
];

export const generateComputedSettings = () => {
  const retVal = {};
  for (const setting of settingsComputedPropertiesMapping) {
    retVal[setting.value] = {
      get() {
        return this.$store.getters[setting.getter];
      },
      set(val) {
        this.$router.push({
          query: {
            ...this.$store.state.routerModule.query,
            [setting.query]: val,
          },
        });
      },
    };
  }
  return retVal;
};
