<template>
  <v-chip :color="color" v-bind="$attrs" :title="title">
    {{ tag.name }}
  </v-chip>
</template>

<script setup lang="ts">
import { getTagColorFromCategory } from "@/misc/util/utilities";
import type { PropType } from "vue";
import { computed } from "vue";
import type { ITag } from "./ITag";

const props = defineProps({
  tag: {
    type: Object as PropType<ITag>,
    required: true,
  },
})

const color = computed(() => getTagColorFromCategory(props.tag.category));
const title = computed(() => {
  const count = props.tag.post_count
    ? `\nPosts: ${props.tag.post_count}`
    : "";
  return `Name: ${props.tag.name}\nCategory: ${props.tag.category}${count}`;
});

</script>
