<template>
  <v-virtual-scroll :items="entries" height="260" item-height="48">
    <template v-slot:default="{ item, index }">
      <v-list-item @click="$emit('click-entry', item)">
        <v-list-item-title v-if="item.length">
          <TagLabel class="mx-1" :tag="{ name: tag }" v-for="(tag, idx) in item" :key="idx" />
        </v-list-item-title>
        <v-list-item-title v-else>
          <i>Empty query</i>
        </v-list-item-title>
        <template #append>
          <v-btn icon @click.stop="addSavedSearch([...item], item.join(' '))" v-if="item.length">
            <v-icon>mdi-content-save-plus</v-icon>
          </v-btn>
          <v-btn icon @click.stop="$emit('delete-entry', index)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </template>
  </v-virtual-scroll>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
import TagLabel from "./TagLabel.vue";
import { useSavedSearchStore } from "@/services";

export default defineComponent({
  props: {
    entries: {
      type: Array as PropType<readonly (readonly string[])[]>,
      required: true,
    },
  },
  components: { TagLabel },
  setup() {
    const savedSearch = useSavedSearchStore();

    return {
      addSavedSearch: (tags: string[], name: string) => savedSearch.addEntry(tags, name),
    }
  }
});
</script>
