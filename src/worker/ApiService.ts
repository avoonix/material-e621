import {
  e621,
  ITagsListArgs,
  IPoolsArgs,
  Post,
  IPostsListArgs,
  IPostFavoriteArgs,
  custom,
  IGetPoolArgs,
} from "./api";
import { isPostBlacklisted } from "./blacklist";
import debug from "debug";
import { BlacklistMode } from "@/services/types";
import { createTagQuery } from "@/misc/util/createTagQuery";

// debug.disable();
// debug.enable("app:*");

const log = debug("app:ApiService");

export interface EnhancedPost extends Post {
  __meta: {
    isBlacklisted: boolean;
    isFavoriteLoading?: boolean;
  };
}

export class ApiService {
  async getPosts(args: {
    page?: number;
    limit: number;
    postsBefore?: number;
    postsAfter?: number;
    tags: string[];
    blacklist?: string[];
    blacklistMode: BlacklistMode;
    auth?: IPostsListArgs["auth"];
    baseUrl: string;
  }) {
    log(args);
    const posts = (
      await e621.posts.list({
        ...args,
        tags: createTagQuery(
          args.blacklistMode,
          args.blacklist || [],
          args.tags,
        ),
        baseUrl: args.baseUrl
      })
    ).data.posts;

    return posts.map<EnhancedPost>((post) => ({
      ...post,
      score: {
        ...post.score,
        down: Math.abs(post.score.down), // shouldn't be negative imo
      },
      __meta: {
        isBlacklisted: isPostBlacklisted(post, args.blacklist || []),
      },
    }));
  }

  async getTags(args: ITagsListArgs) {
    const { data } = await e621.tags.list(args);
    if (Array.isArray(data)) {
      return data;
    } else {
      return data.tags;
    }
  }

  async getPools(args: IPoolsArgs) {
    return (await e621.pools.list(args)).data;
  }

  async getPool(args: IGetPoolArgs) {
    return (await e621.pools.get(args)).data;
  }

  async favoritePost(args: IPostFavoriteArgs) {
    try {
      await custom.posts.favorite(args);
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (message) {
        throw new Error(message);
      }
      throw error;
    }
  }

  async unfavoritePost(args: IPostFavoriteArgs) {
    try {
      await custom.posts.unfavorite(args);
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (message) {
        throw new Error(message);
      }
      throw error;
    }
  }
}
