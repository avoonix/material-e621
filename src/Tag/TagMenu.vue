<template>
  <v-menu
    bottom
    offset-y
    left
    attach
    close-on-content-click
    close-on-click
    close-delay="0"
    v-if="tag.category"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-btn v-on="on" icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </slot>
    </template>
    <tag-actions :category="tag.category" :name="tag.name" />
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import TagActions from "@/Tag/TagActions.vue";
import { ITag } from "./ITag";

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
