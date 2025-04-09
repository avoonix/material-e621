<template>
  <v-timeline>
    <v-timeline-item v-for="(entry, idx) in commits" :key="idx" fill-dot :size="idx !== 0 ? 'small' : 'large'">
      <template v-slot:icon>
        <v-icon v-if="idx === 0">mdi-calendar-star</v-icon>
      </template>
      <commit-entry :entry="entry" />
    </v-timeline-item>
  </v-timeline>
</template>

<script setup lang="ts">
import { getGitInfo } from "@/misc/util/git";
import { computed, defineComponent } from "vue";
import CommitEntry from "./CommitEntry.vue";

// TODO: this was present in vue2
// inheritAttrs: false,

const props = defineProps({
  limit: {
    type: Number,
    default: 10,
  },
});

const commits = computed(() => getGitInfo().slice(0, props.limit));
</script>
