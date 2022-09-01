<template>
  <div
    class="aspect-ratio-box"
    :style="{ 'padding-top': `calc(${ratio} * 100%)` }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    ratio: {
      type: Number,
      required: true,
    },
  },
  setup(props, context) {
    return {};
  },
});
</script>

<style lang="scss">
.aspect-ratio-box {
  height: 0;
  overflow: hidden;
  position: relative;

  & > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
