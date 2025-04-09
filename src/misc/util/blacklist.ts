import { BlacklistMode } from "@/services/types";
import type { ComputedRef } from "vue";
import { computed } from "vue";

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
