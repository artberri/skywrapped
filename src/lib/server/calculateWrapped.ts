import { isNotNil } from "$lib/utils";
import type {
	AppBskyActorDefs,
	AppBskyEmbedImages,
	AppBskyEmbedRecord,
	AppBskyEmbedRecordWithMedia,
	AppBskyFeedDefs,
	AppBskyFeedPost,
} from "@atproto/api";
import type { Wrapped } from "./domain/wrapped";
import { getSortAtTimestamp } from "./timestampUtils";

type FeedViewPost = AppBskyFeedDefs.FeedViewPost;
type ProfileViewDetailed = AppBskyActorDefs.ProfileViewDetailed;
type ProfileView = AppBskyActorDefs.ProfileView;

export const calculateWrapped = async ({
	year,
	profile,
	followers,
	follows,
	feed,
	likes,
	bookmarks,
}: {
	year: number;
	profile: ProfileViewDetailed;
	followers: ProfileView[];
	follows: ProfileView[];
	feed: FeedViewPost[];
	likes: FeedViewPost[];
	bookmarks: FeedViewPost[];
}): Promise<Wrapped> => {
	const current = calculateCurrent(profile, feed);
	const bestTime = calculateBestTime(feed);
	const { yearActivity, engagement, topPost, languages, hashtags, interactions } = getDataFromFeed(
		feed,
		likes,
		bookmarks,
	);

	return {
		did: profile.did,
		handle: profile.handle,
		year,
		displayName: profile.displayName ?? profile.handle,
		current,
		bestTime,
		yearActivity,
		engagement,
		topPost,
		languages,
		hashtags,
		connections: connectionsFromInteractions(profile.handle, interactions, followers, follows),
	};
};

const connectionsFromInteractions = (
	userHandle: string,
	interactions: Wrapped["connections"],
	followers: ProfileView[],
	follows: ProfileView[],
): Wrapped["connections"] => {
	const byHandle = interactions.reduce(
		(acc, interaction) => {
			if (interaction.handle === userHandle) {
				return acc;
			}

			if (acc[interaction.handle]) {
				acc[interaction.handle].intereactionCount++;
			} else {
				acc[interaction.handle] = {
					connection: {
						...interaction,
						following: follows.some((follow) => follow.handle === interaction.handle),
						followsYou: followers.some((follower) => follower.handle === interaction.handle),
					},
					intereactionCount: 1,
				};
			}
			return acc;
		},
		{} as Record<
			string,
			{
				connection: Wrapped["connections"][number];
				intereactionCount: number;
			}
		>,
	);

	return Object.values(byHandle)
		.sort((a, b) => b.intereactionCount - a.intereactionCount)
		.slice(0, 5)
		.map((value) => value.connection);
};

const calculateCurrent = (
	profile: ProfileViewDetailed,
	feed: FeedViewPost[],
): Wrapped["current"] => {
	return {
		posts: feed.length,
		following: profile.followsCount ?? 0,
		followers: profile.followersCount ?? 0,
		accountAge: calculateAccountAge(profile.createdAt, profile.indexedAt),
	};
};

/**
 * Calculate account age in years from the most accurate timestamp available.
 * Uses getSortAtTimestamp to determine the best timestamp following Bluesky guidelines.
 */
const calculateAccountAge = (
	createdAt: string | undefined,
	indexedAt: string | undefined,
): number => {
	const accountCreationDate = getSortAtTimestamp(createdAt, indexedAt);

	if (!accountCreationDate) {
		return 0;
	}

	const now = new Date();
	const diffMs = now.getTime() - accountCreationDate.getTime();

	// Convert to years (365.25 days per year to account for leap years)
	const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
	const ageInYears = diffMs / msPerYear;

	// Round to one decimal place
	return Math.max(0, Math.round(ageInYears * 10) / 10);
};

const calculateBestTime = (feed: FeedViewPost[]): Wrapped["bestTime"] => {
	const postingDates = feed
		.map((post) => getSortAtTimestamp(undefined, post.post.indexedAt))
		.filter(isNotNil);

	const postingDays = postingDates.reduce(
		(acc, date) => {
			acc[date.getDay()]++;
			return acc;
		},
		Array.from({ length: 7 }, () => 0),
	);
	const postingHours = postingDates.reduce(
		(acc, date) => {
			acc[date.getHours()]++;
			return acc;
		},
		Array.from({ length: 24 }, () => 0),
	);

	const mostActiveDay = postingDays.reduce(
		(acc, dayValue, day) => {
			return dayValue > acc.max ? { day, max: dayValue } : acc;
		},
		{ day: 0, max: 0 },
	).day;
	const peakPostingHour = postingHours.reduce(
		(acc, hourValue, hour) => {
			return hourValue > acc.max ? { hour, max: hourValue } : acc;
		},
		{ hour: 0, max: 0 },
	).hour;

	return {
		mostActiveDay,
		peakPostingHour,
		averagePostsPerDay: Math.round((feed.length / 365) * 10) / 10,
	};
};

type EmbedQuote = (AppBskyEmbedRecord.View | AppBskyEmbedRecordWithMedia.View) & {
	record: AppBskyEmbedRecord.ViewRecord;
};

type QuoteFeedViewPost = FeedViewPost & {
	post: {
		embed: EmbedQuote;
	};
};

/**
 * Check if a post is a quote (has a record embed containing another post)
 */
const isQuotePost = (post: FeedViewPost): post is QuoteFeedViewPost => {
	const embed = post.post.embed;
	if (!embed) {
		return false;
	}

	// Check for app.bsky.embed.record#view
	if (embed.$type === "app.bsky.embed.record#view") {
		const recordEmbed = embed as AppBskyEmbedRecord.View;
		// A quote is when the embedded record is a post (viewRecord)
		// The record property is a union type, check if it's a ViewRecord
		const record = recordEmbed.record as { $type?: string };
		return record?.$type === "app.bsky.embed.record#viewRecord";
	}

	// Check for app.bsky.embed.recordWithMedia#view
	if (embed.$type === "app.bsky.embed.recordWithMedia#view") {
		const recordWithMediaEmbed = embed as AppBskyEmbedRecordWithMedia.View;
		// A quote is when the embedded record is a post (viewRecord)
		// The record property is a View type (union), check if it's a ViewRecord
		const record = recordWithMediaEmbed.record as { $type?: string };
		return record?.$type === "app.bsky.embed.record#viewRecord";
	}

	return false;
};

/**
 * Extract the first image URL from a post's embed, if present.
 * Handles both direct image embeds and record-with-media embeds.
 */
const getFirstImage = (
	post: FeedViewPost,
):
	| {
			url: string;
			alt: string;
			aspectRatio?: { width: number; height: number };
	  }
	| undefined => {
	const embed = post.post.embed;
	if (!embed) {
		return undefined;
	}

	// Check for direct images embed: app.bsky.embed.images#view
	if (embed.$type === "app.bsky.embed.images#view") {
		const imagesEmbed = embed as AppBskyEmbedImages.View;
		const image = imagesEmbed.images?.[0];
		if (image) {
			return {
				url: image.thumb,
				alt: image.alt,
				aspectRatio: image.aspectRatio,
			};
		}
	}

	// Check for record with media embed: app.bsky.embed.recordWithMedia#view
	if (embed.$type === "app.bsky.embed.recordWithMedia#view") {
		const recordWithMediaEmbed = embed as AppBskyEmbedRecordWithMedia.View;
		const media = recordWithMediaEmbed.media;

		// Check if media is images
		if (media.$type === "app.bsky.embed.images#view") {
			const imagesMedia = media as AppBskyEmbedImages.View;
			const image = imagesMedia.images?.[0];
			if (image) {
				return {
					url: image.thumb,
					alt: image.alt,
					aspectRatio: image.aspectRatio,
				};
			}
		}
	}

	return undefined;
};

const toTopPost = (post: FeedViewPost): NonNullable<Wrapped["topPost"]> => {
	// Text is stored in the record property according to Bluesky Lexicon
	const record = isRecordPost(post.post.record) ? post.post.record.text : "";
	const text = record ?? "";

	return {
		link: post.post.uri
			.replace("at://", "https://bsky.app/profile/")
			.replace("/app.bsky.feed.post/", "/post/"),
		text,
		image: getFirstImage(post),
		likes: post.post.likeCount ?? 0,
		reposts: (post.post.repostCount ?? 0) + (post.post.quoteCount ?? 0),
	};
};

const getTopPost = (post: FeedViewPost, currentTop: Wrapped["topPost"]): Wrapped["topPost"] => {
	if (post.reason?.$type === "app.bsky.feed.defs#reasonRepost" || isQuotePost(post)) {
		return currentTop;
	}

	const transformedPost = toTopPost(post);

	if (!currentTop) {
		return transformedPost;
	}

	const totalCurrentPost = currentTop.likes + currentTop.reposts;
	const totalTransformedPost = transformedPost.likes + transformedPost.reposts;

	if (totalTransformedPost > totalCurrentPost) {
		return transformedPost;
	}

	return currentTop;
};

const getLanguages = (
	post: FeedViewPost,
	languages: Record<string, number>,
): Record<string, number> => {
	const langs = isRecordPost(post.post.record) ? (post.post.record.langs ?? []) : [];
	if (!langs.length) {
		languages.all = (languages.all ?? 0) + 1;
		return languages;
	}

	return langs.reduce((acc, code) => {
		acc[code] = (acc[code] ?? 0) + 1;
		acc.all = (acc.all ?? 0) + 1;
		return acc;
	}, languages);
};

const getHashtags = (post: FeedViewPost): string[] => {
	if (isRecordPost(post.post.record)) {
		const features = post.post.record.facets?.flatMap((facet) => facet.features ?? []) ?? [];
		return features
			.map((feature) => {
				if (feature.$type === "app.bsky.richtext.facet#tag" && "tag" in feature) {
					return feature.tag;
				}
				return null;
			})
			.filter(isNotNil);
	}

	return [];
};

const isRecordPost = (record: FeedViewPost["post"]["record"]): record is AppBskyFeedPost.Main => {
	return record.$type === "app.bsky.feed.post";
};

const getDataFromFeed = (
	feed: FeedViewPost[],
	likes: FeedViewPost[],
	bookmarks: FeedViewPost[],
): {
	yearActivity: Wrapped["yearActivity"];
	engagement: Wrapped["engagement"];
	topPost: Wrapped["topPost"];
	languages: Wrapped["languages"];
	hashtags: Wrapped["hashtags"];
	interactions: Wrapped["connections"];
} => {
	let posts = feed.length;
	let replies = 0;
	let reposts = 0;
	let quotes = 0;

	let engagementReplies = 0;
	let engagementReposts = 0;
	let engagementQuotes = 0;
	let engagementLikes = 0;
	let engagementBookmarks = 0;

	let topPost: Wrapped["topPost"];
	let languagesRecord: Record<string, number> = { all: 0 };
	let collectedHashtags: [string, number][] = [];

	let interactions: Wrapped["connections"] = [];

	for (const post of feed) {
		const hashtags = getHashtags(post);
		for (const hashtag of hashtags) {
			const hashtagIndex = collectedHashtags.findIndex(
				([existingHashtag]) => existingHashtag.toLocaleLowerCase() === hashtag.toLocaleLowerCase(),
			);
			if (hashtagIndex === -1) {
				collectedHashtags.push([hashtag, 1]);
			} else {
				collectedHashtags[hashtagIndex][1]++;
			}
		}

		// Check reposts first (these are not original posts)
		if (post.reason?.$type === "app.bsky.feed.defs#reasonRepost") {
			reposts++;
			posts--;
			interactions.push({
				handle: post.post.author.handle,
				displayName: post.post.author.displayName ?? post.post.author.handle,
				avatar: post.post.author.avatar ?? "",
				following: false,
				followsYou: false,
			});
			continue; // Skip further checks for reposts
		}

		// Check quotes (a quote can also be a reply)
		if (isQuotePost(post)) {
			quotes++;
			posts--;
			interactions.push({
				handle: post.post.embed.record.author.handle,
				displayName:
					post.post.embed.record.author.displayName ?? post.post.embed.record.author.handle,
				avatar: post.post.embed.record.author.avatar ?? "",
				following: false,
				followsYou: false,
			});
		}

		// Check replies (only if not already counted as quote)
		if (post.reply) {
			replies++;
			posts--;
			if ("author" in post.reply.root && "handle" in post.reply.root.author) {
				interactions.push({
					handle: post.reply.root.author.handle,
					displayName: post.reply.root.author.displayName ?? post.reply.root.author.handle,
					avatar: post.reply.root.author.avatar ?? "",
					following: false,
					followsYou: false,
				});
			}
		}

		if (post.post.replyCount && post.post.replyCount > 0) {
			engagementReplies++;
		}
		if (post.post.repostCount && post.post.repostCount > 0) {
			engagementReposts++;
		}
		if (post.post.quoteCount && post.post.quoteCount > 0) {
			engagementQuotes++;
		}
		if (post.post.likeCount && post.post.likeCount > 0) {
			engagementLikes++;
		}
		if (post.post.bookmarkCount && post.post.bookmarkCount > 0) {
			engagementBookmarks++;
		}

		topPost = getTopPost(post, topPost);
		languagesRecord = getLanguages(post, languagesRecord);
	}

	for (const like of likes) {
		const hashtags = getHashtags(like);
		for (const hashtag of hashtags) {
			const hashtagIndex = collectedHashtags.findIndex(
				([existingHashtag]) => existingHashtag.toLocaleLowerCase() === hashtag.toLocaleLowerCase(),
			);
			if (hashtagIndex === -1) {
				collectedHashtags.push([hashtag, 1]);
			} else {
				collectedHashtags[hashtagIndex][1]++;
			}
		}

		interactions.push({
			handle: like.post.author.handle,
			displayName: like.post.author.displayName ?? like.post.author.handle,
			avatar: like.post.author.avatar ?? "",
			following: false,
			followsYou: false,
		});
	}

	for (const bookmark of bookmarks) {
		interactions.push({
			handle: bookmark.post.author.handle,
			displayName: bookmark.post.author.displayName ?? bookmark.post.author.handle,
			avatar: bookmark.post.author.avatar ?? "",
			following: false,
			followsYou: false,
		});
	}

	const allWithLanguage = languagesRecord.all;
	const languageNames = new Intl.DisplayNames(["en"], {
		type: "language",
	});
	delete languagesRecord.all;
	const languages = Object.entries(languagesRecord)
		.map(([code, count]) => ({
			code,
			name: languageNames.of(code) ?? code,
			percentage: Math.round((count / allWithLanguage) * 100),
		}))
		.sort((a, b) => b.percentage - a.percentage);

	return {
		yearActivity: {
			posts,
			replies,
			reposts,
			quotes,
			likes: likes.length,
			bookmarks: bookmarks.length,
		},
		engagement: {
			replies: engagementReplies,
			reposts: engagementReposts,
			quotes: engagementQuotes,
			likes: engagementLikes,
			bookmarks: engagementBookmarks,
		},
		topPost,
		languages: languages,
		hashtags: collectedHashtags
			.map(([hashtag, count]) => ({
				hashtag,
				count,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5),
		interactions: interactions,
	};
};
