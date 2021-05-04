<template>
  <v-card :id="'post_' + post.id" color="">
    <div @click="setClicked" v-ripple="true" :class="[blacklistClasses]">
      <fixed-aspect-ratio-box :ratio="post.file.height / post.file.width">
        <post-preview
          :file="post.file"
          :preview="post.preview"
          :sample="post.sample"
        />
      </fixed-aspect-ratio-box>
    </div>
    <v-card-title primary-title>
      <post-text :post="post" />
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <post-buttons
        :buttons="buttons"
        :post="post"
        @open-post-details="$emit('open-post-details', $event)"
        @open-post-fullscreen="setClicked"
      />
    </v-card-actions>
    <div :class="stripeColor" :style="{ height: '5px' }" />
  </v-card>
</template>

<script lang="ts">
import { blacklistService, postService } from "@/services";
import { computed, defineComponent, PropType } from "@vue/composition-api";
import { useBlacklistClasses } from "@/utilities/blacklist";
import FixedAspectRatioBox from "./FixedAspectRatioBox.vue";
import PostPreview from "./PostPreview.vue";
import PostText from "./PostText.vue";
import { useStripeColor } from "./stripeColor";
import { Post } from "@/worker/api";
import PostButtons from "./PostButtons.vue";

export default defineComponent({
  components: {
    PostButtons,
    FixedAspectRatioBox,
    PostPreview,
    PostText,
  },
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
  },
  setup(props, context) {
    const postIsBlacklisted = computed(
      () => Boolean((props as any).post?._postCustom?.isBlacklisted), // TODO: types
    );
    const { classes: blacklistClasses } = useBlacklistClasses({
      mode: blacklistService.mode,
      postIsBlacklisted,
    });
    const { stripeColor } = useStripeColor(props);

    const setClicked = () => {
      context.emit("open-post", props.post.id);
    };

    const buttons = computed(() => postService.buttons);

    return {
      blacklistClasses,
      stripeColor,
      setClicked,
      buttons,
    };
  },
});
</script>
