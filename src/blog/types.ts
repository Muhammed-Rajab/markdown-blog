export type Metadata = {
  id: string;
  title: string;
  desc: string;
  slug: string;
  createdAt: Date;
  editedAt: Date;
  draft: boolean;
};

export type BlogMeta = {
  createdAt?: Date;
  blogs: Array<Metadata>;
};
