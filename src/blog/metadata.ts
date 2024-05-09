import fs from "node:fs";
import path from "node:path";
import slugify from "../../node_modules/@sindresorhus/slugify/index";
import { BlogMeta, Metadata } from "./types";
import { v4 as uuidv4 } from "uuid";

// * Types for BlogMetaData
type CreateBlogConfig = {
  title: string;
  desc: string;
  draft: boolean;
};

export class BlogMetaData {
  private METADATA_PATH: string;
  constructor(private blogsPath: string) {
    this.METADATA_PATH = path.join(blogsPath, "METADATA.json");
  }

  public createBlog({ title, desc, draft }: CreateBlogConfig) {
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
    let blogMetaContent: BlogMeta;
    try {
      const metaContent = fs.readFileSync(this.METADATA_PATH);
      const parsedMetaContent = JSON.parse(metaContent.toString()) as BlogMeta;
      blogMetaContent = parsedMetaContent;
    } catch (err) {
      console.error("failed to update METADATA.json", err);
      return;
    }

    // Update the content
    blogMetaContent.blogs.push(meta);

    // Write to file
    try {
      fs.writeFileSync(
        this.METADATA_PATH,
        JSON.stringify(blogMetaContent, null, 2)
      );
      console.log("added meta to file");
    } catch (err) {
      console.error("failed to update files", err);
      return;
    }
  }

  public updateBlog() {}
  public deleteBlog() {}
  public compileBlog() {}
}
