# @shinauth/prisma-adapter

## 1.7.0-rc.1

## 1.7.0-rc.0

## 1.7.0-beta.10

## 1.7.0-beta.9

### Patch Changes

- Updated dependencies []:
  - @shinauth/core@1.7.0-beta.9

## 1.7.0-beta.8

### Patch Changes

- Updated dependencies [[`7c7313c`](https://github.com/rlvtapp/shinauth/commit/7c7313c8189baabd11a2ecb681bd2b16eb40fa4d), [`97903c9`](https://github.com/rlvtapp/shinauth/commit/97903c9cca47f5fa62cf1d2ab86f6228db04aff0), [`3a79aff`](https://github.com/rlvtapp/shinauth/commit/3a79aff58ed82e45caf04c2ee4acaf0f4d09a86c)]:
  - @shinauth/core@1.7.0-beta.8

## 1.7.0-beta.7

### Patch Changes

- Updated dependencies [[`3d04fab`](https://github.com/rlvtapp/shinauth/commit/3d04fababbf3efd4c46a4012f46ed9397715c2e3), [`de8394d`](https://github.com/rlvtapp/shinauth/commit/de8394de207bae2fe9d0b8d7e901a196c1dc08d0)]:
  - @shinauth/core@1.7.0-beta.7

## 1.7.0-beta.6

### Patch Changes

- Updated dependencies [[`aedcb97`](https://github.com/rlvtapp/shinauth/commit/aedcb974f055c3514fe0464dc53d71d45a8a1725), [`2196ea6`](https://github.com/rlvtapp/shinauth/commit/2196ea65e724830d9f1066c6593210579de586b9)]:
  - @shinauth/core@1.7.0-beta.6

## 1.7.0-beta.5

### Patch Changes

- Updated dependencies [[`7fe0e2b`](https://github.com/rlvtapp/shinauth/commit/7fe0e2b165c17207a43863b0f1c12c401976d6b2), [`4f53b61`](https://github.com/rlvtapp/shinauth/commit/4f53b61f49b470a40ccab18fe1fe4d80f225905f), [`91f235f`](https://github.com/rlvtapp/shinauth/commit/91f235f8604cd432749adf18c7bd7d658aa1519b), [`41cca60`](https://github.com/rlvtapp/shinauth/commit/41cca606d14e7b8a1d16da662d644ca39fe4281f)]:
  - @shinauth/core@1.7.0-beta.5

## 1.7.0-beta.4

## 1.6.23

### Patch Changes

- Updated dependencies []:
  - @shinauth/core@1.6.23

## 1.6.22

### Patch Changes

- Updated dependencies [[`8bd43d9`](https://github.com/rlvtapp/shinauth/commit/8bd43d9d8312fd9ddbfb8fb5c827cf0a0e55132d)]:
  - @shinauth/core@1.6.22

## 1.6.21

### Patch Changes

- [#10180](https://github.com/rlvtapp/shinauth/pull/10180) [`90d509e`](https://github.com/rlvtapp/shinauth/commit/90d509e0b9f72614170ad7124ae9d3a7a97d7d3a) Thanks [@ping-maxwell](https://github.com/ping-maxwell)! - `adapter.update` now returns `null` when no row matches or when it is called without a predicate. Use `updateMany` for intentional bulk updates.

  The Kysely MySQL adapter no longer returns a row after a guarded update misses. Updates with an `id` guard also return the targeted row when `id` is not the first predicate. Keep MySQL rows-matched semantics enabled, which mysql2 does by default through `FOUND_ROWS`; disabling it can make idempotent updates look like misses.

  The Prisma adapter now returns `null` when an update guard excludes the targeted row instead of surfacing Prisma's not-found exception. The shared adapter test suite now asserts the same fail-closed update behavior for adapter implementations.

- Updated dependencies [[`90d509e`](https://github.com/rlvtapp/shinauth/commit/90d509e0b9f72614170ad7124ae9d3a7a97d7d3a), [`816d7f9`](https://github.com/rlvtapp/shinauth/commit/816d7f92522518e90d437c2a366d75db56690f86), [`570267c`](https://github.com/rlvtapp/shinauth/commit/570267cd5e782f018933ce3af4f51dbd250bf7de), [`5953157`](https://github.com/rlvtapp/shinauth/commit/5953157acf619bcb8233c91952b1e4072202f055)]:
  - @shinauth/core@1.6.21

## 1.6.20

### Patch Changes

- Updated dependencies []:
  - @shinauth/core@1.6.20

## 1.6.19

### Patch Changes

- Updated dependencies [[`5bd5e1c`](https://github.com/rlvtapp/shinauth/commit/5bd5e1cc73d2c9c38e69011f03038b61a4312a63), [`a787e0b`](https://github.com/rlvtapp/shinauth/commit/a787e0b66b368a1af0b4ba17c9750c2839668246)]:
  - @shinauth/core@1.6.19

## 1.6.18

### Patch Changes

- Updated dependencies [[`b21a5f7`](https://github.com/rlvtapp/shinauth/commit/b21a5f7f6ca1f63c6b69666a498b4227b15e316c)]:
  - @shinauth/core@1.6.18

## 1.6.17

### Patch Changes

- [#9993](https://github.com/rlvtapp/shinauth/pull/9993) [`baeaa00`](https://github.com/rlvtapp/shinauth/commit/baeaa00bc2a600c04f746c7cc2a07065b7691dcc) Thanks [@gustavovalverde](https://github.com/gustavovalverde)! - Counter updates on the memory, Kysely, Drizzle, Prisma, and MongoDB adapters (used for rate limiting and API-key usage limits) are now atomic on the default configuration, where adapter transactions are not enabled. Each adapter implements `incrementOne` natively as a single statement.

- [#9993](https://github.com/rlvtapp/shinauth/pull/9993) [`baeaa00`](https://github.com/rlvtapp/shinauth/commit/baeaa00bc2a600c04f746c7cc2a07065b7691dcc) Thanks [@gustavovalverde](https://github.com/gustavovalverde)! - A `delete` that fails for any reason other than the record already being absent now surfaces the error instead of silently reporting success.

- Updated dependencies [[`baeaa00`](https://github.com/rlvtapp/shinauth/commit/baeaa00bc2a600c04f746c7cc2a07065b7691dcc), [`7343284`](https://github.com/rlvtapp/shinauth/commit/73432841493a2d99144786c986ee57c071d816d8), [`fdef997`](https://github.com/rlvtapp/shinauth/commit/fdef997eb944d85254816f7a4b2d76c06e9b8ec7), [`baeaa00`](https://github.com/rlvtapp/shinauth/commit/baeaa00bc2a600c04f746c7cc2a07065b7691dcc), [`fdef997`](https://github.com/rlvtapp/shinauth/commit/fdef997eb944d85254816f7a4b2d76c06e9b8ec7), [`baeaa00`](https://github.com/rlvtapp/shinauth/commit/baeaa00bc2a600c04f746c7cc2a07065b7691dcc), [`1dbf5bb`](https://github.com/rlvtapp/shinauth/commit/1dbf5bb59de5d628f0d07d5e846eba8287b831d7), [`fdef997`](https://github.com/rlvtapp/shinauth/commit/fdef997eb944d85254816f7a4b2d76c06e9b8ec7)]:
  - @shinauth/core@1.6.17

## 1.6.16

### Patch Changes

- Updated dependencies [[`cb1cbfa`](https://github.com/rlvtapp/shinauth/commit/cb1cbfa4ccba1ce13f7fea419a6fc37dcbdc2f15), [`cb1cbfa`](https://github.com/rlvtapp/shinauth/commit/cb1cbfa4ccba1ce13f7fea419a6fc37dcbdc2f15), [`cb1cbfa`](https://github.com/rlvtapp/shinauth/commit/cb1cbfa4ccba1ce13f7fea419a6fc37dcbdc2f15), [`cb1cbfa`](https://github.com/rlvtapp/shinauth/commit/cb1cbfa4ccba1ce13f7fea419a6fc37dcbdc2f15), [`cb1cbfa`](https://github.com/rlvtapp/shinauth/commit/cb1cbfa4ccba1ce13f7fea419a6fc37dcbdc2f15), [`cb1cbfa`](https://github.com/rlvtapp/shinauth/commit/cb1cbfa4ccba1ce13f7fea419a6fc37dcbdc2f15)]:
  - @shinauth/core@1.6.16

## 1.6.15

### Patch Changes

- Updated dependencies []:
  - @shinauth/core@1.6.15

## 1.6.14

### Patch Changes

- Updated dependencies [[`13abc79`](https://github.com/rlvtapp/shinauth/commit/13abc7922b47f800da59ca212d364a64feeec91f)]:
  - @shinauth/core@1.6.14

## 1.6.13

### Patch Changes

- Updated dependencies [[`e7eb45b`](https://github.com/rlvtapp/shinauth/commit/e7eb45b065903f5fccddae491696cb069814a3c8), [`03e6c94`](https://github.com/rlvtapp/shinauth/commit/03e6c94e965a7e87c1d44074b8e90257cb1f1cd2), [`1e5b808`](https://github.com/rlvtapp/shinauth/commit/1e5b80847208cf839c9d45363ca19b8eab41c68a), [`13abc79`](https://github.com/rlvtapp/shinauth/commit/13abc7922b47f800da59ca212d364a64feeec91f)]:
  - @shinauth/core@1.7.0-beta.4

## 1.7.0-beta.3

### Patch Changes

- Updated dependencies []:
  - @shinauth/core@1.7.0-beta.3

## 1.7.0-beta.2

### Patch Changes

- Updated dependencies []:
  - @shinauth/core@1.7.0-beta.2

## 1.7.0-beta.1

## 1.6.10

### Patch Changes

- Updated dependencies [[`2220a6d`](https://github.com/rlvtapp/shinauth/commit/2220a6d6c25ebd24c8568131636389dc0c12f82b)]:
  - @shinauth/core@1.6.10

## 1.6.9

### Patch Changes

- Updated dependencies [[`815ecf6`](https://github.com/rlvtapp/shinauth/commit/815ecf62b6f6c5bf656ab55da393ce63d7eed0a6)]:
  - @shinauth/core@1.6.9

## 1.6.8

### Patch Changes

- Updated dependencies [[`9aa8e63`](https://github.com/rlvtapp/shinauth/commit/9aa8e63de84549634216e13e407cf6d8aa61acc3)]:
  - @shinauth/core@1.6.8

## 1.6.7

### Patch Changes

- Updated dependencies [[`307196a`](https://github.com/rlvtapp/shinauth/commit/307196a405e067f4a863de2ed68528e8d4bdc162), [`4a180f0`](https://github.com/rlvtapp/shinauth/commit/4a180f0b0c084c59e7b006058d3fdbd8542face5), [`4f373ee`](https://github.com/rlvtapp/shinauth/commit/4f373eed8a42e02460dbd2ee9973b9493cea04eb)]:
  - @shinauth/core@1.6.7

## 1.6.6

### Patch Changes

- Updated dependencies [[`b5742f9`](https://github.com/rlvtapp/shinauth/commit/b5742f9d08d7c6ae0848279b79c8bcc0a09082d7), [`a844c7d`](https://github.com/rlvtapp/shinauth/commit/a844c7dd087715678787cb10bf9670fad46e535b), [`e64ff72`](https://github.com/rlvtapp/shinauth/commit/e64ff720fb8514cb78aedd1660223d8b948284da)]:
  - @shinauth/core@1.6.6

## 1.6.5

### Patch Changes

- Updated dependencies []:
  - @shinauth/core@1.7.0-beta.1

## 1.7.0-beta.0

### Patch Changes

- Updated dependencies [[`93d3871`](https://github.com/rlvtapp/shinauth/commit/93d3871bd2f7c2fdd423c4c88a22a50b6333e656)]:
  - @shinauth/core@1.7.0-beta.0
  - @shinauth/core@1.6.5

## 1.6.4

### Patch Changes

- Updated dependencies []:
  - @shinauth/core@1.6.4

## 1.6.3

### Patch Changes

- Updated dependencies []:
  - @shinauth/core@1.6.3

## 1.6.2

### Patch Changes

- Updated dependencies []:
  - @shinauth/core@1.6.2

## 1.6.1

### Patch Changes

- Updated dependencies []:
  - @shinauth/core@1.6.1

## 1.6.0

### Minor Changes

- [#8836](https://github.com/rlvtapp/shinauth/pull/8836) [`5dd9e44`](https://github.com/rlvtapp/shinauth/commit/5dd9e44c041839bf269056cb246fd617abe6cd33) Thanks [@gustavovalverde](https://github.com/gustavovalverde)! - Add case-insensitive query support for database adapters

### Patch Changes

- Updated dependencies [[`5dd9e44`](https://github.com/rlvtapp/shinauth/commit/5dd9e44c041839bf269056cb246fd617abe6cd33)]:
  - @shinauth/core@1.6.0

## 1.6.0-beta.0

### Minor Changes

- [`28b1291`](https://github.com/rlvtapp/shinauth/commit/28b1291a86d726b8f2602bf1f4898451cf7c195b) Thanks [@gustavovalverde](https://github.com/gustavovalverde)! - Add case-insensitive query support for database adapters

### Patch Changes

- Updated dependencies [[`28b1291`](https://github.com/rlvtapp/shinauth/commit/28b1291a86d726b8f2602bf1f4898451cf7c195b)]:
  - @shinauth/core@1.6.0-beta.0
