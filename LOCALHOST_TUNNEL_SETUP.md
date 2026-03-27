# Localhost Tunnel Setup for Appwrite CORS

Since Appwrite doesn't accept `localhost` as a valid domain, you need to tunnel your local dev server to a public URL. Here are the easiest solutions:

## Option 1: ngrok (Recommended - Free & Easy)

### Install ngrok
```bash
# Install ngrok
npm install -g ngrok
# Or if using homebrew (macOS)
brew install ngrok
```

### Run ngrok tunnel
```bash
# Tunnel your localhost:8081 to a public URL
ngrok http 8081
```

You'll see output like:
```
ngrok by @inconshreveable

Session Status    online
Account           your@email.com (Plan: Free)
Version           3.3.4
Region            United States (us)
Latency           52ms
Web Interface     http://127.0.0.1:4040

Forwarding        https://YOUR-RANDOM-ID.ngrok.io -> http://localhost:8081
```

### Add to Appwrite
1. Go to https://nyc.cloud.appwrite.io/console
2. Select your "markme" project
3. Go to Settings → Domains
4. Add: `https://YOUR-RANDOM-ID.ngrok.io` (the forwarding URL)
5. Save

### Test
- Open your app at `https://YOUR-RANDOM-ID.ngrok.io` in your browser
- Try logging in - it should work!

**Note**: ngrok URL changes each time you restart. For permanent testing, upgrade to ngrok paid or use Option 2.

---

## Option 2: localhost.run (No Installation Required)

### Run tunnel
```bash
# In your project directory, open another terminal and run:
ssh -R 80:localhost:8081 localhost.run
```

You'll see:
```
Connect to your app with the following url:
https://YOUR-RANDOM-ID.localhost.run
```

### Add to Appwrite
1. Go to Appwrite console
2. Settings → Domains
3. Add: `https://YOUR-RANDOM-ID.localhost.run`
4. Save

---

## Option 3: Expose (Simple & Free)

```bash
# Install expose
npm install -g expose

# Run tunnel
expose tunnel http://localhost:8081
```

Then add the generated URL to Appwrite domains.

---

## Option 4: Development Configuration (Advanced)

If you want to avoid tunneling entirely, modify your Appwrite client to disable CORS checks for development:

### Edit your appwrite.ts

```typescript
import { Client } from "react-native-appwrite"

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "")

// FOR DEVELOPMENT ONLY - Add this if using localhost
if (process.env.NODE_ENV === "development" && process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT?.includes("localhost")) {
  // In development with localhost, the Appwrite client will handle CORS differently
  console.warn("[Dev] Using Appwrite with localhost configuration")
}

export { client }
```

Then in your self-hosted Appwrite instance (if applicable), configure:
```
APPWRITE_ALLOWED_ORIGINS=http://localhost:8081,http://localhost:8080
```

---

## Recommended Flow for Development

1. **Start your dev server**:
   ```bash
   npm start  # or expo start
   ```

2. **In another terminal, start ngrok**:
   ```bash
   ngrok http 8081
   ```

3. **Add ngrok URL to Appwrite domains** (one-time setup)

4. **Test at https://YOUR-ID.ngrok.io**

5. **When done**: Restart ngrok for a new URL, or upgrade ngrok for static URLs

---

## Troubleshooting

**Error: "Cannot GET /"**
- Make sure your dev server is running on port 8081
- Check if `npm start` is actually starting the server

**Error: "CORS error still appearing"**
- Make sure you added the ngrok/tunnel URL with `https://`, not `http://`
- Try adding both with and without trailing slash
- Wait 2-3 minutes for Appwrite to refresh
- Hard refresh browser: `Ctrl+Shift+R` or `Cmd+Shift+R`

**"Connection refused"**
- Dev server might be on a different port - check your console output
- Modify the ngrok command: `ngrok http YOUR_PORT`

**Getting new URL each time**
- This is normal for free ngrok (URL changes on restart)
- Upgrade to ngrok pro for static URLs ($5/month)
- Or use localhost.run which is more stable

---

## Production/Staging

For production testing:
- Deploy to Vercel, AWS, or your hosting provider
- Add your production domain to Appwrite
- No tunneling needed!

---

## Summary

**Quickest Fix**:
```bash
# Terminal 1: Start your app
npm start

# Terminal 2: Tunnel it
ngrok http 8081

# Then add the ngrok URL to Appwrite domains
```

That's it! Your app will be accessible at the ngrok URL and will work with Appwrite.
