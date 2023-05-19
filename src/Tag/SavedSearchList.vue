<template>
  <v-list class="secondary">
    <div v-for="(item, i) in entries" :key="i">
      <v-list-item>
        <v-list-item-title>
          <v-text-field dense filled label="Name" type="text" v-model="item.name" hide-details />
          <TagLabel class="mx-1 my-2" :tag="{ name: tag }" v-for="(tag, idx) in item.tags" :key="idx" />
        </v-list-item-title>
        <v-list-item-action>
          <v-btn icon @click.stop="$emit('click-entry', item.tags)">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-action>
          <v-btn icon @click.stop="$emit('delete-entry', i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
        <v-divider class="mb-2" />
    </div>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import TagLabel from "./TagLabel.vue";

export default defineComponent({
  props: {
    entries: {
      type: Array as PropType<{ name: string; tags: string[] }[]>,
      required: true,
    },
  },
  components: { TagLabel },
});
</script>
