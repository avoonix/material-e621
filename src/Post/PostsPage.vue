<template>
  <div>
    <portal to="toolbar">
      <div style="display: flex; align-items: center; flex-grow: 999;">
        <tag-search v-view-transition-name="'tagsearch'" style="flex: 1 1 auto" :tags="tags" @add-tag="addTag" @remove-tag="removeTag"
          @confirm-search="updateQuery() && onSearchClick()" label="Tags" />
        <v-btn icon @click="updateQuery() && onSearchClick()" :loading="loading">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-menu location="bottom left" max-height="300" offset-y transition="slide-y-transition"
          v-if="mdAndUp">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon>
              <v-icon>mdi-history</v-icon>
            </v-btn>
          </template>
          <history-list :entries="historyEntries" @delete-entry="removeHistoryEntry($event)"
            @click-entry="onHistoryEntryClick" />
        </v-menu>
      </div>
    </portal>
    <posts :posts="posts" :loading="loading" :has-previous="hasPrevious" @load-previous="loadPreviousPage()"
      @load-next="loadNextPage()" @open-post="openFullscreenPost" :fullscreen-post="fullscreenPost || undefined"
      @exit-fullscreen="fullscreenPost = null" @next-fullscreen-post="openNextFullscreenPost()"
      @previous-fullscreen-post="openPreviousFullscreenPost()" :has-previous-fullscreen-post="true"
      :has-next-fullscreen-post="true" :details-post="detailsPost || undefined" @open-post-details="openPostDetails"
      @close-details="detailsPost = null" @set-post-favorite="setPostFavorite($event)" />
    <!-- TODO: set has-(next|previous)-fullscreen-post -->
    <portal to="sidebar-suggestions">
      <div class="text-overline" v-if="hiddenPostCount > 0">Blacklisted posts hidden: {{ hiddenPostCount }}</div>
      <div class="text-overline" v-if="suggestedTags.length > 0">Tags on this page</div>
      <suggestions :tags="suggestedTags" />
    </portal>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useHistory } from "@/Post/historyManager";
import { usePostListManager } from "@/Post/postListManager";
import Posts from "@/Post/Posts.vue";
import { useRouterTagManager } from "@/Post/routerTagManager";
import { useAccountStore, useBlacklistStore, usePostsStore, useUrlStore } from "@/services";
import type { ITag } from "@/Tag/ITag";
import { debounce, isEqual } from "lodash";
import { onMounted, ref, toRaw, watch } from "vue";
import { useRouterQueryHelpers } from "../misc/util/utilities";
import HistoryList from "../Tag/HistoryList.vue";
import TagSearch from "../Tag/TagSearch.vue";
import { getAnalyzeService, getApiService } from "../worker/services";
import Suggestions from "./Suggestions.vue";
import { useDisplay } from "vuetify";

const { mdAndUp } = useDisplay();

const account = useAccountStore();
const blacklist = useBlacklistStore();
const postsStore = usePostsStore();
const { tags, addTag, removeTag, updateQuery, query, setTags } =
  useRouterTagManager();
const urlStore = useUrlStore();
const route = useRoute();

const {removeRouterQuery, updateRouterQuery} = useRouterQueryHelpers();

const {
  loadPreviousPage,
  loadNextPage,
  visiblePosts: posts,
  clearPosts,
  hiddenPostCount,
  fullscreenPost,
  detailsPost,
  loading,
  openPostDetails,
  openFullscreenPost,
  openNextFullscreenPost,
  openPreviousFullscreenPost,
  setPostFavorite,
  hasPrevious,
} = usePostListManager({
  getSavedPageNumber() {
    return Number(route.query.page) || 0;
  },
  savePageNumber(page) {
    console.log("save page number", page)
    if (page === 1 || !page) {
      removeRouterQuery(["page"]);
    } else {
      updateRouterQuery({
        page: String(page),
      });
    }
  },
  async loadPosts(page) {
    const service = await getApiService();
    const posts = await service.getPosts(toRaw({
      limit: toRaw(postsStore.postListFetchLimit),
      page,
      tags: toRaw(tags.value),
      blacklist: toRaw(blacklist.tags),
      blacklistMode: toRaw(blacklist.mode),
      auth: toRaw(account.auth),
      baseUrl: toRaw(urlStore.e621Url),
    }));
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
  const occurences = await service.getTagOccurrences(JSON.parse(JSON.stringify(posts.value))); // TODO: no json
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
    await removeRouterQuery(["page"]);
    clearPosts();
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

</script>
