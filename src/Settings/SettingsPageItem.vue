<template>
  <v-card class="ma-3" color="secondary">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text class="text-left text-grey" v-if="description">
      {{ description }}
      <slot name="description" />
    </v-card-text>
    <v-col class="d-flex" v-if="isSwitch">
      <v-spacer style="flex-grow: 999 !important" />
      <span class="mr-3">
        <slot />
      </span>
    </v-col>
    <v-col class="d-flex" v-else-if="isSelect">
      <div class="ma-3 fill-width">
        <slot />
      </div>
    </v-col>
    <span v-else>
      <slot />
    </span>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

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
  setup(props) {
    const isSwitch = computed(() => props.switch);
    const isSelect = computed(() => props.select);
    return {
      isSwitch,
      isSelect,
    };
  },
});
</script>

<style scoped>
.fill-width {
  width: 100%;
}
</style>
