<template>
  <v-dialog v-model="dialog" scrollable max-width="600px">
    <v-card>
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
                <v-list dense>
                  <v-list-tile>
                    <v-list-tile-content>ID:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      current.id
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Score:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      current.score
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Favorites:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      current.fav_count
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Author:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      current.author
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>File size:</v-list-tile-content>
                    <v-list-tile-content class="align-end">
                      {{ current.custom_pretty_file_size }}
                      ({{ current.file_size }}
                      B)
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Uploaded:</v-list-tile-content>
                    <v-list-tile-content class="align-end">
                      {{ current.custom_pretty_relative_upload_date }} ({{
                        current.custom_pretty_upload_date
                      }})
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>MD5:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      current.md5
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>File type:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      (current.file_ext || "").toUpperCase()
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Rating:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      current.rating
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Status:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      current.status
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Dimensions:</v-list-tile-content>
                    <v-list-tile-content class="align-end"
                      >{{ current.width }} x
                      {{ current.height }}</v-list-tile-content
                    >
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Has comments:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      current.has_comments
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Has notes:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      current.has_notes
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Has children:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{
                      current.has_children
                    }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile v-if="current.has_children">
                    <v-list-tile-content>Children:</v-list-tile-content>
                    <v-list-tile-content class="align-end">
                      <span v-if="current.children">
                        <a
                          target="_blank"
                          @click="openChildrenInDialog"
                          v-for="(childId, idx) in current.children.split(',')"
                          :key="idx"
                          >{{ childId }}</a
                        >
                      </span>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile v-if="current.parent_id">
                    <v-list-tile-content>Parent:</v-list-tile-content>
                    <v-list-tile-content class="align-end">
                      <span>
                        <a
                          target="_blank"
                          @click="openInDialog(current.parent_id)"
                          >{{ current.parent_id }}</a
                        >
                      </span>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Resolution:</v-list-tile-content>
                    <v-list-tile-content class="align-end"
                      >{{
                        (current.width * current.height) / 1000000
                      }}
                      Megapixel</v-list-tile-content
                    >
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Sources:</v-list-tile-content>
                    <v-list-tile-content class="align-end">
                      <span>
                        <span
                          v-for="(source, idx) in current.sources"
                          :key="idx"
                        >
                          <external-link :href="source">
                            Source
                            {{ idx + 1 }} </external-link
                          >,&nbsp;
                        </span>
                      </span>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
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
              currently doesn't work. submit a github issue if you want this
              feature
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
                <v-radio-group v-model="radioGroup">
                  <v-radio
                    v-for="(option, index) in radioOptions"
                    :key="option.type"
                    :label="option.display"
                    :value="index"
                  ></v-radio>
                </v-radio-group>
                <div class="body-1">
                  <v-layout row wrap="">
                    <v-flex
                      class="pa-1"
                      v-for="(button, index) in shareButtons"
                      :key="index"
                      xs12
                      md6
                    >
                      <v-btn
                        class="ma-0"
                        :dark="button.dark"
                        large
                        block
                        :color="button.color"
                        @click="shareButtonClick(button)"
                        :href="button.noPopup ? button.url : undefined"
                      >
                        <v-icon left>{{ button.icon }}</v-icon>
                        {{ button.name }}
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </div>
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
import copyToClipboard from "clipboard-copy";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import formatDate from "date-fns/format";
import parseDate from "date-fns/parse";

export default {
  components: {
    Suggestions,
    CommentEditor,
    DTextDisplay,
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
      radioGroup: 0,
      radioOptions: [
        {
          type: "material-e621",
          display: `Share link to the ${this.$appName} fullscreen post`,
        },
        {
          type: "e621",
          display: "Share link to the e621 page",
        },
        {
          type: "image",
          display: "Share link to raw image",
        },
      ],
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
      setTimeout(() => {
        this.$store.dispatch(ACTIONS.LOAD_COMMENTS, {
          id: this.current.id,
        });
      });
    },
    openInDialog(childId) {
      this.$store.dispatch(ACTIONS.ADD_VISIBLE_POSTS_DIALOG, [childId]);
      this.$store.dispatch(ACTIONS.SET_FULLSCREEN_POST_ID, childId);
    },
    openChildrenInDialog() {
      this.$store.dispatch(
        ACTIONS.ADD_VISIBLE_POSTS_DIALOG,
        this.current.children.split(",").filter((str) => str.length),
      );
    },
    close() {
      this.$store.dispatch(ACTIONS.SET_DETAILS_VIEW, {
        id: false,
      });
    },
    shareButtonClick({ url, name, clipboard, noPopup }) {
      if (clipboard) {
        copyToClipboard(url)
          .then(() => {
            this.$store.dispatch(ACTIONS.ADD_MESSAGE, "Link copied");
          })
          .catch((err) => {
            this.$store.dispatch(
              ACTIONS.ADD_MESSAGE,
              err.message || err || "Error",
            );
          });
        return;
      }
      if (noPopup) {
        return;
      }
      window.open(url, `Share to ${name}`, "width=600,height=400");
    },
  },
  computed: {
    currentRawImageUrl() {
      return this.current.file_url;
    },
    currentShareUrl() {
      if (!this.current) return `${this.$baseUrl}/#/e621`;
      switch (this.radioOptions[this.radioGroup].type) {
        case "material-e621":
          return `${this.$baseUrl}/#/e621?fspost=${this.current.id}`;
        case "e621":
          return `https://e621.net/post/show/${this.current.id}`;
        case "image":
        default:
          return this.currentRawImageUrl;
      }
    },
    shareButtons() {
      if (!this.current) return [];
      const url = encodeURIComponent(this.currentShareUrl),
        unencodedText = "Check out this awesome post!",
        text = encodeURIComponent(unencodedText),
        rawUrl = encodeURIComponent(this.currentRawImageUrl);
      return [
        {
          name: "Twitter",
          color: "#1DA1F3",
          dark: true,
          url: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
          icon: "mdi-twitter",
        }, // TODO:
        {
          name: "Reddit",
          color: "#F73F07",
          dark: true,
          url: `https://www.reddit.com/submit?url=${url}&title=${text}`,
          icon: "mdi-reddit",
        },
        {
          name: "Telegram",
          color: "#2A9ED0",
          dark: true,
          url: `https://telegram.me/share/url?url=${url}&text=${text}`,
          icon: "mdi-telegram",
        },
        {
          name: "Google+",
          color: "#D64A37",
          dark: true,
          url: `https://plus.google.com/share?url=${url}`,
          icon: "mdi-google-plus",
        },
        {
          name: "Email",
          color: "#b2b2b2",
          dark: false,
          url: `mailto:?&subject=${text}&body=${url}`,
          icon: "mdi-email",
          noPopup: true,
        },
        {
          name: "Tumblr",
          color: "#2F4155",
          dark: true,
          url: `http://www.tumblr.com/share/link?url=${url}&name=${text}&description=${text}`,
          icon: "mdi-tumblr",
        },

        {
          name: "Copy to clipboard",
          color: "#353535",
          dark: true,
          url: this.currentShareUrl,
          icon: "mdi-clipboard-text",
          clipboard: true,
        },
        {
          name: "Reverse Google search",
          color: "#999999",
          dark: false,
          url: `https://www.google.com/searchbyimage?image_url=${rawUrl}`,
          icon: "mdi-google",
        },
        {
          name: "Copy DText link",
          color: "#152f56",
          dark: true,
          url: `"${unencodedText}":${this.currentShareUrl}`, // no urlencoding
          icon: "mdi-code-brackets",
          clipboard: true,
        },
        {
          name: "Copy IFrame embed",
          color: "#f6b73c",
          dark: false,
          url: `<iframe title="${unencodedText}" src="${this.currentShareUrl}"></iframe>`, // no urlencoding
          icon: "mdi-code-tags",
          clipboard: true,
        },
      ];
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

<style scoped lang="stylus">
.hidden {
  visibility: hidden;
}

.fullscreen {
  z-index: 1000;
  position: fixed;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;

  .flex {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 100vh;
    width: 100%;

    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 60px;
    }

    .middle {
      flex-grow: 1;

      .overflow {
        overflow: hidden;
        height: 100%;
        width: 100%;

        img {
          max-height: 100%;
          max-width: 100%;
          height: 100%;
          width: 100%;
          object-fit: contain;
        }
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 60px;
    }
  }

  .top-right {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1005;

    button {
      float: right;
    }
  }

  .bottom-right {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 1006;

    button {
      float: right;
    }
  }
}
</style>
