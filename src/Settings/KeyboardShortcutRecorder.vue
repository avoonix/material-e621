<template>
  <v-btn block @click="toggleRecording" :color="recording ? 'red' : 'primary'">
    <v-icon start :class="{ blinking: recording }"> mdi-circle </v-icon>
    {{ recording ? "type something" : "record keystrokes" }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Mousetrap from "mousetrap";

export default defineComponent({
  props: {},
  setup(props, context) {
    const recording = ref(false);
    const toggleRecording = () => {
      recording.value = !recording.value;
      if (recording.value)
        Mousetrap.record(function (sequence) {
          if (!recording.value) return;
          recording.value = false;
          context.emit("recorded", sequence.join(" "));
        });
    };
    return {
      toggleRecording,
      recording,
    };
  },
});
</script>

<style lang="css" scoped>
.blinking {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
