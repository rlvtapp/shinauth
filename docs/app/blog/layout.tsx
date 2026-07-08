import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const description = "Latest updates, articles, and insights about Shinauth";

export const metadata: Metadata = createMetadata({
	title: "Blog",
	description,
	openGraph: {
		url: "/blog",
		title: "Blog - Shinauth",
		description,
		images: ["/api/og-release?heading=Better%20Auth%20Blog"],
	},
	twitter: {
		images: ["/api/og-release?heading=Better%20Auth%20Blog"],
		title: "Blog - Shinauth",
		description,
	},
	alternates: {
		types: {
			"application/rss+xml": [
				{
					title: "Shinauth Blog",
					url: "https://shinauth.com/blog/rss.xml",
				},
			],
		},
	},
});

export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<RootProvider>
			<div className="relative flex min-h-screen flex-col">
				<main className="flex-1">{children}</main>
			</div>
		</RootProvider>
	);
}
