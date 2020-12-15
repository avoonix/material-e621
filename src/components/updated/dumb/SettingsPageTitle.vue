<template>
  <v-toolbar :class="color">
    <v-btn icon exact :to="{ path: '/settings' }">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    color: {
      type: String,
    },
  },
};
</script>
