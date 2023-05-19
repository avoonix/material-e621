<template>
  <v-list class="secondary">
    <v-list-item
      v-for="(item, i) in entries"
      :key="i"
      @click="$emit('click-entry', item)"
    >
      <v-list-item-title v-if="item.length">
        <TagLabel class="mx-1" :tag="{ name: tag }" v-for="(tag, idx) in item" :key="idx" />
      </v-list-item-title>
      <v-list-item-title v-else>
        <i>Empty query</i>
      </v-list-item-title>
      <v-list-item-action v-if="item.length">
        <v-btn icon @click.stop="addSavedSearch([...item], item.join(' '))">
          <v-icon>mdi-content-save-plus</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-action>
        <v-btn icon @click.stop="$emit('delete-entry', i)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
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
