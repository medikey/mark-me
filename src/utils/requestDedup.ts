/**
 * Request Deduplication Utility
 * Prevents duplicate API calls by caching in-flight requests
 * Useful for preventing rate limiting on rapid user interactions
 */

interface PendingRequest {
  promise: Promise<any>
  timestamp: number
}

const pendingRequests = new Map<string, PendingRequest>()
const REQUEST_DEDUP_TIMEOUT = 5000 // 5 seconds

/**
 * Wraps an async function to deduplicate in-flight requests
 * @param key - Unique identifier for the request type
 * @param fn - The async function to execute
 * @returns Promise that resolves with the result
 */
export async function dedupRequest<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  // Check if there's already a pending request for this key
  const existing = pendingRequests.get(key)
  if (existing) {
    const age = Date.now() - existing.timestamp
    if (age < REQUEST_DEDUP_TIMEOUT) {
      console.log(`[Dedup] Reusing in-flight request for: ${key}`)
      return existing.promise
    } else {
      // Request has timed out, remove it
      pendingRequests.delete(key)
    }
  }

  // Create new request
  const promise = fn()
    .then((result) => {
      // Remove from pending after completion
      pendingRequests.delete(key)
      return result
    })
    .catch((error) => {
      // Remove from pending on error
      pendingRequests.delete(key)
      throw error
    })

  // Store the pending request
  pendingRequests.set(key, {
    promise,
    timestamp: Date.now(),
  })

  return promise
}

/**
 * Clear all pending requests
 */
export function clearPendingRequests(): void {
  pendingRequests.clear()
}

/**
 * Get count of pending requests
 */
export function getPendingRequestCount(): number {
  return pendingRequests.size
}
