<template>
  <div>
    <v-card class="elevation-0" color="secondary">
      <v-responsive :aspect-ratio="ratio">
        <transition
          :enter-active-class="enterTransitionName"
          :leave-active-class="leaveTransitionName"
          mode="out-in"
        >
          <v-responsive
            class="text-center align-middle elevation-10 ma-4"
            :aspect-ratio="ratio"
            :key="pageKey"
            style=""
            :class="color"
          >
            from {{ direction }}
          </v-responsive>
        </transition>
      </v-responsive>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from "@vue/composition-api";
import { getTransitionName } from "../misc/util/transitions";

export default defineComponent({
  props: {
    directions: {
      type: Array,
      required: true,
    },
    transitionName: {
      type: String,
      reqired: true,
    },
    ratio: {
      type: Number,
    },
  },
  setup(props) {
    const enterTransitionName = ref("fade");
    const leaveTransitionName = ref("fade");
    const direction = ref("right");
    const pageKey = ref(0);

    let interval: any;
    onMounted(() => {
      interval = setInterval(() => {
        const directions = props.directions as string[];
        setTransitionNames(directions[pageKey.value % directions.length]);
      }, 2000);
    });
    onBeforeUnmount(() => {
      clearInterval(interval);
    });

    const setTransitionNames = (transitionDirection: string) => {
      const { enterTransitionName: enter, leaveTransitionName: leave } =
        getTransitionName(props.transitionName || "", transitionDirection);
      direction.value = transitionDirection;
      enterTransitionName.value = enter;
      leaveTransitionName.value = leave;
      pageKey.value++;
    };

    const colors = [
      "red",
      "blue",
      "green",
      "pink",
      "teal",
      "lime",
      "deep-orange",
      "light-blue",
    ];
    const color = computed(
      () => colors[pageKey.value % colors.length] + " lighten-2 black--text",
    );

    return {
      enterTransitionName,
      leaveTransitionName,
      direction,
      pageKey,
      color,
    };
  },
});
</script>
