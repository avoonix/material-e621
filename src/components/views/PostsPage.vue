<template>
  <div>
    <tag-search :tag-string.sync="tagSearch" />
    <posts
      :posts="posts"
      :loading="loading"
      @load-previous="loadPreviousPage"
      @load-next="loadNextPage"
      @open-post="openPost"
      :fullscreen-post="fullscreenPost"
      @exit-fullscreen="fullscreenPost = null"
      @next-fullscreen-post="selectFullscreenPost(1)"
      @previous-fullscreen-post="selectFullscreenPost(-1)"
      :has-previous-fullscreen-post="true"
      :has-next-fullscreen-post="true"
    />
    <!-- TODO: set has-(next|previous)-fullscreen-post -->
    <portal to="sidebar-suggestions">
      <suggestions :tags="suggestedTags" />
    </portal>
  </div>
</template>

<script>
import Posts from "@/components/Posts.vue";
import { getApiService, getSuggestionService } from "../../worker/services";
import { GETTERS } from "../../store/constants";
import {
  updateRouterQuery,
  getTagColorFromCategoryId,
} from "../../utilities/utilities";
import Suggestions from "../Suggestions.vue";
import TagSearch from "../TagSearch.vue";

// TODO: reset first post on tag change

export default {
  name: "PostsPage",
  components: {
    Posts,
    Suggestions,
    TagSearch,
  },
  data() {
    return {
      posts: [],
      fullscreenPost: null,
      suggestedTags: [],
      loading: false,
    };
  },
  async mounted() {
    await this.loadNextPage();
  },
  watch: {
    posts: {
      async handler() {
        updateRouterQuery(this.$router, {
          first_post: this.posts.length ? this.posts[0].id : undefined,
        });
        await this.suggestTags();
      },
    },
  },
  computed: {
    // settingsIsPaginated() {
    //   return this.$store.getters[GETTERS.IS_PAGINATED_MODE];
    // },
    settingsPageSize() {
      return this.$store.getters[GETTERS.POST_FETCH_COUNT];
    },
    settingsSuggestedTagsCount() {
      return this.$store.getters[GETTERS.SUGGESTION_COUNT];
    },
    settingsBlacklist() {
      return this.$store.getters[GETTERS.GET_BLACKLIST_STRING];
    },
    firstPostId() {
      return this.posts.length
        ? this.posts[0].id
        : this.$route.query.first_post;
    },
    lastPostId() {
      return this.posts.length
        ? this.posts[this.posts.length - 1].id
        : this.$route.query.first_post + 1;
    },
    tagSearch: {
      get() {
        return this.$route.query.tags;
      },
      set(tags) {
        updateRouterQuery(this.$router, {
          tags,
        });
      },
    },
  },
  methods: {
    async selectFullscreenPost(relativeIndex) {
      const idx = this.posts.findIndex((p) => p.id === this.fullscreenPost.id);
      await this.openPost(this.posts[idx + relativeIndex].id);
      // TODO: load prev/next page
    },
    async openPost(postId) {
      this.fullscreenPost =
        this.posts.find((p) => p.id === postId) ||
        (await (async () => {
          const service = await getApiService();
          const posts = await service.getPosts({
            limit: 1,
            tags: `id:${postId}`,
            removeBlacklisted: false,
          });
          return posts[0] || null;
        })());
    },
    async loadPreviousPage() {
      await this.loadPosts({
        postsAfter: this.firstPostId,
      });
    },
    async loadNextPage() {
      await this.loadPosts({
        postsBefore: this.lastPostId,
      });
    },
    async loadPosts({ postsBefore, postsAfter }) {
      try {
        this.loading = true;

        const service = await getApiService();
        const posts = await service.getPosts({
          limit: this.settingsPageSize,
          postsBefore,
          postsAfter,
          // TODO: blacklist
          // TODO: blacklist mode (hide, blur)
          tags: this.tagSearch,
          blacklist: this.settingsBlacklist,
          removeBlacklisted: true, // TODO: from settings
        });
        const postCountToRemove = Math.max(
          0,
          this.posts.length - this.settingsPageSize,
        );
        console.log("post count to remove", postCountToRemove);
        if (postsBefore) {
          this.posts.push(...posts);
          this.posts.splice(0, postCountToRemove);
        } else {
          this.posts.unshift(...posts);
          this.posts.splice(
            this.posts.length - postCountToRemove,
            postCountToRemove,
          );
        }
      } catch (error) {
        this.$notify(error);
      } finally {
        this.loading = false;
      }
    },
    async suggestTags() {
      if (!this.posts.length) {
        this.suggestedTags = [];
        return;
      }
      const service = await getSuggestionService();
      const occurences = await service.getTagOccurences(this.posts);
      // TODO: handle slicing and mapping in worker
      this.suggestedTags = occurences.sorted
        .slice(0, this.settingsSuggestedTagsCount)
        .map((t) => ({
          text: t.name,
          count: t.count,
          color: getTagColorFromCategoryId(t.category),
        }));
    },
  },
};
</script>
