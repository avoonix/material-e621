<template>
  <v-table class="text-caption" density="compact">
    <tbody>
      <tr align="right">
        <th>ID:</th>
        <td>{{ post.id }}</td>
      </tr>
      <tr align="right" v-if="post.tags.artist?.length">
        <th>Artist:</th>
        <td>
          <TagWithMenu small v-for="artist in post.tags.artist" :key="artist"
            :tag="{ name: artist, category: 'artist' }" />
        </td>
      </tr>
      <tr align="right" v-if="post.pools?.length">
        <th>Pools:</th>
        <td>
          <TagWithMenu small v-for="pool in post.pools" :key="pool" :tag="{ name: `pool:${pool}`, category: 'pool' }" />
        </td>
      </tr>
      <tr align="right">
        <th>Score:</th>
        <td>
          {{ post.score.total }}
          ({{ post.score.up }} up - {{ post.score.down }} down)
        </td>
      </tr>
      <tr align="right">
        <th>Favorites:</th>
        <td>{{ post.fav_count }}</td>
      </tr>
      <tr align="right">
        <th>File size:</th>
        <td>
          {{ fileSize }}
          ({{ post.file.size }} B)
        </td>
      </tr>
      <tr align="right">
        <th>Dimensions:</th>
        <td>
          {{ post.file.width }}x{{ post.file.height }} ({{ megapixel }} Megapixel)
        </td>
      </tr>
      <tr align="right">
        <th>Hash:</th>
        <td>{{ post.file.md5 }}</td>
      </tr>
      <tr align="right">
        <th>Rating:</th>
        <td>{{ post.rating }}</td>
      </tr>
      <tr align="right">
        <th>Sources:</th>
        <td>
          <a target="_blank" :href="source" v-for="(source, idx) in post.sources" :key="idx">
            {{ source }}
          </a>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import type { Post } from "@/worker/api";
import type { PropType } from "vue";
import { computed } from "vue";
import TagWithMenu from "@/Tag/TagWithMenu.vue";
import { prettyBytes } from "@/misc/util/prettyBytes";

const props = defineProps({
  post: {
    type: Object as PropType<Post>,
    required: true,
  },
});
const fileSize = computed(() => prettyBytes(props.post.file.size));
const megapixel = computed(() => Math.round(((props.post.file.width * props.post.file.height) / 1000000) * 100) / 100);
</script>
