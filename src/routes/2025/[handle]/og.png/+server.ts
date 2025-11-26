import OG from "$lib/components/OG.svelte";
import { YEAR } from "$lib/server/constants";
import { ImageResponse } from "@ethercorps/sveltekit-og";
import { GoogleFont, resolveFonts } from "@ethercorps/sveltekit-og/fonts";
import { error, type RequestHandler } from "@sveltejs/kit";

const fonts = [
	new GoogleFont("Inter", { weight: 400 }),
	new GoogleFont("Inter", { weight: 700 }),
	new GoogleFont("Inter", { weight: 800 }),
];

export const GET: RequestHandler = async ({ locals, params }) => {
	const { ctx } = locals;

	const { handle } = params;
	if (!handle) {
		ctx.logger.error("Handle is required");
		error(404, "Not Found");
	}

	const wrapped = await ctx.wrappedRepository.get(handle, YEAR);
	if (!wrapped) {
		ctx.logger.error(
			{ handle, year: YEAR },
			`Wrapped not found for handle ${handle} and year ${YEAR}`,
		);
		error(404, "Not Found");
	}

	return new ImageResponse(
		OG,
		{
			width: 1200,
			height: 628,
			debug: false,
			fonts: await resolveFonts(fonts),
		},
		{
			profile: {
				displayName: wrapped.displayName,
				handle: wrapped.handle,
			},
		},
	);
};
