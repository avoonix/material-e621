import type { BlacklistMode } from "@/services/types";

const E621_API_TAG_LIMIT = 40;

export const createTagQuery = (
  mode: BlacklistMode,
  blacklist: string[][],
  tags: string[],
) => {
  const allTags = [...tags];
  // if (mode === BlacklistMode.hide) {
  //   // only a single tag per line 
  //   allTags.push(...blacklist.flatMap((t) => t.length === 1 ? [t[0].startsWith("-") ? t[0].replaceAll(/^-/g, "") : `-${t[0]}`] : []));
  // }
  return allTags.slice(0, E621_API_TAG_LIMIT).join(" ");
};
