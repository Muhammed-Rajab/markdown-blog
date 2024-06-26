import fs from "node:fs";
import path from "node:path";
// @ts-ignore
import { marked } from "marked";
import { Logger } from "./logger.js";
import { v4 as uuidv4 } from "uuid";
import { BlogMetaHandler } from "./metadata.js";
import {
  BlogMeta,
  Metadata,
  CreateBlogOptions,
  UpdateBlogOptions,
} from "./types.js";
import slugify from "../../node_modules/@sindresorhus/slugify/index.js";
import chalk from "../../node_modules/chalk/source/index.js";

export class Blog {
  private METADATA_PATH: string;
  private metaHandler: BlogMetaHandler;

  constructor(private blogsPath: string, private assetsPath: string) {
    this.METADATA_PATH = path.join(blogsPath, "METADATA.json");
    this.metaHandler = new BlogMetaHandler(this.METADATA_PATH);
  }

  public createBlog({ title, desc, draft, cover, tags }: CreateBlogOptions) {
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
      cover: cover !== undefined ? cover : "",
      editedAt: createdAt,
      tags,
    };

    const { exists: blogExists, path: dirPath } =
      this.__checkIfBlogExists(slug);
    const { exists: assetsExists, path: assetsPath } =
      this.__checkIfAssetsExists(slug);

    if (blogExists) {
      Logger.warn("blog already exists");
      return;
    }

    if (assetsExists) {
      Logger.warn("assets already exists");
      return;
    }

    try {
      fs.mkdirSync(dirPath);
      Logger.success(`blog folder created '${slug}'`);
    } catch (err) {
      Logger.error(`failed to create blog folder '${slug}'`, err);
      return;
    }

    try {
      fs.mkdirSync(assetsPath);
      Logger.success(`assets folder created '${slug}'`);
      fs.mkdirSync(path.join(assetsPath, "img"));
      Logger.success(`image folder created '${slug}/img'`);
      fs.mkdirSync(path.join(assetsPath, "media"));
      Logger.success(`media folder created '${slug}/media'`);
      fs.mkdirSync(path.join(assetsPath, "docs"));
      Logger.success(`docs folder created '${slug}/docs'`);
    } catch (err) {
      Logger.error(`failed to create assets folder '${slug}'`, err);
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

    this.__commitToSaveChangesMsg();
  }

  public updateBlog(
    titleSlug: string,
    { title, desc, draft, cover, tags }: UpdateBlogOptions
  ) {
    const { exists: blogExists, path: dirPath } =
      this.__checkIfBlogExists(titleSlug);
    const { exists: assetsExists, path: assetsPath } =
      this.__checkIfAssetsExists(titleSlug);

    if (!blogExists) {
      Logger.warn("blog doesn't exists");
      return;
    }

    if (!assetsExists) {
      Logger.warn("assets doesn't exists");
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

    if (cover !== undefined && cover !== meta.cover) {
      isEdited = true;
      meta.cover = cover as string;
    }
    if (tags !== undefined && tags !== meta.tags) {
      isEdited = true;
      meta.tags = tags as string;
    }

    if (isEdited) {
      meta.editedAt = new Date();
    }

    try {
      this.__overWriteMeta(dirPath, meta);
      Logger.success("overwrite metadata.json");
    } catch (err) {
      Logger.error("failed to overwrite updated metadata ", err);
      return;
    }

    let newDirPath = path.join(this.blogsPath, meta.slug);
    let newAssetsPath = path.join(this.assetsPath, meta.slug);
    if (isTitleUpdated) {
      try {
        fs.renameSync(dirPath, newDirPath);
        Logger.success(`renamed blog folder to '${meta.slug}'`);
        fs.renameSync(assetsPath, newAssetsPath);
        Logger.success(`renamed assets folder to '${meta.slug}'`);
      } catch (err) {
        Logger.error("failed to rename folder", err);
        return;
      }
    }

    // update blog meta
    let blogMeta: BlogMeta;
    try {
      blogMeta = this.metaHandler.getBlogMeta();
    } catch (err) {
      console.error(`failed to parse METADATA.json: ${err}`);
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
      Logger.success("overwrite METADATA.json");
    } catch (err) {
      Logger.error("failed to overwrite METADATA.json", err);
      return;
    }

    Logger.success(`blog updated successfully at ${newDirPath}`);

    this.__commitToSaveChangesMsg();
  }

  public deleteBlog(titleSlug: string, removeAssets: boolean = false) {
    const { exists: blogExists, path: dirPath } =
      this.__checkIfBlogExists(titleSlug);
    const { exists: assetsExists, path: assetsPath } =
      this.__checkIfAssetsExists(titleSlug);

    if (!blogExists) {
      Logger.warn("blog doesn't exists");
      return;
    }

    if (!assetsExists) {
      Logger.warn("assets doesn't exists");
      return;
    }

    try {
      fs.rmSync(dirPath, { recursive: true });
      Logger.success(`removed blog folder '${titleSlug}'`);
    } catch (err) {
      Logger.error("failed to remove blog folder", err);
      return;
    }

    if (removeAssets === true) {
      try {
        fs.rmSync(assetsPath, { recursive: true });
        Logger.success(`removed assets folder '${titleSlug}'`);
      } catch (err) {
        Logger.error("failed to remove assets folder", err);
        return;
      }
    }

    try {
      this.metaHandler.remove(titleSlug);
      Logger.success("overwrite METADATA.json");
    } catch (err) {
      Logger.error(`failed to remove from blog meta`, err);
      return;
    }

    Logger.success(`deleted blog '${titleSlug}'`);

    this.__commitToSaveChangesMsg();
  }

  public parseBlog(titleSlug: string) {
    const { exists, path: dirPath } = this.__checkIfBlogExists(titleSlug);
    if (!exists) {
      Logger.warn("blog doesn't exist");
      return;
    }

    let markDownContent: string;
    try {
      const buf = fs.readFileSync(path.join(dirPath, "markdown.md"));
      markDownContent = buf.toString();
    } catch (err) {
      Logger.error("failed to fetch markdown", err);
      return;
    }

    const htmlCode = marked.parse(markDownContent) as string;

    try {
      fs.writeFileSync(path.join(dirPath, "parsed.html"), htmlCode);
    } catch (err) {
      console.error("failed to write html code", err);
      return;
    }

    Logger.success(
      `compiled markdown.md to parsed.html at ${path.join(
        dirPath,
        "parsed.html"
      )}`
    );

    this.__commitToSaveChangesMsg();
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

  public __checkIfAssetsExists(titleSlug: string): {
    exists: boolean;
    path: string;
  } {
    const dirPath = path.join(this.assetsPath, titleSlug);
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

  public __commitToSaveChangesMsg() {
    console.log();
    console.log(chalk.white.bold("to commit changes 💾, run: "));
    console.log(chalk.italic("  git add ."));
    console.log(chalk.italic("  git commit"));
  }
}
