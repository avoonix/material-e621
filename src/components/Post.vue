<template>
  <div style="display: flex;">
    <v-card
      v-if="layout == 'feed'"
      :color="'grey ' + (theme.isDark ? 'darken-4' : 'lighten-1')"
      style="min-width: 40px;max-width: 40px; flex-grow: 1; flex-shrink: 1;"
      class="text-xs-center pt-3"
    >
      <div class="mt-1">
        <v-icon>mdi-thumbs-up-down</v-icon>
      </div>
      <div>{{ post.score }}</div>
      <div class="mt-2">
        <v-icon>mdi-heart</v-icon>
      </div>
      <div>{{ post.fav_count }}</div>
    </v-card>
    <v-card
      :id="'post_' + post.id + (isDialog ? '_dialog' : '')"
      :color="lessInfo ? cardColor : ''"
      style="flex-grow: 99999;"
    >
      <div :style="layout == 'feed' && size == 'md' ? 'display: flex;' : ''">
        <template
          v-for="section in layout == 'feed' && size == 'md'
            ? ['image', 'headline']
            : ['headline', 'image']"
        >
          <div
            v-if="layout == 'feed' && section == 'headline'"
            :key="section"
            style="overflow:hidden; flex-grow: 99999;"
          >
            <div
              class="grey--text ma-2 clickable"
              :title="uploadDate"
              @click="setClicked"
            >
              Posted by {{ post.author }} {{ uploadDateDisplay }}
            </div>
            <div
              class="headline ma-2 clickable"
              @click="setClicked"
              style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; "
            >
              <v-chip :color="cardColor" text-color="white" label="" small>{{
                post.rating == "e"
                  ? "Explicit"
                  : post.rating == "q"
                  ? "Questionable"
                  : "Safe"
              }}</v-chip>
              {{ post.description || "Untitled post" }}
            </div>
            <div class="ma-2">
              <d-text-display :text="post.description" />
            </div>
          </div>
          <div
            v-if="section == 'image' && (layout != 'feed' || size != 'sm')"
            :key="section"
            :class="mainBackgroundColorClasses"
            class="hover-buttons-container"
            style="position:relative;"
            :style="
              layout == 'feed' && size == 'md'
                ? 'max-width: 15vw; min-width: 15vw; flex-grow: 1; flex-shrink: 1;'
                : ''
            "
          >
            <div
              @click="setClicked"
              v-ripple="clickable"
              :class="{
                feed: layout == 'feed',
                feedmd: layout == 'feed' && size == 'md',
                content: !extraSpacing,
                clickable: clickable,
                'aspect-ratio-box': layout !== 'grid' && layout != 'feed',
                'blacklist-blur': blacklistMode == 'blur',
                'blacklist-black': blacklistMode == 'black',
              }"
              :style="{
                'padding-top':
                  layout !== 'grid' && layout != 'feed'
                    ? `calc(${post.height / post.width} * 100% + 10px)`
                    : undefined,
              }"
            >
              <video
                v-if="post.file_ext == 'webm' && clicked"
                controls
                loop
                :autoplay="true"
                preload="none"
              >
                <source :src="post.file_url" type="video/webm" />
                Video type not supported by your browser
              </video>
              <div
                v-else-if="post.file_ext == 'swf'"
                class="centered clickable"
                v-ripple
              >
                <v-icon size="100">mdi-flash</v-icon>
                <div>Flash</div>
              </div>
              <img
                v-else-if="fastLoad || clicked"
                :src="imageSrc"
                :alt="allTags"
                lazy="loaded"
              />
              <img
                v-else
                v-lazy="{
                  src: imageSrc,
                  loading: post.preview_url,
                  error: post.preview_url,
                }"
                :alt="allTags"
              />
              <div
                v-if="post.file_ext == 'webm' && !clicked"
                class="centered clickable play-button"
              >
                <v-icon size="100">mdi-play</v-icon>
              </div>
            </div>
            <div
              class="hover-buttons"
              :class="{
                top: hoverButtonsTop,
                bottom: !hoverButtonsTop,
                'pa-2': size != 'sm',
                'pa-1': size == 'sm',
              }"
              v-if="hoverButtons"
            >
              <v-card>
                <div :class="{ 'pa-1': size != 'sm' }">
                  <post-buttons
                    ref="postButtonsRef"
                    :small="size == 'sm'"
                    :post="post"
                  />
                  <v-btn
                    :small="size == 'sm'"
                    icon
                    @click="show = !show"
                    v-if="!noExpand"
                  >
                    <v-icon :size="size == 'sm' ? '16' : undefined">
                      {{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}
                    </v-icon>
                  </v-btn>
                </div>
              </v-card>
            </div>
          </div>
        </template>
      </div>
      <v-card-title
        primary-title
        v-if="!lessInfo && !hideInfo && layout != 'feed'"
      >
        <div>
          <div class="headline">
            <v-icon>mdi-thumbs-up-down</v-icon>
            {{ post.score }} |
            <v-icon>mdi-heart</v-icon>
            {{ post.fav_count }} | {{ post.file_ext.toUpperCase() }} ({{
              fileSize
            }})
          </div>
          <span class="grey--text"
            >{{ uploadDate }} ({{ uploadDateDisplay }})</span
          >
        </div>
      </v-card-title>
      <div style="flex:1;"></div>
      <v-card-actions
        v-if="!hideInfo"
        :class="{ 'py-1': lessInfo || layout == 'feed' }"
      >
        <post-buttons ref="postButtonsRef" :small="size == 'sm'" :post="post" />
        <v-spacer></v-spacer>
        <v-btn icon @click="show = !show" v-if="!noExpand">
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
      </v-card-actions>
      <v-slide-y-transition>
        <v-card-text v-show="show" v-if="show">
          <div v-if="lessInfo || hoverButtons || layout == 'feed'">
            <v-chip
              :color="
                post.score < 0 ? 'red' : post.score > 0 ? 'green' : 'primary'
              "
              text-color="white"
            >
              <v-avatar>
                <v-icon>mdi-thumbs-up-down</v-icon>
              </v-avatar>
              {{ post.score }} Points
            </v-chip>
            <v-chip
              :color="
                post.fav_count < 0
                  ? 'red'
                  : post.fav_count > 0
                  ? 'green'
                  : 'primary'
              "
              text-color="white"
            >
              <v-avatar>
                <v-icon>mdi-heart</v-icon>
              </v-avatar>
              {{ post.fav_count }} Favorites
            </v-chip>
            <v-chip color="primary" text-color="white">
              <v-avatar>
                <v-icon>{{
                  post.file_ext == "webm"
                    ? "mdi-video"
                    : post.file_ext == "swf"
                    ? "mdi-flash"
                    : "mdi-image"
                }}</v-icon>
              </v-avatar>
              {{ post.file_ext.toUpperCase() }} File
            </v-chip>
            <v-chip color="primary" text-color="white">
              <v-avatar>
                <v-icon>mdi-sd</v-icon>
              </v-avatar>
              {{ fileSize }}
            </v-chip>
            <v-chip color="primary" text-color="white">
              <v-avatar>
                <v-icon>mdi-calendar-range</v-icon>
              </v-avatar>
              {{ uploadDate }}
            </v-chip>
            <v-chip color="primary" text-color="white">
              <v-avatar>
                <v-icon>mdi-clock-outline</v-icon>
              </v-avatar>
              {{ uploadDateDisplay }}
            </v-chip>
          </div>
          <div class="body-1 mb-3" v-if="!lessInfo">
            <d-text-display :text="post.description" />
          </div>
          <template v-for="(category, index) of reversedTaskCategories">
            <span :key="index">
              <template v-for="(tag, tagIndex) of category[1]">
                <tag-label
                  :key="tagIndex"
                  :tag="{ text: tag, color: $getTagColor(category[0]) }"
                />
              </template>
            </span>
          </template>
          <div class="body-1 mt-3" v-if="lessInfo">
            <d-text-display :text="post.description" />
          </div>
        </v-card-text>
      </v-slide-y-transition>
    </v-card>
  </div>
</template>

<script>
// post:
//   id                The ID of the post
//   author            Username of the user who uploaded the post
//   creator_id        User ID of the user who uploaded the post
//   created_at        When the post was uploaded
//   status            Post status, one of: active, flagged, pending, deleted
//   source            The post's source (if there are multiple sources, only the first one is returned
//   sources           An array of the post's sources
//   tags              The post's tags
//   artist            A HTML-escaped JSON array of the post's artist tag(s). Use something like PHP's html_entity_decode() to decode the HTML string, then json_decode() to convert the JSON string to an array.
//   description       The post's description
//   fav_count         The number of users who have the post in their favorites
//   score             The post's score
//   rating            The post's rating. One of: e, q, s
//   parent_id         If the post has a parent, the ID of the parent post
//   has_children      If the post has any children
//   children          Comma-separated list of post IDs of this post's children
//   has_notes         If the post has any notes
//   has_comments      If the post has any comments
//   md5               The post's MD5 hash
//   file_url          Absolute URL of the filename
//   file_ext          The post's extension. One of: jpg, png, gif, swf, webm
//   file_size         Size (in bytes) of the post
//   width             Height of the image
//   height            Height of the image
//   sample_url        Absolute URL of the sample (scaled) filename
//   sample_width      Height of the sample (scaled) image
//   sample_height     Height of the sample (scaled) image
//   preview_url       Absolute URL of the preview (thumbnail) filename
//   preview_width     Height of the preview (thumbnail) image
//   preview_height    Height of the preview (thumbnail) image
//   delreason         Reason the post was deleted. Only appears on posts that have been deleted before.
import DTextDisplay from "./DTextDisplay.vue";
import prettyBytes from "pretty-bytes";
import { GETTERS, ACTIONS } from "../store/constants";
import TagLabel from "./TagLabel.vue";
import PostButtons from "./PostButtons.vue";
import {
  openOnE621,
  downloadPost,
  togglePostFavorite,
} from "../utilities/mixins";

export default {
  components: {
    TagLabel,
    PostButtons,
    DTextDisplay,
  },
  mixins: [openOnE621, downloadPost, togglePostFavorite],
  inject: ["theme"],
  props: {
    post: {
      type: Object,
    },
    noExpand: {
      type: Boolean,
      default: false,
    },
    isDialog: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "md", // sm, md, xl
    },
    layout: {
      type: String,
      default: "blog",
    },
  },
  data: () => ({
    show: false,
    clicked: false,
  }),
  computed: {
    blacklistMode() {
      if (this.post.custom_blacklisted_by_user) {
        return this.$store.getters[GETTERS.BLACKLIST_MODE]; // blur, black
      }
      return false;
    },
    fastLoad() {
      return this.$store.getters[GETTERS.IS_FAST_LOAD_MODE];
    },
    loggedIn() {
      return this.$store.getters[GETTERS.IS_LOGGED_IN];
    },
    extraSpacing() {
      return (
        this.layout == "blog" ||
        this.layout == "feed" ||
        this.layout == "masonry"
      );
    },
    lessInfo() {
      return this.$store.getters[GETTERS.POST_COMPACTNESS] == "compact";
    },
    hideInfo() {
      return (
        this.$store.getters[GETTERS.POST_COMPACTNESS] == "none" ||
        this.hoverButtons
      );
    },
    hoverButtons() {
      return (
        this.$store.getters[GETTERS.POST_COMPACTNESS] == "hover" ||
        this.$store.getters[GETTERS.POST_COMPACTNESS] == "hovertop"
      );
    },
    hoverButtonsTop() {
      return this.$store.getters[GETTERS.POST_COMPACTNESS] == "hovertop";
    },
    clickable() {
      return (
        !this.clicked ||
        (this.$store.getters[GETTERS.IS_LOW_RESOLUTION_MODE] &&
          !this.clicked) ||
        (this.post.file_ext != "swf" && this.post.file_ext != "webm")
      );
    },
    mainBackgroundColorClasses() {
      return {
        box: !(
          this.layout == "blog" ||
          this.layout == "feed" ||
          this.layout == "masonry"
        ),
        ...this.backgroundColorClasses,
      };
    },
    cardColor() {
      let str = "";
      for (const color of Object.keys(this.backgroundColorClasses)) {
        if (this.backgroundColorClasses[color]) str += color + " ";
      }
      return str;
    },
    backgroundColorClasses() {
      return {
        // grey: !this.$store.getters[GETTERS.IS_BACKGROUND_COLORED],
        red:
          this.post.rating == "e" &&
          this.$store.getters[GETTERS.IS_BACKGROUND_COLORED],
        green:
          this.post.rating == "s" &&
          this.$store.getters[GETTERS.IS_BACKGROUND_COLORED],
        yellow:
          this.post.rating == "q" &&
          this.$store.getters[GETTERS.IS_BACKGROUND_COLORED],
        "darken-0": this.$store.getters[GETTERS.IS_BACKGROUND_COLORED],
        // "darken-0": !this.$store.getters[GETTERS.IS_BACKGROUND_COLORED]
      };
    },
    imageSrc() {
      if (this.$store.getters[GETTERS.IS_LOW_RESOLUTION_MODE]) {
        if (this.clicked) {
          return this.post.file_url;
        }
        return this.post.preview_url;
      }
      if (this.post.file_ext == "webm") {
        return this.post.sample_url;
      }
      if (this.post.file_ext == "swf") {
        return this.post.preview_url;
      }
      return this.post.file_url;
    },
    fileSize() {
      return this.post.custom_pretty_file_size;
    },
    uploadDateDisplay() {
      return this.post.custom_pretty_relative_upload_date;
    },
    uploadDate() {
      return this.post.custom_pretty_upload_date;
    },
    allTags() {
      return this.post.custom_all_tags;
    },
    reversedTaskCategories() {
      const order = ["artist", "character", "copyright", "species", "general"];
      const retVal = [];
      for (const cat of order) {
        retVal.push([cat, this.post.tags[cat] || []]);
      }
      return retVal;
    },
  },
  methods: {
    setClicked() {
      if (
        this.clicked ||
        !this.$store.getters[GETTERS.IS_LOW_RESOLUTION_MODE]
      ) {
        if (this.post.file_ext != "webm") this.setFullscreen();
      }
      this.clicked = true;
    },
    setFullscreen() {
      this.$store.dispatch(ACTIONS.SET_FULLSCREEN_POST_ID, false);
      setTimeout(() => {
        this.$store.dispatch(ACTIONS.SET_FULLSCREEN_POST_ID, this.post.id);
      }, 10);
    },
  },
};
</script>

<style lang="stylus" scoped>
.aspect-ratio-box {
  height: 0;
  overflow: hidden;
  position: relative;

  &>* {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.hover-buttons-container {
  .hover-buttons {
    display: none;
    position: absolute;
    right: 0;
    transition: opacity 0.2s ease;

    &.bottom {
      bottom: 0;
    }

    &.top {
      top: 0;
    }
  }

  &:hover .hover-buttons {
    display: block;
    opacity: 0.3;

    &:hover {
      opacity: 1;
    }
  }
}

.box {
  position: relative;
  width: 100%;
}

.box:before {
  content: '';
  display: block;
  padding-top: 100%;
  /* initial ratio of 1:1 */
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.clickable {
  cursor: pointer;
}

img, video {
  height: 100%;
  width: 100%;
  // margin: auto;
  display: inline-block;
  object-fit: contain;
}

.feed {
  img, video {
    max-height: 60vh;
    margin-top: 5px;
  }
}

.feedmd {
  img, video {
    height: 20vh;
  }
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.play-button {
  // z-index: 10;
  position: absolute;
  top: 0;
  height: 100%;
  pointer-events: none;
}

img[lazy=loading] {
  filter: blur(2px);
  opacity: 0.7;
  /* your style here */
}

img[lazy=error] {
  /* your style here */
}

img[lazy=loaded] {
  animation-duration: 0.5s;
  animation-fill-mode: both;
  animation-name: fadeIn;
  /* your style here */
}

@keyframes fadeIn {
  from {
    opacity: 0.7;
    filter: blur(2px);
  }

  to {
    opacity: 1;
    filter: blur(0);
  }
}

.blacklist-black {
  filter: brightness(0.02);
}

.blacklist-blur {
  filter: blur(7px) !important;
  // transform: scale(0.99);
}
</style>