import type { Posts, Tag, TagAlias, Pool } from "./returnTypes";
import type {
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
const clientHeader = `Material e621/${version} (by Avoonix on e621)`;

const buildUrl = (baseUrl: string, path: string, params: Record<string, any> = {}) => {
  const url = new URL(`${baseUrl}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  url.searchParams.append("_client", clientHeader);
  return url.toString();
};

const fetchJson = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const getAuthHeader = (auth?: { login: string; api_key: string }): { Authorization: string } | {} => {
  return auth
    ? {
      Authorization: `Basic ${btoa(`${auth.login}:${auth.api_key}`)}`,
    }
    : {};
};

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
      const url = buildUrl(args.baseUrl, "posts.json", {
        tags: args.tags || "",
        limit: args.limit,
        page,
        ...auth,
      });
      return fetchJson<Posts>(url)
    },
  },
  tags: {
    list(args: ITagsListArgs) {
      const url = buildUrl(args.baseUrl, "tags.json", {
        limit: args.limit,
        "search[order]": args.order,
        "search[name_matches]": args.query,
      });
      return fetchJson<Tag[] | { tags: [] }>(url);
    },
  },
  tagAliases: {
    list(args: ITagAliasesArgs) {
      const url = buildUrl(args.baseUrl, "tag_aliases.json", {
        limit: args.limit,
        "search[order]": args.order,
        "search[name_matches]": args.query,
      });
      return fetchJson<TagAlias[]>(url);
    },
  },
  pools: {
    list(args: IPoolsArgs) {
      const url = buildUrl(args.baseUrl, "pools.json", {
        limit: args.limit,
        "search[order]": args.order,
        "search[name_matches]": args.query,
      });
      return fetchJson<Pool[]>(url);
    },
    get(args: IGetPoolArgs) {
      const url = buildUrl(args.baseUrl, `pools/${+args.id}.json`);
      return fetchJson<Pool>(url);
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
    async favorite(args: IPostFavoriteArgs) {
      const response = await fetch(`${args.proxyUrl}favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(args.auth),
        },
        body: JSON.stringify({ post_id: args.postId }),
      });
      if (!response.ok) {
        throw new Error(`Error favoriting post: ${response.statusText}`);
      }
      return response.json();
    },
    async unfavorite(args: IPostFavoriteArgs) {
      const response = await fetch(`${args.proxyUrl}favorites/${args.postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(args.auth),
        },
      });
      if (!response.ok) {
        throw new Error(`Error unfavoriting post: ${response.statusText}`);
      }
      return response.json();
    },
  },
};
