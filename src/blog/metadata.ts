import fs from "node:fs";
import { BlogMeta, Metadata } from "./types";

export class BlogMetaHandler {
  constructor(private METADATA_PATH: string) {}

  public add(meta: Metadata) {
    let blogMeta: BlogMeta;
    try {
      blogMeta = this.getBlogMeta();
    } catch (err) {
      throw err;
    }

    blogMeta.blogs.push(meta);

    try {
      this.overWriteBlogMeta(blogMeta);
    } catch (err) {
      throw err;
    }
  }

  public remove(titleSlug: string) {
    let blogMeta: BlogMeta;
    try {
      blogMeta = this.getBlogMeta();
    } catch (err) {
      throw err;
    }

    blogMeta.blogs = blogMeta.blogs.filter((blog) => blog.slug !== titleSlug);

    try {
      this.overWriteBlogMeta(blogMeta);
    } catch (err) {
      throw err;
    }
  }

  public getBlogMeta(): BlogMeta {
    try {
      const buf = fs.readFileSync(this.METADATA_PATH);
      const parsedJson = JSON.parse(buf.toString()) as BlogMeta;
      return parsedJson;
    } catch (err) {
      throw new Error(`failed to parse blog meta: ${err}`);
    }
  }

  public overWriteBlogMeta(blogMeta: BlogMeta) {
    try {
      fs.writeFileSync(this.METADATA_PATH, JSON.stringify(blogMeta, null, 2));
    } catch (err) {
      throw new Error(`failed to overwrite blog meta: ${err}`);
    }
  }
}
