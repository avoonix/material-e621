<template>
  <a
    :href="href"
    v-on="$listeners"
    v-bind="$attrs"
    target="_blank"
    class="accent--text"
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
