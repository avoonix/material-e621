export interface IPostsListArgs {
  limit: number;
  tags?: string;
  page?: number;
  postsBefore?: number; // posts before this id
  postsAfter?: number; // posts after this id
  auth?: {
    login: string;
    api_key: string;
  };
}

export interface ITagsListArgs {
  limit: number;
  order: "count" | "date";
  query?: string;
}

export interface ITagAliasesArgs {
  limit: number;
  order: "count" | "date";
  query?: string;
}

export interface IPoolsArgs {
  limit: number;
  order: "count" | "date";
  query?: string;
}
