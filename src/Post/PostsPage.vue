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
        @delete-entry="removeHistoryEntry($event)"
        @click-entry="tags = $event"
      />
    </v-menu>
    <posts
      :posts="posts"
      :loading="loading"
      @load-previous="loadPreviousPage()"
      @load-next="loadNextPage()"
      @open-post="openFullscreenPost"
      :fullscreen-post="fullscreenPost"
      @exit-fullscreen="fullscreenPost = null"
      @next-fullscreen-post="openNextFullscreenPost()"
      @previous-fullscreen-post="openPreviousFullscreenPost()"
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

<script lang="ts">
import Posts from "@/components/Posts.vue";
import { getApiService, getAnalyzeService } from "../worker/services";
import {
  updateRouterQuery,
  getTagColorFromCategory,
} from "../utilities/utilities";
import Suggestions from "./Suggestions.vue";
import TagSearch from "../components/updated/smart/TagSearch.vue";
import { blacklistService, postService } from "@/services";
import HistoryList from "../components/updated/dumb/HistoryList.vue";
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import { usePostListManager } from "@/Post/postListManager";
import { useRouterTagManager } from "@/Post/routerTagManager";
import { useHistory } from "@/Post/historyManager";
import router from "@/router";
import { ITag } from "@/components/updated/dumb/TagLabel.vue";

// TODO: reset first post on tag change

export default defineComponent({
  components: {
    Posts,
    Suggestions,
    TagSearch,
    HistoryList,
  },
  setup(props, context) {
    const { tags, addTag, removeTag } = useRouterTagManager();

    const {
      loadPreviousPage,
      loadNextPage,
      posts,
      fullscreenPost,
      detailsPost,
      loading,
      openPostDetails,
      openFullscreenPost,
      openNextFullscreenPost,
      openPreviousFullscreenPost,
    } = usePostListManager({
      getSavedFirstPostId() {
        return Number(router.currentRoute.query.first_post); // TODO: handle null
      },
      getSettingsPageSize() {
        return postService.postListFetchLimit;
      },
      saveFirstPostId(id) {
        updateRouterQuery(router, {
          first_post: String(id),
        });
      },
      async loadPosts({ postsBefore, postsAfter }) {
        const service = await getApiService();
        const posts = await service.getPosts({
          limit: postService.postListFetchLimit,
          postsBefore,
          postsAfter,
          tags: tags.value,
          blacklist: blacklistService.tags,
          blacklistMode: blacklistService.mode,
        });
        return posts;
      },
    });

    onMounted(() => {
      loadNextPage();
    });

    const {
      historyEntries,
      addHistoryEntry,
      removeHistoryEntry,
    } = useHistory();

    watch(
      () => tags.value.length,
      () => {
        posts.value = [];
        loadNextPage();
        addHistoryEntry(tags.value);
      },
    );

    const suggestedTags = ref<ITag[]>([]);
    const suggestTags = async () => {
      const settingsSuggestedTagsCount = postService.sidebarSuggestionLimit;
      if (!posts.value.length) {
        suggestedTags.value = [];
        return;
      }
      const service = await getAnalyzeService();
      const occurences = await service.getTagOccurrences(posts.value);
      // TODO: handle slicing and mapping in worker
      suggestedTags.value = occurences.sorted
        .slice(0, settingsSuggestedTagsCount)
        .map(
          (t) =>
            ({
              name: t.name,
              category: t.category,
              post_count: t.count,
              // text: t.name,
              // count: t.count,
              // color: getTagColorFromCategory(t.category),
            } as ITag),
        );
    };

    watch(
      () => posts.value,
      () => {
        suggestTags();
      },
    );

    return {
      suggestedTags,
      loadPreviousPage,
      loadNextPage,
      posts,
      fullscreenPost,
      detailsPost,
      loading,
      tags,
      historyEntries,
      addHistoryEntry,
      removeHistoryEntry,
      openPostDetails,
      openFullscreenPost,
      openNextFullscreenPost,
      openPreviousFullscreenPost,
      addTag,
      removeTag,
    };
  },
});
</script>
