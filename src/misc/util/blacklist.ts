import { BlacklistMode } from "@/services/types";
import { computed, ComputedRef } from "@vue/composition-api";

export const useBlacklistClasses = ({
  mode,
  postIsBlacklisted,
}: {
  mode: BlacklistMode;
  postIsBlacklisted: ComputedRef<boolean>;
}) => {
  const classes = computed(() => ({
    "blacklist-blur": mode === BlacklistMode.blur && postIsBlacklisted.value,
    "blacklist-black":
      mode === BlacklistMode.blackout && postIsBlacklisted.value,
  }));

  return {
    classes,
  };
};
