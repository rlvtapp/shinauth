export interface CommunityPlugin {
	name: string;
	url: string;
	description: string;
	author: {
		name: string;
		github: string;
		avatar: string;
	};
}

export const communityPlugins: CommunityPlugin[] = [
	{
		name: "@dymo-api/shinauth",
		url: "https://github.com/TPEOficial/dymo-api-shinauth",
		description:
			"Sign Up Protection and validation of disposable emails (the world's largest database with nearly 14 million entries).",
		author: {
			name: "TPEOficial",
			github: "TPEOficial",
			avatar: "https://github.com/TPEOficial.png",
		},
	},
	{
		name: "better-auth-harmony",
		url: "https://github.com/gekorm/better-auth-harmony/",
		description:
			"Email & phone normalization and additional validation, blocking over 55,000 temporary email domains.",
		author: {
			name: "GeKorm",
			github: "GeKorm",
			avatar: "https://github.com/GeKorm.png",
		},
	},
	{
		name: "validation-shinauth",
		url: "https://github.com/Daanish2003/validation-shinauth",
		description:
			"Validate API request using any validation library (e.g., Zod, Yup)",
		author: {
			name: "Daanish2003",
			github: "Daanish2003",
			avatar: "https://github.com/Daanish2003.png",
		},
	},
	{
		name: "shinauth-localization",
		url: "https://github.com/marcellosso/shinauth-localization",
		description:
			"Localize and customize shinauth messages with easy translation and message override support.",
		author: {
			name: "marcellosso",
			github: "marcellosso",
			avatar: "https://github.com/marcellosso.png",
		},
	},
	{
		name: "shinauth-attio-plugin",
		url: "https://github.com/tobimori/shinauth-attio-plugin",
		description: "Sync your products Shinauth users & workspaces with Attio",
		author: {
			name: "tobimori",
			github: "tobimori",
			avatar: "https://github.com/tobimori.png",
		},
	},
	{
		name: "shinauth-cloudflare",
		url: "https://github.com/zpg6/shinauth-cloudflare",
		description:
			"Seamlessly integrate with Cloudflare Workers, D1, Hyperdrive, KV, R2, and geolocation services. Includes CLI for project generation, automated resource provisioning on Cloudflare, and database migrations. Supports Next.js, Hono, and more!",
		author: {
			name: "zpg6",
			github: "zpg6",
			avatar: "https://github.com/zpg6.png",
		},
	},
	{
		name: "expo-shinauth-passkey",
		url: "https://github.com/kevcube/expo-shinauth-passkey",
		description:
			"Better-auth client plugin for using passkeys on mobile platforms in expo apps. Supports iOS, macOS, Android (and web!) by wrapping the existing shinauth passkey client plugin.",
		author: {
			name: "kevcube",
			github: "kevcube",
			avatar: "https://github.com/kevcube.png",
		},
	},
	{
		name: "shinauth-credentials-plugin",
		url: "https://github.com/erickweil/shinauth-credentials-plugin",
		description: "LDAP authentication plugin for Shinauth.",
		author: {
			name: "erickweil",
			github: "erickweil",
			avatar: "https://github.com/erickweil.png",
		},
	},
	{
		name: "shinauth-opaque",
		url: "https://github.com/TheUntraceable/shinauth-opaque",
		description:
			"Provides database-breach resistant authentication using the zero-knowledge OPAQUE protocol.",
		author: {
			name: "TheUntraceable",
			github: "TheUntraceable",
			avatar: "https://github.com/theuntraceable.png",
		},
	},
	{
		name: "shinauth-firebase-auth",
		url: "https://github.com/yultyyev/shinauth-firebase-auth",
		description:
			"Firebase Authentication plugin for Shinauth with built-in email service, Google Sign-In, and password reset functionality.",
		author: {
			name: "yultyyev",
			github: "yultyyev",
			avatar: "https://github.com/yultyyev.png",
		},
	},
	{
		name: "shinauth-university",
		url: "https://github.com/LuyxLLC/shinauth-university",
		description:
			"University plugin for allowing only specific email domains to be passed through. Includes a University model with name and domain.",
		author: {
			name: "Fyrlex",
			github: "Fyrlex",
			avatar: "https://github.com/Fyrlex.png",
		},
	},
	{
		name: "@alexasomba/shinauth-paystack",
		url: "https://github.com/alexasomba/shinauth-paystack",
		description:
			"Paystack plugin for Shinauth — integrates Paystack transactions, webhooks, and subscription flows.",
		author: {
			name: "alexasomba",
			github: "alexasomba",
			avatar: "https://github.com/alexasomba.png",
		},
	},
	{
		name: "shinauth-lark",
		url: "https://github.com/uselark/shinauth-lark",
		description:
			"Lark billing plugin that automatically creates customers and subscribes them to free plans on signup.",
		author: {
			name: "Vijit",
			github: "vijit-lark",
			avatar: "https://github.com/vijit-lark.png",
		},
	},
	{
		name: "stargate-shinauth",
		url: "https://github.com/neiii/stargate-shinauth",
		description:
			"Gate access to resources based on whether the user has starred a repository",
		author: {
			name: "neiii",
			github: "neiii",
			avatar: "https://github.com/neiii.png",
		},
	},
	{
		name: "@sequenzy/shinauth",
		url: "https://github.com/Sequenzy/sequenzy-shinauth",
		description:
			"Automatically add users to Sequenzy mailing lists on signup for seamless email marketing integration.",
		author: {
			name: "Sequenzy",
			github: "sequenzy",
			avatar: "https://sequenzy.com/logo.png",
		},
	},
	{
		name: "shinauth-nostr",
		url: "https://github.com/leon-wbr/shinauth-nostr",
		description: "Nostr authentication plugin for Shinauth (NIP-98).",
		author: {
			name: "leon-wbr",
			github: "leon-wbr",
			avatar: "https://github.com/leon-wbr.png",
		},
	},
	{
		name: "@ramiras123/shinauth-strapi",
		url: "https://github.com/Ramiras123/shinauth-strapi",
		description: "Plugin for authorization via strapi",
		author: {
			name: "Ramiras123",
			github: "ramiras123",
			avatar: "https://github.com/ramiras123.png",
		},
	},
	{
		name: "shinauth-razorpay",
		url: "https://github.com/iamjasonkendrick/shinauth-razorpay",
		description:
			"Razorpay payment plugin for Shinauth — integrates Razorpay payments, webhooks, and subscription flows.",
		author: {
			name: "iamjasonkendrick",
			github: "iamjasonkendrick",
			avatar: "https://github.com/iamjasonkendrick.png",
		},
	},
	{
		name: "shinauth-payu",
		url: "https://github.com/iamjasonkendrick/shinauth-payu",
		description:
			"PayU payment plugin for Shinauth — integrates PayU payments, webhooks, and subscription flows.",
		author: {
			name: "iamjasonkendrick",
			github: "iamjasonkendrick",
			avatar: "https://github.com/iamjasonkendrick.png",
		},
	},
	{
		name: "better-invite",
		url: "https://github.com/better-invite/better-invite",
		description:
			"Easily create and manage user invitations, allowing you to invite users with customizable settings and track usage.",
		author: {
			name: "Sandy",
			github: "0-Sandy",
			avatar: "https://github.com/0-Sandy.png",
		},
	},
	{
		name: "shinauth-usos",
		url: "https://github.com/qamarq/shinauth-usos",
		description:
			"USOS plugin for Shinauth - allows students to authenticate using their university credentials via the USOS API. Using oauth 1a.",
		author: {
			name: "qamarq",
			github: "qamarq",
			avatar: "https://github.com/qamarq.png",
		},
	},
	{
		name: "shinauth-devtools",
		url: "https://github.com/C-W-D-Harshit/shinauth-devtools",
		description:
			"A devtools panel for Shinauth that lets you create managed test users from templates, switch between sessions instantly, inspect live session data, and edit fields like roles on the fly. All from a floating React UI that only runs in development.",
		author: {
			name: "C-W-D-Harshit",
			github: "C-W-D-Harshit",
			avatar: "https://github.com/C-W-D-Harshit.png",
		},
	},
	{
		name: "shinauth-audit-logs",
		url: "https://github.com/ejirocodes/shinauth-audit-logs",
		description:
			"Audit log plugin for Shinauth. Auto-captures auth events with severity inference, PII redaction, custom storage backends, and retention policies.",
		author: {
			name: "ejirocodes",
			github: "ejirocodes",
			avatar: "https://github.com/ejirocodes.png",
		},
	},
	{
		name: "better-near-auth",
		url: "https://github.com/elliotBraem/better-near-auth",
		description:
			"Sign in with NEAR plugin with built-in gasless relay for on-chain delegate actions.",
		author: {
			name: "efiz.near",
			github: "elliotBraem",
			avatar: "https://github.com/elliotBraem.png",
		},
	},
	{
		name: "ton-shinauth",
		url: "https://github.com/mhbdev/ton-shinauth",
		description: "Sign in with Ton Connect",
		author: {
			name: "mhbdev",
			github: "mhbdev",
			avatar: "https://github.com/mhbdev.png",
		},
	},
	{
		name: "@dbsc-toolkit/shinauth",
		url: "https://www.npmjs.com/package/@dbsc-toolkit/shinauth",
		description:
			"Device Bound Session Credentials (DBSC) — binds sessions to a device-resident key so a stolen cookie can't be replayed from another machine. Native binding via TPM or Secure Enclave on Chromium 145+, with a Web Crypto polyfill for Firefox, Safari, and older Chromium.",
		author: {
			name: "SulimanAbdulrazzaq",
			github: "SulimanAbdulrazzaq",
			avatar: "https://github.com/SulimanAbdulrazzaq.png",
		},
	},
];
