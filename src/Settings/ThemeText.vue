<template>
  <div
    class="text"
    :style="{
      width,
      height,
      backgroundColor: color,
    }"
  >
    <fixed-aspect-ratio-box :ratio="ratio" />
  </div>
</template>

<script lang="ts">
import FixedAspectRatioBox from "@/Post/FixedAspectRatioBox.vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  components: { FixedAspectRatioBox },
  props: {
    width: {
      type: [Number, String],
      required: true,
    },
    ratio: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    return {};
  },
});
</script>

<style scoped>
.text {
  position: relative;
  border-radius: 2px;
}
</style>
