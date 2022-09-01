<template>
  <v-list class="secondary">
    <v-list-item v-for="(item, i) in items" :key="i" @click.stop="item.action">
      <v-list-item-content>{{ item.text }}</v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { updateRouterQuery } from "@/misc/util/utilities";
import { blacklistService } from "@/services";
import { favoriteService } from "@/services/FavoriteService";
import { computed, defineComponent } from "vue";

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
    const wikiUrl = computed(
      () => `https://e621.net/wiki/show?title=${props.name}`,
    );
    const e621Url = computed(
      () => `https://e621.net/posts?tags=${props.name}`,
    );

    const isBlacklisted = computed(() =>
      blacklistService.tagIsBlacklisted(props.name),
    );

    const isFavorited = computed(() =>
      favoriteService.isFavorited(props.name, props.category),
    );
    const toggleFavorite = () => {
      favoriteService.setFavorite(
        props.name,
        props.category,
        !isFavorited.value,
        // props.displayText, // TODO: might be needed in the future
      );
    };

    const items = computed(() => {
      return [
        {
          text: isFavorited.value ? "Unstar" : "Star",
          action: () => {
            toggleFavorite();
          },
        },
        {
          text: "Search",
          action: async () => {
            updateRouterQuery({
              tags: props.name,
            });
          },
        },
        {
          text: isBlacklisted.value
            ? "Remove from blacklist"
            : "Add to blacklist",
          action: () => {
            if (isBlacklisted.value) {
              blacklistService.removeTag(props.name);
            } else {
              blacklistService.addTag(props.name);
            }
          },
        },
        {
          text: "Open e621.net wiki article",
          action: () => {
            const w = window.open(wikiUrl.value, "_blank");
            w?.focus();
          },
        },
        {
          text: "Search on e621.net",
          action: () => {
            const w = window.open(e621Url.value, "_blank");
            w?.focus();
          },
        },
      ];
    });

    return {
      items,
    };
  },
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
