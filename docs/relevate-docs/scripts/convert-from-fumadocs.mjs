import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const sourceRoot = path.join(repoRoot, "docs/content/docs");
const changelogRoot = path.join(repoRoot, "docs/content/changelogs");
const blogRoot = path.join(repoRoot, "docs/content/blogs");
const targetRoot = path.join(repoRoot, "docs/relevate-docs");

const sectionOrder = [
	{
		title: "Get Started",
		pages: ["index", "installation", "basic-usage", "comparison"],
	},
	{ title: "AI Resources", prefix: "ai-resources" },
	{ title: "Concepts", prefix: "concepts" },
	{ title: "Authentication", prefix: "authentication" },
	{ title: "Adapters", prefix: "adapters" },
	{ title: "Integrations", prefix: "integrations" },
	{ title: "Infrastructure", prefix: "infrastructure" },
	{ title: "Plugins", prefix: "plugins" },
	{ title: "Guides", prefix: "guides" },
	{ title: "Reference", prefix: "reference" },
	{ title: "Examples", prefix: "examples" },
];

const preferredOrder = new Map([
	["ai-resources", ["ai-resources/index", "ai-resources/mcp", "ai-resources/skills"]],
	[
		"concepts",
		[
			"concepts/api",
			"concepts/cli",
			"concepts/client",
			"concepts/cookies",
			"concepts/database",
			"concepts/email",
			"concepts/hooks",
			"concepts/plugins",
			"concepts/oauth",
			"concepts/rate-limit",
			"concepts/session-management",
			"concepts/typescript",
			"concepts/users-accounts",
		],
	],
	[
		"authentication",
		[
			"authentication/email-password",
			"authentication/apple",
			"authentication/atlassian",
			"authentication/cognito",
			"authentication/discord",
			"authentication/dropbox",
			"authentication/facebook",
			"authentication/figma",
			"authentication/github",
			"authentication/gitlab",
			"authentication/google",
			"authentication/huggingface",
			"authentication/kakao",
			"authentication/kick",
			"authentication/line",
			"authentication/linear",
			"authentication/linkedin",
			"authentication/microsoft",
			"authentication/naver",
			"authentication/notion",
			"authentication/paybin",
			"authentication/paypal",
			"authentication/polar",
			"authentication/railway",
			"authentication/reddit",
			"authentication/roblox",
			"authentication/salesforce",
			"authentication/slack",
			"authentication/spotify",
			"authentication/tiktok",
			"authentication/twitch",
			"authentication/twitter",
			"authentication/vercel",
			"authentication/vk",
			"authentication/wechat",
			"authentication/zoom",
			"authentication/other-social-providers",
		],
	],
	[
		"adapters",
		[
			"adapters/mysql",
			"adapters/sqlite",
			"adapters/postgresql",
			"adapters/mssql",
			"adapters/other-relational-databases",
			"adapters/drizzle",
			"adapters/prisma",
			"adapters/mongo",
			"adapters/community-adapters",
		],
	],
	[
		"integrations",
		[
			"integrations/astro",
			"integrations/react-router",
			"integrations/next",
			"integrations/nuxt",
			"integrations/electron",
			"integrations/svelte-kit",
			"integrations/solid-start",
			"integrations/tanstack",
			"integrations/hono",
			"integrations/fastify",
			"integrations/encore",
			"integrations/express",
			"integrations/elysia",
			"integrations/nitro",
			"integrations/nestjs",
			"integrations/convex",
			"integrations/expo",
			"integrations/lynx",
			"integrations/waku",
		],
	],
	[
		"infrastructure",
		[
			"infrastructure/introduction",
			"infrastructure/getting-started",
			"infrastructure/plugins/dashboard",
			"infrastructure/plugins/audit-logs",
			"infrastructure/plugins/sentinel",
			"infrastructure/services/email",
			"infrastructure/services/sms",
			"infrastructure/plugins/dash",
		],
	],
	[
		"plugins",
		[
			"plugins/index",
			"plugins/2fa",
			"plugins/username",
			"plugins/anonymous",
			"plugins/phone-number",
			"plugins/magic-link",
			"plugins/email-otp",
			"plugins/passkey",
			"plugins/generic-oauth",
			"plugins/one-tap",
			"plugins/siwe",
			"plugins/admin",
			"plugins/agent-auth",
			"plugins/api-key/index",
			"plugins/api-key/advanced",
			"plugins/api-key/reference",
			"plugins/mcp",
			"plugins/organization",
			"plugins/oidc-provider",
			"plugins/oauth-provider",
			"plugins/sso",
			"plugins/scim",
			"plugins/bearer",
			"plugins/device-authorization",
			"plugins/captcha",
			"plugins/have-i-been-pwned",
			"plugins/i18n",
			"plugins/last-login-method",
			"plugins/multi-session",
			"plugins/oauth-proxy",
			"plugins/one-time-token",
			"plugins/open-api",
			"plugins/jwt",
			"plugins/test-utils",
			"plugins/stripe",
			"plugins/polar",
			"plugins/autumn",
			"plugins/dodopayments",
			"plugins/creem",
			"plugins/chargebee",
			"plugins/commet",
			"plugins/dub",
			"plugins/community-plugins",
		],
	],
	[
		"guides",
		[
			"guides/your-first-plugin",
			"guides/create-a-db-adapter",
			"guides/browser-extension-guide",
			"guides/dynamic-base-url",
			"guides/saml-sso-with-okta",
			"guides/optimizing-for-performance",
			"guides/1-7-upgrade-guide",
			"guides/next-auth-migration-guide",
			"guides/auth0-migration-guide",
			"guides/clerk-migration-guide",
			"guides/supabase-migration-guide",
			"guides/workos-migration-guide",
		],
	],
	[
		"reference",
		[
			"reference/options",
			"reference/errors/index",
			"reference/errors/invalid_callback_request",
			"reference/errors/invalid_code",
			"reference/errors/internal_server_error",
			"reference/errors/state_not_found",
			"reference/errors/state_invalid",
			"reference/errors/state_mismatch",
			"reference/errors/no_code",
			"reference/errors/no_callback_url",
			"reference/errors/oauth_provider_not_found",
			"reference/errors/email_not_found",
			"reference/errors/email_doesn't_match",
			"reference/errors/unable_to_get_user_info",
			"reference/errors/unable_to_link_account",
			"reference/errors/unable_to_create_user",
			"reference/errors/unable_to_create_session",
			"reference/errors/account_not_linked",
			"reference/errors/account_already_linked_to_different_user",
			"reference/errors/signup_disabled",
			"reference/errors/unknown",
			"reference/contributing",
			"reference/resources",
			"reference/security",
			"reference/telemetry",
			"reference/instrumentation",
			"reference/faq",
		],
	],
	[
		"examples",
		[
			"examples/next",
			"examples/astro",
			"examples/react-router",
			"examples/next-js",
			"examples/nuxt",
			"examples/svelte-kit",
		],
	],
]);

const titleOverrides = new Map([
	["index", "Introduction"],
	["plugins/index", "Plugins"],
	["ai-resources/index", "AI Resources"],
	["reference/errors/index", "Errors"],
]);

async function listMdxFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await listMdxFiles(fullPath)));
			continue;
		}
		if (entry.isFile() && entry.name.endsWith(".mdx")) {
			files.push(fullPath);
		}
	}
	return files;
}

function splitFrontmatter(source) {
	if (!source.startsWith("---\n")) {
		return { frontmatter: "", body: source };
	}
	const end = source.indexOf("\n---\n", 4);
	if (end === -1) {
		return { frontmatter: "", body: source };
	}
	return {
		frontmatter: source.slice(0, end + 5),
		body: source.slice(end + 5),
	};
}

function getFrontmatterTitle(frontmatter, fallback) {
	return getFrontmatterValue(frontmatter, "title") || titleize(fallback);
}

function getFrontmatterValue(frontmatter, key) {
	const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
	if (!match) return "";
	return match[1].trim().replace(/^["']|["']$/g, "");
}

function titleize(value) {
	return value
		.split("/")
		.at(-1)
		.replace(/[-_]/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function targetSlugFor(sourcePath) {
	const relative = path.relative(sourceRoot, sourcePath).replaceAll(path.sep, "/");
	const slug = relative.replace(/\.mdx$/, "");
	if (slug === "introduction") return "index";
	return slug;
}

function rewriteBrands(source) {
	return source
		.replaceAll("Better Auth", "Shinauth")
		.replaceAll("better-auth.com", "github.com/rlvtapp/shinauth")
		.replaceAll("mcp.better-auth.com/mcp", "docs.relevate.app/_relevate/mcp")
		.replace(/\bbeter-auth\b/g, "shinauth")
		.replace(/\bbetter-auth\b/g, "shinauth")
		.replace(/\bbetterAuth\b/g, "shinAuth")
		.replace(/@better-auth\//g, "@shinauth/")
		.replace(/\bnpm install @shinauth\//g, "pnpm add @shinauth/")
		.replace(/\bnpm install shinauth\b/g, "pnpm add shinauth")
		.replace(/\bnpx auth@latest\b/g, "pnpm dlx @shinauth/cli")
		.replace(/\bnpx auth\b/g, "pnpm dlx @shinauth/cli");
}

function rewriteLinks(source) {
	let output = source.replace(/\[([^\]]+)\]\(\/docs\/([^)#]+)(#[^)]+)?\)/g, (_, label, href, hash = "") => {
		return `[${label}](/${href}${hash})`;
	});

	output = output.replace(
		/(!\[[^\]]*\]\()\/open-api-reference\.png(\))/g,
		"$1/public/open-api-reference.png$2",
	);

	output = output.replace(/<Link\s+href="([^"]+)">([\s\S]*?)<\/Link>/g, (_, href, label) => {
		const cleanHref = href.startsWith("/docs/") ? `/${href.slice(6)}` : href;
		return `[${label.trim()}](${cleanHref})`;
	});

	return output;
}

function rewriteCodeFenceMeta(source) {
	return source
		.replace(/```package-install/g, "```bash")
		.replace(/```ts twoslash/g, "```ts")
		.replace(/```tsx twoslash/g, "```tsx")
		.replace(/```json title="/g, '```json title="')
		.replace(/\s*\/\/ \[!code (highlight|focus|--|\+\+)\]/g, "")
		.replace(/\s*# \[!code (highlight|focus|--|\+\+)\]/g, "");
}

function stripEsmOutsideCode(source) {
	const lines = source.split("\n");
	const kept = [];
	let inFence = false;
	let skippingExport = false;
	let exportDepth = 0;

	for (const line of lines) {
		if (line.trimStart().startsWith("```")) {
			inFence = !inFence;
			kept.push(line);
			continue;
		}

		if (!inFence && skippingExport) {
			exportDepth += countChars(line, "{") + countChars(line, "[") + countChars(line, "(");
			exportDepth -= countChars(line, "}") + countChars(line, "]") + countChars(line, ")");
			if (exportDepth <= 0 && /;?\s*$/.test(line)) {
				skippingExport = false;
			}
			continue;
		}

		if (!inFence && /^\s*import\s+/.test(line)) {
			continue;
		}

		if (!inFence && /^\s*export\s+(const|let|var|type|interface)\s+/.test(line)) {
			exportDepth =
				countChars(line, "{") +
				countChars(line, "[") +
				countChars(line, "(") -
				countChars(line, "}") -
				countChars(line, "]") -
				countChars(line, ")");
			skippingExport = exportDepth > 0 || !line.includes(";");
			continue;
		}

		kept.push(line);
	}

	return kept.join("\n");
}

function countChars(value, char) {
	return value.split(char).length - 1;
}

function rewriteMdxComponents(source) {
	let output = source;

	output = output.replace(/<APIMethod\b([^>]*)>/g, (_, attrs) => {
		const pathMatch = attrs.match(/path="([^"]+)"/);
		const methodMatch = attrs.match(/method="([^"]+)"/);
		const method = methodMatch?.[1]?.toUpperCase() ?? "API";
		const apiPath = pathMatch?.[1] ?? "";
		return `\n### ${method} ${apiPath}\n`;
	});
	output = output.replace(/<\/APIMethod>/g, "");

	output = output.replace(/<Tabs\b[^>]*>/g, "");
	output = output.replace(/<\/Tabs>/g, "");
	output = output.replace(/<Tab\b([^>]*)>/g, (_, attrs) => {
		const titleMatch = attrs.match(/title="([^"]+)"/);
		const valueMatch = attrs.match(/value="([^"]+)"/);
		const title = titleMatch?.[1] ?? valueMatch?.[1] ?? "Example";
		return `\n#### ${title}\n`;
	});
	output = output.replace(/<\/Tab>/g, "");

	output = output.replace(/<Steps>/g, "");
	output = output.replace(/<\/Steps>/g, "");
	output = output.replace(/<Step>/g, "");
	output = output.replace(/<\/Step>/g, "");

	output = output.replace(/<Callout\b([^>]*)>/g, (_, attrs) => {
		const type = attrs.match(/type="([^"]+)"/)?.[1];
		const label =
			type === "warn" || type === "warning"
				? "Warning"
				: type === "error"
					? "Error"
					: type === "success"
						? "Success"
						: "Note";
		return `\n**${label}:**\n`;
	});
	output = output.replace(/<\/Callout>/g, "");

	output = output.replace(/<Accordion\b[^>]*>/g, "");
	output = output.replace(/<\/Accordion>/g, "");
	output = output.replace(/<Accordions\b[^>]*>/g, "");
	output = output.replace(/<\/Accordions>/g, "");
	output = output.replace(/<Cards\b[^>]*>/g, "");
	output = output.replace(/<\/Cards>/g, "");
	output = output.replace(/<Card\b([^>]*)\/>/g, (_, attrs) => {
		const title = attrs.match(/title="([^"]+)"/)?.[1] ?? "Related page";
		const href = attrs.match(/href="([^"]+)"/)?.[1];
		const description = attrs.match(/description="([^"]+)"/)?.[1];
		const normalizedHref = href?.startsWith("/docs/") ? `/${href.slice(6)}` : href;
		return normalizedHref
			? `- [${title}](${normalizedHref})${description ? ` - ${description}` : ""}`
			: `- ${title}${description ? ` - ${description}` : ""}`;
	});
	output = output.replace(/<Card\b[^>]*>/g, "");
	output = output.replace(/<\/Card>/g, "");

	output = output.replace(/<Files\b[^>]*>/g, "");
	output = output.replace(/<\/Files>/g, "");
	output = output.replace(/<Folder\b[^>]*>/g, "");
	output = output.replace(/<\/Folder>/g, "");
	output = output.replace(/<File\b[^>]*>/g, "");
	output = output.replace(/<\/File>/g, "");

	output = output.replace(/<TypeTable\b[^>]*\/>/g, "\nSee the source types for the complete option reference.\n");
	output = output.replace(/<DatabaseTable\b[^>]*\/>/g, "\nSee the generated schema for the complete table definition.\n");
	output = output.replace(/<Endpoint\b[^>]*\/>/g, "");
	output = output.replace(/<GenerateSecret\s*\/>/g, "");
	output = output.replace(/<Features\s*\/>/g, "- Email and password authentication\n- Social sign-on\n- Sessions\n- Plugins\n- Framework integrations");
	output = output.replace(/<ForkButton\b[^>]*\/>/g, "");
	output = output.replace(/<AddToCursor\s*\/>/g, "");
	output = output.replace(/<DividerText\b[^>]*\/>/g, "");
	output = output.replace(/<HeaderLabel\b[^>]*>([\s\S]*?)<\/HeaderLabel>/g, "**$1**");
	output = output.replace(/<img\b[^>]*src="([^"]+)"[^>]*\/?>/g, (_, src) => {
		if (src === "/extension-id.png") {
			return "Find the extension ID on the extension card in `chrome://extensions`.";
		}
		return `![Screenshot](${src})`;
	});

	return output;
}

function stripRemainingJsxOutsideCode(source) {
	const lines = source.split("\n");
	const kept = [];
	let inFence = false;

	for (const line of lines) {
		if (line.trimStart().startsWith("```")) {
			inFence = !inFence;
			kept.push(line);
			continue;
		}
		if (!inFence && /^\s*<\/?[A-Z][A-Za-z0-9]*(\s[^>]*)?\/?>\s*$/.test(line)) {
			continue;
		}
		kept.push(line);
	}

	return kept.join("\n");
}

function normalizeWhitespace(source) {
	return source
		.replace(/\n{4,}/g, "\n\n\n")
		.replace(/[ \t]+\n/g, "\n")
		.trim()
		.concat("\n");
}

function convertPage(source, slug, title) {
	const { body } = splitFrontmatter(source);
	const nextTitle = titleOverrides.get(slug) ?? title;
	let output = body;
	output = rewriteBrands(output);
	output = rewriteLinks(output);
	output = rewriteCodeFenceMeta(output);
	output = stripEsmOutsideCode(output);
	output = rewriteMdxComponents(output);
	output = stripRemainingJsxOutsideCode(output);
	output = normalizeWhitespace(output);

	return `---\ntitle: ${JSON.stringify(nextTitle)}\n---\n\n${output}`;
}

function versionSlugFor(sourcePath) {
	const basename = path.basename(sourcePath, ".mdx");
	return `v${basename.replace(/\./g, "-")}`;
}

function versionLabelFor(sourcePath) {
	const basename = path.basename(sourcePath, ".mdx");
	const normalized = basename.replace(/-/g, ".");
	return `v${normalized.replace(/\.rc$/i, " RC")}`;
}

function changelogSlugFor(sourcePath, date) {
	const versionSlug = versionSlugFor(sourcePath);
	const year = date.slice(0, 4);
	const monthDay = date.slice(5);
	return `changelog/${year}/${monthDay}-${versionSlug}`;
}

function convertChangelogPage(source, slug, label) {
	const { frontmatter, body } = splitFrontmatter(source);
	const title = getFrontmatterTitle(frontmatter, slug).replace("Better Auth", "Shinauth");
	const description = getFrontmatterValue(frontmatter, "description").replace(
		"Better Auth",
		"Shinauth",
	);
	const date = getFrontmatterValue(frontmatter, "date");
	let output = body;
	output = rewriteBrands(output);
	output = rewriteLinks(output);
	output = rewriteCodeFenceMeta(output);
	output = rewriteMdxComponents(output);
	output = stripRemainingJsxOutsideCode(output);
	output = normalizeWhitespace(output);

	return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\ntype: improved\ndate: ${date}\nlabel: ${JSON.stringify(label)}\ntags: ["Release"]\n---\n\n${output}`;
}

function buildChangelogIndex() {
	return `---\ntitle: Changelog\ndescription: Release notes for Shinauth.\n---\n`;
}

async function writePage(slug, content) {
	const targetPath = path.join(targetRoot, `${slug}.mdx`);
	await mkdir(path.dirname(targetPath), { recursive: true });
	await writeFile(targetPath, content);
}

function sortKnown(prefix, pages) {
	const order = preferredOrder.get(prefix) ?? [];
	const orderIndex = new Map(order.map((page, index) => [page, index]));
	return [...pages].sort((a, b) => {
		const ai = orderIndex.has(a) ? orderIndex.get(a) : Number.MAX_SAFE_INTEGER;
		const bi = orderIndex.has(b) ? orderIndex.get(b) : Number.MAX_SAFE_INTEGER;
		if (ai !== bi) return ai - bi;
		return a.localeCompare(b);
	});
}

function buildNavigation(allPages) {
	const pageSet = new Set(allPages);
	const groups = [
		{
			title: "Get Started",
			pages: ["index", "installation", "basic-usage", "comparison"],
		},
		{
			title: "AI Resources",
			pages: ["ai-resources/index", "ai-resources/mcp", "ai-resources/skills"],
		},
		{
			title: "Concepts",
			pages: [
				"concepts/api",
				"concepts/cli",
				"concepts/client",
				"concepts/cookies",
				"concepts/database",
				"concepts/email",
				"concepts/hooks",
				"concepts/plugins",
				"concepts/oauth",
				"concepts/rate-limit",
				"concepts/session-management",
				"concepts/typescript",
				"concepts/users-accounts",
			],
		},
		{
			title: "Authentication: Core",
			pages: ["authentication/email-password", "authentication/other-social-providers"],
		},
		{
			title: "Authentication: Social Providers",
			pages: [
				"authentication/apple",
				"authentication/atlassian",
				"authentication/cognito",
				"authentication/discord",
				"authentication/dropbox",
				"authentication/facebook",
				"authentication/figma",
				"authentication/github",
				"authentication/gitlab",
				"authentication/google",
				"authentication/huggingface",
				"authentication/kakao",
				"authentication/kick",
				"authentication/line",
				"authentication/linear",
				"authentication/linkedin",
				"authentication/microsoft",
				"authentication/naver",
				"authentication/notion",
				"authentication/paybin",
				"authentication/paypal",
				"authentication/polar",
				"authentication/railway",
				"authentication/reddit",
				"authentication/roblox",
				"authentication/salesforce",
				"authentication/slack",
				"authentication/spotify",
				"authentication/tiktok",
				"authentication/twitch",
				"authentication/twitter",
				"authentication/vercel",
				"authentication/vk",
				"authentication/wechat",
				"authentication/zoom",
			],
		},
		{
			title: "Adapters: Databases",
			pages: [
				"adapters/mysql",
				"adapters/sqlite",
				"adapters/postgresql",
				"adapters/mssql",
				"adapters/other-relational-databases",
			],
		},
		{
			title: "Adapters: ORMs & Community",
			pages: [
				"adapters/drizzle",
				"adapters/prisma",
				"adapters/mongo",
				"adapters/community-adapters",
			],
		},
		{
			title: "Integrations: Full-Stack Frameworks",
			pages: [
				"integrations/astro",
				"integrations/react-router",
				"integrations/next",
				"integrations/nuxt",
				"integrations/electron",
				"integrations/svelte-kit",
				"integrations/solid-start",
				"integrations/tanstack",
			],
		},
		{
			title: "Integrations: Servers & Runtimes",
			pages: [
				"integrations/hono",
				"integrations/fastify",
				"integrations/encore",
				"integrations/express",
				"integrations/elysia",
				"integrations/nitro",
				"integrations/nestjs",
				"integrations/convex",
				"integrations/expo",
				"integrations/lynx",
				"integrations/waku",
			],
		},
		{
			title: "Infrastructure: Overview",
			pages: ["infrastructure/introduction", "infrastructure/getting-started"],
		},
		{
			title: "Infrastructure: Plugins",
			pages: [
				"infrastructure/plugins/dashboard",
				"infrastructure/plugins/audit-logs",
				"infrastructure/plugins/sentinel",
				"infrastructure/plugins/dash",
			],
		},
		{
			title: "Infrastructure: Services",
			pages: ["infrastructure/services/email", "infrastructure/services/sms"],
		},
		{
			title: "Plugins: Core Auth",
			pages: [
				"plugins/index",
				"plugins/2fa",
				"plugins/username",
				"plugins/anonymous",
				"plugins/phone-number",
				"plugins/magic-link",
				"plugins/email-otp",
				"plugins/passkey",
				"plugins/one-tap",
				"plugins/siwe",
			],
		},
		{
			title: "Plugins: Access & Identity",
			pages: [
				"plugins/admin",
				"plugins/agent-auth",
				"plugins/api-key/index",
				"plugins/api-key/advanced",
				"plugins/api-key/reference",
				"plugins/bearer",
				"plugins/multi-session",
				"plugins/last-login-method",
				"plugins/one-time-token",
			],
		},
		{
			title: "Plugins: OAuth & SSO",
			pages: [
				"plugins/generic-oauth",
				"plugins/mcp",
				"plugins/organization",
				"plugins/oidc-provider",
				"plugins/oauth-provider",
				"plugins/oauth-proxy",
				"plugins/sso",
				"plugins/scim",
				"plugins/device-authorization",
			],
		},
		{
			title: "Plugins: Security & Utilities",
			pages: [
				"plugins/captcha",
				"plugins/have-i-been-pwned",
				"plugins/i18n",
				"plugins/open-api",
				"plugins/jwt",
				"plugins/test-utils",
			],
		},
		{
			title: "Plugins: Payments & Commerce",
			pages: [
				"plugins/stripe",
				"plugins/polar",
				"plugins/autumn",
				"plugins/dodopayments",
				"plugins/creem",
				"plugins/chargebee",
				"plugins/commet",
				"plugins/dub",
			],
		},
		{ title: "Plugins: Community", pages: ["plugins/community-plugins"] },
		{
			title: "Guides: Build",
			pages: [
				"guides/your-first-plugin",
				"guides/create-a-db-adapter",
				"guides/browser-extension-guide",
				"guides/dynamic-base-url",
				"guides/saml-sso-with-okta",
				"guides/optimizing-for-performance",
				"guides/1-7-upgrade-guide",
			],
		},
		{
			title: "Guides: Migration",
			pages: [
				"guides/next-auth-migration-guide",
				"guides/auth0-migration-guide",
				"guides/clerk-migration-guide",
				"guides/supabase-migration-guide",
				"guides/workos-migration-guide",
			],
		},
		{
			title: "Reference",
			pages: [
				"reference/options",
				"reference/contributing",
				"reference/resources",
				"reference/security",
				"reference/telemetry",
				"reference/instrumentation",
				"reference/faq",
			],
		},
		{
			title: "Reference: Errors",
			pages: [
				"reference/errors/index",
				"reference/errors/invalid_callback_request",
				"reference/errors/invalid_code",
				"reference/errors/internal_server_error",
				"reference/errors/state_not_found",
				"reference/errors/state_invalid",
				"reference/errors/state_mismatch",
				"reference/errors/no_code",
				"reference/errors/no_callback_url",
				"reference/errors/oauth_provider_not_found",
				"reference/errors/email_not_found",
				"reference/errors/email_doesn't_match",
				"reference/errors/unable_to_get_user_info",
				"reference/errors/unable_to_link_account",
				"reference/errors/unable_to_create_user",
				"reference/errors/unable_to_create_session",
				"reference/errors/account_not_linked",
				"reference/errors/account_already_linked_to_different_user",
				"reference/errors/signup_disabled",
				"reference/errors/unknown",
			],
		},
		{
			title: "Examples",
			pages: [
				"examples/astro",
				"examples/react-router",
				"examples/next-js",
				"examples/nuxt",
				"examples/svelte-kit",
			],
		},
	];
	const content = groups
		.map((group) => ({ ...group, pages: filterNavNodes(group.pages, pageSet) }))
		.filter((group) => group.pages.length > 0);

	const assigned = new Set(content.flatMap((section) => flattenNavNodes(section.pages)));
	const remaining = allPages.filter((page) => !assigned.has(page)).sort();
	if (remaining.length > 0) {
		content.push({ title: "Other", pages: remaining });
	}
	const nestedContent = nestColonGroups(content);

	return {
		$schema: "https://relevate.app/schemas/docs/0.1/schema.json",
		version: "0.1",
		name: "Shinauth",
		changelog: {
			path: "/changelog",
		},
		colors: {
			primary: "#0C74C0",
			light: "#1199fb",
			dark: "#0C74C0",
			background: {
				light: "#ffffff",
				dark: "#1c1a1f",
			},
		},
		favicon: "/public/favicon.svg",
		navigation: {
			tabs: [
				{
					id: "docs",
					label: "Documentation",
					content: nestedContent,
				},
				{
					id: "changelog",
					label: "Changelog",
					content: ["changelog"],
				},
			],
		},
		logo: {
			light: "/public/light.svg",
			dark: "/public/dark.svg",
		},
	};
}

function filterNavNodes(nodes, pageSet) {
	const filtered = [];

	for (const node of nodes) {
		if (typeof node === "string") {
			if (pageSet.has(node)) filtered.push(node);
			continue;
		}

		if (node.page) {
			if (pageSet.has(node.page)) filtered.push(node);
			continue;
		}

		if (node.pages) {
			const pages = filterNavNodes(node.pages, pageSet);
			if (pages.length > 0) {
				filtered.push({ ...node, pages });
			}
		}
	}

	return filtered;
}

function flattenNavNodes(nodes) {
	const pages = [];

	for (const node of nodes) {
		if (typeof node === "string") {
			pages.push(node);
		} else if (node.page) {
			pages.push(node.page);
		} else if (node.pages) {
			pages.push(...flattenNavNodes(node.pages));
		}
	}

	return pages;
}

function nestColonGroups(groups) {
	const nested = [];
	const byTitle = new Map();

	for (const group of groups) {
		const [parentTitle, childTitle] = group.title.split(": ");
		if (!childTitle) {
			nested.push(group);
			byTitle.set(group.title, group);
			continue;
		}

		let parent = byTitle.get(parentTitle);
		if (!parent) {
			parent = { title: parentTitle, pages: [] };
			nested.push(parent);
			byTitle.set(parentTitle, parent);
		}

		parent.pages.push({
			title: childTitle,
			pages: group.pages,
		});
	}

	return nested;
}

const sourceFiles = await listMdxFiles(sourceRoot);
const pages = [];

for (const sourcePath of sourceFiles) {
	const source = await readFile(sourcePath, "utf8");
	const slug = targetSlugFor(sourcePath);
	const { frontmatter } = splitFrontmatter(source);
	const title = getFrontmatterTitle(frontmatter, slug);
	await writePage(slug, convertPage(source, slug, title));
	pages.push(slug);
}

const changelogFiles = await listMdxFiles(changelogRoot);
const releaseBlogFiles = (await listMdxFiles(blogRoot)).filter((sourcePath) => {
	return /^1-\d+(?:-rc)?\.mdx$/.test(path.basename(sourcePath));
});
const releases = [];
await rm(path.join(targetRoot, "changelog"), { recursive: true, force: true });
for (const sourcePath of [...changelogFiles, ...releaseBlogFiles]) {
	const source = await readFile(sourcePath, "utf8");
	const { frontmatter } = splitFrontmatter(source);
	const date = getFrontmatterValue(frontmatter, "date");
	const slug = changelogSlugFor(sourcePath, date);
	const label = versionLabelFor(sourcePath);
	const release = {
		slug,
		title: getFrontmatterTitle(frontmatter, slug).replace("Better Auth", "Shinauth"),
		description: getFrontmatterValue(frontmatter, "description").replace(
			"Better Auth",
			"Shinauth",
		),
		date,
	};
	releases.push(release);
	await writePage(slug, convertChangelogPage(source, slug, label));
}
releases.sort((a, b) => b.date.localeCompare(a.date));
await writePage("changelog/index", buildChangelogIndex());

const navigation = buildNavigation([...new Set(pages)].sort());
await writeFile(
	path.join(targetRoot, "docs.json"),
	`${JSON.stringify(navigation, null, 2)}\n`,
);

console.log(`Converted ${pages.length} pages into ${targetRoot}`);
