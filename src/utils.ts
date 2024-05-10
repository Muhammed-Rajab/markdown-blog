import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const __dirname = dirname(fileURLToPath(import.meta.url));
export const BLOGS_PATH = path.join(__dirname, "../blogs");
export const ASSETS_PATH = path.join(__dirname, "../assets");
