import type { EnhancedPost } from "@/worker/ApiService";
import { getApiService } from "@/worker/services";
import { computed, ref, watch } from "vue";
import { useAccountStore, useSnackbarStore, useUrlStore, useBlacklistStore, usePostsStore } from "@/services";
import { BlacklistMode } from "@/services/types";
import { useRouter } from "vue-router";

interface IUsePostListManagerArgs {
  loadPosts(page: number, direction: "next" | "previous"): Promise<EnhancedPost[]>;

  getSavedPageNumber(): number;
  savePageNumber(id: number | null): void;
}

export const usePostListManager = ({
  loadPosts,
  getSavedPageNumber,
  savePageNumber,
}: IUsePostListManagerArgs) => {
  const snackbar = useSnackbarStore();
  const posts = ref<EnhancedPost[]>([]);
  const fullscreenPost = ref<EnhancedPost | null>(null);
  const detailsPost = ref<EnhancedPost | null>(null);
  const loading = ref(false);
  const urlStore = useUrlStore();
  const blacklistStore = useBlacklistStore();
  const postsStore = usePostsStore();
  const router = useRouter()

  const handleError = (error: any) => {
    const errorMessage = error?.message || String(error);
    snackbar.addMessage(errorMessage);
    console.log(error);
  };

  const setPostFavorite = async (args: {
    postId: number;
    favorited: boolean;
  }) => {
    const account = useAccountStore();
    const post = posts.value.find((p) => p.id === args.postId);
    if (!post) {
      return;
    }

    if (!account.auth) {
      snackbar.addMessage("Not logged in");
      router.push({ name: "AccountSettings" });
      return;
    }
    const service = await getApiService();
    const serviceArgs = {
      postId: post.id,
      auth: account.auth,
      proxyUrl: urlStore.proxyUrl,
    };
    try {
      post.__meta.isFavoriteLoading = true;
      if (args.favorited) {
        await service.favoritePost(serviceArgs);
      } else {
        await service.unfavoritePost(serviceArgs);
      }
      post.is_favorited = args.favorited;
    } catch (error: any) {
      handleError(error);
    } finally {
      post.__meta.isFavoriteLoading = false;
    }
  };

  const getPostCountToRemove = () => posts.value.length - postsStore.postListFetchLimit;

  const firstPageNumber = computed(() =>
    posts.value.length ? posts.value[0].__meta.pageNumber : getSavedPageNumber(),
  );

  const lastPageNumber = computed(() =>
    posts.value.length
      ? posts.value[posts.value.length - 1].__meta.pageNumber
      : getSavedPageNumber(),
  );

  const loadPreviousPage = async () => {
    if (loading.value) {
      return console.log("loadPreviousPage called, but already loading");
    }
    try {
      loading.value = true;
      const newPosts = await loadPosts(firstPageNumber.value - 1, "previous");
      const postCountToRemove = getPostCountToRemove();
      // newly uploaded posts cause old posts to shift pages, and duplicates are bad
      const newPostsFiltered = newPosts.filter(newP => !posts.value.find(existing => existing.id === newP.id))
      posts.value.unshift(...newPostsFiltered);
      posts.value.splice(
        posts.value.length - postCountToRemove,
        postCountToRemove,
      );
    } catch (error) {
      handleError(error);
    } finally {
      loading.value = false;
    }
  };
  const loadNextPage = async () => {
    if (loading.value) {
      return console.log("loadNextPage called, but already loading");
    }
    try {
      loading.value = true;
      const newPosts = await loadPosts(lastPageNumber.value + 1, "next");

      const postCountToRemove = getPostCountToRemove();
      posts.value.push(...newPosts);
      posts.value.splice(0, postCountToRemove);
    } catch (error) {
      handleError(error);
    } finally {
      loading.value = false;
    }
  };

  watch(
    posts,
    () => {
      savePageNumber(posts.value[0]?.__meta.pageNumber || null);
    },
    { deep: true },
  );

  const openPostDetails = (postId: number) => {
    detailsPost.value = posts.value.find((p) => p.id === postId) || null;
  };
  const isValidNextPost = (post: EnhancedPost) => {
    return !!post.file.url && !post.__meta.isBlacklisted;
  };
  const _openFullscreenPost =
    (offset: number) =>
      async (postId: number, depth: number): Promise<boolean> => {
        // returns whether post has been opened successfully
        const idx = posts.value.findIndex((p) => p.id === postId);
        let nextPostIdx = idx;
        do {
          nextPostIdx += offset;
        } while (
          posts.value[nextPostIdx] &&
          !isValidNextPost(posts.value[nextPostIdx]) &&
          offset
        );
        const nextPost = posts.value[nextPostIdx];
        if (nextPost) {
          fullscreenPost.value = nextPost;
          return true;
        } else {
          if (offset > 0) {
            await loadNextPage();
          } else if (offset < 0) {
            await loadPreviousPage();
          }
          if (depth <= 0) {
            const success = await _openFullscreenPost(offset)(postId, depth + 1);
            if (!success) {
              fullscreenPost.value = null; // no further posts
            }
            return success;
          } else {
            return false;
          }
        }
      };

  const openFullscreenPost = _openFullscreenPost(0);
  const openNextFullscreenPost = () =>
    fullscreenPost.value?.id &&
    _openFullscreenPost(1)(fullscreenPost.value.id, 0);
  const openPreviousFullscreenPost = () =>
    fullscreenPost.value?.id &&
    _openFullscreenPost(-1)(fullscreenPost.value.id, 0);

  const visiblePosts = computed(() => {
    const visibleAfterApplyingBlacklist = blacklistStore.mode === BlacklistMode.hide ? posts.value.filter(p => !p.__meta.isBlacklisted) : [...posts.value];
    const visibleAfterApplyingServerSideBlacklistSetting = blacklistStore.hideServerSideBlacklisted ? visibleAfterApplyingBlacklist.filter(p => !!p.file.url) : [...visibleAfterApplyingBlacklist];
    return visibleAfterApplyingServerSideBlacklistSetting;
  });
  const hiddenPostCount = computed(() => posts.value.length - visiblePosts.value.length);
  const clearPosts = () => posts.value = [];
  const hasPrevious = computed(() => posts.value.length !== 0 && posts.value[0].__meta.pageNumber > 1);

  return {
    loadPreviousPage,
    loadNextPage,
    visiblePosts,
    hiddenPostCount,
    fullscreenPost,
    detailsPost,
    loading,
    openPostDetails,
    openFullscreenPost,
    openNextFullscreenPost,
    openPreviousFullscreenPost,
    setPostFavorite,
    clearPosts,
    hasPrevious,
  };
};
