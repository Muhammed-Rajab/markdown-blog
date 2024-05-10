export type Metadata = {
  id: string;
  title: string;
  desc: string;
  cover?: string;
  slug: string;
  createdAt: Date;
  editedAt: Date;
  draft: boolean;
};
export type BlogMeta = {
  createdAt?: Date;
  blogs: Array<Metadata>;
};
export type CreateBlogOptions = {
  title: string;
  desc: string;
  draft: boolean;
  cover?: string;
};
export type UpdateBlogOptions = {
  title?: string;
  desc?: string;
  draft?: boolean;
  cover?: string;
};
