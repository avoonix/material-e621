<template>
  <v-flex>
    <template v-for="tag in tags">
      <v-btn
        :key="tag"
        outline
        @click="toggleBlacklisted(tag)"
        :color="isBlacklisted(tag) ? 'red' : 'green'"
      >
        <v-icon left>
          {{ isBlacklisted(tag) ? "mdi-block-helper" : "mdi-check-decagram" }}
        </v-icon>
        {{ tag }}
      </v-btn>
    </template>
  </v-flex>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    tags: {
      type: Array,
      required: true,
    },
    blacklisted: {
      type: Array,
      required: true,
    },
  },
  setup(props, context) {
    const isBlacklisted = (tag: string) =>
      props.blacklisted.indexOf(tag) !== -1;
    const toggleBlacklisted = (tag: string) =>
      context.emit(isBlacklisted(tag) ? "remove-tag" : "add-tag", tag);

    return {
      isBlacklisted,
      toggleBlacklisted,
    };
  },
});
</script>
