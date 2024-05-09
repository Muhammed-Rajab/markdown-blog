import { BlogMetaData } from "./blog/metadata";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOGS_PATH = path.join(__dirname, "../blogs");

const meta = new BlogMetaData(BLOGS_PATH);

meta.createBlog({
  title: "React: Where we wrong about it?",
  desc: "This requires me to keep my ego aside and actually think it about the problem from a consumer perspective....",
  draft: false,
});
