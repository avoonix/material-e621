<template>
  <v-toolbar :class="color">
    <v-btn
      icon
      :to="{ path: '/settings', query: $store.state.routerModule.query }"
      ><v-icon>mdi-arrow-left</v-icon></v-btn
    >
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
