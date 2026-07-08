import { createAuthClient } from "shinauth/vue";

export * from "shinauth/client/plugins";

export const client = createAuthClient({
	baseURL: "http://localhost:3000",
});
