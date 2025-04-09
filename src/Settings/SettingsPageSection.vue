<template>
  <v-list-item v-view-transition-name="`settings-toolbar-${section}`" :to="{ path: '/settings/' + section }">
    <template #prepend>
      <v-avatar :color="color">
        <v-icon>{{ icon }}</v-icon>
      </v-avatar>
    </template>

    <v-list-item-title>
      {{ title }}
    </v-list-item-title>
    <slot />

    <template #append>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
    },
    section: {
      type: String,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
  },
});
</script>
