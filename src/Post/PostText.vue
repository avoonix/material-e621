<template>
  <div>
    <div class="headline">
      <v-icon>mdi-thumbs-up-down</v-icon>
      {{ post.score.total }} &bull;
      <v-icon>mdi-heart</v-icon>
      {{ post.fav_count }} &bull;
      <v-icon>mdi-file</v-icon>
      {{ post.file.ext.toUpperCase() }} ({{ fileSize }})
    </div>
    <span class="grey--text">
      {{ relativeUploadDate }} ({{ uploadDate }})
    </span>
  </div>
</template>

<script lang="ts">
import { Post } from "@/worker/api";
import { computed, defineComponent, PropType } from "@vue/composition-api";
import { distanceInWordsToNow, format, parse } from "date-fns";
import prettyBytes from "pretty-bytes";

export default defineComponent({
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
  },
  setup(props, context) {
    const fileSize = computed(() => prettyBytes(props.post.file.size));
    const date = computed(() => parse(props.post.created_at));
    const relativeUploadDate = computed(() =>
      distanceInWordsToNow(date.value, { addSuffix: true }),
    );
    const uploadDate = computed(() =>
      format(date.value, "MMMM D, YYYY h:mm A"),
    );

    return {
      fileSize,
      relativeUploadDate,
      uploadDate,
    };
  },
});
</script>
