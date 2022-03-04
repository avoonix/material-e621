<template>
  <v-toolbar-items>
    <v-btn
      text
      v-for="(option, index) in navigationItems"
      :key="index"
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
