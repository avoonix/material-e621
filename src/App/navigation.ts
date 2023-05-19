import { useSavedSearchStore } from "@/services";
import { useFavoritesStore } from "@/services/FavoriteStore";
import { computed } from "vue";

const hasFavorites = computed(() => {
  const store = useFavoritesStore();
  return store.hasFavorites;
});

const customItems = computed(() => {
  const store = useSavedSearchStore();
  return store.entries;
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
  ...customItems.value.map((entry) => ({
    icon: "mdi-panorama-variant",
    name: entry.name,
    exact: true,
    to: {
      path: `/posts?tags=${encodeURIComponent(entry.tags.join(" "))}`,
    },
  })),
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
