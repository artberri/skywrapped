import { YEAR } from "$lib/server/constants";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
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

	return {
		wrapped,
	};
};
