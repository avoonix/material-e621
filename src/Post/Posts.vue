<template>
  <v-container fluid grid-list-md>
    <div class="text-center">
      <v-btn @click="loadPrevious" :loading="loading" color="accent" text>
        load previous
      </v-btn>
    </div>
    <!-- <app-logo v-if="loading" loader /> -->
    <post-list :visible-posts="posts" :loading="loading" @load-next-page="loadNext" @load-previous-page="loadPrevious">
      <template #post="{ post }">
        <!-- :layout="layout" -->
        <post :post="post" @open-post="$emit('open-post', $event)"
          @open-post-details="$emit('open-post-details', $event)"
          @set-post-favorite="$emit('set-post-favorite', $event)" />
      </template>
    </post-list>
    <app-logo v-if="loading" type="loader" />
    <div class="text-center">
      <v-btn @click="loadNext" :loading="loading" color="accent" text>
        load next
      </v-btn>
    </div>
    <fullscreen-dialog :has-previous-fullscreen-post="hasPreviousFullscreenPost"
      :has-next-fullscreen-post="hasNextFullscreenPost" :current="fullscreenPost || null"
      @close="$emit('exit-fullscreen')" @next-post="$emit('next-fullscreen-post')"
      @previous-post="$emit('previous-fullscreen-post')" @open-post-details="$emit('open-post-details', $event)"
      @set-post-favorite="$emit('set-post-favorite', $event)" />
    <details-dialog :current="detailsPost" @close="$emit('close-details')"
      @open-post-fullscreen="$emit('open-post', $event)" @set-post-favorite="$emit('set-post-favorite', $event)" />
    <!--
    <div>
      <blacklist-suggestions :suggested-blacklist="ratingTags" />
      <v-slide-x-transition>
        <v-chip color="info" text-color="white" v-if="itemsInBlacklist">
          <v-avatar class="info darken-3">
            <v-icon>mdi-playlist-edit</v-icon>
          </v-avatar>
          {{ itemsInBlacklist }} blacklist
          {{ itemsInBlacklist == 1 ? "rule" : "rules" }} active
        </v-chip>
      </v-slide-x-transition>
      <v-slide-x-transition>
        <v-chip color="red" text-color="white" v-if="blacklistedCount">
          <v-avatar class="red darken-3">
            <v-icon>mdi-playlist-remove</v-icon>
          </v-avatar>
          {{ blacklistedCount }}
          {{ blacklistedCount == 1 ? "post" : "posts" }} excluded by blacklist
        </v-chip>
      </v-slide-x-transition>
    </div>
    <div class="text-xs-center" v-scroll="onScroll">
      <v-btn
        @click="handleLoadClick"
        v-else-if="!$store.getters.noResults || isControlled"
        color="primary"
        dark
        large
      >
        <span v-if="!isControlled"
          >Load {{ posts.length ? "next" : "" }}
          {{ postFetchCount }} posts</span
        >
        <span v-else>Load next posts</span>
      </v-btn>
      <v-btn color="red" large v-else disabled>{{
        $store.getters.noMorePosts
          ? "You have reached the end"
          : "No results for this query"
      }}</v-btn>
    </div>
    -->
  </v-container>
</template>

<script lang="ts">
import Post from "@/Post/Post.vue";
import PostList from "@/Post/PostList.vue";
import { EnhancedPost } from "@/worker/ApiService";
import { defineComponent, PropType } from "vue";
import AppLogo from "../App/AppLogo.vue";
import DetailsDialog from "./DetailsDialog.vue";
import FullscreenDialog from "./FullscreenDialog.vue";

export default defineComponent({
  metaInfo: {
    title: "Posts",
  },
  components: {
    PostList,
    FullscreenDialog,
    DetailsDialog,
    Post,
    AppLogo,
  },
  props: {
    fullscreenPost: { type: Object as PropType<EnhancedPost> },
    detailsPost: { type: Object as PropType<EnhancedPost> },
    posts: { type: Array as PropType<EnhancedPost[]>, required: true },
    loading: { type: Boolean, required: true },
    hasPreviousFullscreenPost: { type: Boolean, required: true },
    hasNextFullscreenPost: { type: Boolean, required: true },
  },
  // data() {
  //   return {
  //     fullscreenPost: false,
  //     recommendedTags: [],
  //     offsetTop: 0,
  //     items: [...new Array(1000)]
  //       .map((_, i) => i)
  //       .map((i) => ({
  //         id: i,
  //         height: Math.floor(Math.random() * 100),
  //       })),
  //     scrollOptions: {
  //       offset: 0,
  //       duration: 500,
  //       easing: "easeInOutQuint",
  //     },
  //     ratingTags: ratingTags,
  //     postsLoading: false,
  //   };
  // },
  // async mounted() {
  //   if (!this.isControlled && this.$store.getters[GETTERS.IS_AUTO_LOAD]) {
  //     this.postsLoading = true;
  //     await this.$store.dispatch("loadPosts", {
  //       reset: true,
  //     });
  //     this.postsLoading = false;
  //   }
  // },
  // destroyed() {
  //   this.$store.dispatch("resetPosts");
  // },
  // computed: {
  //   notYetLoadedPost() {
  //     if (!this.current) {
  //       return this.$store.getters[GETTERS.GET_FULLSCREEN_POST_ID];
  //     }
  //     return false;
  //   },
  //   currentDetailsPost() {
  //     return this.$store.getters[GETTERS.GET_DETAILS_VIEW_POST];
  //   },
  //   hasPreviousFullscreenPost() {
  //     return this.$store.getters.hasPreviousFullscreenPost;
  //   },
  //   hasNextFullscreenPost() {
  //     return this.$store.getters.hasNextFullscreenPost;
  //   },
  //   currentFullscreenPost() {
  //     return this.$store.getters[GETTERS.GET_FULLSCREEN_POST];
  //   },
  //   navMode() {
  //     return this.$store.getters[GETTERS.NAVIGATION_TYPE];
  //   },
  //   blacklistedCount() {
  //     return this.$store.getters[GETTERS.GET_VISIBLE_POSTS_BLACKLISTED];
  //   },
  //   itemsInBlacklist() {
  //     return this.$store.getters[GETTERS.GET_BLACKLIST_ARRAY].length;
  //   },
  //   loading() {
  //     if (this.isControlled) {
  //       return this.controlledLoading;
  //     }
  //     return this.postsLoading;
  //   },
  //   postFetchCount() {
  //     return this.$store.getters[GETTERS.POST_FETCH_COUNT]; // TODO:
  //   },
  //   fabVisible() {
  //     return this.offsetTop > 200 && this.navMode != "im";
  //   },
  // },
  methods: {
    // TODO: paginated
    loadPrevious() {
      this.$emit("load-previous");
    },
    loadNext() {
      this.$emit("load-next");
    },
    //   onScroll(event) {
    //     this.offsetTop = window.pageYOffset || document.documentElement.scrollTop;
    //     if (!this.$store.getters[GETTERS.IS_BOTTOM_LOAD]) return;
    //     // const errorMargin = 10; // in px
    //     const errorMargin = window.innerHeight / 2; // start loading a half page before the bottom
    //     const body = document.body,
    //       html = document.documentElement;

    //     const height = Math.max(
    //       body.scrollHeight,
    //       body.offsetHeight,
    //       html.clientHeight,
    //       html.scrollHeight,
    //       html.offsetHeight,
    //     );
    //     const scrolled = window.innerHeight + window.scrollY;
    //     const isBottom = scrolled + errorMargin >= height;

    //     if (
    //       isBottom &&
    //       !this.loading &&
    //       this.$store.getters[GETTERS.IS_BOTTOM_LOAD] &&
    //       this.posts.length > 0
    //     ) {
    //       if (this.isControlled) {
    //         this.$emit("click");
    //       } else {
    //         this.postsLoading = true;
    //         this.$store
    //           .dispatch("loadPosts", {
    //             reset: false,
    //           })
    //           .then(() => (this.postsLoading = false));
    //       }
    //     }
    //   },
  },
});
</script>
