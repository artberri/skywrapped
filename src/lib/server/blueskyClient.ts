import type {
  Agent,
  AppBskyActorDefs,
  AppBskyFeedDefs,
  AppBskyGraphGetListsWithMembership,
} from "@atproto/api";

type FeedViewPost = AppBskyFeedDefs.FeedViewPost;
type ProfileViewDetailed = AppBskyActorDefs.ProfileViewDetailed;
type ProfileView = AppBskyActorDefs.ProfileView;
type ListWithMembership = AppBskyGraphGetListsWithMembership.ListWithMembership;

export class BlueskyClient {
  constructor(private agent: Agent) {}

  async getFeedByYear(actor: string, year: number): Promise<FeedViewPost[]> {
    const allPosts: FeedViewPost[] = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await this.agent.getAuthorFeed({
        actor,
        limit: 100,
        cursor,
      });

      const posts = response.data.feed;
      if (posts.length === 0) {
        break;
      }

      // Check if we've reached posts from a previous year
      let foundPreviousYear = false;
      for (const feedPost of posts) {
        const postDate = new Date(feedPost.post.indexedAt);
        const postYear = postDate.getFullYear();

        if (postYear < year) {
          foundPreviousYear = true;
          break;
        }

        // Only collect posts from the target year
        if (postYear === year) {
          allPosts.push(feedPost);
        }
      }

      // If we found posts from a previous year, we can stop
      if (foundPreviousYear) {
        break;
      }

      // Update cursor for next iteration
      cursor = response.data.cursor;
      hasMore = !!cursor;
    }

    return allPosts;
  }

  async getProfile(actor: string): Promise<ProfileViewDetailed> {
    const response = await this.agent.getProfile({ actor });
    return response.data;
  }

  async getFollowers(actor: string): Promise<ProfileView[]> {
    const followers: ProfileView[] = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await this.agent.getFollowers({
        actor,
        limit: 100,
        cursor,
      });

      followers.push(...response.data.followers);
      cursor = response.data.cursor;
      hasMore = !!cursor;
    }

    return followers;
  }

  async getFollows(actor: string): Promise<ProfileView[]> {
    const follows: ProfileView[] = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await this.agent.getFollows({
        actor,
        limit: 100,
        cursor,
      });

      follows.push(...response.data.follows);
      cursor = response.data.cursor;
      hasMore = !!cursor;
    }

    return follows;
  }

  async getListsWithMembership(actor: string): Promise<ListWithMembership[]> {
    const lists: ListWithMembership[] = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await this.agent.app.bsky.graph.getListsWithMembership({
        actor,
        limit: 100,
        cursor,
      });

      lists.push(...response.data.listsWithMembership);
      cursor = response.data.cursor;
      hasMore = !!cursor;
    }

    return lists;
  }

  async getLikesByYear(actor: string, year: number): Promise<FeedViewPost[]> {
    const allLikes: FeedViewPost[] = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await this.agent.getActorLikes({
        actor,
        limit: 100,
        cursor,
      });

      const likes = response.data.feed;
      if (likes.length === 0) {
        break;
      }

      // Check if we've reached likes from a previous year
      let foundPreviousYear = false;
      for (const feedPost of likes) {
        const likeDate = new Date(feedPost.post.indexedAt);
        const likeYear = likeDate.getFullYear();

        if (likeYear < year) {
          foundPreviousYear = true;
          break;
        }

        // Only collect likes from the target year
        if (likeYear === year) {
          allLikes.push(feedPost);
        }
      }

      // If we found likes from a previous year, we can stop
      if (foundPreviousYear) {
        break;
      }

      // Update cursor for next iteration
      cursor = response.data.cursor;
      hasMore = !!cursor;
    }

    return allLikes;
  }

  async getBookmarksByYear(year: number): Promise<FeedViewPost[]> {
    const allBookmarks: FeedViewPost[] = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await this.agent.app.bsky.bookmark.getBookmarks({
        limit: 100,
        cursor,
      });

      const bookmarks = response.data.bookmarks;
      if (bookmarks.length === 0) {
        break;
      }

      // Check if we've reached bookmarks from a previous year
      let foundPreviousYear = false;
      for (const bookmark of bookmarks) {
        if (!bookmark.createdAt) {
          continue;
        }

        const bookmarkDate = new Date(bookmark.createdAt);
        const bookmarkYear = bookmarkDate.getFullYear();

        if (bookmarkYear < year) {
          foundPreviousYear = true;
          break;
        }

        // Only collect bookmarks from the target year
        // The bookmark.item contains the PostView
        if (bookmarkYear === year && bookmark.item.$type === "app.bsky.feed.defs#postView") {
          // Convert BookmarkView to FeedViewPost format
          allBookmarks.push({
            post: bookmark.item as AppBskyFeedDefs.PostView,
          });
        }
      }

      // If we found bookmarks from a previous year, we can stop
      if (foundPreviousYear) {
        break;
      }

      // Update cursor for next iteration
      cursor = response.data.cursor;
      hasMore = !!cursor;
    }

    return allBookmarks;
  }
}
