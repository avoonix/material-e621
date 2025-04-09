<template>
  <div>
    <post-button
      :post="post"
      v-for="(button, idx) in buttons"
      :key="idx"
      :type="button"
      @open-post-details="$emit('open-post-details', $event)"
      @open-post-fullscreen="$emit('open-post-fullscreen', $event)"
      @set-post-favorite="$emit('set-post-favorite', $event)"
    />
  </div>
</template>

<script lang="ts">
import type { ButtonType } from "@/services/types";
import { Post } from "@/worker/api";
import type { EnhancedPost } from "@/worker/ApiService";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import PostButton from "./PostButton.vue";

export default defineComponent({
  components: { PostButton },
  props: {
    buttons: {
      type: Array as PropType<ButtonType[]>,
      required: true,
    },
    post: {
      type: Object as PropType<EnhancedPost>,
      required: true,
    },
  },
  setup(props, context) {
    return {};
  },
});
</script>
