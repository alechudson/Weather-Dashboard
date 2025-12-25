// Weather Dashboard with Real API Integration
// This file demonstrates how to use the Netlify serverless functions
// Rename this to app.js when you're ready to use real weather data

// Toggle between mock data and real API
const USE_MOCK_DATA = true; // Set to false when using real API

// Configuration
const DEFAULT_CITY = "San Francisco";

// Mock Weather Data (same as before)
const mockWeatherData = {
    location: "San Francisco, CA",
    current: {
        temp: 72,
        feelsLike: 70,
        condition: "Sunny",
        humidity: 65,
        windSpeed: 12,
        pressure: 30.2,
        uvIndex: 6,
        icon: "sun"
    },
    forecast: [
        { day: "Mon", temp: 72, condition: "Sunny", humidity: 65, windSpeed: 12 },
        { day: "Tue", temp: 68, condition: "Cloudy", humidity: 70, windSpeed: 15 },
        { day: "Wed", temp: 65, condition: "Rainy", humidity: 85, windSpeed: 18 },
        { day: "Thu", temp: 70, condition: "Partly Cloudy", humidity: 60, windSpeed: 10 },
        { day: "Fri", temp: 75, condition: "Sunny", humidity: 55, windSpeed: 8 },
        { day: "Sat", temp: 78, condition: "Sunny", humidity: 50, windSpeed: 7 },
        { day: "Sun", temp: 76, condition: "Partly Cloudy", humidity: 58, windSpeed: 9 }
    ]
};

// Fetch current weather from API
async function fetchCurrentWeather(city) {
    if (USE_MOCK_DATA) {
        return mockWeatherData;
    }

    try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        return transformWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        // Fallback to mock data on error
        return mockWeatherData;
    }
}

// Fetch forecast from API
async function fetchForecast(city) {
    if (USE_MOCK_DATA) {
        return mockWeatherData.forecast;
    }

    try {
        const response = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch forecast data');
        }
        const data = await response.json();
        return transformForecastData(data);
    } catch (error) {
        console.error('Error fetching forecast:', error);
        return mockWeatherData.forecast;
    }
}

// Transform OpenWeatherMap data to our format
function transformWeatherData(apiData) {
    return {
        location: `${apiData.name}, ${apiData.sys.country}`,
        current: {
            temp: Math.round(apiData.main.temp),
            feelsLike: Math.round(apiData.main.feels_like),
            condition: apiData.weather[0].main,
            humidity: apiData.main.humidity,
            windSpeed: Math.round(apiData.wind.speed),
            pressure: (apiData.main.pressure * 0.02953).toFixed(1), // Convert hPa to inHg
            uvIndex: 0, // UV data requires separate API call
            icon: apiData.weather[0].icon
        }
    };
}

// Transform forecast data
function transformForecastData(apiData) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyForecasts = [];
    const processedDays = new Set();

    // Group by day and get one forecast per day
    apiData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayName = days[date.getDay()];

        if (!processedDays.has(dayName) && dailyForecasts.length < 7) {
            processedDays.add(dayName);
            dailyForecasts.push({
                day: dayName,
                temp: Math.round(item.main.temp),
                condition: item.weather[0].main,
                humidity: item.main.humidity,
                windSpeed: Math.round(item.wind.speed)
            });
        }
    });

    return dailyForecasts;
}

// Weather Icons
const weatherIcons = {
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`,
    cloud: `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>`,
    rain: `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="8" y1="19" x2="8" y2="21"></line>
        <line x1="8" y1="13" x2="8" y2="15"></line>
        <line x1="16" y1="19" x2="16" y2="21"></line>
        <line x1="16" y1="13" x2="16" y2="15"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="12" y1="15" x2="12" y2="17"></line>
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
    </svg>`,
    partlyCloudy: `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" opacity="0.5"></path>
    </svg>`
};

// Initialize the dashboard
async function initDashboard() {
    const weatherData = await fetchCurrentWeather(DEFAULT_CITY);
    const forecastData = await fetchForecast(DEFAULT_CITY);

    updateCurrentWeather(weatherData);
    updateWeatherStats(weatherData);
    createForecastCards(forecastData);
    createTemperatureChart(forecastData);
    createConditionsChart(forecastData);
}

// Update current weather display
function updateCurrentWeather(data) {
    document.getElementById('location-name').textContent = data.location;
    document.getElementById('current-temp').textContent = data.current.temp;
    document.getElementById('weather-description').textContent = data.current.condition;

    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('weather-date').textContent = date.toLocaleDateString('en-US', options);
}

// Update weather statistics
function updateWeatherStats(data) {
    document.getElementById('humidity').textContent = data.current.humidity + '%';
    document.getElementById('wind-speed').textContent = data.current.windSpeed + ' mph';
    document.getElementById('pressure').textContent = data.current.pressure + ' inHg';
    document.getElementById('uv-index').textContent = data.current.uvIndex + ' (High)';
}

// Create forecast cards
function createForecastCards(forecastData) {
    const forecastGrid = document.getElementById('forecast-grid');
    const forecast = forecastData.slice(0, 5);

    forecastGrid.innerHTML = forecast.map(day => {
        const icon = getWeatherIcon(day.condition);
        return `
            <div class="forecast-day">
                <h4>${day.day}</h4>
                ${icon}
                <div class="forecast-temp">${day.temp}°</div>
                <div class="forecast-condition">${day.condition}</div>
            </div>
        `;
    }).join('');
}

// Get weather icon based on condition
function getWeatherIcon(condition) {
    const iconMap = {
        'Sunny': weatherIcons.sun,
        'Clear': weatherIcons.sun,
        'Cloudy': weatherIcons.cloud,
        'Clouds': weatherIcons.cloud,
        'Rainy': weatherIcons.rain,
        'Rain': weatherIcons.rain,
        'Partly Cloudy': weatherIcons.partlyCloudy
    };
    return iconMap[condition] || weatherIcons.sun;
}

// Create temperature chart
function createTemperatureChart(forecastData) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.1)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: forecastData.map(d => d.day),
            datasets: [{
                label: 'Temperature (°F)',
                data: forecastData.map(d => d.temp),
                borderColor: '#818cf8',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#818cf8',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '°F';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(51, 65, 85, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return value + '°';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// Create conditions chart
function createConditionsChart(forecastData) {
    const ctx = document.getElementById('conditionsChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: forecastData.map(d => d.day),
            datasets: [
                {
                    label: 'Humidity (%)',
                    data: forecastData.map(d => d.humidity),
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                },
                {
                    label: 'Wind Speed (mph)',
                    data: forecastData.map(d => d.windSpeed),
                    backgroundColor: 'rgba(168, 85, 247, 0.7)',
                    borderColor: 'rgba(168, 85, 247, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#f1f5f9',
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(51, 65, 85, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);
