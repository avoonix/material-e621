import router from "@/router";
import { accountService, snackbarService } from "@/services";
import { EnhancedPost } from "@/worker/ApiService";
import { getApiService } from "@/worker/services";
import { computed, ref, watch } from "@vue/composition-api";
import Vue from "vue";

interface IUsePostListManagerArgs {
  loadPosts(args: {
    postsBefore?: number | undefined;
    postsAfter?: number | undefined;
  }): Promise<EnhancedPost[]>;

  getSettingsPageSize(): number;

  getSavedFirstPostId(): number;
  saveFirstPostId(id: number | null): void;
}

export const usePostListManager = ({
  loadPosts,
  getSavedFirstPostId,
  saveFirstPostId,
  getSettingsPageSize,
}: IUsePostListManagerArgs) => {
  const posts = ref<EnhancedPost[]>([]);
  const fullscreenPost = ref<EnhancedPost | null>(null);
  const detailsPost = ref<EnhancedPost | null>(null);
  const loading = ref(false);

  const setPostFavorite = async (args: {
    postId: number;
    favorited: boolean;
  }) => {
    const post = posts.value.find((p) => p.id === args.postId);
    if (!post) {
      return;
    }

    if (!accountService.auth) {
      snackbarService.addMessage("Not logged in");
      const { appRouter } = await import("@/misc/util/router");
      appRouter.push({ name: "AccountSettings" });
      return;
    }
    const service = await getApiService();
    const serviceArgs = {
      postId: post.id,
      auth: accountService.auth,
    };
    try {
      Vue.set(post.__meta, "isFavoriteLoading", true);
      if (args.favorited) {
        await service.favoritePost(serviceArgs);
      } else {
        await service.unfavoritePost(serviceArgs);
      }
    } catch (error: any) {
      const errorMessage = error.message || String(error);
      snackbarService.addMessage(errorMessage);
    } finally {
      Vue.set(post.__meta, "isFavoriteLoading", false);
    }
    Vue.set(post, "is_favorited", args.favorited);
  };

  const getPostCountToRemove = () => posts.value.length - getSettingsPageSize();

  const firstPostId = computed(() =>
    posts.value.length ? posts.value[0].id : getSavedFirstPostId(),
  );
  const lastPostId = computed(() =>
    posts.value.length
      ? posts.value[posts.value.length - 1].id
      : getSavedFirstPostId() + 1,
  );

  const loadPreviousPage = async () => {
    try {
      loading.value = true;
      const newPosts = await loadPosts({
        postsAfter: firstPostId.value,
      });
      const postCountToRemove = getPostCountToRemove();
      posts.value.unshift(...newPosts);
      posts.value.splice(
        posts.value.length - postCountToRemove,
        postCountToRemove,
      );
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  const loadNextPage = async () => {
    try {
      loading.value = true;
      const newPosts = await loadPosts({
        postsBefore: lastPostId.value,
      });

      const postCountToRemove = getPostCountToRemove();
      posts.value.push(...newPosts);
      posts.value.splice(0, postCountToRemove);
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  watch(posts, () => {
    saveFirstPostId(posts.value[0]?.id || null);
  });

  const openPostDetails = (postId: number) => {
    detailsPost.value = posts.value.find((p) => p.id === postId) || null;
  };
  const isValidNextPost = (post: EnhancedPost) => {
    return !!post.file.url;
  };
  const _openFullscreenPost = (offset: number) => async (postId: number) => {
    const idx = posts.value.findIndex((p) => p.id === postId);
    let nextPostIdx = idx;
    do {
      nextPostIdx += offset;
    } while (
      posts.value[nextPostIdx] &&
      !isValidNextPost(posts.value[nextPostIdx]) &&
      offset
    );
    fullscreenPost.value = posts.value[nextPostIdx] || null;

    if (!fullscreenPost.value) {
      if (offset > 0) {
        await loadNextPage();
      } else if (offset < 0) {
        await loadPreviousPage();
      }
    }
  };

  const openFullscreenPost = _openFullscreenPost(0);
  const openNextFullscreenPost = () =>
    fullscreenPost.value?.id && _openFullscreenPost(1)(fullscreenPost.value.id);
  const openPreviousFullscreenPost = () =>
    fullscreenPost.value?.id &&
    _openFullscreenPost(-1)(fullscreenPost.value.id);

  return {
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
};
