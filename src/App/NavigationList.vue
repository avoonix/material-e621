<template>
  <v-list subheader class="pa-0 mt-3">
    <v-list-item
      v-for="(option, index) in navigationItems"
      :key="index"
      ripple
      router
      :to="option.to"
      :exact="option.exact"
    >
      <v-list-item-action>
        <v-icon>{{ option.icon }}</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>{{ option.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { navigationItems } from "../App/navigation";

export default defineComponent({
  setup() {
    return {
      navigationItems,
    };
  },
});
</script>
