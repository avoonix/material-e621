import ax from "axios";
import { Posts, Tag, TagAlias, Pool } from "./returnTypes";
import {
  IPostsListArgs,
  ITagsListArgs,
  ITagAliasesArgs,
  IPoolsArgs,
} from "./requestTypes";

export * from "./returnTypes";
export * from "./requestTypes";

/**
 * TODO: Post upvoting/downvoting, login verification
 */

const axios = ax.create({
  responseType: "json",
  params: {
    _client: "MaterialE621/0.0.0 (by Avoonix on e621)",
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
      return axios.get<Posts>("https://e621.net/posts.json", {
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
      return axios.get<Tag[] | { tags: [] }>("https://e621.net/tags.json", {
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
      return axios.get<TagAlias[]>("https://e621.net/tag_aliases.json", {
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
      return axios.get<Pool[]>("https://e621.net/pools.json", {
        params: {
          limit: args.limit,
          "search[order]": args.order,
          "search[name_matches]": args.query,
        },
      });
    },
  },
};
