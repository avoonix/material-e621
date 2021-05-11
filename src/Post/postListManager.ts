import { Post } from "@/worker/api";
import { computed, ref, watch } from "@vue/composition-api";

interface IUsePostListManagerArgs {
  loadPosts(args: {
    postsBefore?: number | undefined;
    postsAfter?: number | undefined;
  }): Promise<Post[]>;

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
  const posts = ref<Post[]>([]);
  const fullscreenPost = ref<Post | null>(null);
  const detailsPost = ref<Post | null>(null);
  const loading = ref(false);

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
  const _openFullscreenPost = (offset: number) => (postId: number) => {
    const idx = posts.value.findIndex((p) => p.id === postId);
    fullscreenPost.value = posts.value[idx + offset] || null;
    // this.fullscreenPost =
    //   this.posts.find((p) => p.id === postId) ||
    //   (await (async () => {
    //     const service = await getApiService();
    //     const posts = await service.getPosts({
    //       limit: 1,
    //       tags: [`id:${postId}`],
    //       removeBlacklisted: false,
    //     });
    //     return posts[0] || null;
    //   })());
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
  };
};
