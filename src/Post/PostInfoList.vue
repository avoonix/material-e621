<template>
  <v-list dense class="secondary">
    <v-list-item>
      <v-list-item-content>ID</v-list-item-content>
      <v-list-item-content class="align-end">
        {{ post.id }}
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="post.tags.artist?.length">
      <v-list-item-content>Artist</v-list-item-content>
      <v-list-item-content class="align-end">
        <div>
          <TagWithMenu small v-for="artist in post.tags.artist" :key="artist" :tag="{ name: artist, category: 'artist' }" />
        </div>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="post.pools?.length">
      <v-list-item-content>Pools</v-list-item-content>
      <v-list-item-content class="align-end">
        <div>
          <TagWithMenu small v-for="pool in post.pools" :key="pool" :tag="{ name: `pool:${pool}`, category: 'pool' }" />
        </div>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>Score</v-list-item-content>
      <v-list-item-content class="align-end">
        {{ post.score.total }}
        ({{ post.score.up }} up - {{ post.score.down }} down)
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>Favorites</v-list-item-content>
      <v-list-item-content class="align-end">
        {{ post.fav_count }}
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>File size</v-list-item-content>
      <v-list-item-content class="align-end">
        {{ fileSize }}
        ({{ post.file.size }} B)
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>Dimensions</v-list-item-content>
      <v-list-item-content class="align-end">
        {{ post.file.width }}x{{ post.file.height }} ({{ megapixel }} Megapixel)
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>Hash</v-list-item-content>
      <v-list-item-content class="align-end">
        {{ post.file.md5 }}
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>Rating</v-list-item-content>
      <v-list-item-content class="align-end">
        {{ post.rating }}
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>Sources</v-list-item-content>
      <v-list-item-content class="align-end">
        <a target="_blank" :href="source" v-for="(source, idx) in post.sources" :key="idx">
          {{ source }}
        </a>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Post } from "@/worker/api";
import { computed, defineComponent, PropType } from "vue";
import prettyBytes from "pretty-bytes";
import TagWithMenu from "@/Tag/TagWithMenu.vue";

export default defineComponent({
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
  },
  setup(props) {
    const fileSize = computed(() => prettyBytes(props.post.file.size));
    const megapixel = computed(() => Math.round(((props.post.file.width * props.post.file.height) / 1000000) * 100) / 100);
    return {
      megapixel,
      fileSize,
    };
  },
  components: { TagWithMenu }
});
</script>
