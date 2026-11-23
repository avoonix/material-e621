export interface PostFilesMeta {
  md5: string;
  ext: string;
  size: number;
  duration: number | null;
  has_sample: boolean;
}

export interface PostFilesOriginal {
  width: number;
  height: number;
  /**
   * might be null if tags are on the "Global Blacklist"
   */
  url: string | null;
}

export interface PostFilesImage {
  width: number;
  height: number;
  jpg: string | null;
  webp: string | null;
}

export interface PostFiles {
  meta: PostFilesMeta;
  original: PostFilesOriginal;
  preview: PostFilesImage;
  sample: PostFilesImage;
}

export interface Score {
  up: number;
  down: number;
  total: number;
}

export interface PostStats {
  score: Score;
  fav_count: number;
  is_favorited: boolean;
  vote: 1 | 0 | -1;
  comment_count: number;
  hotness: number;
}

export interface PostTags {
  general: string[];
  artist: string[];
  contributor: string[];
  copyright: string[];
  character: string[];
  species: string[];
  invalid: string[];
  meta: string[];
  lore: string[];
}

export type TagCategoryName = keyof PostTags;

export interface Flags {
  pending: boolean;
  flagged: boolean;
  note_locked: boolean;
  status_locked: boolean;
  rating_locked: boolean;
  deleted: boolean;
}

export interface PostHas {
  parent: boolean;
  children: boolean;
  active_children: boolean;
  notes: boolean;
  sample: boolean;
}

export interface Relationships {
  parent_id: number | null;
  children: number[];
}

export interface Post {
  id: number;
  created_at: string;
  updated_at: string;
  change_seq: number;
  files: PostFiles;
  uploader_id: number;
  uploader_name: string;
  approver_id: number | null;
  stats: PostStats;
  flags: Flags;
  has: PostHas;
  relationships: Relationships;
  pools: number[];
  rating: "s" | "q" | "e";
  locked_tags: string[];
  sources: string[];
  description: string;
  tags: PostTags;
}

export interface Tag {
  id: number;
  name: string;
  post_count: number;
  related_tags: string;
  related_tags_updated_at: string | null;
  category: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface TagAlias {
  id: number;
  antecedent_name: string;
  reason: string;
  creator_id: number;
  created_at: string | null;
  forum_post_id: number | null;
  updated_at: string | null;
  forum_topic_id: number | null;
  consequent_name: string;
  status: string;
  post_count: number;
  approver_id: number | null;
}

export interface Pool {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  creator_id: number;
  description: string;
  is_active: boolean;
  category: "collection" | "series";
  post_ids: number[];
  creator_name: string;
  post_count: number;
}
