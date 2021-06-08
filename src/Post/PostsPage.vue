<template>
  <div>
    <portal to="toolbar">
      <v-flex style="display: flex; align-items: center">
        <tag-search
          style="flex: 1 1 auto"
          :tags="tags"
          @add-tag="addTag"
          @remove-tag="removeTag"
          label="Tags"
        />
        <v-btn icon @click="onSearchClick" :loading="loading">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-menu
          bottom
          left
          max-height="300"
          lazy
          offset-y
          transition="slide-y-transition"
        >
          <v-btn slot="activator" icon>
            <v-icon>mdi-history</v-icon>
          </v-btn>
          <history-list
            :entries="historyEntries"
            @delete-entry="removeHistoryEntry($event)"
            @click-entry="onHistoryEntryClick"
          />
        </v-menu>
      </v-flex>
    </portal>
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
import Posts from "@/Post/Posts.vue";
import { getApiService, getAnalyzeService } from "../worker/services";
import { removeRouterQuery, updateRouterQuery } from "../misc/util/utilities";
import Suggestions from "./Suggestions.vue";
import TagSearch from "../Tag/TagSearch.vue";
import { accountService, blacklistService, postService } from "@/services";
import HistoryList from "../Tag/HistoryList.vue";
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import { usePostListManager } from "@/Post/postListManager";
import { useRouterTagManager } from "@/Post/routerTagManager";
import { useHistory } from "@/Post/historyManager";
import router from "@/router";
import { ITag } from "@/Tag/TagLabel.vue";
import { useRoute } from "@/misc/util/router";

export default defineComponent({
  components: {
    Posts,
    Suggestions,
    TagSearch,
    HistoryList,
  },
  setup(props, context) {
    const { tags, addTag, removeTag } = useRouterTagManager();

    const route = useRoute();

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
        return Number(route.query.first_post); // TODO: handle null
      },
      getSettingsPageSize() {
        return postService.postListFetchLimit;
      },
      saveFirstPostId(id) {
        if (!id) {
          removeRouterQuery(router, ["first_post"]);
          return;
        }
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
          auth: accountService.auth,
        });
        return posts;
      },
    });

    onMounted(() => {
      loadNextPage();
    });

    const { historyEntries, addHistoryEntry, removeHistoryEntry } =
      useHistory();

    watch(posts, () => {
      addHistoryEntry(tags.value);
    });

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
            } as ITag),
        );
    };

    watch(
      () => posts.value,
      () => {
        suggestTags();
      },
    );

    const onSearchClick = () => {
      removeRouterQuery(router, ["first_post"]);
      posts.value = [];
      loadNextPage();
    };

    const onHistoryEntryClick = (entry: string[]) => {
      tags.value = [...entry];
      onSearchClick();
    };

    return {
      onHistoryEntryClick,
      onSearchClick,
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
