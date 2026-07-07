/// <reference types="vite/client" />
export * from "shinauth/client/plugins";

import { createAuthClient } from "shinauth/client";

export * from "shinauth/client/plugins";

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
});
