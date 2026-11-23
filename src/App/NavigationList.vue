<template>
  <v-list class="pa-0 mt-3">
    <v-list-item v-for="(option, index) in navigationItems" :key="option.resolved" :to="option.to" :exact="option.exact">
      <template #prepend>
        <v-icon>{{ option.icon }}</v-icon>
      </template>

      <v-list-item-title>{{ option.name }}</v-list-item-title>

    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useNavigationItems } from "../App/navigation";

const navigationItems = useNavigationItems();
</script>
