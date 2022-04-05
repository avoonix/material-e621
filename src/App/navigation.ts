import { favoriteService } from "@/services/FavoriteService";
import { computed } from "@vue/composition-api";

const hasFavorites = computed(() => favoriteService.hasFavorites)

export const navigationItems = computed(() => [
  {
    icon: "mdi-home",
    name: "Home",
    exact: false,
    to: {
      path: "/posts",
    },
  },
  {
    icon: "mdi-cog",
    name: "Settings",
    exact: false,
    to: {
      path: "/settings",
    },
  },
  {
    icon: "mdi-braille",
    name: "Post Suggester",
    exact: true,
    to: {
      path: "/suggester",
    },
  },
  {
    icon: "mdi-graph",
    name: "Stats",
    exact: true,
    to: {
      path: "/analyzer",
    },
  },
  ...(hasFavorites.value
    ? [
        {
          icon: "mdi-star",
          name: "Starred",
          exact: true,
          to: {
            name: "Starred"
          },
        },
      ]
    : []),
]);
