import { ensureError } from "$lib/utils";

/**
 * Sanitizes error messages for client-facing responses.
 * Prevents leaking internal implementation details, stack traces, or sensitive information.
 *
 * @param error - The error to sanitize
 * @param defaultMessage - Default message to return if error cannot be safely exposed
 * @returns A safe, user-friendly error message
 */
export function sanitizeErrorMessage(
	error: unknown,
	defaultMessage: string = "An error occurred",
): string {
	const err = ensureError(error);
	const message = err.message.toLowerCase();

	// List of potentially sensitive patterns that should not be exposed
	const sensitivePatterns = [
		/stack trace/i,
		/at\s+\w+\./i, // Stack trace patterns
		/error:\s*\d+/i, // Error codes
		/file:\/\//i, // File paths
		/c:\\.*\\/i, // Windows paths
		/\/.*\//i, // Unix paths
		/database/i,
		/connection/i,
		/timeout/i,
		/env/i, // Environment variables
		/secret/i,
		/key/i,
		/token/i,
		/password/i,
		/did:/i, // DIDs might be sensitive
		/oauth/i,
		/session/i,
	];

	// Check if error message contains sensitive information
	for (const pattern of sensitivePatterns) {
		if (pattern.test(message)) {
			return defaultMessage;
		}
	}

	// For known safe error types, return a user-friendly message
	if (err.message.includes("Failed to resolve identity")) {
		return "Please enter a valid Bluesky handle (e.g., @username.bsky.social)";
	}

	if (err.message.includes("Unauthorized") || err.message.includes("No agent found")) {
		return "Authentication required";
	}

	// If error message seems safe, return it (but truncate to prevent information leakage)
	const safeMessage = err.message.length > 100 ? `${err.message.slice(0, 100)}...` : err.message;
	return safeMessage;
}

/**
 * Logs error details server-side while returning a sanitized message for the client
 *
 * @param error - The error to handle
 * @param logger - Logger instance for server-side logging
 * @param context - Additional context for logging
 * @param defaultMessage - Default message to return to client
 * @returns Sanitized error message safe for client exposure
 */
export function handleErrorSafely(
	error: unknown,
	logger: { error: (obj: Record<string, unknown>, msg: string) => void },
	context: Record<string, unknown> = {},
	defaultMessage: string = "An error occurred",
): string {
	const err = ensureError(error);

	// Log full error details server-side
	logger.error(
		{
			...context,
			error: {
				message: err.message,
				name: err.name,
				stack: err.stack,
			},
		},
		"Error occurred",
	);

	// Return sanitized message for client
	return sanitizeErrorMessage(err, defaultMessage);
}
