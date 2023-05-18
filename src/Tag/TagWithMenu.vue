<template>
  <TagMenu :tag="tag">
    <template #default="{ on }">
      <v-chip :color="color" outlined class="mr-2 mb-2" v-on="on" :small="small">
        <v-icon v-if="icon">{{ icon }}</v-icon>
        <span :class="{ 'ml-2': icon }">
          {{ tag.name }}
        </span>
      </v-chip>
    </template>
  </TagMenu>
</template>

<script lang="ts">
import { getTagColorFromCategory, getTagIconFromCategory } from "@/misc/util/utilities";
import { computed, defineComponent, PropType } from "vue";
import { ITag } from "./ITag";
import TagMenu from "./TagMenu.vue";

export default defineComponent({
  inheritAttrs: false,
  props: {
    tag: {
      type: Object as PropType<ITag>,
      required: true,
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const color = computed(() => getTagColorFromCategory(props.tag.category));
    const icon = computed(() => getTagIconFromCategory(props.tag.category));
    return {
      color,
      icon,
    };
  },
  components: { TagMenu }
});
</script>
