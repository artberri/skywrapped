import type {
  AppBskyActorDefs,
  AppBskyFeedDefs,
  AppBskyGraphGetListsWithMembership,
} from "@atproto/api";
import type { Wrapped } from "./domain/wrapped";
import { getSortAtTimestamp } from "./timestampUtils";

type FeedViewPost = AppBskyFeedDefs.FeedViewPost;
type ProfileViewDetailed = AppBskyActorDefs.ProfileViewDetailed;
type ProfileView = AppBskyActorDefs.ProfileView;
type ListWithMembership = AppBskyGraphGetListsWithMembership.ListWithMembership;

export const calculateWrapped = async ({
  year,
  profile,
  followers: _followers,
  follows: _follows,
  lists: _lists,
  feed,
  likes: _likes,
  bookmarks: _bookmarks,
}: {
  year: number;
  profile: ProfileViewDetailed;
  followers: ProfileView[];
  follows: ProfileView[];
  lists: ListWithMembership[];
  feed: FeedViewPost[];
  likes: FeedViewPost[];
  bookmarks: FeedViewPost[];
}): Promise<Wrapped> => {
  return {
    did: profile.did,
    handle: profile.handle,
    year,
    displayName: profile.displayName ?? profile.handle,
    current: {
      posts: feed.length,
      following: profile.followsCount ?? 0,
      followers: profile.followersCount ?? 0,
      accountAge: calculateAccountAge(profile.createdAt, profile.indexedAt),
    },
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
