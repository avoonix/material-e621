<template>
  <v-card>
    <v-card-title>
      {{ date }}
    </v-card-title>
    <v-card-text>
      {{ entry.message }}
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        flat
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
import { computed, defineComponent, PropType } from "@vue/composition-api";
import { distanceInWordsToNow } from "date-fns";

export default defineComponent({
  props: {
    entry: {
      type: Object as PropType<IGitCommit>,
      required: true,
    },
  },
  setup(props, context) {
    const date = computed(() =>
      distanceInWordsToNow(props.entry.date, { addSuffix: true }),
    );
    return {
      date,
    };
  },
});
</script>
