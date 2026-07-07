import { headers } from "next/headers";
import EntryButton from "@/components/entry-button";
import { auth } from "@/lib/auth";

const features: { name: string; link: string }[] = [
	{
		name: "Email & Password",
		link: "https://github.com/rlvtapp/shinauth",
	},
	{
		name: "Organization | Teams",
		link: "https://github.com/rlvtapp/shinauth",
	},
	{
		name: "Passkeys",
		link: "https://github.com/rlvtapp/shinauth",
	},
	{
		name: "Multi Factor",
		link: "https://github.com/rlvtapp/shinauth",
	},
	{
		name: "Password Reset",
		link: "https://github.com/rlvtapp/shinauth",
	},
	{
		name: "Email Verification",
		link: "https://github.com/rlvtapp/shinauth",
	},
	{
		name: "Roles & Permissions",
		link: "https://github.com/rlvtapp/shinauth",
	},
	{
		name: "Rate Limiting",
		link: "https://github.com/rlvtapp/shinauth",
	},
	{
		name: "Session Management",
		link: "https://github.com/rlvtapp/shinauth",
	},
	{
		name: "Multiple Session",
		link: "https://github.com/rlvtapp/shinauth",
	},
	{
		name: "Stripe Integration",
		link: "https://github.com/rlvtapp/shinauth",
	},
	{
		name: "Last Login Method",
		link: "https://github.com/rlvtapp/shinauth",
	},
	{
		name: "OAuth Provider",
		link: "https://github.com/rlvtapp/shinauth",
	},
];

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div className="min-h-[80vh] flex items-center justify-center overflow-hidden no-visible-scrollbar">
			<main className="flex flex-col gap-4 row-start-2 items-center justify-center">
				<div className="flex flex-col gap-1">
					<h3 className="text-3xl sm:text-4xl text-black dark:text-white text-center">
						SHINAUTH.
					</h3>
					<p className="text-center wrap-break-word text-sm md:text-base">
						Official demo to showcase{" "}
						<a
							href="https://github.com/rlvtapp/shinauth"
							target="_blank"
							className="italic underline"
						>
							shinauth.
						</a>{" "}
						features and capabilities. <br />
					</p>
				</div>
				<div className="max-w-xl w-full flex flex-col gap-4">
					<div className="flex flex-col gap-3 pt-2 flex-wrap">
						<div className="border p-2 border-dashed bg-secondary/70">
							<div className="text-xs flex items-center gap-2 justify-center text-muted-foreground">
								<span className="text-center">
									All features on this demo are implemented with Shinauth
									without any custom backend code
								</span>
							</div>
						</div>
						<div className="flex gap-2 justify-center flex-wrap">
							{features.map((feature) => (
								<a
									className="border-b pb-1 text-muted-foreground text-xs cursor-pointer hover:text-foreground duration-150 ease-in-out transition-all hover:border-foreground flex items-center gap-1"
									key={feature.name}
									href={feature.link}
								>
									{feature.name}
								</a>
							))}
						</div>
					</div>

					<div className="flex items-center justify-center">
						<EntryButton session={session} />
					</div>
				</div>
			</main>
		</div>
	);
}
