<template>
  <span>
    <template v-for="button in buttons">
      <v-btn
        :disabled="post.demo"
        :dark="large && !post.demo"
        :large="large"
        :class="{ 'mr-2': large, 'mt-2': large }"
        :small="small"
        v-if="button.name == 'download'"
        :key="button.id"
        icon
        :loading="downloadPostLoading"
        @click="downloadPost(post)"
      >
        <v-icon :size="small ? '16' : large ? '30' : undefined">{{
          post.file_ext == "webm"
            ? "mdi-video"
            : post.file_ext == "swf"
            ? "mdi-flash"
            : "mdi-image"
        }}</v-icon>
      </v-btn>
      <v-btn
        :disabled="post.demo"
        :dark="large && !post.demo"
        :large="large"
        :class="{ 'mr-2': large, 'mt-2': large }"
        :small="small"
        v-if="button.name == 'e621'"
        :key="button.id"
        icon
        @click="openOnE621(post.id)"
      >
        <v-icon :size="small ? '16' : large ? '30' : undefined"
          >mdi-open-in-new</v-icon
        >
      </v-btn>
      <v-btn
        :disabled="post.demo"
        :dark="large && !post.demo"
        :large="large"
        :class="{ 'mr-2': large, 'mt-2': large }"
        :small="small"
        v-if="button.name == 'info'"
        :key="button.id"
        icon
        @click="openDetails"
      >
        <v-icon :size="small ? '16' : large ? '30' : undefined"
          >mdi-information</v-icon
        >
      </v-btn>
      <v-btn
        :disabled="post.demo"
        :dark="large && !post.demo"
        :large="large"
        :class="{ 'mr-2': large, 'mt-2': large }"
        :small="small"
        v-if="button.name == 'favorite' && loggedIn"
        :key="button.id"
        icon
        :loading="favoritePostLoading"
        @click="togglePostFavorite(post)"
      >
        <v-icon
          :size="small ? '16' : large ? '30' : undefined"
          v-if="post.custom_favorited_by_user"
          color="pink darken-1"
          >mdi-heart</v-icon
        >
        <v-icon :size="small ? '16' : large ? '30' : undefined" v-else
          >mdi-heart-outline</v-icon
        >
      </v-btn>
      <v-btn
        :disabled="post.demo"
        :dark="large && !post.demo"
        :large="large"
        :class="{ 'mr-2': large, 'mt-2': large }"
        :small="small"
        v-if="button.name == 'new_tab'"
        :key="button.id"
        icon
        @click="openInNewTab(post.id)"
      >
        <v-icon :size="small ? '16' : large ? '30' : undefined">mdi-tab</v-icon>
      </v-btn>
      <v-btn
        :disabled="post.demo"
        :dark="large && !post.demo"
        :large="large"
        :class="{ 'mr-2': large, 'mt-2': large }"
        :small="small"
        v-if="button.name == 'new_tab_author'"
        :key="button.id"
        icon
        @click="openInNewTabAuthor(post)"
      >
        <v-icon :size="small ? '16' : large ? '30' : undefined"
          >mdi-brush</v-icon
        >
      </v-btn>
      <v-btn
        :disabled="post.demo"
        :dark="large && !post.demo"
        :large="large"
        :class="{ 'mr-2': large, 'mt-2': large }"
        :small="small"
        v-if="button.name == 'post_score' && post.custom_post_score"
        :key="button.id"
        icon
        @click="openDetails"
        >{{ formatPercentage(post.custom_post_score) }}</v-btn
      >
    </template>
  </span>
</template>

<script>
import {
  openOnE621,
  downloadPost,
  togglePostFavorite,
} from "../utilities/mixins";
import { GETTERS, ACTIONS } from "../store/constants";
export default {
  mixins: [downloadPost, openOnE621, togglePostFavorite],
  props: {
    post: {
      type: Object,
      default: () => ({ file_ext: "png", demo: true }),
    },
    small: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    loggedIn() {
      return this.$store.getters[GETTERS.IS_LOGGED_IN];
    },
    buttons() {
      return this.$store.getters[GETTERS.POST_BUTTONS_LAYOUT].filter(
        // FIXME: js profiler
        (btn) =>
          (btn.active && !this.fullscreen) ||
          (btn.activeFullscreen && this.fullscreen), // only active buttons
      );
    },
  },
  methods: {
    formatPercentage(num) {
      return Math.floor(num * 100);
    },
    openInNewTab(id) {
      window
        .open(
          `${window.location.origin}/#/e621?agree=true&fspost=${id}`,
          "_blank",
        )
        .focus();
    },
    openInNewTabAuthor(post) {
      for (const artist of post.tags.artist)
        window
          .open(
            `${window.location.origin}/#/e621?agree=true&tags=${artist}`,
            "_blank",
          )
          .focus();
    },
    openDetails() {
      this.$emit("open-post-details", this.post.id);
      // this.$store.dispatch(ACTIONS.SET_DETAILS_VIEW, {
      //   id: false,
      // });
      // setTimeout(() => {
      //   this.$store.dispatch(ACTIONS.SET_DETAILS_VIEW, {
      //     id: this.post.id,
      //   });
      // }, 10);
    },
  },
};
</script>
