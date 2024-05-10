import chalk from "../../node_modules/chalk/source/index";

export class Logger {
  static success(...msg: Array<unknown>) {
    console.log(chalk.greenBright("✅ Success:", ...msg));
  }

  static error(...msg: Array<unknown>) {
    console.log(chalk.redBright("❌ Error: ", ...msg));
  }

  static warn(...msg: Array<unknown>) {
    console.log(chalk.yellowBright("⚠️ Warning:", ...msg));
  }

  static info(...msg: Array<unknown>) {
    console.log(chalk.blueBright("ℹ️ Info:", ...msg));
  }
}
