<template>
  <v-content
    :style="`background-color: ${currentTheme.background} !important; border-color: ${currentTheme.background} !important;`"
  >
    <transition
      :enter-active-class="enterTransitionName"
      :leave-active-class="leaveTransitionName"
      mode="out-in"
    >
      <router-view :key="routeKey" />
    </transition>
  </v-content>
</template>

<script lang="ts">
import { useDirectionalTransitions } from "@/misc/util/directionalTransitions";
import { appearanceService } from "@/services";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {},
  setup(props, context) {
    const {
      enterTransitionName,
      leaveTransitionName,
      setTransitionNames,
    } = useDirectionalTransitions({
      transitionName() {
        return appearanceService.routeTransition;
      },
    });
    return {
      enterTransitionName,
      leaveTransitionName,
      setTransitionNames,
    };
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.setTransitionNames(
        toDepth < fromDepth ? "left" : toDepth === fromDepth ? "none" : "right",
      );
    },
  },
  computed: {
    routeKey(): string {
      return (this.$route as any).path;
    },
    currentTheme() {
      return {
        primary: appearanceService.primaryColor,
        secondary: appearanceService.secondaryColor,
        accent: appearanceService.accentColor,
        background: appearanceService.backgroundColor,
        sidebar: appearanceService.sidebarColor,
      };
    },
  },
});
</script>
