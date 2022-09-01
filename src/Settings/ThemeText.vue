<template>
  <div
    class="text"
    :style="{
      width,
      backgroundColor: color,
    }"
  >
    <fixed-aspect-ratio-box :ratio="ratio" />
  </div>
</template>

<script lang="ts">
import FixedAspectRatioBox from "@/Post/FixedAspectRatioBox.vue";
import { defineComponent } from "vue";

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
      default: "grey",
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
