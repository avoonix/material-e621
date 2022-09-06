<template>
  <v-data-table :items="posts" :headers="headers" class="secondary-hover secondary">
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
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn :href="`https://e621.net/posts/${item.id}`" target="_blank" v-bind="attrs" v-on="on" icon>
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </template>
        <span>Open on e621.net</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn :href="`https://e621.net/post_versions?search[post_id]=${item.id}`" target="_blank" v-bind="attrs"
            v-on="on" icon>
            <v-icon>mdi-history</v-icon>
          </v-btn>
        </template>
        <span>View edits on e621.net</span>
      </v-tooltip>
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
      { text: "Rating", value: "rating", width: 0, sortable: false },
      { text: "Post ID", value: "id" },
      // { text: "Upvotes", value: "score.up" },
      { text: "Favorites", value: "fav_count" },
      { text: "Score", value: "score.total", cellClass: "text-no-wrap" },
      { text: "Comments", value: "comment_count", divider: true },
      // { text: "Downvotes", value: "score.down", divider: true },
      // { text: "Sources", value: "sources.length" },
      // { text: "General Tags", value: "tags.general.length" },
      { text: "Created", value: "created_at", cellClass: "text-no-wrap width-0" },
      { text: "Last Updated", value: "updated_at", cellClass: "text-no-wrap width-0", divider: true },
      { text: "", value: "buttons", sortable: false, cellClass: "text-no-wrap", width: 0 },
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
