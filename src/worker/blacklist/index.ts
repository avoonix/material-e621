import { intersection } from "lodash";
import type { Post } from "../api";
import { debug } from "@/misc/util/debug";

const log = debug("app:blacklist");

export const isPostBlacklisted = (post: Post, blacklist?: string[][]) => {
  if (!blacklist) {
    log("no blacklist");
    return false;
  }
  const postTags = Object.values(post.tags).flat() as string[];
  log(postTags);
  switch (post.rating) {
    case "e":
      postTags.push("rating:e", "rating:explicit");
      break;
    case "q":
      postTags.push("rating:q", "rating:questionable");
      break;
    case "s":
      postTags.push("rating:s", "rating:safe");
      break;
  }
  for (const blacklistLine of blacklist) {
    if (matchesBlacklistLine(postTags, blacklistLine)) {
      return true;
    }
  }
  return false;
};

const isSubset = <T>(arr: T[], subArr: T[]) => intersection(arr, subArr).length === subArr.length;

const matchesBlacklistLine = (postTags: string[], blacklistLine: string[]) => {
  if (!blacklistLine.length) return false;

  // TODO: refactor
  const require = blacklistLine.filter(t => !t.startsWith("~") && !t.startsWith("-"));
  const optional = blacklistLine.filter(t => t.startsWith("~")).map(t => t.replace(/^~/, ""));
  const exclude = blacklistLine.filter(t => t.startsWith("-")).map(t => t.replace(/^-/, ""));

  // https://github.com/e621ng/e621ng/blob/8112e57329ee225a193b5aa0503aaf95b29c103f/app/javascript/src/javascripts/blacklists.js#L281
  return !!((isSubset(postTags, require))
    && (!optional.length || intersection(postTags, optional).length)
    && !intersection(postTags, exclude).length);
}
