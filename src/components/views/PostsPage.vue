<template>
  <div>
    <tag-search :tags="tags" @add-tag="addTag" @remove-tag="removeTag" />
    <v-menu
      bottom
      left
      max-height="300"
      lazy
      offset-y
      transition="slide-y-transition"
    >
      <v-btn slot="activator" dark icon>
        <v-icon>mdi-history</v-icon>
      </v-btn>
      <history-list
        :entries="historyEntries"
        @delete-entry="deleteEntry($event)"
        @click-entry="setTags($event)"
      />
    </v-menu>
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
      :details-post="detailsPost"
      @open-post-details="openPostDetails"
      @close-details="detailsPost = null"
    />
    <!-- TODO: set has-(next|previous)-fullscreen-post -->
    <portal to="sidebar-suggestions">
      <v-subheader v-if="suggestedTags.length > 0">Tag suggestions</v-subheader>
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
import Suggestions from "../updated/dumb/Suggestions.vue";
import TagSearch from "../updated/smart/TagSearch";
import { blacklistService, historyService } from "@/services";
import HistoryList from "../updated/dumb/HistoryList.vue";
import { defineComponent } from "@vue/composition-api";

// TODO: reset first post on tag change

export default defineComponent({
  name: "PostsPage",
  components: {
    Posts,
    Suggestions,
    TagSearch,
    HistoryList,
  },
  data() {
    return {
      posts: [],
      fullscreenPost: null,
      detailsPost: null,
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
    "tags.length"() {
      this.posts = [];
      this.loadNextPage();
      historyService.addEntry(this.tags);
    },
  },
  computed: {
    historyEntries() {
      return historyService.entries;
    },
    // settingsIsPaginated() {
    //   return this.$store.getters[GETTERS.IS_PAGINATED_MODE];
    // },
    settingsPageSize() {
      return this.$store.getters[GETTERS.POST_FETCH_COUNT];
    },
    settingsSuggestedTagsCount() {
      return this.$store.getters[GETTERS.SUGGESTION_COUNT];
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
    tags() {
      return (this.$route.query.tags || "").split(" ").filter((t) => t);
    },
  },
  methods: {
    deleteEntry: (idx) => historyService.deleteEntry(idx),
    openPostDetails(postId) {
      this.detailsPost = this.posts.find((p) => p.id === postId);
    },
    addTag(tag) {
      this.setTags([...this.tags, tag]);
    },
    removeTag(tag) {
      this.setTags(this.tags.filter((t) => t !== tag));
    },
    setTags(tags) {
      updateRouterQuery(this.$router, {
        tags: tags.join(" "),
      });
    },
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
            tags: [`id:${postId}`],
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
          tags: this.tags,
          blacklist: blacklistService.tags,
          blacklistMode: blacklistService.mode,
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
        console.error(error);
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
});
</script>
