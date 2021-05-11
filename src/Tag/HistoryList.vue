<template>
  <v-list>
    <v-list-tile
      v-for="(item, i) in entries"
      :key="i"
      @click="$emit('click-entry', item)"
    >
      <!-- avatar
        
        @click="setSearch(item)" -->
      <!-- <tag-list-display v-if="item" :tags="item" /> -->
      <v-list-tile-title>
        {{ item }}
      </v-list-tile-title>
      <v-list-tile-action>
        <v-btn icon @click.stop="$emit('delete-entry', i)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";

export default defineComponent({
  props: {
    entries: {
      type: Array as PropType<string[][]>,
      required: true,
    },
  },
});
</script>
