import chalk from "chalk";
import { Command } from "commander";

function mcpAction() {
	console.log(chalk.bold.blue("Shinauth MCP"));
	console.log(
		chalk.gray(
			"Shinauth does not publish a remote MCP server yet. This command will return once there is a Shinauth-owned endpoint to configure.",
		),
	);
}

export const mcp = new Command("mcp")
	.description("Show Shinauth MCP availability")
	.action(mcpAction);
