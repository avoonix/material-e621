<template>
  <v-list dense>
    <template v-for="(tag, index) in tags">
      <v-list-item dense :key="index">
        <v-list-item-content>
          <div>
            <tag-label :tag="tag" />
          </div>
        </v-list-item-content>
        {{ tag.post_count }}
        <v-list-item-action>
          <v-menu
            bottom
            offset-y
            left
            attach
            close-on-content-click
            close-on-click
            close-delay="0"
          >
            <template #activator="{ on }">
              <v-btn v-on="on" icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-card color="primary">
              <v-list class="secondary">
                <v-list-item
                  v-for="(item, i) in getItems(tag)"
                  :key="i"
                  @click.stop="item.action"
                >
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-list-item-action>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";
import { ITag, default as TagLabel } from "../Tag/TagLabel.vue";

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
