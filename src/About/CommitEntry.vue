<template>
  <v-card>
    <v-card-title>
      <div>
        <h3 class="text-h5">
          {{ entry.message.subject }}
        </h3>
        <div class="text-caption">
          {{ date }} by {{ entry.author }}
        </div>
      </div>
    </v-card-title>
    <v-card-text v-if="entry.message.body" class="pre text-body-1">{{ entry.message.body }}</v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" :href="`https://github.com/avoonix/material-e621/commit/${entry.hash}`" color="primary">
        <v-icon start> mdi-open-in-new </v-icon>
        View commit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { IGitCommit } from "@/misc/util/git";
import type { PropType } from "vue";
import { computed } from "vue";
import { formatDistanceToNow } from "date-fns";

const props = defineProps({
  entry: {
    type: Object as PropType<IGitCommit>,
    required: true,
  },
});

const date = computed(() =>
  formatDistanceToNow(props.entry.date, { addSuffix: true }),
);
</script>

<style scoped>
.pre {
  white-space: pre-wrap;
}
</style>
