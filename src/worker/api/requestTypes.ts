export interface IPostsListArgs extends IBaseArgs {
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

export interface ITagsListArgs extends IBaseArgs {
  limit: number;
  order: "count" | "date";
  query?: string;
}

export interface ITagAliasesArgs extends IBaseArgs {
  limit: number;
  order: "count" | "date";
  query?: string;
}

export interface IPoolsArgs extends IBaseArgs {
  limit: number;
  order: "count" | "date";
  query?: string;
}

export interface IGetPoolArgs extends IBaseArgs {
  id: number;
}

export interface IBaseArgs {
  baseUrl: string;
}
