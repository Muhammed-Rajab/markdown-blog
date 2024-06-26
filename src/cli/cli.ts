#! /usr/bin/env node
import figlet from "figlet";
import chalk from "chalk";
import { Command } from "commander";
import { Blog } from "../blog/blog.js";
import { ASSETS_PATH, BLOGS_PATH } from "../utils.js";

const program = new Command();
const blog = new Blog(BLOGS_PATH, ASSETS_PATH);

program
  .version("69.69.69")
  .description("Manage blogs, without much effort.")
  .option("-c, --create", "to create a new blog")
  .option("-u, --update", "to update an existing blog")
  .option("-x, --delete", "to delete an existing blog")
  .option("-p, --parse", "to parse markdown to html")
  .option("-s, --slug  <slug>", "title slug of the blog")
  .option("-t, --title <title>", "specify title")
  .option("-g, --tags <tags>", "specify tags")
  .option("-d, --desc  <description>", "specify description")
  .option("-r, --draft [draft]", "specify draft status (true or false)")
  .option("-v, --cover <cover>", "specify cover url of blog")
  .option("--delete-assets <assets>", "specify whether to delete the assets []")
  .parse(process.argv);

function banner() {
  console.log(
    chalk.bold.underline.cyanBright(
      figlet.textSync("md-blog", {
        font: "Sub-Zero",
      })
    )
  );
  console.log(chalk.italic("Write, Manage and Publish. All at one place."));
}

const opts = program.opts();

if (opts.create) {
  // * Validation
  const required = ["title", "desc", "draft"];
  for (let prop of required) {
    if (opts[prop] === undefined) {
      const msg = `${prop} is required`;
      console.log(msg);
      process.exit(1);
    }
  }

  const title = opts.title;
  const desc = opts.desc;
  const draft = opts.draft;
  const cover = opts.cover || "";
  const tags = opts.tags || "";

  blog.createBlog({
    title,
    desc,
    draft: draft === "true" ? true : false,
    cover,
    tags,
  });
} else if (opts.update) {
  const slug = opts.slug;

  if (slug === undefined) {
    console.log("-s, --slug is required");
    process.exit(1);
  }

  const title = opts.title;
  const desc = opts.desc;
  let draft = opts.draft;
  draft = draft === undefined ? undefined : draft === "true" ? true : false;
  const cover = opts.cover;
  const tags = opts.tags;

  blog.updateBlog(slug, {
    title,
    desc,
    draft,
    cover,
    tags,
  });
} else if (opts.delete) {
  const slug = opts.slug;
  let deleteAssets = opts.deleteAssets;
  deleteAssets =
    deleteAssets === undefined ? false : deleteAssets === "true" ? true : false;

  if (slug === undefined) {
    console.log("-s, --slug is required");
    process.exit(1);
  }

  blog.deleteBlog(slug, deleteAssets);
} else if (opts.parse) {
  const slug = opts.slug;

  if (slug === undefined) {
    console.log("-s, --slug is required");
    process.exit(1);
  }

  blog.parseBlog(slug);
} else {
  console.log(opts);
}
