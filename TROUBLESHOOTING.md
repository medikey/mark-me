# Mark-Me Troubleshooting Guide

## CORS Error During Login

### Problem
You see errors like:
```
Access to fetch at 'https://nyc.cloud.appwrite.io/v1/account/sessions/email' 
from origin 'http://localhost:8081' has been blocked by CORS policy
```

### Root Cause
The Appwrite server is not configured to accept requests from your development environment at `http://localhost:8081`.

### Solution: Configure CORS in Appwrite Console

#### Step 1: Access Your Appwrite Console
1. Go to: https://nyc.cloud.appwrite.io/console
2. Log in with your Appwrite account
3. Select your project "markme"

#### Step 2: Add localhost to Allowed Origins
1. Navigate to **Settings** (gear icon in top right)
2. Look for **Domains** or **Allowed Origins** section
3. Click **Add Domain** or similar button
4. Add these origins:
   - `http://localhost:8081`
   - `http://localhost:8080`
   - `http://127.0.0.1:8081`

#### Step 3: Save and Test
1. Click **Save**
2. Wait 1-2 minutes for changes to propagate
3. Hard refresh your browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
4. Try logging in again

### If Still Getting Errors

#### Option 1: Clear Browser Cache
1. Open DevTools: `F12`
2. Right-click the refresh button
3. Select "Empty cache and hard refresh"
4. Try again

#### Option 2: Check Your Environment
```bash
# Verify you're using the correct endpoint
echo $EXPO_PUBLIC_APPWRITE_ENDPOINT
# Should show: https://nyc.cloud.appwrite.io/v1

# Verify project ID
echo $EXPO_PUBLIC_APPWRITE_PROJECT_ID
# Should show: 695b021b0027b63ab6b7
```

#### Option 3: Check Appwrite Service Status
1. Go to https://status.appwrite.io
2. Verify all services are operational
3. If any are down, wait for them to come back online

### Verification Checklist

After making changes, verify:

- [ ] CORS domain added to Appwrite console
- [ ] Changes saved in Appwrite
- [ ] Browser cache cleared
- [ ] Hard refresh done (Ctrl/Cmd + Shift + R)
- [ ] Appwrite service is online
- [ ] Correct endpoint in `.env`
- [ ] Correct project ID in `.env`

---

## Login Page Issues

### Issue: "A component is changing an uncontrolled input to be controlled"

**Cause:** Input component not properly initialized

**Fix:** Ensure all form inputs have initial state values:
```tsx
const [email, setEmail] = useState("")  // Initialize with empty string
const [password, setPassword] = useState("")
```

### Issue: Login button doesn't work

**Cause:** Could be CORS or form validation

**Steps:**
1. Check browser console for error messages
2. Verify email format is valid
3. Verify password is not empty
4. Check CORS configuration (see above)
5. Check network tab to see actual API responses

---

## Classes Page Issues

### Issue: Classes not loading

**Symptoms:**
- Page appears blank or shows loading spinner forever
- Error message in console about Appwrite

**Solutions:**

1. **Check CORS** (same as login above)
2. **Verify Database Connection:**
   - Go to Appwrite console
   - Navigate to Databases
   - Check if database `695b02ec0031d7aba24b` exists
   - Check if "classes" collection exists

3. **Clear Cache:**
   ```bash
   # Delete AsyncStorage cache (browser only)
   # Or uninstall and reinstall the app (mobile)
   ```

4. **Verify Collection Permissions:**
   - In Appwrite console, go to Database → classes collection
   - Check Document Permissions allow read access

### Issue: Can't create new classes

**Solutions:**
1. Check CORS configuration
2. Verify write permissions on the classes collection
3. Check API key has correct permissions

---

## Student Management Issues

### Issue: Students not showing in class

**Solutions:**
1. Verify students collection exists in Appwrite
2. Check CORS configuration
3. Clear app cache: `AsyncStorage.clear()`

### Issue: Can't add students

**Solutions:**
1. Verify write permissions on students collection
2. Check CORS configuration
3. Ensure class ID is valid and exists

---

## Grading Issues

### Issue: Grades not saving

**Solutions:**
1. Verify grades collection exists
2. Check CORS configuration
3. Verify write permissions

### Issue: Can't see grades for student

**Solutions:**
1. Verify grades collection exists
2. Check student ID is valid
3. Check class ID is valid
4. Clear cache and try again

---

## Network Errors

### "Failed to fetch" error

**Causes:**
- No internet connection
- Appwrite server is down
- CORS misconfiguration (main cause)
- API key is invalid

**Fixes:**
1. Check internet connection
2. Check https://status.appwrite.io for service status
3. Verify CORS configuration (see top of this guide)
4. Verify API key in `.env` is correct

### Timeout errors

**Cause:** Request took too long

**Solutions:**
1. Check network speed
2. Retry the operation
3. Check if server is overloaded
4. Check APPWRITE_ENDPOINT is correct

---

## Developer Console Tips

### Enable Debug Logging

All errors logged with `[v0]` prefix:

```bash
# Filter console to see only error logs
# In DevTools console, search for "[v0]"
```

### Check Error Types

The app categorizes errors:
- **CORS errors** → Fix CORS configuration
- **Network errors** → Check internet/server
- **Auth errors** → Check email/password
- **Validation errors** → Check input format
- **Server errors** → Wait and retry

---

## Quick Fix Checklist

For most issues, try in this order:

1. [ ] Hard refresh browser: `Ctrl/Cmd + Shift + R`
2. [ ] Check CORS domains in Appwrite console
3. [ ] Verify `.env` variables are correct
4. [ ] Check internet connection
5. [ ] Wait 2 minutes and retry
6. [ ] Check browser console for specific error message
7. [ ] Check Appwrite service status

---

## Getting More Help

If issues persist:

1. **Check browser console** (`F12` → Console tab)
2. **Check network requests** (`F12` → Network tab)
3. **Note the exact error message** shown to user and in console
4. **Take a screenshot** of the error
5. **Check CORS domains** in Appwrite console

Include these when reporting issues:
- Error message from browser console
- Screenshots of the error
- What action caused the error
- Environment (local vs. deployed)
- Browser and OS version

---

## Environment Configuration Reference

Your current `.env` setup:

```
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=695b021b0027b63ab6b7
EXPO_PUBLIC_APPWRITE_DATABASE_ID=695b02ec0031d7aba24b
EXPO_PUBLIC_APPWRITE_CLASSES_COLLECTION_ID=classes
EXPO_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID=students
EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
EXPO_PUBLIC_APPWRITE_GRADES_COLLECTION_ID=grades
EXPO_PUBLIC_APPWRITE_CRITERIA_COLLECTION_ID=grading_criteria
EXPO_PUBLIC_APPWRITE_GROUPS_COLLECTION_ID=class_groups
```

If any of these are wrong, update them and restart your dev server.
