// Netlify Serverless Function for Weather API Proxy
// This keeps your API key secure on the server

exports.handler = async (event, context) => {
  // Get API key from environment variables (set in Netlify dashboard)
  const API_KEY = process.env.WEATHER_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  // Get parameters from the request
  const { lat, lon, city } = event.queryStringParameters || {};

  // Build API URL based on what parameters were provided
  let apiUrl;
  if (lat && lon) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
  } else if (city) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameters: city or (lat and lon)' })
    };
  }

  try {
    // Fetch data from weather API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Return the weather data
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=600' // Cache for 10 minutes
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to fetch weather data',
        message: error.message
      })
    };
  }
};
