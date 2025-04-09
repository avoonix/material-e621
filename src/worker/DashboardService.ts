import { round } from "@/misc/util/round";
import { BlacklistMode } from "@/services/types";
import type { ITag } from "@/Tag/ITag";
import { expose } from "comlink";
import { differenceInDays, format, parseISO } from "date-fns";
import type { IProgressEvent } from "./AnalyzeService";
import type { IBaseArgs } from "./api";
import type { EnhancedPost } from "./ApiService";
import { ApiService } from "./ApiService";
import { debug } from "@/misc/util/debug";

const log = debug("app:DashboardService");

export interface IDashboardArgs extends IBaseArgs {
  artist: string;
}

export type Heatmap = {
  max: number;
  days: { [date: string]: number | undefined };
};

export interface IDashboardResult {
  posts: EnhancedPost[];
  uploadMetrics: IMetric[];
  communityMetrics: IMetric[];
  topTags: { up: ITag[]; down: ITag[]; count: ITag[]; fav: ITag[] };
  heatmap: Heatmap;
}

export interface IMetric {
  display: string;
  value: number;
}

export interface ITagCount {
  count: number;
  favorites: number;
  up: number;
  down: number;
}

export class DashboardService {
  private static POST_LIMIT = 3200; // 10 pages

  async getDashboardResult(
    args: IDashboardArgs,
    onProgress: (event: IProgressEvent) => void,
  ): Promise<IDashboardResult> {
    const posts = await this.getPosts([args.artist], args.baseUrl, onProgress);
    if (!posts.length)
      return {
        communityMetrics: [],
        uploadMetrics: [],
        posts: [],
        topTags: { count: [], down: [], fav: [], up: [] },
        heatmap: { max: 0, days: {} },
      };
    const counters = {
      upvotes: 0,
      downvotes: 0,
      favorites: 0,
      comments: 0,
      rating: {
        s: 0,
        q: 0,
        e: 0,
      },
      pending: 0,
      tags: {} as {
        [category: string]: {
          [tag: string]: ITagCount | undefined;
        };
      },
      heatmap: {} as { [date: string]: number | undefined },
    };
    for (const post of posts) {
      counters.upvotes += post.score.up;
      counters.downvotes += post.score.down;
      counters.favorites += post.fav_count;
      counters.comments += post.comment_count;
      counters.rating[post.rating]++;
      if (post.flags.pending) {
        counters.pending++;
      }
      for (const [category, tags] of Object.entries(post.tags)) {
        if (!(category in counters.tags)) {
          counters.tags[category] = {};
        }
        for (const tag of tags) {
          if (!(tag in counters.tags[category])) {
            counters.tags[category][tag] = {
              count: 0,
              favorites: 0,
              up: 0,
              down: 0,
            };
          }
          const counts = counters.tags[category][tag]!;
          counts.count += 1;
          counts.up = post.score.up;
          counts.down = post.score.down;
          counts.favorites = post.fav_count;
        }
      }
      const uploadDate = parseISO(post.created_at);
      if (Math.abs(differenceInDays(uploadDate, new Date())) <= 366) {
        const formatted = format(uploadDate, "yyyy-MM-dd");
        counters.heatmap[formatted] = (counters.heatmap[formatted] || 0) + 1;
      }
    }
    const uploadMetrics: IMetric[] = [
      {
        display: "Artwork Uploaded",
        value: posts.length,
      },
      {
        display: "SFW Artwork",
        value: counters.rating.s,
      },
      {
        display: "Questionable Artwork",
        value: counters.rating.q,
      },
      {
        display: "Explicit Artwork",
        value: counters.rating.e,
      },
      {
        display: "Pending Posts",
        value: counters.pending,
      },
      {
        display: "Average Uploads per Week",
        value: round(
          posts.length /
            (Math.abs(
              differenceInDays(
                parseISO(posts[posts.length - 1].created_at),
                new Date(),
              ),
            ) / 7 || 1),
        ),
      },
    ];
    const communityMetrics: IMetric[] = [
      {
        display: "Upvotes Received",
        value: counters.upvotes,
      },
      {
        display: "Downvotes Received",
        value: counters.downvotes,
      },
      {
        display: "Favorites Received",
        value: counters.favorites,
      },
      {
        display: "Comments Received",
        value: counters.comments,
      },
      {
        display: "Average Upvotes per Post",
        value: round(counters.upvotes / posts.length),
      },
      {
        display: "Average Downvotes per Post",
        value: round(counters.downvotes / posts.length),
      },
      {
        display: "Average Favorites per Post",
        value: round(counters.favorites / posts.length),
      },
      {
        display: "Average Comments per Post",
        value: round(counters.comments / posts.length),
      },
      {
        display: "Upvote to Downvote Ratio",
        value: counters.downvotes
          ? round(counters.upvotes / counters.downvotes)
          : 0,
      },
    ];
    const tags = Object.entries(counters.tags)
      .flatMap(([category, tags]) =>
        Object.entries(tags).map(
          ([name, counts]) =>
            ({ name, post_count: counts?.count, category, counts } as ITag & {
              counts: ITagCount;
            }),
        ),
      )
      .filter((t) => t.name !== args.artist && t.name !== "conditional_dnp");

    const count = [...tags].sort(
      (a, b) => (b.post_count ?? 0) - (a.post_count ?? 0),
    );
    const fav = [...tags].sort(
      (a, b) =>
        (b.counts.favorites ?? 0) / b.counts.count -
        (a.counts.favorites ?? 0) / a.counts.count,
    );
    const up = [...tags].sort(
      (a, b) =>
        b.counts.up / (b.counts.up + b.counts.down) -
        a.counts.up / (a.counts.up + a.counts.down),
    );
    const down = [...tags].sort(
      (a, b) =>
        b.counts.down / (b.counts.up + b.counts.down) -
        a.counts.down / (a.counts.up + a.counts.down),
    );

    const removeOutliers = (t: { counts: { count: number } }) =>
      t.counts.count > posts.length * 0.02; // TODO: let user decide this number?

    return {
      posts,
      uploadMetrics,
      communityMetrics,
      topTags: {
        count: count.slice(0, 10),
        fav: fav.filter(removeOutliers).slice(0, 10),
        up: up.filter(removeOutliers).slice(0, 10),
        down: down.filter(removeOutliers).slice(0, 10),
      },
      heatmap: {
        days: counters.heatmap,
        max: Math.max(
          ...Object.values(counters.heatmap).filter((n): n is number => !!n),
        ),
      },
    };
  }

  private async getPosts(
    tags: string[],
    baseUrl: string,
    onProgress: (event: IProgressEvent) => void,
  ) {
    const service = new ApiService();
    const posts: EnhancedPost[] = [];
    let page = 1;
    log("start fetch");
    while (posts.length < DashboardService.POST_LIMIT) {
      const newPosts: EnhancedPost[] = await service.getPosts({
        blacklistMode: BlacklistMode.blur,
        limit: 320,
        tags,
        page,
        baseUrl
      });
      page += 1;
      posts.push(...newPosts);
      onProgress({
        message: `got ${posts.length} of ${DashboardService.POST_LIMIT} posts`,
        progress: Math.min(1, posts.length / DashboardService.POST_LIMIT),
      });
      if (newPosts.length !== 320) {
        break;
      }
    }
    return posts;
  }
}

expose(DashboardService);
