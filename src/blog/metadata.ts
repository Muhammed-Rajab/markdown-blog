import fs from "node:fs";
import path from "node:path";
import slugify from "../../node_modules/@sindresorhus/slugify/index";
import { BlogMeta, Metadata } from "./types";
import { v4 as uuidv4 } from "uuid";

// * Types for BlogMetaData
type CreateBlogOptions = {
  title: string;
  desc: string;
  draft: boolean;
};
type UpdateBlogOptions = {
  title?: string;
  desc?: string;
  draft?: boolean;
};

export class BlogMetaHandler {
  constructor(private METADATA_PATH: string) {}

  public add(meta: Metadata) {
    // Get existing metadata
    let blogMeta: BlogMeta;
    try {
      blogMeta = this.getBlogMeta();
    } catch (err) {
      throw err;
    }

    // Add to the blogs
    blogMeta.blogs.push(meta);

    // Rewrite the existing metadata
    try {
      this.overWriteBlogMeta(blogMeta);
    } catch (err) {
      throw err;
    }
  }

  public remove(titleSlug: string) {
    // Get all blogs
    let blogMeta: BlogMeta;
    try {
      blogMeta = this.getBlogMeta();
    } catch (err) {
      throw err;
    }

    // Filter this one out
    blogMeta.blogs = blogMeta.blogs.filter((blog) => blog.slug !== titleSlug);

    // Overwrite the blog meta
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

export class Blog {
  private METADATA_PATH: string;
  private metaHandler: BlogMetaHandler;
  constructor(private blogsPath: string) {
    this.METADATA_PATH = path.join(blogsPath, "METADATA.json");
    this.metaHandler = new BlogMetaHandler(this.METADATA_PATH);
  }

  public createBlog({ title, desc, draft }: CreateBlogOptions) {
    // Create metadata object
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

    const { exists, path: folderPath } = this.__checkIfBlogExists(slug);

    if (exists) {
      console.log("blog already exists");
      return;
    }

    try {
      fs.mkdirSync(folderPath);
      console.log("Folder created successfully", folderPath);
    } catch (err) {
      console.error("failed to create the folder", err);
      return;
    }

    const metaFilePath = path.join(folderPath, "metadata.json");
    const markdownFilePath = path.join(folderPath, `markdown.md`);
    const htmlFilePath = path.join(folderPath, `parsed.html`);
    try {
      fs.writeFileSync(metaFilePath, JSON.stringify(meta, null, 2));
      console.log("Created metadata file");
      fs.writeFileSync(markdownFilePath, "# Hello World");
      console.log("Created markdown file");

      // ! DO THE RENDERING LATER
      fs.writeFileSync(htmlFilePath, "");
      console.log("Created html file");
    } catch (err) {
      console.error("failed to create files", err);
      return;
    }

    // Update the METADATA.json
    this.metaHandler.add(meta);
  }

  public updateBlog(
    titleSlug: string,
    { title, desc, draft }: UpdateBlogOptions
  ) {
    // check if it exists
    const { exists, path: dirPath } = this.__checkIfBlogExists(titleSlug);
    if (!exists) {
      console.log("blog doesn't exist");
      return;
    }

    // get the blog meta
    const meta = this.__getMeta(dirPath);

    // update meta

    let isEdited = false;
    let isTitleUpdated = false;

    // check if title has changed, if yes, create new slug
    if (title !== undefined && meta.title !== title) {
      isEdited = true;
      isTitleUpdated = true;
      meta.title = title as string;
      meta.slug = slugify(title as string, {
        separator: "-",
        lowercase: true,
      });
    }

    // check if desc has changed
    if (desc !== undefined && desc !== meta.desc) {
      isEdited = true;
      meta.desc = desc as string;
    }

    // check if draft has changed
    if (draft !== undefined && draft !== meta.draft) {
      isEdited = true;
      meta.draft = draft as boolean;
    }

    if (isEdited) {
      meta.editedAt = new Date();
    }

    // save the new meta to metadata.json
    try {
      this.__overWriteMeta(dirPath, meta);
    } catch (err) {
      console.log(`failed to overwrite updated metadata `, err);
      return;
    }

    // rename the folder if title is changed
    try {
      fs.renameSync(dirPath, path.join(this.blogsPath, meta.slug));
    } catch (err) {
      console.log("failed to rename the folder to updated name", err);
      return;
    }

    // ! ERROR HANDLING REQUIRED

    // update blog meta
    const blogMeta = this.metaHandler.getBlogMeta();

    blogMeta.blogs = blogMeta.blogs.map((blog: Metadata) => {
      if (blog.id === meta.id) {
        return meta;
      }
      return blog;
    });

    this.metaHandler.overWriteBlogMeta(blogMeta);
  }

  public deleteBlog(titleSlug: string) {
    // check if it exists
    const { exists, path: dirPath } = this.__checkIfBlogExists(titleSlug);
    if (!exists) {
      console.log("blog doesn't exist");
      return;
    }

    // delete the stuff
    try {
      fs.rmSync(dirPath, { recursive: true });
    } catch (err) {
      console.error("failed to delete file", err);
      return;
    }

    // remove fom blog meta
    try {
      this.metaHandler.remove(titleSlug);
    } catch (err) {
      console.error(`failed to remove from blog meta`, err);
      return;
    }
  }

  public compileBlog(titleSlug: string) {}

  // ! HELPER METHODS
  private __checkIfBlogExists(titleSlug: string): {
    exists: boolean;
    path: string;
  } {
    const dirPath = path.join(this.blogsPath, titleSlug);
    const blogExists = fs.existsSync(dirPath);
    if (!blogExists) {
      return { exists: false, path: "" };
    }
    return { exists: true, path: dirPath };
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
