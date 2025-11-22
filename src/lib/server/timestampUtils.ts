/**
 * Utility functions for working with Bluesky timestamps.
 *
 * Following Bluesky timestamp guidelines:
 * https://docs.bsky.app/docs/advanced-guides/timestamps
 */

const CLOCK_SKEW_WINDOW_MS = 2 * 60 * 1000; // 2 minutes in milliseconds

/**
 * Determines the most accurate timestamp to use following Bluesky's sortAt logic.
 *
 * Uses createdAt when available (represents original creation time),
 * falls back to indexedAt if createdAt is missing or in the future (beyond clock skew window).
 *
 * @param createdAt - The createdAt timestamp (optional)
 * @param indexedAt - The indexedAt timestamp (optional)
 * @returns The most accurate Date, or null if neither timestamp is available
 */
export function getSortAtTimestamp(
  createdAt: string | undefined,
  indexedAt: string | undefined,
): Date | undefined {
  const now = new Date();
  const nowMs = now.getTime();

  // Determine which timestamp to use following sortAt logic
  let bestTimestamp: Date | undefined;

  if (createdAt) {
    const createdAtDate = new Date(createdAt);
    const createdAtMs = createdAtDate.getTime();

    // Use createdAt if it's not in the future (beyond clock skew window)
    if (createdAtMs <= nowMs + CLOCK_SKEW_WINDOW_MS) {
      bestTimestamp = createdAtDate;
    }
  }

  // Fall back to indexedAt if createdAt is not available or is in the future
  if (!bestTimestamp && indexedAt) {
    bestTimestamp = new Date(indexedAt);
  }

  return bestTimestamp;
}
