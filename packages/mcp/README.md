# @shinauth/mcp

Model Context Protocol (MCP) plugin for [Shinauth](https://www.shinauth.com).

`mcp()` turns your Shinauth app into an OAuth 2.1 authorization server for MCP
clients, built on [`@shinauth/oauth-provider`](https://www.shinauth.com/docs/plugins/oauth-provider).
It serves the RFC 9728 protected resource metadata so MCP clients can discover it.
To protect an MCP route, wrap its handler with `requireMcpAuth` (or `mcpHandler`),
which verifies bearer tokens against the published JWKS.

```ts
import { betterAuth } from "shinauth";
import { jwt } from "shinauth/plugins";
import { mcp } from "@shinauth/mcp";

export const auth = betterAuth({
  plugins: [jwt(), mcp({ loginPage: "/login", consentPage: "/consent" })],
});
```

See the [MCP plugin documentation](https://www.shinauth.com/docs/plugins/mcp).
