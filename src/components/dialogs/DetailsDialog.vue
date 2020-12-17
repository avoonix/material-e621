<template>
  <v-dialog v-model="dialog" scrollable max-width="600px">
    <v-card v-if="current">
      <v-card-title class="mt-0 pt-0 mx-0 px-0">
        <v-progress-linear
          v-if="!commentsLoaded"
          indeterminate
          class="ma-0 pa-0"
        ></v-progress-linear>
        <v-tabs v-model="tabs">
          <v-tab ripple>Overview</v-tab>
          <v-tab ripple>Tags</v-tab>
          <v-tab ripple>Description</v-tab>
          <v-tab ripple>Comments</v-tab>
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
                  <d-text-display
                    :text="current.description || 'No description'"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text v-if="current.has_comments">
                <template v-for="comment in comments">
                  <v-card :key="comment.id" class="mb-3 elevation-4">
                    <v-card-title>
                      {{ comment.creator }}&nbsp;
                      <span class="grey--text">{{
                        formatDate(comment.created_at)
                      }}</span>
                    </v-card-title>
                    <v-card-text>
                      <d-text-display :text="comment.body" />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-icon
                        :color="
                          comment.score == 0
                            ? 'yellow'
                            : comment.score > 0
                            ? 'green'
                            : 'red'
                        "
                        class="mr-2"
                        >{{
                          comment.score == 0
                            ? "mdi-thumbs-up-down"
                            : comment.score > 0
                            ? "mdi-thumb-up"
                            : "mdi-thumb-down"
                        }}</v-icon
                      >
                      <span
                        :class="{
                          'red--text': comment.score < 0,
                          'green--text': comment.score > 0,
                          'yellow--text': comment.score == 0,
                        }"
                        >{{ comment.score }}</span
                      >
                    </v-card-actions>
                  </v-card>
                </template>
                <comment-editor
                  v-if="current"
                  @update-comments="loadComments"
                  :post-id="current.id"
                />
              </v-card-text>
              <v-card-text v-else
                >No comments
                <comment-editor
                  v-if="current"
                  @update-comments="loadComments"
                  :post-id="current.id"
                />
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
import Suggestions from "../Suggestions.vue";
import CommentEditor from "../CommentEditor.vue";
import prettyBytes from "pretty-bytes";
import { openOnE621, downloadPost } from "../../utilities/mixins";
import DTextDisplay from "../DTextDisplay";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import formatDate from "date-fns/format";
import parseDate from "date-fns/parse";
import PostInfoList from "../updated/dumb/PostInfoList.vue";
import LinkShare from "../updated/dumb/LinkShare.vue";

export default {
  name: "DetailsDialog",
  components: {
    Suggestions,
    CommentEditor,
    DTextDisplay,
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
  watch: {
    current(val) {
      if (val && val.id) this.loadComments();
    },
    commentsLoaded: {
      immediate: true,
      handler(loaded) {
        if (!loaded && this.current && this.current.id) {
          this.loadComments();
        }
      },
    },
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
    loadComments() {
      // setTimeout(() => {
      //   this.$store.dispatch(ACTIONS.LOAD_COMMENTS, {
      //     id: this.current.id,
      //   });
      // });
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
    comments() {
      const comments = this.$store.getters[GETTERS.GET_COMMENTS](
        this.current.id,
      );
      if (!comments) return comments;
      return []; // TODO: comments dont work
      // return comments.reverse();
    },
    commentsLoaded() {
      return this.comments !== false;
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
