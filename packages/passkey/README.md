# Shinauth Passkey Plugin

## Installation

```bash
# Using npm
npm install shinauth @shinauth/passkey

# Using yarn
yarn add shinauth @shinauth/passkey

# Using pnpm
pnpm add shinauth @shinauth/passkey

# Using bun
bun add shinauth @shinauth/passkey
```

## Usage

### Server

```typescript
import { betterAuth } from 'shinauth';
import { passkey } from '@shinauth/passkey';

export const auth = betterAuth({
  plugins: [
    passkey({
      rpID: 'example.com',
      rpName: 'My App',
    }),
  ],
});
```

### Client

```typescript
import { createAuthClient } from 'shinauth/client';
import { passkeyClient } from '@shinauth/passkey/client';

export const authClient = createAuthClient({
  plugins: [passkeyClient()],
});
```

## Documentation

For more information, visit the [Shinauth Passkey documentation](https://shinauth.com/docs/plugins/passkey).

## License

MIT
