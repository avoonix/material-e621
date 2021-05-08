<template>
  <v-list subheader class="pa-0 mt-3">
    <v-list-tile
      v-for="(option, index) in navigationItems"
      :key="index"
      ripple
      router
      :to="option.to"
      :exact="option.exact"
      avatar
    >
      <v-list-tile-action>
        <v-icon>{{ option.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ option.name }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
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
