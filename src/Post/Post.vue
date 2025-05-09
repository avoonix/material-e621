<template>
  <v-card :id="'post_' + post.id" color="secondary">
    <div :class="[blacklistClasses]">
      <post-preview
        :file="post.file"
        :preview="post.preview"
        :sample="post.sample"
        @open-post="setClicked"
      />
    </div>
    <v-card-text>
      <post-text :post="post" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <post-buttons
        :buttons="buttons"
        :post="post"
        @open-post-details="$emit('open-post-details', $event)"
        @open-post-fullscreen="setClicked"
        @set-post-favorite="$emit('set-post-favorite', $event)"
      />
    </v-card-actions>
    <div :class="stripeColor" :style="{ height: '5px' }" />
  </v-card>
</template>

<script lang="ts">
import { useBlacklistClasses } from "@/misc/util/blacklist";
import { useBlacklistStore, usePostsStore } from "@/services";
import type { EnhancedPost } from "@/worker/ApiService";
import type { PropType } from "vue";
import { computed, defineComponent } from "vue";
import PostButtons from "./PostButtons.vue";
import PostPreview from "./PostPreview.vue";
import PostText from "./PostText.vue";
import { useStripeColor } from "./stripeColor";

export default defineComponent({
  components: {
    PostButtons,
    PostPreview,
    PostText,
  },
  props: {
    post: {
      type: Object as PropType<EnhancedPost>,
      required: true,
    },
  },
  setup(props, context) {
    const blacklist = useBlacklistStore();
    const posts = usePostsStore();
    const postIsBlacklisted = computed(
      () => Boolean(props.post?.__meta.isBlacklisted), // TODO: types
    );
    const { classes: blacklistClasses } = useBlacklistClasses({
      mode: blacklist.mode,
      postIsBlacklisted,
    });
    const { stripeColor } = useStripeColor(props);

    const setClicked = () => {
      context.emit("open-post", props.post.id);
    };

    const buttons = computed(() => posts.buttons);

    return {
      blacklistClasses,
      stripeColor,
      setClicked,
      buttons,
    };
  },
});
</script>
