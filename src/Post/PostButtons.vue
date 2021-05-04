<template>
  <fragment>
    <post-button
      :post="post"
      v-for="(button, idx) in buttons"
      :key="idx"
      :type="button"
      @open-post-details="$emit('open-post-details', $event)"
      @open-post-fullscreen="$emit('open-post-fullscreen', $event)"
    />
  </fragment>
</template>

<script lang="ts">
import { ButtonType } from "@/services/types";
import { Post } from "@/worker/api";
import { defineComponent, PropType } from "@vue/composition-api";
import PostButton from "./PostButton.vue";


export default defineComponent({
  components: { PostButton },
  props: {
    buttons: {
      type: Array as PropType<ButtonType[]>,
      required: true,
    },
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
  },
  setup(props, context) {
    return {};
  },
});
</script>
