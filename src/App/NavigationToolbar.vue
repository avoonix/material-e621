<template>
  <v-toolbar-items>
    <v-btn variant="text" v-for="(option, index) in navigationItems" :key="option.resolved" :to="option.to" :exact="option.exact">
      {{ option.name }}
    </v-btn>
  </v-toolbar-items>
</template>

<script setup lang="ts">
import { useNavigationItems } from "../App/navigation";

const navigationItems = useNavigationItems();
</script>
