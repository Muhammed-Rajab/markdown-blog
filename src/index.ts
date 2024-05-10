import { Blog } from "./blog/blog";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Logger } from "./blog/logger";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOGS_PATH = path.join(__dirname, "../blogs");

const meta = new Blog(BLOGS_PATH);

// if (!meta.__checkIfBlogExists("test-blog").exists)
//   meta.createBlog({
//     title: "test blog",
//     desc: "This requires me to keep my ego aside and actually think it about the problem from a consumer perspective....",
//     draft: false,
//   });

// meta.compileBlog("test-blog");

Logger.success("Created a new blog");
Logger.error("JSON parsing resulted in error");
Logger.warn("Blog already exists");
Logger.info("The analytics is doing great!");
