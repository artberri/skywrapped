import OG from "$lib/components/OG.svelte";
import { ImageResponse } from "@ethercorps/sveltekit-og";
import { GoogleFont, resolveFonts } from "@ethercorps/sveltekit-og/fonts";
import type { RequestHandler } from "@sveltejs/kit";

const fonts = [
	new GoogleFont("Inter", { weight: 400 }),
	new GoogleFont("Inter", { weight: 700 }),
	new GoogleFont("Inter", { weight: 800 }),
];

export const GET: RequestHandler = async () => {
	return new ImageResponse(OG, {
		width: 1200,
		height: 628,
		debug: false,
		fonts: await resolveFonts(fonts),
	});
};
