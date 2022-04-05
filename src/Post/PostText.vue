<template>
  <div>
    <div>
      <v-chip outlined class="mr-2 mb-2 no-before-content">
        <v-icon>mdi-thumbs-up-down</v-icon>
        <span class="ml-2">
          {{ post.score.total }}
        </span>
      </v-chip>
      <v-chip outlined class="mr-2 mb-2 no-before-content">
        <v-icon>mdi-heart</v-icon>
        <span class="ml-2">
          {{ post.fav_count }}
        </span>
      </v-chip>
      <v-chip outlined class="mr-2 mb-2 no-before-content" v-if="score">
        <v-icon>mdi-counter</v-icon>
        <span class="ml-2">
          {{ score }}
        </span>
      </v-chip>
      <tag-menu
        v-for="artist in post.tags.artist"
        :key="artist"
        :tag="{ name: artist, category: 'artist' }"
      >
        <template #default="{ on }">
          <v-chip
            :color="artistColor"
            outlined
            class="mr-2 mb-2"
            v-on="on"
          >
            <v-icon>mdi-palette</v-icon>
            <span class="ml-2">
              {{ artist }}
            </span>
          </v-chip>
        </template>
      </tag-menu>
      <v-chip outlined class="mb-2 no-before-content">
        <v-icon>mdi-clock</v-icon>
        <span class="ml-2"> {{ relativeUploadDate }} ({{ uploadDate }}) </span>
      </v-chip>
    </div>
  </div>
</template>

<script lang="ts">
import { getTagColorFromCategory } from "@/misc/util/utilities";
import { ScoredPost } from "@/worker/AnalyzeService";
import { Post } from "@/worker/api";
import { computed, defineComponent, PropType } from "@vue/composition-api";
import { formatDistanceToNow, format, parse, parseISO } from "date-fns";
import prettyBytes from "pretty-bytes";
import TagMenu from "@/Tag/TagMenu.vue";

const isScoredPost = (post: any): post is ScoredPost => !!post.__score;

const artistColor = getTagColorFromCategory("artist");

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
      artistColor,
    };
  },
  components: { TagMenu },
});
</script>
