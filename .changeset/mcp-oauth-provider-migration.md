---
"@shinauth/mcp": minor
"shinauth": minor
"@shinauth/oauth-provider": minor
---

The MCP plugin moves out of `shinauth` into its own package, `@shinauth/mcp`, built on `@shinauth/oauth-provider`. Import the server plugin and its helpers from `@shinauth/mcp`, and the remote client and adapters from `@shinauth/mcp/client` and `@shinauth/mcp/client/adapters` (previously imported from `shinauth/plugins` and `shinauth/plugins/mcp/client`). The OAuth endpoints move from `/mcp/*` to `/oauth2/*`, with discovery at `/.well-known/oauth-authorization-server` and protected resource metadata at `/.well-known/oauth-protected-resource`. Discovery-based MCP clients pick up the new locations on their own.

The route helper is renamed `requireMcpAuth` (was `withMcpAuth`), and the remote client is `createMcpResourceClient` (was `createMcpAuthClient`). `requireMcpAuth` verifies the bearer token against the published JWKS and passes the verified JWT claims to your handler.

To migrate, install `@shinauth/mcp`, add the `jwt()` plugin (now required for token signing), and move options that were nested under `oidcConfig` to flat options on `mcp({ ... })`. The database models change: `oauthApplication` becomes `oauthClient`, with new `oauthRefreshToken` and `oauthClientAssertion` tables. Regenerate or migrate your schema with `npx auth migrate` or `npx auth generate`.
