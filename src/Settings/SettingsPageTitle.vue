<template>
  <v-toolbar :color="color" v-view-transition-name="`settings-toolbar-${section}`">
    <v-btn icon exact :to="{ name: 'Settings' }">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title class="text-left">
      {{ title }}
    </v-toolbar-title>
    <v-spacer />
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
    },
    color: {
      type: String,
    },
    section: {
      type: String,
    },
  },
  setup() {
    onMounted(() => {
      window.scrollTo({ top: 0 }); // not pretty but works 
    });
  },
});
</script>
