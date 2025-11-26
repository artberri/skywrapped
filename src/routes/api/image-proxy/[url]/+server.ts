import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * Allowed domains for image proxying (Bluesky CDN only)
 */
const ALLOWED_DOMAINS = [
  "cdn.bsky.app",
  "bsky.app", // Fallback for any Bluesky domains
];

/**
 * Maximum image size in bytes (10MB)
 */
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

/**
 * Allowed image content types
 */
const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

/**
 * Validates that a URL is from an allowed Bluesky CDN domain
 */
function isAllowedDomain(url: URL): boolean {
  const hostname = url.hostname.toLowerCase();
  return ALLOWED_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

/**
 * Validates that the content type is an allowed image type
 */
function isAllowedContentType(contentType: string | null): boolean {
  if (!contentType) {
    return false;
  }
  const normalizedType = contentType.toLowerCase().split(";")[0].trim();
  return ALLOWED_CONTENT_TYPES.includes(normalizedType);
}

/**
 * Validates that the request is from the same origin
 */
function isSameOrigin(request: Request, requestUrl: URL): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const requestHostname = requestUrl.hostname.toLowerCase();

  // Check Origin header first (most reliable for CORS requests)
  if (origin) {
    try {
      const originUrl = new URL(origin);
      return originUrl.hostname.toLowerCase() === requestHostname;
    } catch {
      return false;
    }
  }

  // Fallback to Referer header (for same-origin requests, Origin might be null)
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      return refererUrl.hostname.toLowerCase() === requestHostname;
    } catch {
      return false;
    }
  }

  // If neither Origin nor Referer is present, reject (likely a direct API call from external source)
  return false;
}

/**
 * Image proxy endpoint to bypass CORS restrictions.
 * Only allows proxying images from Bluesky CDN domains for security.
 * Only accessible from the same origin.
 */
export const GET: RequestHandler = async ({ params, fetch, request, url: requestUrl }) => {
  try {
    // Validate same-origin request
    if (!isSameOrigin(request, requestUrl)) {
      throw error(403, "Only same-origin requests are allowed");
    }

    // SvelteKit automatically decodes route parameters, so params.url is already decoded
    const imageUrl = params.url;

    // Validate that it's a valid URL
    let url: URL;
    try {
      url = new URL(imageUrl);
    } catch {
      throw error(400, "Invalid URL");
    }

    // Only allow HTTPS URLs for security
    if (url.protocol !== "https:") {
      throw error(400, "Only HTTPS URLs are allowed");
    }

    // Validate that the domain is from Bluesky CDN
    if (!isAllowedDomain(url)) {
      throw error(403, "Only Bluesky CDN images are allowed");
    }

    // Fetch the image
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SkyWrapped/1.0)",
      },
    });

    if (!response.ok) {
      throw error(response.status, `Failed to fetch image: ${response.statusText}`);
    }

    // Validate content type before downloading
    const contentType = response.headers.get("content-type");
    if (!isAllowedContentType(contentType)) {
      throw error(
        400,
        `Invalid content type: ${contentType || "unknown"}. Only images are allowed.`,
      );
    }

    // Check content length if available
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_IMAGE_SIZE) {
      throw error(413, "Image size exceeds maximum allowed size");
    }

    // Download the image with size limit
    const imageBuffer = await response.arrayBuffer();

    // Validate actual size
    if (imageBuffer.byteLength > MAX_IMAGE_SIZE) {
      throw error(413, "Image size exceeds maximum allowed size");
    }

    // Return the image with appropriate headers
    // Note: We don't set Access-Control-Allow-Origin since this is same-origin only
    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType!,
        "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
      },
    });
  } catch (err) {
    // If it's already a SvelteKit error, rethrow it
    if (err && typeof err === "object" && "status" in err) {
      throw err;
    }

    console.error("Error proxying image:", err);
    throw error(500, "Failed to proxy image");
  }
};
