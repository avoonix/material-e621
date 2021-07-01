<template>
  <v-btn icon @click="button.onClick" :loading="button.loading">
    <v-icon>{{ button.icon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { ButtonType } from "@/services/types";
import { openE6PostInStandaloneWindow } from "@/misc/util/url";
import { computed, defineComponent, PropType } from "@vue/composition-api";
import { postService } from "@/services";
import { usePostListManager } from "./postListManager";
import { EnhancedPost } from "@/worker/ApiService";

interface IButton {
  icon: string;
  onClick: () => void;
  loading?: boolean;
}

export default defineComponent({
  props: {
    type: {
      type: String as PropType<ButtonType>,
      required: true,
      validator: (v: any): v is ButtonType =>
        postService.allButtonTypes.indexOf(v) !== -1,
    },
    post: {
      type: Object as PropType<EnhancedPost>,
    },
  },
  setup(props, context) {
    const buttons = computed<{ [key in ButtonType]: IButton }>(() => ({
      info: {
        icon: "mdi-information",
        onClick: () => {
          if (props.post) context.emit("open-post-details", props.post.id);
        },
      },
      fullscreen: {
        icon: "mdi-fullscreen",
        onClick: () => {
          if (props.post) context.emit("open-post-fullscreen", props.post.id);
        },
      },
      external: {
        icon: "mdi-open-in-new",
        onClick: () => {
          if (props.post) openE6PostInStandaloneWindow(props.post.id);
        },
      },
      favorite: {
        icon: props.post?.is_favorited ? "mdi-heart" : "mdi-heart-outline",
        loading: props.post?.__meta.isFavoriteLoading || false,
        onClick: async () => {
          if (!props.post) return;
          context.emit("set-post-favorite", {
            postId: props.post.id,
            favorited: !props.post.is_favorited,
          } as Parameters<ReturnType<typeof usePostListManager>["setPostFavorite"]>["0"]);
        },
      },
      // TODO: download?
    }));

    const button = computed(() => buttons.value[props.type]);

    return {
      button,
    };
  },
});
</script>
