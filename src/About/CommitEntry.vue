<template>
  <v-card color="secondary">
    <v-card-title>
      <div>
        <h3 class="text-h5">
          {{ entry.message.subject }}
        </h3>
        <div class="text-caption">
          {{ date }}
        </div>
      </div>
    </v-card-title>
    <v-card-text v-if="entry.message.body" class="pre text-body-1" >{{entry.message.body}}</v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        text
        :href="`https://github.com/avoonix/material-e621/commit/${entry.hash}`"
        color="primary"
      >
        <v-icon left> mdi-open-in-new </v-icon>
        View commit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { IGitCommit } from "@/misc/util/git";
import { computed, defineComponent, PropType } from "vue";
import { formatDistanceToNow } from "date-fns";

export default defineComponent({
  props: {
    entry: {
      type: Object as PropType<IGitCommit>,
      required: true,
    },
  },
  setup(props, context) {
    const date = computed(() =>
      formatDistanceToNow(props.entry.date, { addSuffix: true }),
    );
    return {
      date,
    };
  },
});
</script>

<style scoped>
.pre {
  white-space: pre-wrap;
}
</style>
