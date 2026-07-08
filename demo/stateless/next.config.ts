import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["shinauth", "@shinauth/core"],
};

export default nextConfig;
