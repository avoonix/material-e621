<template>
  <div class="text-left">
    <div class="text-h5">
      <v-chip outlined class="no-before-content">
        <v-icon>mdi-thumbs-up-down</v-icon>
        <span class="ml-3">
          {{ post.score.total }}
        </span>
      </v-chip>
      <v-chip outlined class="ml-2 no-before-content">
        <v-icon>mdi-heart</v-icon>
        <span class="ml-3">
          {{ post.fav_count }}
        </span>
      </v-chip>
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
    const uploadDate = computed(() => format(date.value, "PP p"));
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
