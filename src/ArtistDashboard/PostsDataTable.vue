<template>
  <v-data-table :items="posts" :headers="headers">
    <template #item.score.total="{ item }">
      {{item.score.total}} <span class="half-opacity-text">({{item.score.up}} - {{item.score.down}})</span>
    </template>
    <template #item.created_at="{ item }">
      <DateDisplay :value="item.created_at" />
    </template>
    <template #item.updated_at="{ item }">
      <DateDisplay :value="item.updated_at" />
    </template>
    <template #item.rating="{ item }">
      <v-icon :color="getColor(item.rating)">mdi-circle-medium</v-icon>
    </template>
    <template #item.buttons="{ item }">
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-btn :href="`${urlStore.e621Url}posts/${item.id}`" target="_blank" v-bind="props" icon>
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </template>
        <span>Open on e621.net</span>
      </v-tooltip>
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-btn :href="`${urlStore.e621Url}post_versions?search[post_id]=${item.id}`" target="_blank"
            v-bind="props" icon>
            <v-icon>mdi-history</v-icon>
          </v-btn>
        </template>
        <span>View edits on e621.net</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import type { Post } from "@/worker/api";
import type { PropType } from "vue";
import { computed, defineComponent } from "vue";
import type { DataTableHeader } from "vuetify";
import DateDisplay from "./DateDisplay.vue";
import { getColor } from "@/Post/stripeColor";
import { useUrlStore } from "@/services";

export default defineComponent({
  props: {
    posts: {
      type: Array as PropType<Post[]>,
      required: true,
    }
  },
  setup(props, context) {
    const headers = computed<DataTableHeader<Post>[]>(() => [
      { title: "Rating", value: "rating", width: 0, sortable: false },
      { title: "Post ID", value: "id" },
      { title: "Favorites", value: "fav_count" },
      { title: "Score", value: "score.total", cellClass: "text-no-wrap" },
      { title: "Comments", value: "comment_count", divider: true },
      { title: "Created", value: "created_at", cellClass: "text-no-wrap width-0" },
      { title: "Last Updated", value: "updated_at", cellClass: "text-no-wrap width-0", divider: true },
      { title: "", value: "buttons", sortable: false, cellClass: "text-no-wrap", width: 0 },
    ]);

    const urlStore = useUrlStore();

    return {
      headers,
      getColor,
      urlStore,
    };
  },
  components: { DateDisplay, }
});
</script>
