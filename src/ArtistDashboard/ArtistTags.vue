<template>
  <v-list color="secondary">
    <v-list-item v-for="tag in tags" :key="tag.name">
      <v-list-item-title>
        <TagLabel :tag="tag" />
      </v-list-item-title>
        <v-list-item-action
          v-if="tag.post_count"
          class="grey--text text-caption text-no-wrap"
        >
          {{ tag.post_count }} Posts
        </v-list-item-action>
        <v-list-item-action v-if="tag.category">
          <TagMenu :tag="tag" />
        </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { ITag } from "@/Tag/ITag";
import { defineComponent, PropType } from "vue";
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
