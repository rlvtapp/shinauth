import { expoClient } from "@shinauth/expo/client";
import { createAuthClient } from "shinauth/client";
import * as SecureStore from "expo-secure-store";

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
