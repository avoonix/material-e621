<template>
  <v-list>
    <v-list-item v-for="tag in tags" :key="tag.name">
      <v-list-item-title>
        <TagLabel :tag="tag" />
      </v-list-item-title>
      <template #append>
        <div v-if="tag.post_count" class="text-grey text-caption text-no-wrap">
          {{ tag.post_count }} Posts
        </div>
        <div v-if="tag.category">
          <TagMenu :tag="tag" />
        </div>
      </template>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import type { ITag } from "@/Tag/ITag";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import TagLabel from "@/Tag/TagLabel.vue";
import TagMenu from "@/Tag/TagMenu.vue";

export default defineComponent({
  props: {
    tags: {
      type: Array as PropType<ITag[]>,
      required: true,
    }
  },
  setup(props, context) {
    return {};
  },
  components: { TagLabel, TagMenu }
});
</script>
