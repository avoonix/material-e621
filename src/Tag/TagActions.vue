<template>
  <v-list class="secondary">
    <PoolInfo v-if="pool" class="mb-2" :pool-id="pool" />
    <v-list-item v-for="(item, i) in items" :key="i" @click.stop="item.action">
      <v-list-item-content>{{ item.text }}</v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import PoolInfo from "@/Pool/PoolInfo.vue";
import { useBlacklistStore, useUrlStore } from "@/services";
import { useFavoritesStore } from "@/services/FavoriteStore";
import { computed, defineComponent } from "vue";
import { openUrlInNewTab } from "@/misc/util/url";

// const menu = {
//   remove: "Remove from search",
//   add: "Add to search",
//   exclude: "Exclude from search",
//   openNew: "Search in new tab",
// };

export default defineComponent({
    props: {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
    },
    setup(props, context) {
        const blacklist = useBlacklistStore();
        const favorites = useFavoritesStore();
        const urlStore = useUrlStore();
        const wikiUrl = computed(() => `${urlStore.e621Url}wiki/show?title=${props.name}`);
        const e621Url = computed(() => `${urlStore.e621Url}posts?tags=${props.name}`);
        const isBlacklisted = computed(() => blacklist.tagIsBlacklisted(props.name));
        const isFavorited = computed(() => favorites.isFavorited(props.name, props.category));
        const pool = computed(() => {
            if(props.category === "pool") {
                const match = /pool:(\d+)/.exec(props.name);
                if(match) {
                    return +match[1];
                }
            }
            return false;
        });
        const toggleFavorite = () => {
            favorites.setFavorite(props.name, props.category, !isFavorited.value);
        };
        const items = computed<{
            text: string;
            action: () => void;
            visible: boolean;
        }[]>(() => [
            {
                text: isFavorited.value ? "Unstar" : "Star",
                action: () => {
                    toggleFavorite();
                },
                visible: true,
            },
            {
                text: "Search",
                action: async () => {
                    const { appRouter } = await import("@/misc/util/router");
                    appRouter.push({
                        name: "Posts",
                        query: {
                            tags: props.name,
                        },
                    });
                    // updateRouterQuery({
                    //   tags: props.name,
                    // });
                },
                visible: true,
            },
            {
                text: isBlacklisted.value
                    ? "Remove from blacklist"
                    : "Add to blacklist",
                action: () => {
                    if (isBlacklisted.value) {
                        blacklist.removeTag(blacklist.tags.findIndex(tags => tags.length === 1 && tags[0] === props.name), props.name);
                    }
                    else {
                        blacklist.addTag(blacklist.tags.length, props.name);
                    }
                },
                visible: true,
            },
            {
                text: "Open e621.net wiki article",
                action: () => {
                    openUrlInNewTab(wikiUrl.value);
                },
                visible: true,
            },
            {
                text: "Search on e621.net",
                action: () => {
                    openUrlInNewTab(e621Url.value);
                },
                visible: true,
            },
            {
                text: "View in Artist Dashboard",
                action: async () => {
                    const { appRouter } = await import("@/misc/util/router");
                    appRouter.push({
                        name: "DashboardResult",
                        params: {
                            name: props.name,
                        },
                    });
                },
                visible: props.category === "artist",
            },
        ].filter(item => item.visible));
        return {
            items,
            pool,
        };
    },
    components: { PoolInfo }
});
// data() {
//   return {
//     items: [menu.remove, menu.add, menu.exclude],
//   };
// },
// methods: {
//   getAvailableOptions(tag) {
//     const options = [];
//     let inArray = false,
//       inArrayButNegated = false,
//     for (const cur of this.currentQuery) {
//       if (cur == tag) {
//         inArray = true;
//       }
//       if (cur == "-" + tag) {
//         inArrayButNegated = true;
//       }
//     }
//     if (inArray) options.push(menu.remove);
//     if (!inArray) options.push(menu.add);
//     if (!inArrayButNegated) options.push(menu.exclude);
//     options.push(menu.wiki);
//     options.push(menu.openNew);
//     return options;
//   },
//   executeAction(tag, action) {
//     switch (action) {
//       case menu.remove:
//         this.setQueryParams(
//           (this.$store.state.routerModule.query.tags || "")
//             .replace(
//               new RegExp(
//                 "(\\s|^)(\\-)?" + escapeStringRegexp(tag) + "(\\s|$)",
//                 "g",
//               ),
//               " ",
//             )
//             .replace(/\s+/, " "),
//         );
//         break;
//       case menu.add:
//         this.setQueryParams(
//           (
//             (this.$store.state.routerModule.query.tags || "").replace(
//               new RegExp(
//                 "(\\s|^)(\\-)?" + escapeStringRegexp(tag) + "(\\s|$)",
//                 "g",
//               ),
//               " ",
//             ) +
//             " " +
//             tag
//           ).replace(/\s+/g, " "),
//         );
//         break;
//       case menu.exclude:
//         this.setQueryParams(
//           (
//             (this.$store.state.routerModule.query.tags || "").replace(
//               new RegExp(
//                 "(\\s|^)(\\-)?" + escapeStringRegexp(tag) + "(\\s|$)",
//                 "g",
//               ),
//               " ",
//             ) +
//             " -" +
//             tag
//           ).replace(/\s+/g, " "),
//         );
//         break;
//       case menu.openNew:
//         window
//           .open(
//             `${window.location.origin}/#/e621?agree=true&tags=${tag}`,
//             "_blank",
//           )
//           .focus();
//         break;
//     }
//   },
//   setQueryParams(tags) {
//     this.$store.dispatch("resetNoResults");
//     this.$router.push({
//       query: {
//         ...this.$store.state.routerModule.query,
//         tags: tags,
//       },
//     });
//   },
// },
// computed: {
//   currentQuery() {
//     return (this.$store.state.routerModule.query.tags || "").split(" ");
//   },
// },
</script>
