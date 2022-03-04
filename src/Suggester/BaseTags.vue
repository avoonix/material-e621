<template>
  <v-card color="secondary">
    <v-card-title>Your suggestions are based on these tags</v-card-title>
    <v-card-text>
      <template v-for="(item, i) in data">
        <v-card :key="i" color="secondary">
          <v-card-title>{{ item.category }}</v-card-title>
          <v-card-text>
            {{ item.tags }}
            <span class="grey--text" v-if="item.more">
              + {{ item.more }} more
            </span>
          </v-card-text>
        </v-card>
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { FavoriteTagsResult } from "@/worker/AnalyzeService";
import { computed, defineComponent, PropType } from "@vue/composition-api";

export default defineComponent({
  props: {
    counts: {
      type: Object as PropType<FavoriteTagsResult["counts"]>,
      required: true,
    },
  },
  setup(props, context) {
    const data = computed(() => {
      return Object.entries(props.counts).map(([category, counts]) => {
        const data = Object.keys(counts!);
        return {
          category,
          tags: data.slice(0, 10),
          more: Math.max(0, data.length - 10),
        };
      });
    });
    return {
      data,
    };
  },
});
</script>
