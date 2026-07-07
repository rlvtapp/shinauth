<div align="center">
  <h1>Shinauth</h1>

  [![npm](https://img.shields.io/npm/dm/shinauth?style=flat&colorA=000000&colorB=000000)](https://npm.chart.dev/shinauth?primary=neutral&gray=neutral&theme=dark)
  [![npm version](https://img.shields.io/npm/v/shinauth.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/shinauth)
  [![GitHub stars](https://img.shields.io/github/stars/rlvtapp/shinauth?style=flat&colorA=000000&colorB=000000)](https://github.com/rlvtapp/shinauth/stargazers)

  <p>
    <a href="https://github.com/rlvtapp/shinauth/issues">Issues</a>
    ·
    <a href="https://github.com/rlvtapp/shinauth/tree/main/packages">Packages</a>
    ·
    <a href="https://github.com/rlvtapp/shinauth/blob/main/LICENSE.md">License</a>
  </p>
</div>

## Shinauth

Shinauth is a framework-agnostic authentication and authorization framework for TypeScript. It is an independent fork of Better Auth, created to keep the auth stack detached from Vercel stewardship and portable across runtimes, frameworks, hosts, and deployment platforms.

The name “Shinauth” combines “shin” and “auth”. In Japanese, shin can be read through ideas like `新` (new), `真` (true), `信` (trust), and `心` (heart or core), which fits a fork focused on keeping authentication independent, portable, and open.

Although Shinauth is maintained under Relevate and may use Relevate-run infrastructure such as Relevate Docs, Relevate will never turn Shinauth into a product. There will be no enterprise section, hosted upsell, or proprietary tier. Shinauth will stay MIT-licensed. We maintain it because we need an independent auth framework ourselves, and because the TypeScript community benefits from having one that stays open and portable.

## Install

```bash
pnpm add shinauth
```

```ts
import { shinAuth } from "shinauth";

export const auth = shinAuth({
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

## Documentation

The documentation site is still being carried over from Shinauth. It will move to Relevate docs later; until then, package names in this repository are the source of truth for Shinauth usage.

## License

Shinauth is free and open source under the [MIT License](https://github.com/rlvtapp/shinauth/blob/main/LICENSE.md).
