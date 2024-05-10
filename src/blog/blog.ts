import fs from "node:fs";
import path from "node:path";
// @ts-ignore
import { marked } from "marked";
import { Logger } from "./logger";
import { v4 as uuidv4 } from "uuid";
import { BlogMetaHandler } from "./metadata";
import {
  BlogMeta,
  Metadata,
  CreateBlogOptions,
  UpdateBlogOptions,
} from "./types";
import slugify from "../../node_modules/@sindresorhus/slugify/index";

export class Blog {
  private METADATA_PATH: string;
  private metaHandler: BlogMetaHandler;

  constructor(private blogsPath: string) {
    this.METADATA_PATH = path.join(blogsPath, "METADATA.json");
    this.metaHandler = new BlogMetaHandler(this.METADATA_PATH);
  }

  public createBlog({ title, desc, draft }: CreateBlogOptions) {
    const id = uuidv4();
    const createdAt = new Date();
    const slug = slugify(title, {
      separator: "-",
      lowercase: true,
    });
    const meta: Metadata = {
      id,
      title,
      desc,
      draft,
      slug,
      createdAt,
      editedAt: createdAt,
    };

    const { exists, path: dirPath } = this.__checkIfBlogExists(slug);

    if (exists) {
      Logger.warn("blog already exists");
      return;
    }

    try {
      fs.mkdirSync(dirPath);
      Logger.success(`folder created '${slug}'`);
    } catch (err) {
      Logger.error(`failed to create folder '${slug}'`, err);
      return;
    }

    const metaFilePath = path.join(dirPath, "metadata.json");
    const markdownFilePath = path.join(dirPath, `markdown.md`);
    const htmlFilePath = path.join(dirPath, `parsed.html`);
    try {
      fs.writeFileSync(metaFilePath, JSON.stringify(meta, null, 2));
      Logger.success("metadata.json created");
      fs.writeFileSync(markdownFilePath, "# Hello World");
      Logger.success("markdown.md created");
      fs.writeFileSync(htmlFilePath, "<h1>Hello World</h1>");
      Logger.success("parsed.html created");
    } catch (err) {
      Logger.error("failed to create file", err);
      return;
    }

    this.metaHandler.add(meta);
    Logger.success(`blog created successfully at ${dirPath}`);
  }

  public updateBlog(
    titleSlug: string,
    { title, desc, draft }: UpdateBlogOptions
  ) {
    const { exists, path: dirPath } = this.__checkIfBlogExists(titleSlug);
    if (!exists) {
      console.error("blog doesn't exist");
      return;
    }

    const meta = this.__getMeta(dirPath);

    let isEdited = false;
    let isTitleUpdated = false;

    if (title !== undefined && meta.title !== title) {
      isEdited = true;
      isTitleUpdated = true;
      meta.title = title as string;
      meta.slug = slugify(title as string, {
        separator: "-",
        lowercase: true,
      });
    }

    if (desc !== undefined && desc !== meta.desc) {
      isEdited = true;
      meta.desc = desc as string;
    }

    if (draft !== undefined && draft !== meta.draft) {
      isEdited = true;
      meta.draft = draft as boolean;
    }

    if (isEdited) {
      meta.editedAt = new Date();
    }

    try {
      this.__overWriteMeta(dirPath, meta);
    } catch (err) {
      console.error(`failed to overwrite updated metadata `, err);
      return;
    }

    if (isTitleUpdated) {
      try {
        fs.renameSync(dirPath, path.join(this.blogsPath, meta.slug));
      } catch (err) {
        console.error("failed to rename the folder to updated name", err);
        return;
      }
    }

    // update blog meta
    let blogMeta: BlogMeta;
    try {
      blogMeta = this.metaHandler.getBlogMeta();
    } catch (err) {
      console.error(`failed to parse blog meta: ${err}`);
      return;
    }

    blogMeta.blogs = blogMeta.blogs.map((blog: Metadata) => {
      if (blog.id === meta.id) {
        return meta;
      }
      return blog;
    });

    try {
      this.metaHandler.overWriteBlogMeta(blogMeta);
    } catch (err) {
      console.error(`failed to overwrite blog meta: ${err}`);
      return;
    }

    // * LOGGING
  }

  public deleteBlog(titleSlug: string) {
    const { exists, path: dirPath } = this.__checkIfBlogExists(titleSlug);
    if (!exists) {
      console.error("blog doesn't exist");
      return;
    }

    try {
      fs.rmSync(dirPath, { recursive: true });
    } catch (err) {
      console.error("failed to delete blog", err);
      return;
    }

    try {
      this.metaHandler.remove(titleSlug);
    } catch (err) {
      console.error(`failed to remove from blog meta`, err);
      return;
    }
  }

  public compileBlog(titleSlug: string) {
    const { exists, path: dirPath } = this.__checkIfBlogExists(titleSlug);
    if (!exists) {
      console.error("blog doesn't exist");
      return;
    }

    let markDownContent: string;
    try {
      const buf = fs.readFileSync(path.join(dirPath, "markdown.md"));
      markDownContent = buf.toString();
    } catch (err) {
      console.error("failed to fetch markdown", err);
      return;
    }

    const htmlCode = marked.parse(markDownContent) as string;

    try {
      fs.writeFileSync(path.join(dirPath, "parsed.html"), htmlCode);
    } catch (err) {
      console.error("failed to write html code", err);
      return;
    }
  }

  // ! HELPER METHODS
  public __checkIfBlogExists(titleSlug: string): {
    exists: boolean;
    path: string;
  } {
    const dirPath = path.join(this.blogsPath, titleSlug);
    const blogExists = fs.existsSync(dirPath);
    return { exists: blogExists, path: dirPath };
  }

  private __getMeta(dirPath: string): Metadata {
    try {
      const buf = fs.readFileSync(path.join(dirPath, "metadata.json"));
      const parsedJSON = JSON.parse(buf.toString()) as Metadata;
      return parsedJSON;
    } catch (err) {
      throw err;
    }
  }

  private __overWriteMeta(dirPath: string, meta: Metadata) {
    try {
      fs.writeFileSync(
        path.join(dirPath, "metadata.json"),
        JSON.stringify(meta, null, 2)
      );
    } catch (err) {
      throw err;
    }
  }
}
