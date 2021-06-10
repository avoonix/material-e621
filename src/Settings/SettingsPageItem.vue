<template>
  <v-card class="ma-3" color="secondary">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text class="text-xs-left grey--text" v-if="description">
      {{ description }}
      <slot name="description" />
    </v-card-text>
    <v-flex class="d-flex" v-if="this.switch">
      <v-spacer style="flex-grow: 999 !important" />
      <span class="mr-3">
        <slot />
      </span>
    </v-flex>
    <v-flex class="d-flex" v-else-if="this.select">
      <span class="ma-3">
        <slot />
      </span>
    </v-flex>
    <span v-else>
      <slot />
    </span>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    switch: {
      type: Boolean,
      default: false,
    },
    select: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
