<template>
  <v-btn icon @click="button.onClick">
    <v-icon>{{ button.icon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { ButtonType } from "@/services/types";
import { openE6PostInStandaloneWindow } from "@/misc/util/url";
import { Post } from "@/worker/api";
import { computed, defineComponent, PropType } from "@vue/composition-api";

interface IButton {
  icon: string;
  onClick: () => void;
}

// export const togglePostFavorite = {
//   data() {
//     return { favoritePostLoading: false, favoritePostLoadingTimeout: 0 };
//   },
//   watch: {
//     post(val, prev) {
//       if (val.custom_favorited_by_user != prev.custom_favorited_by_user) {
//         this.favoritePostLoading = false;
//       }
//     },
//   },
//   methods: {
//     togglePostFavorite(post) {
//       this.favoritePostLoading = true;
//       clearTimeout(this.favoritePostLoadingTimeout);
//       this.favoritePostLoadingTimeout = setTimeout(() => {
//         this.favoritePostLoading = false;
//       }, 30000);
//       const action = post.custom_favorited_by_user ? "destroy" : "create";
//       this.$store.dispatch("favoritePost", {
//         action: action,
//         postId: post.id,
//       });
//     },
//   },
// };

export default defineComponent({
  props: {
    type: {
      type: String as PropType<ButtonType>,
      required: true,
      validator: (v: any): v is ButtonType =>
        (["external", "info", "fullscreen"] as ButtonType[]).indexOf(v) !== -1,
    },
    post: {
      type: Object as PropType<Post>,
    },
  },
  setup(props, context) {
    const buttons: { [key in ButtonType]: IButton } = {
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
      // TODO:
      // fav/unfav, download
    };

    const button = computed(() => buttons[props.type]);

    return {
      button,
    };
  },
});
</script>
