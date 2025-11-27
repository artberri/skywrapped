import { calculateWrapped } from "$lib/server/calculateWrapped";
import { YEAR } from "$lib/server/constants";
import { handleErrorSafely } from "$lib/server/errorUtils";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const MIN_STEP_DURATION = 200; // 0.2 seconds in milliseconds

async function ensureMinDuration(startTime: number): Promise<void> {
	const elapsed = Date.now() - startTime;
	if (elapsed < MIN_STEP_DURATION) {
		await new Promise((resolve) => setTimeout(resolve, MIN_STEP_DURATION - elapsed));
	}
}

export const GET: RequestHandler = async ({ locals }) => {
	const { agent, ctx } = locals;
	let actor: string | undefined;

	try {
		if (!agent) {
			throw new Error("No agent found");
		}

		actor = agent?.assertDid;
		if (!actor) {
			throw new Error("No agent found");
		}
	} catch (err) {
		const errorMessage = handleErrorSafely(err, ctx.logger, {}, "Authentication required");
		ctx.logger.debug({ err }, "Error asserting did during calculate");
		return json({ error: errorMessage }, { status: 401 });
	}

	const existingWrapped = await ctx.wrappedRepository.getByDidAndYear(actor, YEAR);
	let shouldCalculate = true;
	if (existingWrapped && existingWrapped.createdAt) {
		const now = Date.now();
		const age = now - existingWrapped.createdAt;
		if (age < 1000 * 60 * 60 * 24) {
			// 24 hours
			shouldCalculate = false;
		}
	}

	const blueskyClient = ctx.getBlueskyClient(agent);

	// Create a readable stream for Server-Sent Events
	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();

			const sendProgress = (step: number, message: string, progress: number) => {
				const data = JSON.stringify({ step, message, progress });
				controller.enqueue(encoder.encode(`data: ${data}\n\n`));
			};

			if (!shouldCalculate) {
				const step0Start = Date.now();
				sendProgress(0, "Retrieving your existing Wrapped...", 95);
				await ensureMinDuration(step0Start);
				controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
				controller.close();
				return;
			}

			try {
				// Step 1: Get feed
				const step1Start = Date.now();
				sendProgress(0, "Analyzing your posts...", 14);
				const feed = await blueskyClient.getFeedByYear(actor, YEAR);
				await ensureMinDuration(step1Start);
				sendProgress(1, "Analyzing your posts...", 14);

				// Step 2: Get profile
				const step2Start = Date.now();
				sendProgress(1, "Counting your followers...", 28);
				const profile = await blueskyClient.getProfile(actor);
				await ensureMinDuration(step2Start);
				sendProgress(2, "Counting your followers...", 28);

				// Step 3: Get followers
				const step3Start = Date.now();
				sendProgress(2, "Finding your top moments...", 42);
				const followers = await blueskyClient.getFollowers(actor);
				await ensureMinDuration(step3Start);
				sendProgress(3, "Finding your top moments...", 42);

				// Step 4: Get follows
				const step4Start = Date.now();
				sendProgress(3, "Calculating engagement...", 57);
				const follows = await blueskyClient.getFollows(actor);
				await ensureMinDuration(step4Start);
				sendProgress(4, "Calculating engagement...", 57);

				// Step 5: Get likes
				const step5Start = Date.now();
				sendProgress(4, "Counting your likes...", 69);
				const likes = await blueskyClient.getLikesByYear(actor, YEAR);
				await ensureMinDuration(step5Start);
				sendProgress(5, "Counting your likes...", 69);

				// Step 6: Get bookmarks
				const step6Start = Date.now();
				sendProgress(5, "Counting your bookmarks...", 81);
				const bookmarks = await blueskyClient.getBookmarksByYear(YEAR);
				await ensureMinDuration(step6Start);
				sendProgress(6, "Counting your bookmarks...", 81);

				// Step 7: Calculate wrapped
				const step7Start = Date.now();
				sendProgress(6, "Wrapping up your year...", 92);
				const wrapped = await calculateWrapped({
					year: YEAR,
					profile,
					followers,
					follows,
					feed,
					likes,
					bookmarks,
				});
				await ensureMinDuration(step7Start);
				sendProgress(7, "Wrapping up your year...", 92);

				// Step 8: Save wrapped
				const step8Start = Date.now();
				sendProgress(7, "Saving your wrapped...", 100);
				await ctx.wrappedRepository.save(wrapped);
				await ensureMinDuration(step8Start);
				sendProgress(8, "Saving your wrapped...", 100);

				// Send completion
				const step9Start = Date.now();
				await ensureMinDuration(step9Start);
				controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
				controller.close();
			} catch (error) {
				const errorMessage = handleErrorSafely(
					error,
					ctx.logger,
					{ did: actor },
					"Calculation failed",
				);
				const errorData = JSON.stringify({ error: errorMessage });
				controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
				controller.close();
			}
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
};
