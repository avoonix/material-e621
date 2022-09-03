<template>
  <v-main
    :style="`background-color: ${backgroundColor} !important; border-color: ${backgroundColor} !important;`"
  >
    <transition
      :enter-active-class="enterTransitionName"
      :leave-active-class="leaveTransitionName"
      mode="out-in"
    >
      <router-view :key="routeKey" />
    </transition>
  </v-main>
</template>

<script lang="ts">
import { useDirectionalTransitions } from "@/misc/util/directionalTransitions";
import { useAppearanceStore } from "@/services";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {},
  setup(props, context) {
    const appearance = useAppearanceStore();

    const { enterTransitionName, leaveTransitionName, setTransitionNames } =
      useDirectionalTransitions({
        transitionName() {
          return appearance.routeTransition;
        },
      });

    const backgroundColor = computed(() => appearance.backgroundColor);

    return {
      enterTransitionName,
      leaveTransitionName,
      setTransitionNames,
      backgroundColor,
    };
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.setTransitionNames(
        toDepth < fromDepth ? "left" : toDepth === fromDepth ? "none" : "right",
      );

      // snackbar.clearMessage();
    },
  },
  computed: {
    routeKey(): string {
      return (this.$route as any).path;
    },
  },
});
</script>
