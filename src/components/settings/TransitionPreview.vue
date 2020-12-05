<template>
  <div>
    <v-card class="elevation-0">
      <v-responsive :aspect-ratio="this.ratio" class="">
        <transition
          :enter-active-class="enterTransitionName"
          :leave-active-class="leaveTransitionName"
          mode="out-in"
        >
          <v-responsive
            class="text-xs-center align-middle elevation-10 ma-4"
            :aspect-ratio="this.ratio"
            :key="theKey"
            style=""
            :class="theColor"
            >from {{ direction }}</v-responsive
          >
        </transition>
      </v-responsive>
    </v-card>
  </div>
</template>
<script>
import { getTransitionName } from "../../utilities";

export default {
  props: ["transitionName", "directions", "ratio"],
  data() {
    return {
      enterTransitionName: "fade",
      leaveTransitionName: "fade",
      direction: "right",
      theKey: 1,
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      this.setTransitionNames(
        this.directions[this.theKey % this.directions.length],
      );
    }, 2000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    setTransitionNames(direction) {
      const { enterTransitionName, leaveTransitionName } = getTransitionName(
        this.transitionName,
        direction,
      );
      this.direction = direction;
      this.enterTransitionName = enterTransitionName;
      this.leaveTransitionName = leaveTransitionName;
      this.theKey++;
    },
  },
  computed: {
    theColor() {
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
      return colors[this.theKey % colors.length] + " lighten-2 black--text";
    },
  },
};
</script>
