---
"@shinauth/core": minor
"@shinauth/oauth-provider": patch
"shinauth": patch
---

OAuth and device-authorization responses that carry credentials now consistently send `Cache-Control: no-store` and `Pragma: no-cache`, so proxies, CDNs, and browsers never cache them. This covers the token, introspection, and userinfo endpoints, dynamic and admin client registration, client secret rotation, and the device code and device token responses, including the error responses from those endpoints.

Endpoints declare this with `metadata: { noStore: true }`, and the header set is exported from `@shinauth/core` as `NO_STORE_HEADERS` for responses built by hand.
