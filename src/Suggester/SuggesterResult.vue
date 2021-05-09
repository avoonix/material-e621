<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center ref="container">
        <div v-if="result">
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
          <portal to="sidebar-suggestions">
            <base-tags :counts="result.counts" />
          </portal>
        </div>
        <div v-else>
          <logo type="loader" />
          <span v-if="progress">{{ progress.message }}</span>
          <v-progress-linear
            v-if="progress"
            :value="progress.progress * 100"
            :indeterminate="progress.indeterminate"
          />
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
} from "@vue/composition-api";
import router from "@/router";
import { FavoriteTagsResult, IProgressEvent } from "@/worker/AnalyzeService";
import { getAnalyzeService } from "@/worker/services";
import Logo from "../components/updated/dumb/Logo.vue";
import * as Comlink from "comlink";
import BaseTags from "./BaseTags.vue";
import { usePostListManager } from "@/Post/postListManager";
import { updateRouterQuery } from "@/utilities/utilities";
import Posts from "@/components/Posts.vue";
import { postService } from "@/services";

export default defineComponent({
  metaInfo: {
    title: "Suggestions",
  },
  components: {
    Logo,
    BaseTags,
    Posts,
  },
  setup(props, context) {
    const progress = ref<IProgressEvent>();

    const username = computed<string>(() =>
      router.currentRoute.query?.name?.toString(),
    );

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

    // TODO: use weights
    const weights = computed<any>(() => {
      const entries: any[] = Object.entries((router as any).currentRoute.query);
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
        Comlink.proxy((progressEvent) => {
          progress.value = progressEvent;
        }),
      );
      await nextTick();
      await loadNextPage();
    };

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
        if (!result.value) {
          throw new Error("no tags available");
        }
        // const service = await getApiService();
        // const posts = await service.getPosts({
        //   limit: size,
        //   postsBefore,
        //   postsAfter,
        //   tags: tags.value,
        //   blacklist: blacklistService.tags,
        //   blacklistMode: blacklistService.mode,
        // });
        // return posts;
        const service = await getAnalyzeService();
        const posts = await service.suggestPosts(
          result.value,
          weights.value,
          postService.postListFetchLimit,
          { postsBefore, postsAfter },
          Comlink.proxy((progressEvent) => {
            console.log(progressEvent); // TODO
            // progress.value = progressEvent;
          }),
        );
        return posts;
      },
    });

    watchEffect(() => {
      analyze(username.value);
    });

    return {
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
    };
  },
});
</script>
