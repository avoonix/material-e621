<template>
  <v-list class="secondary">
    <v-list-item
      v-for="(item, i) in entries"
      :key="i"
      @click="$emit('click-entry', item)"
    >
      <v-list-item-title>
        {{ item }}
      </v-list-item-title>
      <v-list-item-action>
        <v-btn icon @click.stop="$emit('delete-entry', i)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";

export default defineComponent({
  props: {
    entries: {
      type: Array as PropType< readonly (readonly string[])[]>,
      required: true,
    },
  },
});
</script>
