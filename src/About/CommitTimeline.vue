<template>
  <v-timeline v-bind="$attrs">
    <v-timeline-item
      v-for="(entry, idx) in commits"
      :key="idx"
      fill-dot
      :small="idx !== 0"
      :large="idx === 0"
    >
      <v-icon slot="icon" v-if="idx === 0">mdi-calendar-star</v-icon>
      <commit-entry :entry="entry" />
    </v-timeline-item>
  </v-timeline>
</template>

<script lang="ts">
import { getGitInfo } from "@/misc/util/git";
import { computed, defineComponent } from "@vue/composition-api";
import CommitEntry from "./CommitEntry.vue";

export default defineComponent({
  inheritAttrs: false,
  components: { CommitEntry },
  props: {
    limit: {
      type: Number,
      default: 10,
    },
  },
  setup(props, context) {
    const commits = computed(() => getGitInfo().slice(0, props.limit));
    return {
      commits,
    };
  },
});
</script>
