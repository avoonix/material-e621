<template>
  <a
    :href="href"
    v-bind="$attrs"
    target="_blank"
    class="text-accent"
    rel="noopener"
  >
    <slot>{{ href }}</slot>
  </a>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  inheritAttrs: false,
  props: {
    href: {
      type: String,
      default: "",
    },
  },
});
</script>
