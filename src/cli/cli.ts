#! /usr/bin/env node
import figlet from "figlet";
import chalk from "chalk";
import { Command } from "commander";

const program = new Command();

program
  .version("1.0.0")
  .description("Manage blogs, without much effort.")
  .option("-c, --create", "to create a new blog")
  .option("-t, --title <title>", "specify title")
  .option("-d, --desc <description>", "specify description")
  .option("-r, --draft [draft]", "specify draft status (true of false)")
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

  //   Execute stuff
}
