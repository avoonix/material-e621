<template>
  <v-menu location="bottom left" offset-y close-on-content-click :persistent="false" close-delay="0" v-if="tag.category">
    <template #activator="{ props }">
      <slot :props="props">
        <v-btn v-bind="props" icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </slot>
    </template>
    <tag-actions :category="tag.category" :name="tag.name" />
  </v-menu>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
import TagActions from "@/Tag/TagActions.vue";
import type { ITag } from "./ITag";

export default defineComponent({
  components: {
    TagActions,
  },
  props: {
    tag: {
      type: Object as PropType<ITag>,
      required: true,
    },
  },
  setup(props, context) {
    return {};
  },
});
</script>
