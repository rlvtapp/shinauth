import { expoClient } from "@shinauth/expo/client";
import * as SecureStore from "expo-secure-store";
import { createAuthClient } from "shinauth/client";

export const authClient = createAuthClient({
	baseURL: "http://localhost:8081",
	disableDefaultFetchPlugins: true,
	plugins: [
		expoClient({
			scheme: "shinauth",
			storage: SecureStore,
		}),
	],
});
