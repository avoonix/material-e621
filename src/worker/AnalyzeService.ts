import { expose } from "comlink";
import { PostTags, Post } from "./api";
import { debug } from "debug";
import cloud from "d3-cloud";
import { ApiService } from "./ApiService";
import { BlacklistMode } from "@/services/types";
import * as d3 from "d3";
// import objectHash from "object-hash";

const log = debug("app:AnalyzeService");

debug.disable();
debug.enable("app:AnalyzeService");


interface ScoredPost extends Post {
  __score: number;
}

export type Counts = {
  // [idx: string]: {
  [K in keyof PostTags]: {
    [idx: string]: number;
  };
};

export interface IAnalyzeTagsArgs {
  width: number;
  height: number;
  tags: string[];
  postLimit: number;
}

export interface IAnalyzeTagsResult {
  wordPositions: any[];
}

export interface IProgressEvent {
  message: string;
  /**
   * 0-1
   */
  progress: number;
  indeterminate?: boolean;
}

// const objectToHash = (obj: any) => {
// const cacheName = objectHash.sha1(obj);
// }

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

    log("finished getTagOccurrences");
    return {
      counts,
      sorted,
    };
  }

  cache: { [key: string]: Post[] | undefined } = {};

  // TODO: generator?
  private async fetchPostsCached(
    tags: string[],
    postLimit: number,
    onProgress: (event: IProgressEvent) => void,
  ) {
    const service = new ApiService();
    const posts: Post[] = [];
    let postsBefore: undefined | number = undefined;
    const key = [tags, postLimit].join("");
    log("start fetch");
    if (key && this.cache[key]) {
      posts.push(...this.cache[key]!);
    } else {
      while (true) {
        const newPosts: Post[] = await service.getPosts({
          blacklistMode: BlacklistMode.blur,
          limit: 320,
          tags,
          postsBefore,
        });
        postsBefore = newPosts[newPosts.length - 1]?.id;
        posts.push(...newPosts);
        onProgress({
          message: `got ${posts.length} of ${postLimit} posts`,
          progress: Math.min(1, posts.length / postLimit) * 0.5,
        });
        if (newPosts.length !== 320 || posts.length >= postLimit) {
          break;
        }
      }
      this.cache[key] = posts;
    }
    return posts;
  }

  async analyzeTags(
    args: IAnalyzeTagsArgs,
    onProgress: (event: IProgressEvent) => void,
  ): Promise<IAnalyzeTagsResult> {
    const posts = await this.fetchPostsCached(
      args.tags,
      args.postLimit,
      onProgress,
    );
    onProgress({
      message: "got posts, creating clouds",
      progress: 0.5,
      indeterminate: true,
    });
    log("got posts");

    const counts = getCounts(posts);

    const result: any = [];
    for (const [category, obj] of Object.entries(counts)) {
      result.push({
        category,
        result: await createCloud(obj, args.width, args.height),
      });
      log("created a cloud");
    }
    onProgress({ message: "done", progress: 1 });
    return {
      wordPositions: result,
    };
  }

  // display most favorited tags to user
  async getFavoriteTags(
    username: string,
    onProgress: (event: IProgressEvent) => void,
  ): Promise<FavoriteTagsResult> {
    const posts = await this.fetchPostsCached(
      [`fav:${username}`],
      1000,
      onProgress,
    );

    const counts = getCounts(posts);

    return { counts };
  }

  // TODO: get new posts and use favorited tags to score them
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
    args: {
      postsBefore?: number;
      postsAfter?: number;
    },
    onProgress: (event: IProgressEvent) => void,
  ): Promise<ScoredPost[]> {
    // fetch `5*limit` posts, sort them by score and display the top `limit` ones

    const service = new ApiService();
    const posts: ScoredPost[] = [];
    const direction = args.postsAfter ? "after" : "before";
    let postsBefore: undefined | number = args.postsBefore || undefined;
    let postsAfter: undefined | number = args.postsAfter || undefined;
    // const key = [tags, postLimit].join("");
    // log("start fetch");
    let stop = false;
    while (!stop) {
      onProgress({progress: Math.random(), message: "fetching posts"}) // TODO: progress
      const newPosts = await service.getPosts({
        blacklistMode: BlacklistMode.blur, // TODO: blacklist mode
        limit: limit,
        tags: [],
        postsBefore,
        postsAfter,
      });

      if (posts.length) {
        stop = true;
      }

      onProgress({indeterminate: true, message: "scoring posts", progress: 0})
      const scoredNewPosts = scorePosts(tags, weights, newPosts);
      if (direction === "after") {
        postsAfter = scoredNewPosts[0]?.id || undefined;
        posts.unshift(...scoredNewPosts);
      } else {
        postsBefore = scoredNewPosts[scoredNewPosts.length - 1]?.id || undefined;
        posts.push(...scoredNewPosts);
      }
    }

    console.log(
      "post ids",
      posts.map((p) => p.id),
    );

    console.log("called suggest posts");
    return posts;
  }
}

const scorePosts = (
  tags: FavoriteTagsResult,
  weights: Parameters<AnalyzeService["suggestPosts"]>["1"],
  posts: Post[],
) => {
  const scoredPosts: ScoredPost[] = [];
  for (const post of posts) {
  let score = 0;
  let tagCount = 0;
    console.log(post);
    for (const tag of tagIterator(post.tags)) {
      ++tagCount;
      const categoryWeight  = Number((weights as any)[tag.category]);
      if(!categoryWeight) continue;
      const count = tags.counts[tag.category]?.[tag.tag];
      if(!count) continue;
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

const createCloud = (counts: any, width: number, height: number) => {
  return new Promise<any[]>((resolve) => {
    const words = Object.entries(counts).map(([text, count]) => ({
      text,
      size: count,
    }));

    const sizes = words.map((w) => w.size as number);

    // const fontSize = d3.scaleLinear([6, 60]);
    // const fontSize = d3.scaleLog([6, 60]);
    const fontSize = d3.scaleSqrt([6, 60]);
    fontSize.domain([Math.min(...sizes), Math.max(...sizes)]); // min and max occurences
    const rotate = d3.scaleLinear([-45, 45]);
    rotate.domain([0, 1]);

    const layout = cloud()
      .canvas(() => {
        return new OffscreenCanvas(width, height);
      })
      .size([width, height])
      .words(words)
      .padding(1)
      .rotate(function () {
        return rotate(Math.random());
      })
      .font("sans-serif")
      .fontSize((d: any) => fontSize(d.size))
      // .fontSize(function (d: any) {
      //   // return Math.log(d.size);
      //   // return Math.sqrt(d.size);
      //   // return Math.sqrt(d.value);
      //   return d.size;
      // })
      .spiral("archimedean") // archimedean
      .on("end", (wordPositions: any) => {
        resolve(wordPositions);
      });

    layout.start();
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
