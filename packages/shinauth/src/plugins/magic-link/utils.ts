import { base64Url } from "@shinauth/utils/base64";
import { createHash } from "@shinauth/utils/hash";

export const defaultKeyHasher = async (otp: string) => {
	const hash = await createHash("SHA-256").digest(
		new TextEncoder().encode(otp),
	);
	const hashed = base64Url.encode(new Uint8Array(hash), {
		padding: false,
	});
	return hashed;
};
