<template>
  <v-container fluid grid-list-md>
    <portal to="sidebar-suggestions">
      <suggestions :tags="recommendedTags" />
    </portal>
    <tag-search v-if="!isControlled && navMode != 'im'" />
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
    <fullscreen-dialog
      :has-previous-fullscreen-post="hasPreviousFullscreenPost"
      :has-next-fullscreen-post="hasNextFullscreenPost"
      :current="currentFullscreenPost || fullscreenPost"
      @close="exitFullscreen"
    />
    <details-dialog :current="currentDetailsPost" />
    <div class="text-xs-center mb-3" v-if="!isControlled">
      <pagination :loading="loading" @load-posts="loadPosts" />
    </div>
    <post-list :visible-posts="visiblePosts" />
    <div
      class="text-xs-center my-3"
      v-if="visiblePosts.length && !isControlled"
    >
      <pagination :loading="loading" @load-posts="loadPosts" />
    </div>
    <div class="text-xs-center" v-scroll="onScroll">
      <logo v-if="loading" loader />
      <v-btn
        @click="handleLoadClick"
        v-else-if="!$store.getters.noResults || isControlled"
        color="primary"
        dark
        large
      >
        <span v-if="!isControlled"
          >Load {{ visiblePosts.length ? "next" : "" }}
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
    <v-fab-transition>
      <v-btn
        v-show="fabVisible"
        color="secondary"
        fixed
        bottom
        right
        fab
        @click="$vuetify.goTo(0, scrollOptions)"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
import TagSearch from "../components/TagSearch.vue";
import PostList from "../components/PostList.vue";
import Pagination from "../components/Pagination.vue";
import FullscreenDialog from "./dialogs/FullscreenDialog.vue";
import DetailsDialog from "./dialogs/DetailsDialog.vue";
import Logo from "./Logo.vue";
import { GETTERS, ACTIONS } from "../store/constants";
import BlacklistSuggestions from "./BlacklistSuggestions.vue";
import { ratingTags } from "../config/customTags";
import Suggestions from "./Suggestions.vue";
import { getSuggestionService, getApiService } from "../worker/services";
import * as plugins from "../utilities/vuePlugin";

export default {
  metaInfo: {
    title: "Posts",
  },
  components: {
    TagSearch,
    PostList,
    FullscreenDialog,
    DetailsDialog,
    Logo,
    Pagination,
    BlacklistSuggestions,
    Suggestions,
  },
  props: {
    isControlled: {
      type: Boolean,
      default: false,
    },
    controlledLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fullscreenPost: false,
      recommendedTags: [],
      offsetTop: 0,
      items: [...new Array(1000)]
        .map((_, i) => i)
        .map((i) => ({
          id: i,
          height: Math.floor(Math.random() * 100),
        })),
      scrollOptions: {
        offset: 0,
        duration: 500,
        easing: "easeInOutQuint",
      },
      ratingTags: ratingTags,
      postsLoading: false,
    };
  },
  async mounted() {
    if (!this.isControlled && this.$store.getters[GETTERS.IS_AUTO_LOAD]) {
      this.postsLoading = true;
      await this.$store.dispatch("loadPosts", {
        reset: true,
      });
      this.postsLoading = false;
    }
  },
  destroyed() {
    this.$store.dispatch("resetPosts");
  },
  watch: {
    notYetLoadedPost: {
      async handler(val) {
        if (val) {
          const service = await getApiService();
          const posts = await service.getPosts({
            limit: 1,
            tags: `id:${val}`,
          });
          if (posts.length) {
            this.fullscreenPost = posts[0];
          } else {
            console.log("current fullscreen post not found");
          }
        }
      },
      immediate: true,
    },
    visiblePosts() {
      if (this.visiblePosts.length) {
        getSuggestionService().then((s) =>
          s.getTagOccurences(this.visiblePosts).then((o) => {
            this.recommendedTags = o.sorted
              .slice(0, this.$store.getters[GETTERS.SUGGESTION_COUNT])
              .map((t) => ({
                text: t.name,
                count: t.count,
                color: plugins.getTagColor(t.category),
              }));
          }),
        );
      } else {
        this.recommendedTags = [];
      }
    },
    currentPageLoaded: {
      immediate: true,
      handler(val) {
        if (!val && this.isPaginated && !this.isControlled) {
          this.postsLoading = true;
          this.$store
            .dispatch("loadPosts", { reset: false })
            .then(() => (this.postsLoading = false));
          // console.log("not loaded");
        }
      },
    },
  },
  computed: {
    notYetLoadedPost() {
      if (!this.current) {
        return this.$store.getters[GETTERS.GET_FULLSCREEN_POST_ID];
      }
      return false;
    },
    currentDetailsPost() {
      return this.$store.getters[GETTERS.GET_DETAILS_VIEW_POST];
    },
    hasPreviousFullscreenPost() {
      return this.$store.getters.hasPreviousFullscreenPost;
    },
    hasNextFullscreenPost() {
      return this.$store.getters.hasNextFullscreenPost;
    },
    currentFullscreenPost() {
      return this.$store.getters[GETTERS.GET_FULLSCREEN_POST];
    },
    navMode() {
      return this.$store.getters[GETTERS.NAVIGATION_TYPE];
    },
    blacklistedCount() {
      return this.$store.getters[GETTERS.GET_VISIBLE_POSTS_BLACKLISTED];
    },
    itemsInBlacklist() {
      return this.$store.getters[GETTERS.GET_BLACKLIST_ARRAY].length;
    },
    loading() {
      if (this.isControlled) {
        return this.controlledLoading;
      }
      return this.postsLoading;
    },
    isPaginated() {
      return (
        this.$store.getters[GETTERS.IS_PAGINATED_MODE] && !this.isControlled
      );
    },
    currentPageLoaded() {
      return this.$store.getters[GETTERS.GET_CURRENT_PAGE_LOADED];
    },
    visiblePosts() {
      return this.$store.getters[GETTERS.GET_VISIBLE_POSTS];
    },
    postFetchCount() {
      return this.$store.getters[GETTERS.POST_FETCH_COUNT]; // TODO:
    },
    fabVisible() {
      return this.offsetTop > 200 && this.navMode != "im";
    },
    isPopup() {
      return this.$store.getters[GETTERS.IS_POPUP];
    },
  },
  methods: {
    exitFullscreen() {
      if (!this.currentFullscreenPost && this.isPopup) {
        window.close();
      }
      this.$store.dispatch(ACTIONS.SET_FULLSCREEN_POST_ID, false);
      this.fullscreenPost = false;
    },
    async loadPosts() {
      this.postsLoading = true;
      await this.$store.dispatch("loadPosts", { reset: false });
      this.postsLoading = false;
    },
    handleLoadClick() {
      if (
        this.$store.getters[GETTERS.IS_PAGINATED_MODE] &&
        !this.isControlled
      ) {
        this.$store.dispatch(
          ACTIONS.SET_CURRENT_PAGE_NUMBER,
          this.$store.getters[GETTERS.GET_MAX_PAGE_NUMBER] + 1,
        );
      }
      if (this.isControlled) {
        this.$emit("click", true);
      } else {
        this.postsLoading = true;
        this.$store
          .dispatch("loadPosts", { reset: false })
          .then(() => (this.postsLoading = false)); // TODO:
      }
      this.$nextTick(() => {
        this.$vuetify.goTo(
          window.innerHeight + window.scrollY,
          this.scrollOptions,
        );
      });
    },
    onScroll(event) {
      this.offsetTop = window.pageYOffset || document.documentElement.scrollTop;
      if (!this.$store.getters[GETTERS.IS_BOTTOM_LOAD]) return;
      // const errorMargin = 10; // in px
      const errorMargin = window.innerHeight / 2; // start loading a half page before the bottom
      const body = document.body,
        html = document.documentElement;

      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
      );
      const scrolled = window.innerHeight + window.scrollY;
      const isBottom = scrolled + errorMargin >= height;

      if (
        isBottom &&
        !this.loading &&
        this.$store.getters[GETTERS.IS_BOTTOM_LOAD] &&
        this.visiblePosts.length > 0
      ) {
        if (this.isControlled) {
          this.$emit("click");
        } else {
          this.postsLoading = true;
          this.$store
            .dispatch("loadPosts", {
              reset: false,
            })
            .then(() => (this.postsLoading = false));
        }
      }
    },
  },
};
</script>
