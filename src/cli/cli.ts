#! /usr/bin/env node
import figlet from "figlet";
import { Command } from "commander";
import chalk from "chalk";

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

banner();
