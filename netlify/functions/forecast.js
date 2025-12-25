// Netlify Serverless Function for 5-day Weather Forecast
// This keeps your API key secure on the server

exports.handler = async (event, context) => {
  const API_KEY = process.env.WEATHER_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  const { lat, lon, city } = event.queryStringParameters || {};

  let apiUrl;
  if (lat && lon) {
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
  } else if (city) {
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameters: city or (lat and lon)' })
    };
  }

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=1800' // Cache for 30 minutes
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to fetch forecast data',
        message: error.message
      })
    };
  }
};
