<template>
  <v-card color="secondary">
    <v-subheader>Suggestions based on</v-subheader>
    <div>
      <template v-for="(item, i) in data">
        <div :key="i" color="secondary">
          <!-- <v-card-title>{{ item.category }}</v-card-title> -->
          <v-subheader>{{ item.category }}</v-subheader>
          <div class="ml-10">

          <div v-if="item.tags.length">
            <TagLabel
              v-for="(name, idx) in item.tags"
              :key="idx"
              :tag="{ name, category: item.category }"
              class="ma-1"
            />
            <span class="grey--text more" v-if="item.more">
              + {{ item.more }} more
            </span>
          </div>
          <div v-else>
            <i class="grey--text">None</i>
          </div>
          </div>
        </div>
      </template>
    </div>
  </v-card>
</template>

<script lang="ts">
import { FavoriteTagsResult } from "@/worker/AnalyzeService";
import { computed, defineComponent, PropType } from "@vue/composition-api";
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