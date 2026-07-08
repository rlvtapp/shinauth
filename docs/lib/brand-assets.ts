export const brandAssetPaths = {
	assetsZip: "/branding/shinauth-brand-assets.zip",
	mark: {
		light: {
			svg: "/branding/svg/shinauth-mark-light.svg",
			png: "/branding/png/shinauth-mark-light.png",
		},
		dark: {
			svg: "/branding/svg/shinauth-mark-dark.svg",
			png: "/branding/png/shinauth-mark-dark.png",
		},
	},
	wordmark: {
		light: {
			svg: "/branding/svg/shinauth-wordmark-light.svg",
			png: "/branding/png/shinauth-wordmark-light.png",
		},
		dark: {
			svg: "/branding/svg/shinauth-wordmark-dark.svg",
			png: "/branding/png/shinauth-wordmark-dark.png",
		},
	},
} as const;

export const brandLogoPreviews = [
	{
		label: "Mark · Light",
		src: brandAssetPaths.mark.light.svg,
		bg: "bg-black",
	},
	{
		label: "Mark · Dark",
		src: brandAssetPaths.mark.dark.svg,
		bg: "bg-white",
	},
	{
		label: "Wordmark · Light",
		src: brandAssetPaths.wordmark.light.svg,
		bg: "bg-black",
	},
	{
		label: "Wordmark · Dark",
		src: brandAssetPaths.wordmark.dark.svg,
		bg: "bg-white",
	},
] as const;
