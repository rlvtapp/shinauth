---
"shinauth": patch
---

Cloudflare Workers apps can now start when importing Shinauth subpaths such as `shinauth/db`. Beta builds were crashing during module initialization before application code ran.
