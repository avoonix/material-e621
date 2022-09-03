import { useFavoritesStore } from "@/services/FavoriteStore";
import { computed } from "vue";

const hasFavorites = computed(() => {
  const store = useFavoritesStore();
  return store.hasFavorites;
});

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
    icon: "mdi-chart-timeline-variant-shimmer",
    name: "Post Suggester",
    exact: true,
    to: {
      path: "/suggester",
    },
  },
  {
    icon: "mdi-cloud-tags",
    name: "Tag Cloud",
    exact: true,
    to: {
      path: "/analyzer",
    },
  },
  {
    icon: "mdi-view-dashboard-variant",
    name: "Artist Dashboard",
    exact: true,
    to: {
      path: "/dash",
    },
  },
  ...(hasFavorites.value
    ? [
        {
          icon: "mdi-star",
          name: "Starred",
          exact: true,
          to: {
            name: "Starred",
          },
        },
      ]
    : []),
  {
    icon: "mdi-cog",
    name: "Settings",
    exact: false,
    to: {
      path: "/settings",
    },
  },
]);
