<template>
  <v-list-item :to="{ path: '/settings/' + section }">
    <v-list-item-avatar>
      <v-avatar :color="color">
        <v-icon>{{ icon }}</v-icon>
      </v-avatar>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>
        {{ title }}
      </v-list-item-title>
      <slot />
    </v-list-item-content>
    <v-list-item-action>
      <v-icon> mdi-chevron-right </v-icon>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

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
