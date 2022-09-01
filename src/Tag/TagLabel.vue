<template>
  <v-chip :color="color" v-on="$listeners" v-bind="$attrs" :title="title">
    {{ tag.name }}
  </v-chip>
</template>

<script lang="ts">
import { getTagColorFromCategory } from "@/misc/util/utilities";
import { computed, defineComponent, PropType } from "vue";

export interface ITag {
  name: string;
  post_count?: number;
  category?: string;
}

export default defineComponent({
  inheritAttrs: false,
  props: {
    tag: {
      type: Object as PropType<ITag>,
      required: true,
    },
  },
  setup(props, context) {
    const color = computed(() => getTagColorFromCategory(props.tag.category));
    const title = computed(() => {
      const count = props.tag.post_count
        ? `\nPosts: ${props.tag.post_count}`
        : "";
      return `Name: ${props.tag.name}\nCategory: ${props.tag.category}${count}`;
    });

    return {
      color,
      title,
    };
  },
  // TODO: count?
});
</script>
