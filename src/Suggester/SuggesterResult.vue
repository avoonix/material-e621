<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center ref="container">
        <div v-if="result">
          <posts
            :posts="posts"
            :loading="loading"
            @load-previous="loadPreviousPage()"
            @load-next="loadNextPage()"
            @open-post="openFullscreenPost"
            :fullscreen-post="fullscreenPost || undefined"
            @exit-fullscreen="fullscreenPost = null"
            @next-fullscreen-post="openNextFullscreenPost()"
            @previous-fullscreen-post="openPreviousFullscreenPost()"
            :has-previous-fullscreen-post="true"
            :has-next-fullscreen-post="true"
            :details-post="detailsPost || undefined"
            @open-post-details="openPostDetails"
            @close-details="detailsPost = null"
            @set-post-favorite="setPostFavorite($event)"
          />
          <portal to="sidebar-suggestions">
            <progress-message v-if="listProgress" :value="listProgress" />
            <base-tags :counts="result.counts" />
          </portal>
        </div>
        <div v-else>
          <progress-message :value="progress" />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  ref,
  watchEffect,
  watch,
} from "vue";
import { FavoriteTagsResult, IProgressEvent } from "@/worker/AnalyzeService";
import { getAnalyzeService } from "@/worker/services";
import * as Comlink from "comlink";
import BaseTags from "./BaseTags.vue";
import { usePostListManager } from "@/Post/postListManager";
import { updateRouterQuery } from "@/misc/util/utilities";
import Posts from "@/Post/Posts.vue";
import { useRoute } from "@/misc/util/router";
import ProgressMessage from "./ProgressMessage.vue";
import { useAccountStore, usePostsStore, useUrlStore } from "@/services";

export default defineComponent({
  metaInfo: {
    title: "Suggestions",
  },
  components: {
    BaseTags,
    Posts,
    ProgressMessage,
  },
  setup(props, context) {
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
        updateRouterQuery({
          first_post: String(id),
        });
      },
      async loadPosts({ postsBefore, postsAfter }) {
        if (!result.value) {
          throw new Error("no tags available");
        }
        try {
          const service = await getAnalyzeService();
          const posts = await service.suggestPosts(
            result.value,
            weights.value,
            postsStore.postListFetchLimit,
            { postsBefore, postsAfter },
            account.auth,
            urlStore.e621Url,
            Comlink.proxy((progressEvent) => {
              listProgress.value = progressEvent;
            }),
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

    watchEffect(() => {
      console.log(
        posts.value,
        posts.value.map((p) => p.id),
      );
    });

    return {
      listProgress,
      result,
      progress,
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
    };
  },
});
</script>
