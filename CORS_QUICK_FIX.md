# CORS Error - Quick Fix Guide

## The Error You're Seeing

```
Access to fetch at 'https://nyc.cloud.appwrite.io/v1/account/sessions/email' 
from origin 'http://localhost:8081' 
has been blocked by CORS policy
```

**Translation:** Your browser won't let the app talk to the Appwrite server.

---

## Quick Fix (3 Minutes)

### Step 1: Open Appwrite Console
Visit: https://nyc.cloud.appwrite.io/console

### Step 2: Select Your Project
- Look for "markme" project
- Click to open it

### Step 3: Go to Settings
- Click the gear icon (⚙️) in the top right
- Look for **"Domains"** or **"Allowed Origins"** section

### Step 4: Add Your Development URL
Click "Add Domain" and add:
```
http://localhost:8081
```

### Step 5: Save
- Click Save/Confirm
- Wait 2 minutes for changes to apply

### Step 6: Test
- Go back to your app
- Refresh the page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Try logging in

---

## Still Not Working?

### Clear Your Browser Cache
1. Press `F12` to open DevTools
2. Right-click the refresh button
3. Select "Empty cache and hard refresh"
4. Try again

### Check the Console
1. Press `F12` to open DevTools
2. Go to "Console" tab
3. Look for errors starting with `[v0]`
4. Copy the error message
5. Refer to **TROUBLESHOOTING.md** for your specific error

### Verify Your Setup
```bash
# Your current settings in .env:
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=695b021b0027b63ab6b7
```

If these don't match your Appwrite project, update `.env`

---

## Common CORS Issues

### Issue 1: Added domain but still getting error
**Solution:** Wait 2-3 minutes and hard refresh (`Ctrl+Shift+R`)

### Issue 2: Only added `http://localhost:8081` but other ports fail
**Solution:** Add all ports you use:
```
http://localhost:8081
http://localhost:8080
http://localhost:3000
http://127.0.0.1:8081
```

### Issue 3: Error shows `localhost` but Appwrite shows `127.0.0.1`
**Solution:** Add both:
```
http://localhost:8081
http://127.0.0.1:8081
```

---

## What Changed in Your App

Your app now shows **clear error messages** instead of confusing "Failed to fetch" errors:

| Before | After |
|--------|-------|
| "AppwriteException: Failed to fetch" | "Connection error. Please ensure your Appwrite server is properly configured." |
| No info what went wrong | Specific error type shown |
| Can't retry automatically | App knows when to retry |

---

## Checklist

After adding CORS domains, verify:

- [ ] Domain added to Appwrite console
- [ ] Domain saved in Appwrite
- [ ] 2 minutes have passed
- [ ] Browser hard refreshed (`Ctrl/Cmd+Shift+R`)
- [ ] Cache cleared (if issues persist)
- [ ] Login page loads without CORS error

---

## Error Types You Might See

### Connection Error (CORS)
```
✗ Connection error. Please ensure your Appwrite server 
  is properly configured. Check the browser console for details.
```
**Fix:** Add domain to Appwrite CORS (see Quick Fix above)

### Network Error
```
✗ Network connection error. Please check your internet 
  connection and try again.
```
**Fix:** Check your internet connection

### Invalid Credentials
```
✗ Invalid email or password. Please try again.
```
**Fix:** Check your email and password are correct

### Server Error
```
✗ Server error. Please try again later.
```
**Fix:** Wait a moment, Appwrite server might be restarting

---

## Where to Get Help

1. **CORS issues?** → Read **APPWRITE_CORS_FIX.md**
2. **Any app issue?** → Read **TROUBLESHOOTING.md**
3. **Want details?** → Read **CORS_AND_ERROR_HANDLING_FIX.md**
4. **Browser console errors?** → Look for `[v0]` prefix
5. **Appwrite status?** → Check https://status.appwrite.io

---

## Production Setup

When you deploy to production:

1. Add your production domain instead of localhost:
```
https://yourapp.com
https://www.yourapp.com
```

2. Keep development domains separate:
```
Development: http://localhost:8081
Production: https://yourapp.com
```

3. Never use `http://` in production - always use `https://`

---

## Summary

1. ✅ Add `http://localhost:8081` to Appwrite CORS domains
2. ✅ Wait 2 minutes and save
3. ✅ Hard refresh your browser
4. ✅ Try logging in again

That's it! The app now shows clear error messages for any issues that remain.
