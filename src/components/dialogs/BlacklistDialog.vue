<template>
  <v-dialog v-model="dialog" scrollable max-width="1000px">
    <v-card>
      <v-card-title>Blacklist</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 800px;">
        <tag-search v-if="dialog" :tag-string.sync="tagString" />
        <!-- <div class="body-1 mb-1">
          Posts will not be displayed if they contain any blacklisted tags.
          Please note that compound blacklist tags (multiple tags per row) don't
          work. Also, if any other blacklist mode than "tags" is used, you can't
          use metatags (like "user:Bob" or "id:100") except "rating:".
        </div> -->
        <v-textarea
          v-if="dialog"
          class="mt-3"
          box
          rows="8"
          counter="0"
          label="Manual edit"
          v-model="blacklistText"
          :hint="'Multiple entries per line don\'t work'"
        ></v-textarea>
        <div class="headline mb-1 mt-1">Suggestions</div>
        <blacklist-suggestions v-if="dialog" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" flat @click.native="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import uniq from "lodash.uniq";
// import escapeStringRegexp from "escape-string-regexp";
import { GETTERS } from "../../store/constants";
import TagSearch from "../TagSearch.vue";
import BlacklistSuggestions from "../BlacklistSuggestions.vue";
import { updateRouterQuery } from "../../utilities/utilities";

export default {
  components: {
    TagSearch,
    BlacklistSuggestions,
  },
  props: {
    value: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      blacklistText: "",
    };
  },
  watch: {
    blacklistString: {
      immediate: true,
      handler(val) {
        this.blacklistText = val;
      },
    },
    blacklistText: {
      handler(val) {
        const parsedBlacklist = val
          .split("\n")
          .map((tags) => tags.trim().split(" ")[0])
          .filter((tags) => tags && tags.length)
          .join(" ");

        // this.$store.dispatch("resetNoResults");
        // this.$router.push({
        //   query: {
        //     ...this.$store.state.routerModule.query,
        //     blacklist: parsedBlacklist,
        //   },
        // });
        updateRouterQuery(this.$router, {
          blacklist: parsedBlacklist,
        });
      },
    },
  },
  computed: {
    blacklistString() {
      return this.$store.getters[GETTERS.GET_BLACKLIST_ARRAY].join("\n");
    },
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    tagString: {
      get() {
        return this.$store.getters[GETTERS.GET_BLACKLIST_STRING];
      },
      set(val) {
        updateRouterQuery(this.$router, {
          blacklist: val,
        });
      },
    },
  },
};
</script>

<style scoped></style>
