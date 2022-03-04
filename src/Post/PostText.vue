<template>
  <div class="text-left">
    <div class="text-h5">
      <v-icon>mdi-thumbs-up-down</v-icon>
      {{ post.score.total }} &bull;
      <v-icon>mdi-heart</v-icon>
      {{ post.fav_count }} &bull;
      <v-icon>mdi-file</v-icon>
      {{ post.file.ext.toUpperCase() }} ({{ fileSize }})
      <span v-if="score">
        <v-icon>mdi-counter</v-icon>
        {{ score }}
      </span>
    </div>
    <span class="grey--text">
      {{ relativeUploadDate }} ({{ uploadDate }})
    </span>
  </div>
</template>

<script lang="ts">
import { ScoredPost } from "@/worker/AnalyzeService";
import { Post } from "@/worker/api";
import { computed, defineComponent, PropType } from "@vue/composition-api";
import { formatDistanceToNow, format, parse, parseISO } from "date-fns";
import prettyBytes from "pretty-bytes";

const isScoredPost = (post: any): post is ScoredPost => !!post.__score;

export default defineComponent({
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
  },
  setup(props, context) {
    const fileSize = computed(() => prettyBytes(props.post.file.size));
    const date = computed(() => parseISO(props.post.created_at));
    const relativeUploadDate = computed(() =>
      formatDistanceToNow(date.value, { addSuffix: true }),
    );
    const uploadDate = computed(() =>
      format(date.value, "PP p"),
    );
    // post.__score
    const score = computed(() => {
      if (isScoredPost(props.post)) {
        return props.post.__score;
      }
      return null;
    });

    return {
      fileSize,
      relativeUploadDate,
      uploadDate,
      score,
    };
  },
});
</script>
