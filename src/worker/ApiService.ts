import { e621, ITagsListArgs, IPoolsArgs, Post, Tag } from "./api";
import { isPostBlacklisted } from "./blacklist";
import debug from "debug";
import { BlacklistMode } from "@/services/types";
import { createTagQuery } from "@/misc/util/createTagQuery";

debug.disable();
// debug.enable("app:*");

const log = debug("app:ApiService");

export interface EnhancedTag extends Tag {
  // other: {
  //   color: string;
  // };
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
      })
    ).data.posts;

    // extra fields for compatibility with legacy api
    // todo: remove extra fields
    return posts.map<Post>((post) => ({
      ...post,
      preview_height: post.preview.height,
      preview_width: post.preview.width,
      preview_url: post.preview.url,
      sample_height: post.sample.height,
      sample_width: post.sample.width,
      sample_url: post.sample.url,
      file_ext: post.file.ext,
      height: post.file.height,
      width: post.file.width,
      md5: post.file.md5,
      file_size: post.file.size || 0,
      file_url: post.file.url,
      // score: post.score.total,

      _postCustom: {
        isBlacklisted: isPostBlacklisted(post, args.blacklist || []),
      },
    }));
  }

  async getTags(args: ITagsListArgs) {
    return (await e621.tags.list(args)).data.map<EnhancedTag>((tag) => ({
      ...tag,
      // other: {
      //   color: getTagColor(tag.category)
      // }
    }));
  }

  async getPools(args: IPoolsArgs) {
    return (await e621.pools.list(args)).data;
  }
  // private _counter = 0;

  // constructor(init = 0) {
  //   console.log(init);
  //   this._counter = init;
  // }

  // get counter() {
  //   return this._counter;
  // }

  // increment(delta = 1) {
  //   this._counter += delta;
  // }
}
