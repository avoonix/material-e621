<template>
  <v-card>
    <div class="text-overline">Suggestions based on</div>
    <div>
      <template v-for="(item, i) in data" :key="i">
        <div  color="secondary">
          <!-- <v-card-title>{{ item.category }}</v-card-title> -->
          <div class="text-overline">{{ item.category }}</div>
          <div class="ml-10">

          <div v-if="item.tags.length">
            <TagLabel
              v-for="(name, idx) in item.tags"
              :key="idx"
              :tag="{ name, category: item.category }"
              class="ma-1"
            />
            <span class="text-grey more" v-if="item.more">
              + {{ item.more }} more
            </span>
          </div>
          <div v-else>
            <i class="text-grey">None</i>
          </div>
          </div>
        </div>
      </template>
    </div>
  </v-card>
</template>

<script lang="ts">
import type { FavoriteTagsResult } from "@/worker/AnalyzeService";
import type { PropType } from "vue";
import { computed, defineComponent } from "vue";
import TagLabel from "@/Tag/TagLabel.vue";

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
  components: { TagLabel },
});
</script>

<style scoped>
.more {
  white-space: nowrap;
}
</style>