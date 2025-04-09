<template>
  <div class="d-flex flex-row fill-width">
    <div v-for="(col, idx) in matrix" :key="idx" class="d-flex flex-column fill-width" :style="{marginLeft: '2px', marginRight: '2px'}">
      <div v-for="(day, i) in col" :key="i" class="d-flex"
        :style="{ outline: `1px ${day.count ? 'solid' : 'dotted'} var(--v-secondary-base)`, marginTop: '2px', marginBottom: '2px' }">
        <v-tooltip location="bottom">
          <template #activator="{ props }">
            <div v-bind="props" :style="{ aspectRatio: '1', opacity: day.count / (max || 1) }"
              class="bg-primary fill-width" />
          </template>
          <span>{{day.count}} uploads on {{day.date}}</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { eachDayOfInterval, format, subDays } from "date-fns";
import { chunk } from "lodash";
import type { PropType } from "vue";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    heatmap: {
      type: Object as PropType<{
        [date: string]: number | undefined;
      }>,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    }
  },
  setup(props, context) {
    const matrix = computed(() => chunk(eachDayOfInterval({
      start: subDays(new Date(), 370),
      end: new Date(),
    }).map(date => ({ date: format(date, "PP p"), count: props.heatmap[format(date, "yyyy-MM-dd")] ?? 0 })), 7));

    return {
      matrix,
    };
  },
});
</script>
