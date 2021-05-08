<template>
  <v-toolbar-items>
    <v-btn
      flat
      v-for="(option, index) in navigationItems"
      :key="index"
      :loading="option.loading"
      :to="option.to"
    >
      {{ option.name }}
    </v-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { navigationItems } from "../App/navigation";

export default defineComponent({
  setup() {
    return {
      navigationItems,
    };
  },
});
</script>
