# Appwrite + Localhost - 5 Minute Setup

## The Problem
Appwrite doesn't accept `localhost` as a valid domain - it needs a real domain name.

## The Solution: ngrok (Free Tunnel)

### Step 1: Install ngrok (one-time)
```bash
npm install -g ngrok
```

### Step 2: Start your app
```bash
npm start
# Your app runs on http://localhost:8081
```

### Step 3: Open a NEW terminal and tunnel it
```bash
ngrok http 8081
```

### Step 4: Copy the forwarding URL
You'll see something like:
```
Forwarding    https://abc123def456.ngrok.io -> http://localhost:8081
```

Copy: `https://abc123def456.ngrok.io`

### Step 5: Add to Appwrite
1. Go to https://nyc.cloud.appwrite.io/console
2. Select "markme" project
3. Settings → Domains
4. Paste: `https://abc123def456.ngrok.io`
5. Click Add & Save

### Step 6: Test
Open your browser to: `https://abc123def456.ngrok.io`

Try logging in - it should work!

## Important Notes

- **URL changes on restart**: Each time you restart ngrok, you get a new URL. Update Appwrite domains accordingly.
- **Free tier limitation**: If you need a permanent URL, upgrade ngrok ($5/month for stable URLs)
- **Hard refresh**: If issues persist, hard refresh: `Ctrl+Shift+R`
- **Must use HTTPS**: Appwrite only accepts `https://` URLs, not `http://`

## If You Want a Permanent URL

Use `localhost.run` instead (no installation needed):
```bash
ssh -R 80:localhost:8081 localhost.run
```
This gives you a more stable URL that persists across restarts!

## For Production

When you deploy your app (Vercel, AWS, etc.), the localhost tunneling is no longer needed - just add your production domain to Appwrite.
