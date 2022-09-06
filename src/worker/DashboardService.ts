import { round } from "@/misc/util/round";
import { BlacklistMode } from "@/services/types";
import { ITag } from "@/Tag/ITag";
import { expose } from "comlink";
import {
  differenceInDays,
  differenceInYears,
  format,
  parseISO,
} from "date-fns";
import { debug } from "debug";
import { IProgressEvent } from "./AnalyzeService";
import { ApiService, EnhancedPost } from "./ApiService";

const log = debug("app:DashboardService");

// debug.disable();
debug.enable("app:DashboardService");

export interface IDashboardArgs {
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
  topTags: ITag[];
  heatmap: Heatmap;
}

export interface IMetric {
  display: string;
  value: number;
}

export class DashboardService {
  private static POST_LIMIT = 3200; // 10 pages

  async getDashboardResult(
    args: IDashboardArgs,
    onProgress: (event: IProgressEvent) => void,
  ): Promise<IDashboardResult> {
    const posts = await this.getPosts([args.artist], onProgress);
    if (!posts.length)
      return {
        communityMetrics: [],
        uploadMetrics: [],
        posts: [],
        topTags: [],
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
      tags: {} as { [category: string]: { [tag: string]: number | undefined } },
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
          counters.tags[category][tag] =
            (counters.tags[category][tag] || 0) + 1;
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
            ) /
              7),
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
    ];
    const tags = Object.entries(counters.tags)
      .flatMap(([category, tags]) =>
        Object.entries(tags).map(
          ([name, post_count]) => ({ name, post_count, category } as ITag),
        ),
      )
      .filter((t) => t.name !== args.artist && t.name !== "conditional_dnp")
      .sort((a, b) => (b.post_count ?? 0) - (a.post_count ?? 0));
    return {
      posts,
      uploadMetrics,
      communityMetrics,
      topTags: tags.slice(0, 20),
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
    onProgress: (event: IProgressEvent) => void,
  ) {
    const service = new ApiService();
    const posts: EnhancedPost[] = [];
    let postsBefore: undefined | number = undefined;
    log("start fetch");
    while (true) {
      const newPosts: EnhancedPost[] = await service.getPosts({
        blacklistMode: BlacklistMode.blur,
        limit: 320,
        tags,
        postsBefore,
      });
      postsBefore = newPosts[newPosts.length - 1]?.id;
      posts.push(...newPosts);
      onProgress({
        message: `got ${posts.length} of ${DashboardService.POST_LIMIT} posts`,
        progress: Math.min(1, posts.length / DashboardService.POST_LIMIT),
      });
      if (
        newPosts.length !== 320 ||
        posts.length >= DashboardService.POST_LIMIT
      ) {
        break;
      }
    }
    return posts;
  }
}


expose(DashboardService);
