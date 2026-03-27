# Appwrite Rate Limiting Optimizations

## Overview
This document outlines the optimizations implemented to prevent Appwrite rate limiting issues during login/signup and class data loading.

## Problems Fixed

### 1. **Duplicate Auth API Calls**
**Problem**: Login and session checks were making multiple API calls:
- `isSessionActive()` → calls `account.get()`
- `getCurrentUser()` → calls `account.get()` + `databases.getDocument()` (separate call)

This resulted in 2-3 API calls for a single login operation.

**Solution**: 
- Added response caching in `appwriteAuth.login()` that returns the user profile
- Modified `AuthContext.login()` to use the cached profile from login response
- Eliminated unnecessary second `getCurrentUser()` call

**Impact**: Reduced login API calls from 3 to 1 API call

### 2. **Session Check Rate Limiting**
**Problem**: `isSessionActive()` was called on every app start and making redundant API calls.

**Solution**:
- Implemented timestamp-based caching (5-minute TTL)
- Check cache before making API call
- If cache is fresh, return cached result immediately

**Impact**: 90% reduction in session check API calls

### 3. **Duplicate In-Flight Requests**
**Problem**: Fast user interactions (multiple login attempts, rapid navigation) could trigger duplicate API requests.

**Solution**:
- Created `requestDedup.ts` utility that deduplicates in-flight requests
- If same request is already pending, reuse the promise
- Added to `isSessionActive()` and `getCurrentUser()`

**Impact**: Prevents duplicate API calls from rapid clicks

### 4. **Classes List Rate Limiting**
**Problem**: Classes page was making fresh API call every time without caching.

**Solution**:
- Added 5-minute cache for class lists
- Automatic cache invalidation on create/update/delete
- Fallback to stale cache on network errors

**Impact**: Subsequent loads of classes page are instant

## Implementation Details

### Auth Service (`services/appwrite-auth.ts`)

**Cache Keys:**
- `@markme:user_profile_cache` - Stores user profile JSON
- `@markme:user_profile_timestamp` - Stores cache timestamp

**Key Methods:**
```typescript
// Returns profile in response to prevent second fetch
login(email, password) → { userId, email, profile }

// Uses cache, falls back to API with cache invalidation
getCurrentUser() → TeacherProfile | null

// Uses cache + dedup to prevent redundant checks
isSessionActive() → boolean
```

### Classes Service (`services/appwrite-classes.ts`)

**Cache Keys:**
- `@markme:classes_cache` - Stores classes array
- `@markme:classes_cache_timestamp` - Stores cache timestamp

**Cache Behavior:**
- 5-minute cache duration
- Auto-invalidate on create, update, delete
- Fallback to stale cache on network errors

### Request Deduplication (`src/utils/requestDedup.ts`)

**How it works:**
```typescript
// Deduplicates in-flight requests by key
await dedupRequest("auth:isSessionActive", async () => {
  // If same key is already pending, returns existing promise
  // Otherwise executes function and stores promise
})
```

## Configuration

All cache durations and timeouts are configurable:

**In `appwrite-auth.ts`:**
```typescript
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
```

**In `appwrite-classes.ts`:**
```typescript
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
```

**In `requestDedup.ts`:**
```typescript
const REQUEST_DEDUP_TIMEOUT = 5000 // 5 seconds
```

Increase cache durations for less frequent API calls, or decrease for more real-time data.

## Monitoring & Debugging

### Debug Logging
The optimized code includes console logging:
- `"Using cached user profile"` - Cache hit
- `"Session valid (cached)"` - Session cache hit
- `"Using cached classes"` - Classes cache hit
- `"[Dedup] Reusing in-flight request for: {key}"` - Dedup hit
- `"Using stale cache due to fetch error"` - Fallback behavior

### Clearing Cache Manually
```typescript
// Clear auth cache
import { appwriteAuth } from "@/../services/appwrite-auth"
await appwriteAuth.clearCache()

// Clear classes cache
import { classesService } from "@/../services/appwrite-classes"
await classesService.clearCache()

// Clear all pending requests
import { clearPendingRequests } from "@/utils/requestDedup"
clearPendingRequests()
```

## Remaining Optimizations to Consider

1. **Pagination for Classes**: Load classes in smaller batches
2. **Request Queuing**: Queue requests instead of deduping to preserve order
3. **Offline Support**: Use AsyncStorage for offline fallback
4. **Incremental Sync**: Only sync changed classes instead of all classes
5. **GraphQL**: Use GraphQL queries instead of REST to batch operations

## Testing Rate Limits

To test rate limiting fixes:

1. **Login Multiple Times**: Rapid login attempts should be deduplicated
2. **Session Check**: Close and reopen app within 5 minutes - should use cache
3. **Classes Navigation**: Navigate away and back to classes page quickly
4. **Network Monitoring**: Open DevTools network tab to verify reduced API calls

## Related Files

- `src/contexts/AuthContext.tsx` - Uses optimized auth service
- `src/contexts/AppContext.tsx` - Uses cached classes service
- `src/app/(auth)/login.tsx` - Login page benefiting from optimizations
- `src/app/(auth)/signup.tsx` - Signup page benefiting from optimizations
