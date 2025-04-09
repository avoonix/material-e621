<template>
  <v-list density="compact">
    <template v-for="(tag, index) in tags" :key="index">
      <v-list-item density="compact">
        <div>
          <tag-label :tag="tag" />
        </div>
        <template #append class="ma-0">

          <div v-if="tag.post_count" class="text-grey text-caption mr-2">
            {{ tag.post_count }}
          </div>
          <template v-if="tag.category">
            <tag-favorite-button :category="tag.category" :name="tag.name" class="mr-2" />
            <tag-menu :tag="tag" />
          </template>
        </template>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
import TagLabel from "../Tag/TagLabel.vue";
import TagFavoriteButton from "@/Tag/TagFavoriteButton.vue";
import TagMenu from "@/Tag/TagMenu.vue";
import type { ITag } from "@/Tag/ITag";

export default defineComponent({
  components: {
    TagLabel,
    TagFavoriteButton,
    TagMenu,
  },
  props: {
    tags: {
      type: Array as PropType<ITag[]>,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
