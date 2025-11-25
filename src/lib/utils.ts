import { clsx, type ClassValue } from "clsx";
import { toPng } from "html-to-image";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ifString(value: unknown): value is string {
  return typeof value === "string";
}

export const ensureError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
};

export const isNotNil = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Generates a proxy URL for an external image to bypass CORS restrictions.
 * @param imageUrl - The original external image URL
 * @returns A proxy URL that serves the image through our server
 */
export function getImageProxyUrl(imageUrl: string): string {
  // Encode the URL to handle special characters
  const encodedUrl = encodeURIComponent(imageUrl);
  return `/api/image-proxy/${encodedUrl}`;
}

/**
 * Checks if a URL is external (not relative or data URL)
 */
function isExternalUrl(url: string): boolean {
  // Data URLs and relative URLs are not external
  if (
    url.startsWith("data:") ||
    url.startsWith("/") ||
    url.startsWith("./") ||
    url.startsWith("../")
  ) {
    return false;
  }
  // Check if it's a full URL (starts with http:// or https://)
  try {
    const urlObj = new URL(url);
    // If it's a different origin, it's external
    return urlObj.origin !== window.location.origin;
  } catch {
    // If URL parsing fails, assume it's relative (not external)
    return false;
  }
}

/**
 * Waits for all images in an element to load
 */
function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"));
  const imagePromises = images.map((img) => {
    if (img.complete) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve even on error to not block
      // Timeout after 10 seconds
      setTimeout(() => resolve(), 10000);
    });
  });
  return Promise.all(imagePromises).then(() => {});
}

/**
 * Captures a DOM element as an image and downloads it
 * @param element - The HTML element to capture
 * @param filename - The filename for the downloaded image (without extension)
 */
export async function downloadElementAsImage(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  try {
    // Remove animation classes before capture
    const allElements = element.querySelectorAll("*");
    const removedClasses: Array<{ element: Element; classes: string[] }> = [];

    allElements.forEach((el) => {
      const classesToRemove = [
        "animate-scale-in",
        "animate-fade-in",
        "animate-float",
        "animate-float-delayed",
        "animate-drift",
      ];
      const removed: string[] = [];
      classesToRemove.forEach((cls) => {
        if (el.classList.contains(cls)) {
          el.classList.remove(cls);
          removed.push(cls);
        }
      });
      if (removed.length > 0) {
        removedClasses.push({ element: el, classes: removed });
      }
    });

    // Replace external image URLs with proxy URLs for CORS bypass
    const images = Array.from(element.querySelectorAll("img")) as HTMLImageElement[];
    const imageReplacements: Array<{ img: HTMLImageElement; originalSrc: string }> = [];

    images.forEach((img) => {
      const src = img.src;
      if (src && isExternalUrl(src)) {
        imageReplacements.push({ img, originalSrc: src });
        img.src = getImageProxyUrl(src);
      }
    });

    // Wait for proxied images to load
    if (imageReplacements.length > 0) {
      await waitForImages(element);
    }

    // Capture the element using html-to-image (better SVG support)
    const dataUrl = await toPng(element, {
      backgroundColor: undefined, // Transparent background
      pixelRatio: 2, // Higher quality
      filter: (node) => {
        // Ignore elements with data-ui-overlay attribute
        return !(node instanceof HTMLElement && node.hasAttribute("data-ui-overlay"));
      },
    });

    // Restore original image URLs
    imageReplacements.forEach(({ img, originalSrc }) => {
      img.src = originalSrc;
    });

    // Restore animation classes
    removedClasses.forEach(({ element: el, classes }) => {
      classes.forEach((cls) => el.classList.add(cls));
    });

    // Create download link
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error capturing element as image:", error);
    throw error;
  }
}
