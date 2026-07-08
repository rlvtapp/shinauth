import Crypto from "node:crypto";
import chalk from "chalk";
import { Command } from "commander";

export const generateSecret = new Command("secret").action(() => {
	const secret = Crypto.randomBytes(32).toString("hex");
	console.log(`\nAdd the following to your .env file:
${
	chalk.gray("# Shinauth Secret") +
	chalk.green(`\nSHINAUTH_SECRET=${secret}\nBETTER_AUTH_SECRET=${secret}`)
}`);
});
