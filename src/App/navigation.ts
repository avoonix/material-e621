import { useSavedSearchStore } from "@/services";
import { useFavoritesStore } from "@/services/FavoriteStore";
import { computed } from "vue";
import { useRouter } from "vue-router";

const hasFavorites = computed(() => {
  const store = useFavoritesStore();
  return store.hasFavorites;
});

const customItems = computed(() => {
  const store = useSavedSearchStore();
  return store.entries;
});

export const useNavigationItems = () => {
  const router = useRouter();
  const navigationItems = computed(() => [
    {
      icon: "mdi-home",
      name: "Home",
      exact: true,
      to: {
        name: "Posts",
      },
    },
    ...customItems.value.map((entry) => ({
      icon: "mdi-panorama-variant",
      name: entry.name,
      exact: true,
      to: {
        name: "Posts",
        query: {
          tags: entry.tags.join(" "),
        }
      },
    })),
    {
      icon: "mdi-chart-timeline-variant-shimmer",
      name: "Post Suggester",
      exact: true,
      to: {
        name: "Suggester"
      },
    },
    {
      icon: "mdi-cloud-tags",
      name: "Favorite Analyzer",
      exact: true,
      to: {
        name: "FavoritesAnalyzer"
      },
    },
    {
      icon: "mdi-view-dashboard-variant",
      name: "Artist Dashboard",
      exact: true,
      to: {
        name: "Dashboard"
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
        name: "Settings"
      },
    },
  ].map((item) => ({
    ...item,
    resolved: router.resolve(item.to).href,
  })));
  return navigationItems;
};
