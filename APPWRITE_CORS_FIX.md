# Appwrite CORS Configuration Fix

## Problem
The application is experiencing CORS (Cross-Origin Resource Sharing) errors when trying to connect to your Appwrite instance at `https://nyc.cloud.appwrite.io` from `http://localhost:8081`.

**Error:**
```
Access to fetch at 'https://nyc.cloud.appwrite.io/v1/account' from origin 'http://localhost:8081' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Root Cause
The Appwrite server is not allowing requests from your development localhost origin. This is a security feature that needs to be configured in Appwrite's console.

## Solution

### Step 1: Configure CORS in Appwrite Console

1. Go to your Appwrite Console: https://nyc.cloud.appwrite.io/console
2. Navigate to **Settings** → **Domains** (or **Integrations** → **Domains** depending on your Appwrite version)
3. Add the following origins to the CORS allowlist:
   - `http://localhost:8081` (for local development)
   - `http://localhost:8080` (alternative dev port)
   - `http://127.0.0.1:8081` (loopback)
   - Your production domain (e.g., `https://yourdomain.com`)

4. Save the changes

### Step 2: Verify Configuration

After adding the domains, test the connection by:
1. Refreshing your application
2. Attempting to login again
3. Check the browser console - CORS errors should be gone

### Alternative: Use API Key Authentication (Already Configured)

Your `.env` file already has:
- `EXPO_PUBLIC_APPWRITE_API_KEY` - This is configured for API key authentication
- However, this works better with self-signed JWTs than email/password sessions

## Environment Configuration

Your current setup:
```
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=695b021b0027b63ab6b7
```

These are correctly configured. The CORS issue is solely a server-side configuration problem in Appwrite.

## Testing Locally

Once CORS is enabled:

1. **Test Login:**
   ```bash
   npm run web
   # Navigate to login page and try to authenticate
   ```

2. **Check Browser Console:**
   - Should NOT see CORS errors
   - Should see "Login successful" message

3. **Monitor Network Tab:**
   - Requests to `nyc.cloud.appwrite.io` should return 200/201 status
   - No failed requests with CORS errors

## Troubleshooting

### Still getting CORS errors?

1. **Clear Browser Cache:**
   - Hard refresh: Cmd/Ctrl + Shift + R
   - Clear browser cache completely

2. **Check Appwrite Logs:**
   - Go to your Appwrite console
   - Check Settings → Logs for detailed error information

3. **Verify Project ID:**
   - Ensure `EXPO_PUBLIC_APPWRITE_PROJECT_ID` matches your Appwrite project ID
   - Go to Settings → General to verify

4. **Check API Key:**
   - Verify `EXPO_PUBLIC_APPWRITE_API_KEY` is valid
   - Generate a new key if needed: Settings → API Keys

### Origin Not Working?

If you add a domain but it's still blocked:
- Wait 1-2 minutes for the configuration to propagate
- Try with a different port if developing on multiple ports
- Check if Appwrite service is running (if self-hosted)

## Production Deployment

When deploying to production:

1. **Update Allowed Origins:**
   - Replace `http://localhost:8081` with your production domain
   - Keep development domains separate from production for security

2. **Use HTTPS:**
   - Always use HTTPS in production
   - Example: `https://markme.yourdomain.com`

3. **Environment Variables:**
   - Update `EXPO_PUBLIC_APPWRITE_ENDPOINT` if using a different Appwrite instance
   - Keep API keys secure - never expose them in client code

## Additional Security Notes

- The `EXPO_PUBLIC_*` prefix means these variables are exposed in the browser
- API keys starting with `EXPO_PUBLIC_` should be read-only API keys
- For sensitive operations, use server-side authentication with backend routes
- Consider using JWT tokens instead of API keys for production

## References

- [Appwrite CORS Documentation](https://appwrite.io/docs/advanced/security#cors)
- [Appwrite Console Settings](https://appwrite.io/docs/getting-started#settings)
- [CORS Error Solutions](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
