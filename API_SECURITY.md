# API Key Security Guide

## The Problem

GitHub Pages only hosts static files. Any API key in your client-side JavaScript will be visible to users. You cannot truly hide API keys in a static website.

## Solutions

### Option 1: Backend Proxy (Recommended for Production)

Use a serverless function to proxy API requests. The API key stays on the server.

#### Using Netlify (Free & Easy)

**Benefits:**
- Free tier available
- Easy deployment from GitHub
- Built-in serverless functions
- Automatic HTTPS
- Better than GitHub Pages for this use case

**Setup:**

1. **Sign up at [Netlify](https://netlify.com)**

2. **Create `netlify.toml` in your project root:**
```toml
[build]
  publish = "."
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

3. **Create serverless function:**

File: `netlify/functions/weather.js`
```javascript
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const API_KEY = process.env.WEATHER_API_KEY; // Stored in Netlify dashboard
  const { lat, lon, city } = event.queryStringParameters;

  // Determine the API URL based on parameters
  let apiUrl;
  if (lat && lon) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
  } else if (city) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameters' })
    };
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data' })
    };
  }
};
```

4. **Update your client-side code:**

```javascript
// In app.js - replace direct API calls with proxy calls
async function fetchWeatherData(city) {
  try {
    // Call your Netlify function instead of the weather API directly
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
}
```

5. **Deploy to Netlify:**
   - Connect your GitHub repo to Netlify
   - Set environment variable `WEATHER_API_KEY` in Netlify dashboard (Settings → Environment Variables)
   - Deploy

---

### Option 2: Vercel Serverless Functions

Similar to Netlify but using Vercel.

**Create `api/weather.js`:**
```javascript
export default async function handler(req, res) {
  const API_KEY = process.env.WEATHER_API_KEY;
  const { city } = req.query;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
  );
  const data = await response.json();

  res.status(200).json(data);
}
```

Then deploy to Vercel and set the environment variable there.

---

### Option 3: Cloudflare Workers

Free tier with excellent performance.

**Create `worker.js`:**
```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const city = url.searchParams.get('city')

  const API_KEY = WEATHER_API_KEY // Set in Cloudflare dashboard

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`

  const response = await fetch(weatherUrl)
  const data = await response.json()

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
```

---

### Option 4: API Key with Domain Restrictions (Acceptable for Free APIs)

If you must use GitHub Pages, many weather APIs allow domain restrictions:

**For OpenWeatherMap:**
1. Get free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. In API dashboard, restrict key to your GitHub Pages domain: `yourusername.github.io`
3. This prevents others from using your key on their sites

**Limitations:**
- Key is still visible in browser, but can't be used elsewhere
- Good for free tier APIs with rate limits
- Not suitable for paid APIs

**Implementation:**
```javascript
// In app.js
const API_KEY = 'your_api_key_here'; // Restricted to your domain

async function fetchWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;
  const response = await fetch(url);
  return await response.json();
}
```

---

## Recommended Approach

**For this project:** Use **Netlify** (Option 1)
- Free tier is generous
- Easy setup
- Better security than GitHub Pages
- No API key exposure
- Can still deploy from GitHub automatically

## Free Weather APIs

Popular options:
- **OpenWeatherMap** - 1,000 calls/day free
- **WeatherAPI** - 1,000,000 calls/month free
- **Tomorrow.io** - 500 calls/day free

## Security Best Practices

1. ✅ Never commit API keys to git
2. ✅ Use environment variables
3. ✅ Add `.env` to `.gitignore`
4. ✅ Use domain restrictions when available
5. ✅ Implement rate limiting
6. ✅ Monitor API usage
