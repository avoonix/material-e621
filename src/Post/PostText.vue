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
      <tag-with-menu v-for="artist in post.tags.artist" :key="artist" :tag="{ name: artist, category: 'artist' }" />
      <tag-with-menu v-for="pool in post.pools || []" :key="pool" :tag="{ name: `pool:${pool}`, category: 'pool' }" />
      <v-chip outlined class="mb-2 no-before-content">
        <v-icon>mdi-clock</v-icon>
        <span class="ml-2">
          <date-display :value="post.created_at" />
        </span>
      </v-chip>
    </div>
  </div>
</template>

<script lang="ts">
import DateDisplay from "@/ArtistDashboard/DateDisplay.vue";
import { getTagColorFromCategory } from "@/misc/util/utilities";
import TagWithMenu from "@/Tag/TagWithMenu.vue";
import { ScoredPost } from "@/worker/AnalyzeService";
import { Post } from "@/worker/api";
import prettyBytes from "pretty-bytes";
import { computed, defineComponent, PropType } from "vue";

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
    const score = computed(() => {
      if (isScoredPost(props.post)) {
        return props.post.__score;
      }
      return null;
    });
    return {
      fileSize,
      score,
      artistColor,
    };
  },
  components: { DateDisplay, TagWithMenu },
});
</script>
