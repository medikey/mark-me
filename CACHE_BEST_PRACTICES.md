# Cache & Request Optimization Best Practices

## Cache Strategy Overview

The optimizations use a **3-tier strategy** to prevent rate limiting:

### Tier 1: Request Deduplication (Immediate)
- **Scope**: Within the same millisecond/execution cycle
- **Example**: Two components mount simultaneously, both call `getClasses()`
- **Benefit**: Only 1 API call made instead of 2
- **Implementation**: `dedupRequest()` utility

### Tier 2: Local Caching (5-60 seconds)
- **Scope**: Within the app session
- **Example**: User navigates away and back, classes still in cache
- **Benefit**: No API call needed if cache fresh
- **Implementation**: `AsyncStorage` with TTL

### Tier 3: Graceful Degradation (Network Error Recovery)
- **Scope**: When network fails
- **Example**: Network drops but user still sees last fetched data
- **Benefit**: App doesn't crash, users see stale-but-useful data
- **Implementation**: Return cached data on catch

## When Cache is Used

### Automatic Cache Hits (Zero Code Changes):
```
1. User opens app
   → Auth check uses cached session (if fresh)
   → No API call needed

2. User navigates to Classes page
   → Classes loaded from cache
   → No API call if < 5 min since last fetch

3. Two rapid requests to getStudentGrades()
   → First request: API call
   → Second request: Waits for first, uses same result
   → No second API call
```

### Automatic Cache Invalidation (Zero Code Changes):
```
1. User creates a new class
   → classesService.createClass() called
   → Cache automatically invalidated
   → Next getClasses() hits server
   → Fresh data loaded

2. User updates a student
   → studentsService.updateStudent(studentId, updates, classId)
   → Cache for that class automatically cleared
   → Next getStudentsByClass(classId) hits server
```

## Adding New Features with Cache

If you add a new Appwrite service, follow this pattern:

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage"
import { dedupRequest } from "../src/utils/requestDedup"

// 1. Define cache keys and duration
const CACHE_KEY = "@markme:my_data"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// 2. Wrap fetch functions with dedup + cache
async getMyData(id: string): Promise<MyData[]> {
  return dedupRequest(`mydata:${id}`, async () => {
    try {
      // Check cache
      const cached = await AsyncStorage.getItem(CACHE_KEY)
      const timestamp = await AsyncStorage.getItem(`${CACHE_KEY}_ts`)
      
      if (cached && timestamp && Date.now() - parseInt(timestamp) < CACHE_DURATION) {
        return JSON.parse(cached)
      }

      // Fetch from server
      const data = await database.listDocuments(...)
      
      // Cache result
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data))
      await AsyncStorage.setItem(`${CACHE_KEY}_ts`, Date.now().toString())
      
      return data
    } catch (error) {
      // Return stale cache on error
      const cached = await AsyncStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : []
    }
  })
}

// 3. Invalidate on write operations
async createMyData(data: MyData): Promise<void> {
  await database.createDocument(...)
  await AsyncStorage.removeItem(CACHE_KEY)
  await AsyncStorage.removeItem(`${CACHE_KEY}_ts`)
}
```

## Debugging Cache Issues

### Check if Cache is Working:

**1. React Native Console Logs:**
```
✅ Cache Hit: "Using cached classes"
✅ Cache Miss: (no log, normal request)
✅ Invalidated: "Invalidated classes cache"
```

**2. AsyncStorage Inspection** (React Native Debugger):
```javascript
// In React Native console:
AsyncStorage.getAllKeys().then(keys => {
  console.log('Cache keys:', keys.filter(k => k.startsWith('@markme')))
})
```

**3. Network Tab** (Expo Go):
- Fewer API calls = working correctly
- Same number of API calls = cache might be disabled

### Common Cache Issues:

**Issue**: Cache keys conflicts across different data types
**Solution**: Use descriptive prefixes: `@markme:classes`, `@markme:students`, etc.

**Issue**: Cache not invalidating after updates
**Solution**: Check that write functions call `invalidateCache()`

**Issue**: Cache never expires (stale data forever)
**Solution**: Verify `CACHE_DURATION` is set and timestamp check works

## Performance Tips

### 1. Optimize Cache Duration Based on Data Freshness:
```typescript
// Rarely changes - longer TTL
const CLASSES_CACHE = 10 * 60 * 1000 // 10 minutes

// Changes frequently - shorter TTL
const GRADES_CACHE = 2 * 60 * 1000 // 2 minutes

// Changes very frequently - minimal cache
const ATTENDANCE_CACHE = 30 * 1000 // 30 seconds
```

### 2. Batch Related Requests:
```typescript
// ❌ Bad: 3 separate requests
const classes = await classesService.getClasses()
const students = await studentsService.getStudentsByClass(classId)
const grades = await gradesService.getStudentGrades(studentId, classId)

// ✅ Better: Same requests but more efficient with cache
// If cache fresh: 0 API calls
// If cache stale: 3 API calls (already happening efficiently)
```

### 3. Use Key Specificity:
```typescript
// ✅ Good: Specific keys allow partial invalidation
const studentCacheKey = `@markme:students_${classId}`
const gradeCacheKey = `@markme:grades_${studentId}_${classId}`

// Can invalidate class cache without affecting other classes
await AsyncStorage.removeItem(`@markme:students_${classId}`)
```

### 4. Handle Loading States:
```typescript
// Users expect quick responses
// If cache hit: response instant
// If cache miss: show loading indicator for ~500-1000ms

const [isLoading, setIsLoading] = useState(false)

useEffect(() => {
  setIsLoading(true)
  classesService.getClasses()
    .then(setClasses)
    .finally(() => setIsLoading(false))
}, [])
```

## Testing Cache Behavior

### Test 1: Verify Cache Hit (same data within TTL):
```typescript
const classes1 = await classesService.getClasses()
// Should see API call in network tab

const classes2 = await classesService.getClasses()
// Should NOT see API call (cached)

expect(classes1).toEqual(classes2)
```

### Test 2: Verify Cache Invalidation:
```typescript
const before = await classesService.getClasses()
// API call made

await classesService.createClass(newClass)
// Should see "Invalidated classes cache" log

const after = await classesService.getClasses()
// API call made (cache was cleared)

// after should include new class
expect(after.length).toBeGreaterThan(before.length)
```

### Test 3: Verify Request Deduplication:
```typescript
// Make multiple simultaneous requests
const [result1, result2, result3] = await Promise.all([
  classesService.getClasses(),
  classesService.getClasses(),
  classesService.getClasses(),
])

// Should see only 1 API call in network tab (not 3)
expect(result1).toEqual(result2)
expect(result2).toEqual(result3)
```

## FAQ

**Q: Will cached data ever be inconsistent with the server?**
A: Only within the cache TTL window. After TTL expires, next request fetches fresh data.

**Q: Can users manually refresh to bypass cache?**
A: Yes - pull-to-refresh should invalidate cache before fetching.

**Q: What if Appwrite goes down?**
A: Graceful degradation - users see last cached data instead of error.

**Q: Does this work offline?**
A: Yes - users can browse cached data offline, sync when online.

**Q: How much storage does this use?**
A: ~10-50KB depending on data volume. AsyncStorage has 10MB limit.

**Q: Can I disable cache for debugging?**
A: Yes - temporarily set `CACHE_DURATION = 0` to force fresh fetches.

---

**Remember**: The goal is preventing rate limiting while keeping data reasonably fresh!
