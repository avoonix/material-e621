<template>
  <v-dialog v-model="dialog" scrollable max-width="600px">
    <v-card v-if="current">
      <v-card-title class="mt-0 pt-0 mx-0 px-0">
        <v-tabs v-model="tabs">
          <v-tab ripple>Overview</v-tab>
          <v-tab ripple>Tags</v-tab>
          <v-tab ripple>Description</v-tab>
          <v-tab ripple>Share</v-tab>
        </v-tabs>
      </v-card-title>
      <v-card-text>
        <v-tabs-items v-model="tabs">
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <post-info-list :post="current" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <suggestions post-specific :tags="tags" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <div class="body-1">
                  <d-text :text="current.description || 'No description'" />
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <link-share
                  :postId="current.id"
                  :rawFileUrl="current.file.url"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn flat @click.native="openOnE621(current.id)">Open on e621</v-btn>
        <v-btn
          flat
          :loading="downloadPostLoading"
          @click.native="downloadPost(current)"
          >Download</v-btn
        >
        <v-btn color="primary" flat @click.native="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { GETTERS, ACTIONS } from "../../store/constants";
import Suggestions from "../updated/dumb/Suggestions.vue";
import prettyBytes from "pretty-bytes";
import { openOnE621, downloadPost } from "../../utilities/mixins";
import DText from "../updated/dumb/DText.vue";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import formatDate from "date-fns/format";
import parseDate from "date-fns/parse";
import PostInfoList from "../updated/dumb/PostInfoList.vue";
import LinkShare from "../updated/dumb/LinkShare.vue";

export default {
  name: "DetailsDialog",
  components: {
    Suggestions,
    DText,
    PostInfoList,
    LinkShare,
  },
  mixins: [openOnE621, downloadPost],
  props: {
    current: {
      required: true,
    },
  },
  data() {
    return {
      tabs: 1,
    };
  },
  methods: {
    formatDate(time) {
      const date = parseDate(time);
      return (
        formatDate(date, "MMMM D, YYYY h:mm A") +
        " (" +
        distanceInWordsToNow(date, {
          addSuffix: true,
        }) +
        ")"
      );
    },
    openInDialog(childId) {
      // this.$store.dispatch(ACTIONS.ADD_VISIBLE_POSTS_DIALOG, [childId]);
      // this.$store.dispatch(ACTIONS.SET_FULLSCREEN_POST_ID, childId);
    },
    openChildrenInDialog() {
      // this.$store.dispatch(
      //   ACTIONS.ADD_VISIBLE_POSTS_DIALOG,
      //   this.current.children.split(",").filter((str) => str.length),
      // );
    },
    close() {
      this.$emit("close");
      // this.$store.dispatch(ACTIONS.SET_DETAILS_VIEW, {
      //   id: false,
      // });
    },
  },
  computed: {
    currentRawImageUrl() {
      return this.current.file_url;
    },
    tags() {
      const order = ["artist", "character", "copyright", "species", "general"];
      const retVal = [];
      if (!this.current) return retVal;
      for (const cat of order) {
        retVal.push(
          ...this.current.tags[cat].map((str) => ({
            color: this.$getTagColor(cat),
            text: str,
            count: "",
          })),
        );
      }
      return retVal;
    },
    dialog: {
      get() {
        return !!this.current;
      },
      set(val) {
        if (!val) this.close();
      },
    },
    loggedIn() {
      return this.$store.getters[GETTERS.IS_LOGGED_IN];
    },
    currentFileUrl() {
      return this.current.file_url;
    },
  },
};
</script>
