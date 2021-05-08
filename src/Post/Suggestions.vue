<template>
  <v-flex>
    <template v-for="(tag, index) in tags">
      <v-list-tile dense :key="index">
        <v-list-tile-content>
          <tag-label :tag="tag" />
        </v-list-tile-content>
        {{ tag.post_count }}
        <v-list-tile-action>
          <v-menu
            bottom
            offset-y
            left
            attach
            close-on-content-click
            close-on-click
            close-delay="0"
          >
            <v-btn slot="activator" icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
            <v-card>
              <v-list>
                <v-list-tile
                  v-for="(item, i) in getItems(tag)"
                  :key="i"
                  @click.stop="item.action"
                >
                  <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-menu>
        </v-list-tile-action>
      </v-list-tile>
    </template>
  </v-flex>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";
import { ITag, default as TagLabel } from "../components/updated/dumb/TagLabel.vue";

// const menu = {
//   remove: "Remove from search",
//   add: "Add to search",
//   exclude: "Exclude from search",
//   blacklist: "Add to blacklist",
//   openNew: "Search in new tab",
// };

export default defineComponent({
  components: {
    TagLabel,
  },
  props: {
    // postSpecific: {
    //   type: Boolean,
    //   default: false,
    // },
    tags: {
      type: Array as PropType<ITag[]>,
      required: true,
    },
  },
  setup() {
    const createWikiUrl = (tagName: string) =>
      `https://e621.net/wiki/show?title=${tagName}`;

    const getItems = (
      tag: ITag,
    ): Array<{ action: () => void; text: string }> => {
      return [
        {
          text: "Open wiki article",
          action: () => {
            const w = window.open(createWikiUrl(tag.name), "_blank");
            w?.focus();
          },
        },
      ];
    };

    return {
      getItems,
    };
  },
  // data() {
  //   return {
  //     items: [menu.remove, menu.add, menu.exclude, menu.blacklist],
  //   };
  // },
  // methods: {
  //   getAvailableOptions(tag) {
  //     const options = [];
  //     let inArray = false,
  //       inArrayButNegated = false,
  //       inBlacklist = false;
  //     for (const cur of this.currentQuery) {
  //       if (cur == tag) {
  //         inArray = true;
  //       }
  //       if (cur == "-" + tag) {
  //         inArrayButNegated = true;
  //       }
  //     }
  //     for (const cur of this.currentBlacklist) {
  //       if (cur == tag) {
  //         inBlacklist = true;
  //       }
  //     }
  //     if (inArray) options.push(menu.remove);
  //     if (!inArray) options.push(menu.add);
  //     if (!inArrayButNegated) options.push(menu.exclude);
  //     if (!inBlacklist) options.push(menu.blacklist);
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
  //       case menu.blacklist:
  //         this.setQueryAndBlacklistParams({
  //           query: (this.$store.state.routerModule.query.tags || "")
  //             .replace(
  //               new RegExp(
  //                 "(\\s|^)(\\-)?" + escapeStringRegexp(tag) + "(\\s|$)",
  //                 "g",
  //               ),
  //               " ",
  //             )
  //             .replace(/\s+/, " "),
  //           blacklist: (
  //             blacklistService.tags
  //               .join(" ")
  //               .replace(
  //                 new RegExp(
  //                   "(\\s|^)(\\-)?" + escapeStringRegexp(tag) + "(\\s|$)",
  //                   "g",
  //                 ),
  //                 " ",
  //               ) +
  //             " " +
  //             tag
  //           ).replace(/\s+/g, " "),
  //         });
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
  //   setQueryAndBlacklistParams({ query, blacklist }) {
  //     this.$store.dispatch("resetNoResults");
  //     this.$router.push({
  //       query: {
  //         ...this.$store.state.routerModule.query,
  //         tags: query,
  //         blacklist: blacklist,
  //       },
  //     });
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
  //   currentBlacklist() {
  //     return blacklistService.tags;
  //   },
  // },
});
</script>
