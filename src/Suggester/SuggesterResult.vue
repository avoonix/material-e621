<template>
  <v-container class="fill-height">
    <v-row align-center>
      <v-col class="text-center" ref="container">
        <div v-if="result">
          <posts :posts="posts" :loading="loading" :has-previous="hasPrevious" @load-previous="loadPreviousPage()"
            @load-next="loadNextPage()" @open-post="openFullscreenPost" :fullscreen-post="fullscreenPost || undefined"
            @exit-fullscreen="fullscreenPost = null" @next-fullscreen-post="openNextFullscreenPost()"
            @previous-fullscreen-post="openPreviousFullscreenPost()" :has-previous-fullscreen-post="true"
            :has-next-fullscreen-post="true" :details-post="detailsPost || undefined"
            @open-post-details="openPostDetails" @close-details="detailsPost = null"
            @set-post-favorite="setPostFavorite($event)" />
          <portal to="sidebar-suggestions">
            <div class="text-overline" v-if="hiddenPostCount > 0">Blacklisted posts hidden: {{ hiddenPostCount }}</div>
            <progress-message v-if="listProgress" :value="listProgress" />
            <base-tags :counts="result.counts" />
          </portal>
        </div>
        <div v-else>
          <progress-message :value="progress" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch, toRaw, } from "vue";
import type { FavoriteTagsResult, IProgressEvent } from "@/worker/AnalyzeService";
import { getAnalyzeService } from "@/worker/services";
import * as Comlink from "comlink";
import BaseTags from "./BaseTags.vue";
import { usePostListManager } from "@/Post/postListManager";
import { useRouterQueryHelpers } from "@/misc/util/utilities";
import Posts from "@/Post/Posts.vue";
import { useRoute } from "vue-router";
import ProgressMessage from "./ProgressMessage.vue";
import { useAccountStore, useBlacklistStore, usePostsStore, useUrlStore } from "@/services";
import { useHead } from "@unhead/vue";

useHead({ title: "Suggestions", });

const blacklist = useBlacklistStore();

const { removeRouterQuery, updateRouterQuery } = useRouterQueryHelpers();

const postsStore = usePostsStore();
const account = useAccountStore();
const route = useRoute();
const progress = ref<IProgressEvent>();
const listProgress = ref<IProgressEvent | null>(null);

const username = computed<string>(() => route.query?.name?.toString());

const keys = [
  "general",
  "artist",
  "copyright",
  "character",
  "species",
  "meta",
  "lore",
  "invalid",
];

const weights = computed<any>(() => {
  const entries: any[] = Object.entries((route as any).query);
  const newEntries = entries
    .filter(([key]) => keys.includes(key))
    .map(([key, value]) => [key, Number(value) || 0]);
  return Object.fromEntries(newEntries) as any;
});

const result = ref<FavoriteTagsResult | null>(null);

const analyze = async (username: string) => {
  const service = await getAnalyzeService();
  result.value = await service.getFavoriteTags(
    username,
    urlStore.e621Url,
    Comlink.proxy((progressEvent) => {
      progress.value = progressEvent;
    }),
  );
  await nextTick();
  await loadNextPage();
};

const urlStore = useUrlStore();

const {
  loadPreviousPage,
  loadNextPage,
  visiblePosts: posts,
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
  async loadPosts(page, direction) {
    if (!result.value) {
      throw new Error("no tags available");
    }
    try {
      const service = await getAnalyzeService();
      const posts = await service.suggestPosts(
        toRaw(result.value),
        toRaw(weights.value),
        toRaw(postsStore.postListFetchLimit),
        { page: toRaw(page), direction: toRaw(direction) },
        toRaw(account.auth),
        toRaw(urlStore.e621Url),
        Comlink.proxy((progressEvent) => {
          listProgress.value = progressEvent;
        }),
        toRaw(blacklist.tags),
        toRaw(blacklist.mode),
      );
      return posts;
    } finally {
      listProgress.value = null;
    }
  },
});

watch(
  username,
  () => {
    analyze(username.value);
  },
  {
    immediate: true,
  },
);
</script>
