<template>
  <v-toolbar :class="color">
    <v-btn icon exact :to="{ path: '/settings' }">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer/>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    title: {
      type: String,
    },
    color: {
      type: String,
    },
  },
});
</script>
