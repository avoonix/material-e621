export interface File {
  width: number;
  height: number;
  ext: string;
  size: number;
  md5: string;
  /**
   * might be null if tags are on the "Global Blacklist"
   */
  url: string | null;
}

export interface Preview {
  width: number;
  height: number;
  url: string;
}

export interface Sample {
  has: boolean;
  height: number;
  width: number;
  url: string;
}

export interface Score {
  up: number;
  down: number;
  total: number;
}

export interface PostTags {
  general: string[];
  species: string[];
  character: string[];
  copyright: string[];
  artist: string[];
  invalid: string[];
  lore: string[];
  meta: string[];
}

export interface Flags {
  pending: boolean;
  flagged: boolean;
  note_locked: boolean;
  status_locked: boolean;
  rating_locked: boolean;
  deleted: boolean;
}

export interface Relationships {
  parent_id?: number;
  has_children: boolean;
  has_active_children: boolean;
  children: number[];
}

export interface Post {
  id: number;
  created_at: Date;
  updated_at: Date;
  file: File;
  preview: Preview;
  sample: Sample;
  score: Score;
  tags: PostTags;
  locked_tags: string[];
  change_seq: number;
  flags: Flags;
  rating: "s" | "q" | "e";
  fav_count: number;
  sources: string[];
  pools: number[];
  relationships: Relationships;
  approver_id?: number;
  uploader_id: number;
  description: string;
  comment_count: number;
  is_favorited: boolean;
  has_notes: boolean;
}

export interface Posts {
  posts: Post[];
}

export interface Tag {
  id: number;
  name: string;
  post_count: number;
  related_tags: string;
  related_tags_updated_at: Date;
  category: number;
  is_locked: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TagAlias {
  id: number;
  antecedent_name: string;
  reason: string;
  creator_id: number;
  created_at: Date;
  forum_post_id?: number;
  updated_at?: Date;
  forum_topic_id?: number;
  consequent_name: string;
  status: string;
  post_count: number;
  approver_id?: number;
}

export interface Pool {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  creator_id: number;
  description: string;
  is_active: boolean;
  category: string;
  is_deleted: boolean;
  post_ids: number[];
  creator_name: string;
  post_count: number;
}
