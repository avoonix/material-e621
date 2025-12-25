import { expose } from "comlink";
import type { PostTags, Post } from "./api";
import type { EnhancedPost } from "./ApiService";
import { ApiService } from "./ApiService";
import { BlacklistMode } from "@/services/types";
import { debug } from "@/misc/util/debug";

const log = debug("app:AnalyzeService");

// debug.disable();
// debug.enable("app:AnalyzeService");

export interface ScoredPost extends EnhancedPost {
  __score: number;
}

export type Counts = {
  [K in keyof PostTags]: {
    [idx: string]: number;
  };
};

export interface IAnalyzeTagsArgs {
  tags: string[];
  postLimit: number;
  baseUrl: string;
}

export interface IAnalyzeTagsResult {
  wordPositions: {
      category: string;
      result: {text: string, size: number}[];
  }[];
}

export interface IProgressEvent {
  message: string;
  /**
   * 0-1
   */
  progress: number;
  indeterminate?: boolean;
}

export class AnalyzeService {
  async getTagOccurrences(posts: Post[]) {
    log("called getTagOccurrences");
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
        if(tag[c]) {
          for (const t of tag[c]) {
            counts[c][t] = (counts[c][t] || 0) + 1;
          }
        } else {
          console.warn(tag, "does not contain", c)
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

    log("finished getTagOccurrences");
    return {
      counts,
      sorted,
    };
  }

  cache: { [key: string]: Post[] | undefined } = {};

  // ...removed duplicate fetchPostsCached...

  async analyzeTags(
    args: IAnalyzeTagsArgs,
    onProgress: (event: IProgressEvent) => void,
    auth?: { login: string; api_key: string },
  ): Promise<IAnalyzeTagsResult> {
    const posts = await this.fetchPostsCached(
      args.tags,
      args.postLimit,
      args.baseUrl,
      onProgress,
      auth,
    );
    onProgress({
      message: "got posts, sorting tags",
      progress: 0.5,
      indeterminate: true,
    });
    log("got posts");

    const counts = getCounts(posts);

    const result = [];
    for (const [category, obj] of Object.entries(counts)) {
      result.push({
        category,
        result: await createCloud(obj),
      });
      log("created a cloud");
    }
    onProgress({ message: "done", progress: 1 });
    return {
      wordPositions: result,
    };
  }

  async getFavoriteTags(
    username: string,
    baseUrl: string,
    onProgress: (event: IProgressEvent) => void,
    auth?: { login: string; api_key: string },
  ): Promise<FavoriteTagsResult> {
    const posts = await this.fetchPostsCached(
      [`fav:${username}`],
      320 * 6,
      baseUrl,
      onProgress,
      auth,
    );

    const counts = getCounts(posts);

    return { counts };
  }

  async suggestPosts(
    tags: FavoriteTagsResult,
    weights: {
      [key in
        | "general"
        | "artist"
        | "copyright"
        | "character"
        | "species"
        | "meta"
        | "lore"
        | "invalid"]: number;
    },

    limit: number,
  ): Promise<Post[]> {
    // This implementation fetches posts and scores them for suggestions.
    const posts = await this.fetchPostsCached(
      [""],
      limit,
      "https://e621.net/", // or use a configurable baseUrl if needed
      () => {},
    );
    // If posts is not an array, return an empty array to avoid errors
    if (!Array.isArray(posts)) return [];
    // Score posts (dummy scoring for now)
    return posts;
  }

  private async fetchPostsCached(
    tags: string[],
    postLimit: number,
    baseUrl: string,
    onProgress: (event: IProgressEvent) => void,
    auth?: { login: string; api_key: string },
  ): Promise<Post[]> {
    const service = new ApiService();
    const posts: Post[] = [];
    let page = 1;
    const key = [tags, postLimit].join("");
    log("start fetch");
    if (key && this.cache[key]) {
      posts.push(...this.cache[key]!);
    } else {
      while (posts.length < postLimit) {
        const newPosts: Post[] = await service.getPosts({
          blacklistMode: BlacklistMode.blur,
          limit: 320,
          tags,
          baseUrl,
          page,
          auth,
        });
        page += 1;
        posts.push(...newPosts);
        onProgress({
          message: `got ${posts.length} of ${postLimit} posts`,
          progress: Math.min(1, posts.length / postLimit),
        });
        if (newPosts.length !== 320) {
          break;
        }
      }
      this.cache[key] = posts;
    }
    return posts;
  }

  // ...removed stray code after fetchPostsCached...
}

const scorePosts = (
  tags: FavoriteTagsResult,
  weights: Parameters<AnalyzeService["suggestPosts"]>["1"],
  posts: EnhancedPost[],
) => {
  const scoredPosts: ScoredPost[] = [];
  for (const post of posts) {
    let score = 0;
    let tagCount = 0;
    for (const tag of tagIterator(post.tags)) {
      ++tagCount;
      const categoryWeight = Number((weights as any)[tag.category]);
      if (!categoryWeight) continue;
      const count = tags.counts[tag.category]?.[tag.tag];
      if (!count) continue;
      score += count * categoryWeight;
    }
    scoredPosts.push({
      ...post,
      __score: Math.round(score / tagCount),
    });
  }
  return scoredPosts;
};

const tagIterator = function* (tags: PostTags) {
  for (const [category, arr] of Object.entries(tags)) {
    for (const tag of arr) {
      yield {
        category,
        tag,
      };
    }
  }
};

const createCloud = (counts: any) => {
  return new Promise<{text: string, size: number}[]>((resolve) => {
    const words = Object.entries(counts).map(([text, count]) => ({
      text,
      size: count as number,
    }));
    words.sort((a, b) => b.size - a.size);

      resolve(words);
  });
};

const getCounts = (posts: Post[]) => {
  const counts: {
    [category: string]: undefined | { [tag: string]: undefined | number };
  } = {};
  for (const post of posts) {
    for (const [category, tags] of Object.entries(post.tags)) {
      counts[category] = counts[category] || {};
      for (const tag of tags) {
        counts[category]![tag] = (counts[category]![tag] || 0) + 1;
      }
    }
  }
  return counts;
};

export interface FavoriteTagsResult {
  counts: ReturnType<typeof getCounts>;
}

expose(AnalyzeService);
