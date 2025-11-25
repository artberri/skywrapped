import { clsx, type ClassValue } from "clsx";
import html2canvas from "html2canvas-pro";
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
 * Captures a DOM element as an image and downloads it
 * @param element - The HTML element to capture
 * @param filename - The filename for the downloaded image (without extension)
 */
export async function downloadElementAsImage(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  try {
    // Wait a bit for any animations to settle
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Capture the element
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2, // Higher quality
      useCORS: false,
      logging: false,
      allowTaint: true,
      onclone: (doc) => {
        const allElements = doc.querySelectorAll("*");
        allElements.forEach((el) => {
          el.classList.remove(
            "animate-scale-in",
            "animate-fade-in",
            "animate-float",
            "animate-float-delayed",
            "animate-drift",
          );
        });
        var svgElements = doc.querySelectorAll("svg");
        svgElements.forEach(function (item) {
          item.setAttribute(
            "width",
            item.getBoundingClientRect().width.toString(),
          );
          item.setAttribute(
            "height",
            item.getBoundingClientRect().height.toString(),
          );
          item.style.width = "";
          item.style.height = "";
        });
      },
      ignoreElements: (el) => {
        return el.hasAttribute("data-ui-overlay");
      },
    });

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Failed to create blob from canvas");
        return;
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    }, "image/png");
  } catch (error) {
    console.error("Error capturing element as image:", error);
    throw error;
  }
}
