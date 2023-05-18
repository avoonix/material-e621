import ax from "axios";
import { Posts, Tag, TagAlias, Pool } from "./returnTypes";
import {
  IPostsListArgs,
  ITagsListArgs,
  ITagAliasesArgs,
  IPoolsArgs,
  IGetPoolArgs,
} from "./requestTypes";
import { getGitInfo } from "@/misc/util/git";

export * from "./returnTypes";
export * from "./requestTypes";

/**
 * TODO: Post upvoting/downvoting, login verification
 */

const version = getGitInfo()[0]?.hash?.substring(0, 7) ?? "0.0.0";

const axios = ax.create({
  responseType: "json",
  params: {
    _client: `Material e621/${version} (by Avoonix on e621)`,
  },
});

export const e621 = {
  posts: {
    list(args: IPostsListArgs) {
      let page = undefined;
      if (args.postsAfter) {
        page = `a${args.postsAfter}`;
      }
      if (args.postsBefore) {
        page = `b${args.postsBefore}`;
      }
      if (args.page !== undefined) {
        page = args.page;
      }
      const auth = args?.auth || {};
      return axios.get<Posts>(`${args.baseUrl}posts.json`, {
        params: {
          tags: args.tags || "",
          limit: args.limit,
          page,
          ...auth,
        },
      });
    },
  },
  tags: {
    list(args: ITagsListArgs) {
      return axios.get<Tag[] | { tags: [] }>(`${args.baseUrl}tags.json`, {
        params: {
          limit: args.limit,
          "search[order]": args.order,
          "search[name_matches]": args.query,
        },
      });
    },
  },
  tagAliases: {
    list(args: ITagAliasesArgs) {
      return axios.get<TagAlias[]>(`${args.baseUrl}tag_aliases.json`, {
        params: {
          limit: args.limit,
          "search[order]": args.order,
          "search[name_matches]": args.query,
        },
      });
    },
  },
  pools: {
    list(args: IPoolsArgs) {
      return axios.get<Pool[]>(`${args.baseUrl}pools.json`, {
        params: {
          limit: args.limit,
          "search[order]": args.order,
          "search[name_matches]": args.query,
        },
      });
    },
    get(args: IGetPoolArgs) {
      return axios.get<Pool>(`${args.baseUrl}pools/${+args.id}.json`);
    },
  },
};

export interface IPostFavoriteArgs {
  postId: number;
  auth: {
    login: string;
    api_key: string;
  };
  proxyUrl: string;
}

export const custom = {
  posts: {
    favorite(args: IPostFavoriteArgs) {
      return axios.post(
        `${args.proxyUrl}favorites`,
        { post_id: args.postId },
        {
          headers: {
            "content-type": "application/json",
          },
          auth: {
            username: args.auth.login,
            password: args.auth.api_key,
          },
        },
      );
    },
    unfavorite(args: IPostFavoriteArgs) {
      return axios.delete(
        `${args.proxyUrl}favorites/${args.postId}`,
        {
          headers: {
            "content-type": "application/json",
          },
          auth: {
            username: args.auth.login,
            password: args.auth.api_key,
          },
        },
      );
    },
  },
};
