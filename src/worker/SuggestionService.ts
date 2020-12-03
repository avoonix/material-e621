import { expose } from "comlink";

import { PostTags, Post } from "./api";
import { debug } from "debug";

const log = debug("app:SuggestionService");

debug.disable();
debug.enable("app:*");

export type Counts = {
  // [idx: string]: {
  [K in keyof PostTags]: {
    [idx: string]: number;
  };
};

export class SuggestionService {
  async getTagOccurences(posts: Post[]) {
    log("called getTagOccurences");
    const tags = posts.map((p) => p.tags);
    // TODO: only copy tags over context boundaries (not all posts)
    const counts: Counts = {
      artist: {},
      character: {},
      copyright: {},
      general: {},
      invalid: {},
      lore: {},
      meta: {},
      species: {},
    };
    for (const c of Object.keys(counts) as (keyof PostTags)[]) {
      for (const tag of tags) {
        for (const t of tag[c]) {
          counts[c][t] = (counts[c][t] || 0) + 1;
        }
      }
    }

    const list = [];
    for (const [category, v] of Object.entries(counts)) {
      for (const [tag, count] of Object.entries(v)) {
        list.push({
          category,
          name: tag,
          count,
        });
      }
    }
    const sorted = list.sort((a, b) => b.count - a.count);

    log("finished getTagOccurences");
    return {
      counts,
      sorted,
    };
  }
}

expose(SuggestionService);
