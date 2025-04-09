<template>
  <v-main :style="`background-color: ${backgroundColor} !important; border-color: ${backgroundColor} !important;`">
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { useAppearanceStore } from "@/services";
import { computed } from "vue";
const appearance = useAppearanceStore();

const backgroundColor = computed(() => appearance.backgroundColor);
</script>
