import transitions from "../data/transitions.json";

export const getTransitionName = (type: string, direction: string) => {
  // direction = "none" | "right" | "left"
  // type = "none" | "zoom" | "fade" | ...
  const transition = (transitions as any)?.[type]?.[direction];
  return {
    enterTransitionName: transition?.["enter"] || "",
    leaveTransitionName: transition?.["leave"] || "",
  };
};
