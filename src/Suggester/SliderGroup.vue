<template>
  <v-layout wrap>
    <v-flex v-for="key in keys" xs12 :key="key">
      <v-slider
        color="accent"
        class="mx-4"
        v-model="value[key]"
        @change="forceSliderSumToEqual100(key)"
        thumb-label
        :min="0"
        :max="100"
        :label="key"
      />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  PropType,
} from "vue";

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<{ [key: string]: number }>,
      required: true,
    },
  },
  setup(props, context) {
    const keys = computed(() => Object.keys(props.value));

    const forceSliderSumToEqual100 = async (key: string) => {
      await nextTick();

      const calculateOtherTotal = () => {
        let sum = 0;
        for (const otherKey of Object.keys(props.value)) {
          if (otherKey !== key) {
            sum += props.value[otherKey];
          }
        }
        return sum;
      };
      let otherValues = calculateOtherTotal();
      const valuesToSplit = 100 - props.value[key];
      for (const otherKey of Object.keys(props.value)) {
        if (otherKey !== key) {
          let previousPercentage = 0;
          if (otherValues) {
            previousPercentage = props.value[otherKey] / otherValues;
          } else {
            previousPercentage = 0.25;
          }
          props.value[otherKey] = Math.floor(
            previousPercentage * valuesToSplit,
          );
        }
      }
      otherValues = calculateOtherTotal();
      while (otherValues + props.value[key] != 100) {
        for (const otherKey of Object.keys(props.value)) {
          otherValues = calculateOtherTotal();
          if (otherKey !== key) {
            const difference = otherValues + props.value[key] - 100;
            if (difference < 0) {
              props.value[otherKey]++;
            } else if (difference > 0) {
              props.value[otherKey]--;
            } else {
              break;
            }
          }
        }
      }
    };

    return {
      keys,
      forceSliderSumToEqual100,
    };
  },
});
</script>
