import { isNotNil } from "$lib/utils";
import type {
  AppBskyActorDefs,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyFeedDefs,
} from "@atproto/api";
import type { Wrapped } from "./domain/wrapped";
import { getSortAtTimestamp } from "./timestampUtils";

type FeedViewPost = AppBskyFeedDefs.FeedViewPost;
type ProfileViewDetailed = AppBskyActorDefs.ProfileViewDetailed;
type ProfileView = AppBskyActorDefs.ProfileView;

export const calculateWrapped = async ({
  year,
  profile,
  followers: _followers,
  follows: _follows,
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
  const { yearActivity, engagement, topPost, languages } = getDataFromFeed(feed, likes, bookmarks);

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
  };
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

/**
 * Check if a post is a quote (has a record embed containing another post)
 */
const isQuotePost = (post: FeedViewPost): boolean => {
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
  const record =
    post.post.record.$type === "app.bsky.feed.post"
      ? (post.post.record as { text?: string }).text
      : "";
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
  const langs =
    post.post.record.$type === "app.bsky.feed.post"
      ? ((post.post.record as { langs?: string[] }).langs ?? [])
      : [];
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

const getDataFromFeed = (
  feed: FeedViewPost[],
  likes: FeedViewPost[],
  bookmarks: FeedViewPost[],
): {
  yearActivity: Wrapped["yearActivity"];
  engagement: Wrapped["engagement"];
  topPost: Wrapped["topPost"];
  languages: Wrapped["languages"];
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

  for (const post of feed) {
    // Check reposts first (these are not original posts)
    if (post.reason?.$type === "app.bsky.feed.defs#reasonRepost") {
      reposts++;
      posts--;
      continue; // Skip further checks for reposts
    }

    // Check quotes (a quote can also be a reply)
    if (isQuotePost(post)) {
      quotes++;
      posts--;
    }

    // Check replies (only if not already counted as quote)
    if (post.reply) {
      replies++;
      posts--;
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
  };
};
