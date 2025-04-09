<template>
  <v-col>
    <template v-for="tag in tags"  :key="tag">
      <v-btn
      class="ma-1"
       
        variant="outlined"
        @click="toggleBlacklisted(tag)"
        :color="isBlacklisted(tag) ? 'red' : 'green'"
      >
        <v-icon start>
          {{ isBlacklisted(tag) ? "mdi-block-helper" : "mdi-check-decagram" }}
        </v-icon>
        {{ tag }}
      </v-btn>
    </template>
  </v-col>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    tags: {
      type: Array as PropType<string[]>,
      required: true,
    },
    blacklisted: {
      type: Array as PropType<string[][]>,
      required: true,
    },
  },
  setup(props, context) {
    const findTag = (tag: string) => (tags: string[]) => tags.length === 1 && tags[0] === tag
    // only count as blacklist if every occurence (= one row in the e621 blacklist) is blacklisted
    const isBlacklisted = (tag: string) =>
      !!props.blacklisted.find(findTag(tag));

    const toggleBlacklisted = (tag: string) => {
      const index = props.blacklisted.findIndex(findTag(tag));
      if (index !== -1) {
        context.emit("remove-tag", index, tag)
      } else {
        context.emit("add-tag", tag);
      }
    }

    return {
      isBlacklisted,
      toggleBlacklisted,
    };
  },
});
</script>
