<template>
  <div>
    <v-subheader v-if="tags.length > 0 && !postSpecific"
      >Tag suggestions</v-subheader
    >
    <v-flex>
      <template v-for="(tag, index) in tags">
        <v-list-tile dense :key="index">
          <v-list-tile-content>
            <tag-label :tag="tag" />
          </v-list-tile-content>
          {{ tag.count }}
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
              <v-btn slot="activator" icon :id="'suggestion' + index">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
              <v-card>
                <v-list>
                  <v-list-tile
                    v-for="(item, i) in getAvailableOptions(tag.text)"
                    :key="i"
                    @click.stop="executeAction(tag.text, item)"
                  >
                    <v-list-tile-title>{{ item }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-menu>
          </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-flex>
  </div>
</template>

<script>
import TagLabel from "./TagLabel.vue";
import escapeStringRegexp from "escape-string-regexp";
import { GETTERS } from "../store/constants";
import { api } from "../store/api";

const menu = {
  remove: "Remove from search",
  add: "Add to search",
  exclude: "Exclude from search",
  blacklist: "Add to blacklist",
  wiki: "Open wiki article",
  openNew: "Search in new tab",
};

export default {
  components: {
    TagLabel,
  },
  props: {
    postSpecific: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      items: [menu.remove, menu.add, menu.exclude, menu.blacklist],
    };
  },
  methods: {
    getAvailableOptions(tag) {
      const options = [];
      let inArray = false,
        inArrayButNegated = false,
        inBlacklist = false;
      for (const cur of this.currentQuery) {
        if (cur == tag) {
          inArray = true;
        }
        if (cur == "-" + tag) {
          inArrayButNegated = true;
        }
      }
      for (const cur of this.currentBlacklist) {
        if (cur == tag) {
          inBlacklist = true;
        }
      }
        if (inArray) options.push(menu.remove);
        if (!inArray) options.push(menu.add);
        if (!inArrayButNegated) options.push(menu.exclude);
        if (!inBlacklist) options.push(menu.blacklist);
      options.push(menu.wiki);
      options.push(menu.openNew);
      return options;
    },
    executeAction(tag, action) {
      switch (action) {
        case menu.remove:
          this.setQueryParams(
            (this.$store.state.routerModule.query.tags || "")
              .replace(
                new RegExp(
                  "(\\s|^)(\\-)?" + escapeStringRegexp(tag) + "(\\s|$)",
                  "g",
                ),
                " ",
              )
              .replace(/\s+/, " "),
          );
          break;
        case menu.add:
          this.setQueryParams(
            (
              (this.$store.state.routerModule.query.tags || "").replace(
                new RegExp(
                  "(\\s|^)(\\-)?" + escapeStringRegexp(tag) + "(\\s|$)",
                  "g",
                ),
                " ",
              ) +
              " " +
              tag
            ).replace(/\s+/g, " "),
          );
          break;
        case menu.exclude:
          this.setQueryParams(
            (
              (this.$store.state.routerModule.query.tags || "").replace(
                new RegExp(
                  "(\\s|^)(\\-)?" + escapeStringRegexp(tag) + "(\\s|$)",
                  "g",
                ),
                " ",
              ) +
              " -" +
              tag
            ).replace(/\s+/g, " "),
          );
          break;
        case menu.blacklist:
          this.setQueryAndBlacklistParams({
            query: (this.$store.state.routerModule.query.tags || "")
              .replace(
                new RegExp(
                  "(\\s|^)(\\-)?" + escapeStringRegexp(tag) + "(\\s|$)",
                  "g",
                ),
                " ",
              )
              .replace(/\s+/, " "),
            blacklist: (
              this.$store.getters[GETTERS.GET_BLACKLIST_STRING].replace(
                new RegExp(
                  "(\\s|^)(\\-)?" + escapeStringRegexp(tag) + "(\\s|$)",
                  "g",
                ),
                " ",
              ) +
              " " +
              tag
            ).replace(/\s+/g, " "),
          });
          break;
        case menu.wiki:
          window
            .open(
              api.e621.createWikiUrl({
                tag,
              }),
              "_blank",
            )
            .focus();
          break;
        case menu.openNew:
          window
            .open(
              `${window.location.origin}/#/e621?agree=true&tags=${tag}`,
              "_blank",
            )
            .focus();
          break;
      }
    },
    setQueryAndBlacklistParams({ query, blacklist }) {
      this.$store.dispatch("resetNoResults");
      this.$router.push({
        query: {
          ...this.$store.state.routerModule.query,
          tags: query,
          blacklist: blacklist,
        },
      });
    },
    setQueryParams(tags) {
      this.$store.dispatch("resetNoResults");
      this.$router.push({
        query: {
          ...this.$store.state.routerModule.query,
          tags: tags,
        },
      });
    },
  },
  computed: {
    currentQuery() {
      return (this.$store.state.routerModule.query.tags || "").split(" ");
    },
    currentBlacklist() {
      return this.$store.getters[GETTERS.GET_BLACKLIST_ARRAY];
    },
  },
};
</script>
