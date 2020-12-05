import transitions from "../config/transitions.json";

export const getTransitionName = (type, direction) => {
  // direction = "none" | "right" | "left"
  // type = "none" | "zoom" | "fade" | ...
  try {
    return {
      enterTransitionName: transitions[type][direction]["enter"],
      leaveTransitionName: transitions[type][direction]["leave"],
    };
  } catch (error) {
    return {
      enterTransitionName: "",
      leaveTransitionName: "",
    };
  }
};
