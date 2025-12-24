# Weather Dashboard

A clean and modern weather dashboard featuring interactive charts and a responsive design. Currently uses mock data for demonstration purposes.

## Features

- **Current Weather Display**: Shows real-time temperature, weather conditions, and location
- **Weather Statistics**: Displays humidity, wind speed, pressure, and UV index
- **Interactive Charts**:
  - 7-day temperature forecast line chart
  - Weather conditions bar chart (humidity and wind speed)
- **5-Day Forecast**: Visual cards showing upcoming weather
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark color scheme with gradient accents

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript
- Chart.js (v4.4.0) for data visualization

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No build tools or dependencies required

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alechudson/Weather-Dashboard.git
   cd Weather-Dashboard
   ```

2. Open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html

   # On Linux
   xdg-open index.html

   # On Windows
   start index.html
   ```

   Or simply double-click the `index.html` file.

## Project Structure

```
Weather-Dashboard/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── app.js             # JavaScript logic and mock data
├── README.md          # Project documentation
└── LICENSE            # GPL-3.0 License
```

## Current Implementation

The dashboard currently uses **mock data** to demonstrate functionality. This allows you to see the complete UI and features without requiring API keys or external services.

### Mock Data Includes:
- Current weather conditions
- 7-day forecast
- Hourly temperature data
- Weather statistics (humidity, wind, pressure, UV index)

## Future Enhancements

- [ ] Integration with real weather API (OpenWeatherMap, WeatherAPI, etc.)
- [ ] Location search functionality
- [ ] Geolocation support for automatic location detection
- [ ] Weather alerts and warnings
- [ ] Historical weather data
- [ ] Temperature unit toggle (Fahrenheit/Celsius)
- [ ] Additional chart types (precipitation, air quality, etc.)
- [ ] Local storage for saving preferences

## Screenshots

The dashboard features:
- A gradient header with location display
- Large current temperature display with weather icon
- Four stat cards showing key weather metrics
- Two interactive charts powered by Chart.js
- Five-day forecast with visual cards

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Chart.js for the excellent charting library
- Weather icons using Feather Icons SVG format
