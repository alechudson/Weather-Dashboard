# Deployment Guide

## Quick Start: Deploy to Netlify (Recommended)

This is the easiest and most secure way to deploy your weather dashboard.

### Step 1: Get a Weather API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "API keys" section
4. Copy your API key

### Step 2: Deploy to Netlify

#### Option A: One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Click the button above
2. Connect your GitHub account
3. Select this repository
4. Add environment variable:
   - Key: `WEATHER_API_KEY`
   - Value: Your OpenWeatherMap API key
5. Click "Deploy site"

#### Option B: Manual Deploy

1. **Sign up at [Netlify](https://netlify.com)**

2. **Connect to GitHub:**
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository

3. **Configure build settings:**
   - Build command: (leave empty)
   - Publish directory: `.`
   - Click "Show advanced"
   - Add environment variable:
     - Key: `WEATHER_API_KEY`
     - Value: Your OpenWeatherMap API key

4. **Deploy:**
   - Click "Deploy site"
   - Your site will be live in ~1 minute!

### Step 3: Enable Real Weather Data

1. In your repository, rename `app-with-api.js` to `app.js` (overwrite the mock version)
2. Set `USE_MOCK_DATA = false` at the top of the file
3. Commit and push changes
4. Netlify will automatically redeploy

---

## Alternative: Deploy to Vercel

### Setup

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create Vercel config:**

   Create `vercel.json`:
   ```json
   {
     "functions": {
       "api/*.js": {
         "runtime": "nodejs18.x"
       }
     }
   }
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add environment variable:**
   ```bash
   vercel env add WEATHER_API_KEY
   ```

---

## Alternative: GitHub Pages (Less Secure)

⚠️ **Warning:** This approach exposes your API key. Only use with domain restrictions.

### Setup

1. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll to "Pages"
   - Select source: main branch
   - Save

2. **Restrict your API key:**
   - Go to OpenWeatherMap API dashboard
   - Restrict key to: `yourusername.github.io`

3. **Modify app.js:**
   ```javascript
   const API_KEY = 'your_api_key_here';

   async function fetchWeather(city) {
     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;
     const response = await fetch(url);
     return await response.json();
   }
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add API integration"
   git push
   ```

---

## Testing Locally (with Netlify CLI)

### Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Create .env file

```bash
cp .env.example .env
# Edit .env and add your API key
```

### Run development server

```bash
netlify dev
```

This will:
- Serve your site locally
- Run serverless functions
- Use environment variables from `.env`
- Available at `http://localhost:8888`

---

## Comparison of Deployment Options

| Platform | Security | Difficulty | Cost | Best For |
|----------|----------|------------|------|----------|
| **Netlify** | ✅ Excellent | 🟢 Easy | Free | **Recommended** |
| **Vercel** | ✅ Excellent | 🟡 Medium | Free | Advanced users |
| **Cloudflare** | ✅ Excellent | 🟡 Medium | Free | Global CDN |
| **GitHub Pages** | ⚠️ Poor | 🟢 Easy | Free | Demo only |

---

## Troubleshooting

### "API key not configured" error

- Check that you've set the `WEATHER_API_KEY` environment variable
- In Netlify: Site settings → Environment variables
- In Vercel: Settings → Environment Variables

### "Failed to fetch weather data" error

- Verify your API key is valid
- Check OpenWeatherMap API dashboard for usage limits
- Check browser console for specific error messages

### Functions not working locally

- Make sure you're using `netlify dev`, not a simple HTTP server
- Check that `.env` file exists with your API key
- Verify functions are in `netlify/functions/` directory

### 429 Too Many Requests

- You've hit the API rate limit (60 calls/minute for free tier)
- Wait a minute and try again
- Consider implementing client-side caching

---

## Next Steps

After deploying:

1. **Add a custom domain** (Netlify/Vercel make this easy)
2. **Enable HTTPS** (automatic on Netlify/Vercel)
3. **Monitor API usage** in OpenWeatherMap dashboard
4. **Add location search** for user-selected cities
5. **Implement caching** to reduce API calls
