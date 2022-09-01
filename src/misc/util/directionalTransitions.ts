import { ref } from "vue";
import { getTransitionName } from "./transitions";

export type Direction = "left" | "right" | "none";

export const useDirectionalTransitions = (args: {
  transitionName: () => string;
}) => {
  const enterTransitionName = ref("fade");
  const leaveTransitionName = ref("fade");

  const setTransitionNames = (direction: Direction) => {
    const { enterTransitionName: e, leaveTransitionName: l } =
      getTransitionName(args.transitionName(), direction);
    enterTransitionName.value = e;
    leaveTransitionName.value = l;
  };

  return {
    enterTransitionName,
    leaveTransitionName,
    setTransitionNames,
  };
};
