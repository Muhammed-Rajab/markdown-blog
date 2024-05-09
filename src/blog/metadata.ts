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

    const folderPath = path.join(this.blogsPath, slug);
    try {
      fs.mkdirSync(folderPath);
      console.log("Folder created successfully", folderPath);
    } catch (err) {
      console.error("failed to create the folder", err);
      return;
    }

    const metaFilePath = path.join(folderPath, "metadata.json");
    const markdownFilePath = path.join(folderPath, `${slug}.md`);
    const htmlFilePath = path.join(folderPath, `${slug}.html`);
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
    // update meta
    // update blog meta
  }

  public deleteBlog(titleSlug: string) {
    // check if it exists
    const dirPath = path.join(this.blogsPath, titleSlug);
    const blogExists = fs.existsSync(dirPath);
    if (!blogExists) {
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
}
