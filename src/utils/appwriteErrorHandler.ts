/**
 * Appwrite Error Handler Utility
 * Handles CORS, network, and API errors with user-friendly messages
 */

export interface AppwriteError {
  type: "cors" | "network" | "auth" | "validation" | "server" | "unknown"
  message: string
  originalError: any
  isRetryable: boolean
  retryAfter?: number
}

/**
 * Parse Appwrite error and provide user-friendly message
 */
export function parseAppwriteError(error: any): AppwriteError {
  const message = error?.message || String(error)

  console.error("[v0] Appwrite Error:", { message, error })

  // CORS Error Detection
  if (
    message.includes("CORS") ||
    message.includes("blocked by CORS") ||
    message.includes("Access-Control") ||
    message.includes("Could not establish connection")
  ) {
    return {
      type: "cors",
      message:
        "Connection error. Please ensure your Appwrite server is properly configured. Check the browser console for details.",
      originalError: error,
      isRetryable: true,
      retryAfter: 5000,
    }
  }

  // Network Error Detection
  if (
    message.includes("Failed to fetch") ||
    message.includes("ERR_FAILED") ||
    message.includes("Network") ||
    message.includes("offline") ||
    message.includes("timeout")
  ) {
    return {
      type: "network",
      message: "Network connection error. Please check your internet connection and try again.",
      originalError: error,
      isRetryable: true,
      retryAfter: 3000,
    }
  }

  // Authentication Error Detection
  if (
    message.includes("Unauthorized") ||
    message.includes("Invalid credentials") ||
    message.includes("Invalid email or password") ||
    message.includes("401") ||
    message.includes("authentication")
  ) {
    return {
      type: "auth",
      message: "Invalid email or password. Please try again.",
      originalError: error,
      isRetryable: false,
    }
  }

  // Validation Error Detection
  if (
    message.includes("Invalid") ||
    message.includes("Required") ||
    message.includes("400") ||
    message.includes("validation")
  ) {
    return {
      type: "validation",
      message: "Please check your input and try again.",
      originalError: error,
      isRetryable: false,
    }
  }

  // Server Error Detection
  if (message.includes("500") || message.includes("503") || message.includes("Server")) {
    return {
      type: "server",
      message: "Server error. Please try again later.",
      originalError: error,
      isRetryable: true,
      retryAfter: 10000,
    }
  }

  // Rate Limit Detection
  if (message.includes("429") || message.includes("rate limit") || message.includes("too many")) {
    return {
      type: "server",
      message: "Too many requests. Please wait a moment and try again.",
      originalError: error,
      isRetryable: true,
      retryAfter: 30000,
    }
  }

  // Unknown Error
  return {
    type: "unknown",
    message: "An unexpected error occurred. Please try again.",
    originalError: error,
    isRetryable: true,
    retryAfter: 3000,
  }
}

/**
 * Log error with context for debugging
 */
export function logAppwriteError(context: string, error: any): void {
  const parsed = parseAppwriteError(error)
  console.error(`[v0] ${context}`, {
    type: parsed.type,
    message: parsed.message,
    isRetryable: parsed.isRetryable,
    originalError: error,
  })
}

/**
 * Check if error is CORS-related
 */
export function isCORSError(error: any): boolean {
  const message = error?.message || String(error)
  return (
    message.includes("CORS") ||
    message.includes("blocked by CORS") ||
    message.includes("Access-Control") ||
    message.includes("Could not establish connection")
  )
}

/**
 * Check if error is network-related
 */
export function isNetworkError(error: any): boolean {
  const message = error?.message || String(error)
  return (
    message.includes("Failed to fetch") ||
    message.includes("ERR_FAILED") ||
    message.includes("Network") ||
    message.includes("offline") ||
    message.includes("timeout")
  )
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  const parsed = parseAppwriteError(error)
  return parsed.isRetryable
}

/**
 * Get retry delay in milliseconds
 */
export function getRetryDelay(error: any): number {
  const parsed = parseAppwriteError(error)
  return parsed.retryAfter || 3000
}
