<template>
  <div>
    <portal to="toolbar">
      <v-flex style="display: flex; align-items: center">
        <tag-search style="flex: 1 1 auto" :tags="tags" @add-tag="addTag" @remove-tag="removeTag"
          @confirm-search="updateQuery() && onSearchClick()" label="Tags" />
        <v-btn icon @click="updateQuery() && onSearchClick()" :loading="loading">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-menu bottom left max-height="300" offset-y transition="slide-y-transition"
          v-if="$vuetify.breakpoint.mdAndUp">
          <template #activator="{ on }">
            <v-btn v-on="on" icon>
              <v-icon>mdi-history</v-icon>
            </v-btn>
          </template>
          <history-list :entries="historyEntries" @delete-entry="removeHistoryEntry($event)"
            @click-entry="onHistoryEntryClick" />
        </v-menu>
      </v-flex>
    </portal>
    <posts :posts="posts" :loading="loading" @load-previous="loadPreviousPage()" @load-next="loadNextPage()"
      @open-post="openFullscreenPost" :fullscreen-post="fullscreenPost || undefined"
      @exit-fullscreen="fullscreenPost = null" @next-fullscreen-post="openNextFullscreenPost()"
      @previous-fullscreen-post="openPreviousFullscreenPost()" :has-previous-fullscreen-post="true"
      :has-next-fullscreen-post="true" :details-post="detailsPost || undefined" @open-post-details="openPostDetails"
      @close-details="detailsPost = null" @set-post-favorite="setPostFavorite($event)" />
    <!-- TODO: set has-(next|previous)-fullscreen-post -->
    <portal to="sidebar-suggestions">
      <v-subheader v-if="suggestedTags.length > 0">Tags on this page</v-subheader>
      <suggestions :tags="suggestedTags" />
    </portal>
  </div>
</template>

<script lang="ts">
import { useRoute } from "@/misc/util/router";
import { useHistory } from "@/Post/historyManager";
import { usePostListManager } from "@/Post/postListManager";
import Posts from "@/Post/Posts.vue";
import { useRouterTagManager } from "@/Post/routerTagManager";
import { useAccountStore, useBlacklistStore, usePostsStore } from "@/services";
import { ITag } from "@/Tag/ITag";
import { debounce, isEqual } from "lodash";
import { defineComponent, onMounted, ref, watch } from "vue";
import { removeRouterQuery, updateRouterQuery } from "../misc/util/utilities";
import HistoryList from "../Tag/HistoryList.vue";
import TagSearch from "../Tag/TagSearch.vue";
import { getAnalyzeService, getApiService } from "../worker/services";
import Suggestions from "./Suggestions.vue";

export default defineComponent({
  components: {
    Posts,
    Suggestions,
    TagSearch,
    HistoryList,
  },
  setup(props, context) {
    const account = useAccountStore();
    const blacklist = useBlacklistStore();
    const postsStore = usePostsStore();
    const { tags, addTag, removeTag, updateQuery, query, setTags } =
      useRouterTagManager();

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
      setPostFavorite,
    } = usePostListManager({
      getSavedFirstPostId() {
        return Number(route.query.first_post); // TODO: handle null
      },
      getSettingsPageSize() {
        return postsStore.postListFetchLimit;
      },
      saveFirstPostId(id) {
        console.log("save first post", id)
        if (!id) {
          removeRouterQuery(["first_post"]);
          return;
        }
        updateRouterQuery({
          first_post: String(id),
        });
      },
      async loadPosts({ postsBefore, postsAfter }) {
        const service = await getApiService();
        const posts = await service.getPosts({
          limit: postsStore.postListFetchLimit,
          postsBefore,
          postsAfter,
          tags: tags.value,
          blacklist: blacklist.tags,
          blacklistMode: blacklist.mode,
          auth: account.auth,
        });
        return posts;
      },
    });

    onMounted(() => {
      loadNextPage();
    });

    const { historyEntries, addHistoryEntry, removeHistoryEntry } =
      useHistory();

    const suggestedTags = ref<ITag[]>([]);
    const suggestTags = async () => {
      const settingsSuggestedTagsCount = postsStore.sidebarSuggestionLimit;
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

    const onSearchClick = debounce(async () => {
      if (!loading.value) {
        await removeRouterQuery(["first_post"]);
        posts.value = [];
        loadNextPage();
      }
    }, 50);

    watch(
      query,
      (cur, prev) => {
        if (!isEqual(cur, prev)) {
          console.log("query updated", { prev, cur });
          onSearchClick();
        }
      },
      { immediate: false },
    );

    const onHistoryEntryClick = (entry: string[]) => {
      setTags(entry);
      updateQuery();
    };

    watch(posts, () => {
      console.log("posts changed", posts.value.length)
      addHistoryEntry(tags.value);
      suggestTags();
    }, { deep: true, });

    return {
      updateQuery,
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
      setPostFavorite,
    };
  },
});
</script>
