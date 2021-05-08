<template>
  <v-list dense>
    <v-list-tile>
      <v-list-tile-content>ID</v-list-tile-content>
      <v-list-tile-content class="align-end">
        {{ post.id }}
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile>
      <v-list-tile-content>Score</v-list-tile-content>
      <v-list-tile-content class="align-end">
        {{ post.score.total }}
        ({{ post.score.up }} up - {{ post.score.down }} down)
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile>
      <v-list-tile-content>Favorites</v-list-tile-content>
      <v-list-tile-content class="align-end">
        {{ post.fav_count }}
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile>
      <v-list-tile-content>File size</v-list-tile-content>
      <v-list-tile-content class="align-end">
        {{ fileSize }}
        ({{ post.file.size }} B)
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile>
      <v-list-tile-content>Dimensions</v-list-tile-content>
      <v-list-tile-content class="align-end">
        {{ post.file.width }}x{{ post.file.height }} ({{ megapixel }} Megapixel)
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script lang="ts">
import { Post } from "@/worker/api";
import { computed, defineComponent, PropType } from "@vue/composition-api";
import prettyBytes from "pretty-bytes";

export default defineComponent({
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
  },
  setup(props) {
    const fileSize = computed(() => prettyBytes(props.post.file.size));
    const megapixel = computed(
      () =>
        Math.round(
          ((props.post.file.width * props.post.file.height) / 1000000) * 100,
        ) / 100,
    );
    return {
      megapixel,
      fileSize,
    };
  },
});
</script>
