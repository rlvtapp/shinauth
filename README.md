<div align="center">
  <picture>
    <source srcset="./banner-dark.png" media="(prefers-color-scheme: dark)"/>
    <source srcset="./banner-light.png" media="(prefers-color-scheme: light)"/>
    <img src="./banner-light.png" alt="Shinauth Logo"/>
  </picture>

  [![npm](https://img.shields.io/npm/dm/shinauth?style=flat&colorA=000000&colorB=000000)](https://npm.chart.dev/shinauth?primary=neutral&gray=neutral&theme=dark)
  [![npm version](https://img.shields.io/npm/v/shinauth.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/shinauth)
  [![GitHub stars](https://img.shields.io/github/stars/rlvtapp/shinauth?style=flat&colorA=000000&colorB=000000)](https://github.com/rlvtapp/shinauth/stargazers)

  <p>
    <a href="https://github.com/rlvtapp/shinauth/issues">Issues</a>
    ·
    <a href="./packages">Packages</a>
    ·
    <a href="./LICENSE.md">License</a>
  </p>
</div>

## Shinauth

Shinauth is a framework-agnostic authentication and authorization framework for TypeScript. It is an independent fork of Better Auth, created to keep the auth stack detached from Vercel stewardship and portable across runtimes, frameworks, hosts, and deployment platforms.

The project keeps the broad Better Auth feature surface: email and password auth, social sign-in, sessions, passkeys, two-factor auth, organizations, OAuth/OIDC, SSO, SCIM, API keys, Stripe integration, and database adapters.

Although Shinauth is maintained under Relevate and may use Relevate-run infrastructure such as Relevate Docs, Relevate will never turn Shinauth into a product. There will be no enterprise section, hosted upsell, or proprietary tier. Shinauth will stay MIT-licensed. We maintain it because we need an independent auth framework ourselves, and because the TypeScript community benefits from having one that stays open and portable.

## Install

```bash
pnpm add shinauth
```

```ts
import { betterAuth } from "shinauth";

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
});
```

Client packages and integrations live under the `@shinauth` scope:

```bash
pnpm add @shinauth/passkey @shinauth/sso @shinauth/drizzle-adapter
```

The CLI is published as `@shinauth/cli` and exposes the `shinauth` command:

```bash
pnpm dlx @shinauth/cli init
```

## Packages

- `shinauth` - main authentication library
- `@shinauth/core` - shared core types and utilities
- `@shinauth/cli` - project setup, schema generation, and migration helpers
- `@shinauth/*-adapter` - database adapters for Prisma, Drizzle, Kysely, MongoDB, and memory
- `@shinauth/passkey`, `@shinauth/sso`, `@shinauth/scim`, `@shinauth/api-key`, `@shinauth/stripe`, and more - optional plugins and integrations

## Documentation

The documentation site is still being carried over from Better Auth. It will move to Relevate docs later; until then, package names in this repository are the source of truth for Shinauth usage.

## Development

This repository uses `pnpm`.

```bash
pnpm install
pnpm typecheck
pnpm build
```

Avoid `pnpm test` for normal development because it runs the whole workspace. Run targeted Vitest files instead.

## License

Shinauth is free and open source under the [MIT License](./LICENSE.md).
