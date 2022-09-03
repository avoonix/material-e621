<template>
  <v-data-table :items="posts" :headers="headers" class="secondary-hover secondary">
    <template #item.created_at="{ item }">
      <DateDisplay :value="item.created_at" />
    </template>
    <template #item.updated_at="{ item }">
      <DateDisplay :value="item.updated_at" />
    </template>
    <template #item.rating="{ item }">
      <v-chip :color="getColor(item.rating)" dark>
        {{ item.rating }}
      </v-chip>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Post } from "@/worker/api";
import { computed, defineComponent, PropType } from "vue";
import { DataTableHeader } from "vuetify";
import DateDisplay from "./DateDisplay.vue";
import { getColor } from "@/Post/stripeColor";

export default defineComponent({
  props: {
    posts: {
      type: Array as PropType<Post[]>,
      required: true,
    }
  },
  setup(props, context) {
    const headers = computed<DataTableHeader<Post>[]>(() => [
      { text: "Post ID", value: "id" },
      { text: "Created", value: "created_at", cellClass: "text-no-wrap" },
      { text: "Last Updated", value: "updated_at", cellClass: "text-no-wrap" },
      { text: "Upvotes", value: "score.up" },
      { text: "Downvotes", value: "score.down" },
      { text: "Total Score", value: "score.total" },
      { text: "Rating", value: "rating" },
      { text: "Favorites", value: "fav_count" },
      { text: "Comments", value: "comment_count" },
      // { text: "Sources", value: "sources.length" },
      { text: "General Tags", value: "tags.general.length" },
      // { text: "Species Tags", value: "tags.species.length" },
      // { text: "Character Tags", value: "tags.character.length" },
      // { text: "Copyright Tags", value: "tags.copyright.length" },
    ]);
    return {
      headers,
      getColor
    };
  },
  components: { DateDisplay, }
});
</script>
