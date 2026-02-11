# Weather Dashboard

A modern, interactive weather dashboard with a beautiful user interface, dark/light mode support, and real-time weather data.

## Features

✨ **Modern UI Design**
- Clean and attractive interface with smooth animations
- Responsive design that works on all devices
- Interactive hover effects and transitions

🌙 **Dark & Light Mode**
- Toggle between dark and light themes
- Theme preference saved to local storage
- Smooth theme transitions

🌍 **Weather Information**
- Current weather conditions with temperature and description
- Real-time weather details (humidity, wind speed, precipitation)
- 5-day weather forecast with daily high/low temperatures
- 24-hour hourly forecast with detailed metrics
- Weather icons that change based on conditions

🔍 **Search & Location Features**
- Search for any city worldwide
- City suggestions as you type
- Use current GPS location
- Automatic location-based weather updates

📱 **Responsive Layout**
- Optimized for desktop, tablet, and mobile devices
- Flexible grid system for different screen sizes
- Touch-friendly buttons and controls

## Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6)** - Interactive functionality and API integration
- **Open-Meteo API** - Free weather data (no API key required)
- **Nominatim API** - Geocoding and reverse geocoding for location services
- **Font Awesome** - Beautiful weather and UI icons

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for real-time weather data

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start exploring weather data!

## How to Use

### Search for a City
1. Type a city name in the search box
2. Select from the suggestions dropdown
3. Weather information updates automatically

### Use Current Location
1. Click the "Use Current Location" button
2. Allow the browser to access your location
3. Weather for your current location loads instantly

### Toggle Dark/Light Mode
- Click the theme toggle button in the header (moon/sun icon)
- Your preference is automatically saved

### View Weather Details
- **Current Weather**: Large display with temperature and description
- **Weather Details**: Sidebar showing humidity, wind speed, and precipitation
- **5-Day Forecast**: Preview upcoming weather conditions
- **Hourly Forecast**: Hour-by-hour breakdown for the next 24 hours

## Project Structure

```
Weather Dashboard/
├── index.html        # Main HTML file
├── styles.css        # All styling and theme variables
├── script.js         # JavaScript functionality
└── README.md         # Documentation
```

## API Information

### Open-Meteo (Weather Data)
- **Endpoint**: https://api.open-meteo.com/v1/forecast
- **Features**: Free, no API key required
- **Data**: Temperature, weather codes, wind speed, humidity, precipitation

### Nominatim (Geocoding)
- **Endpoint**: https://nominatim.openstreetmap.org/
- **Features**: City search and reverse geocoding
- **Free service**: No authentication needed

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --warning-color: #e74c3c;
}
```

### Modifying Theme
- Dark mode colors are defined under `body.dark-mode`
- Light mode uses `:root` variables
- All transitions smooth across both themes

### Adding More Weather Metrics
1. Update the API request in `script.js`
2. Add new HTML elements in `index.html`
3. Style with CSS and update JavaScript display functions

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

- Weather data requires internet connection
- Geolocation requires HTTPS (on production sites)
- API rate limits apply for heavy usage
- Free tier APIs may have occasional downtime

## Future Enhancements

- [ ] Weather alerts and notifications
- [ ] Weather history and trends
- [ ] Multiple location comparisons
- [ ] Pollen and air quality data
- [ ] Weather-based recommendations
- [ ] More weather icons and animations
- [ ] Customizable dashboard widgets
- [ ] Export weather data to JSON/CSV

## License

Free to use and modify for personal and commercial projects.

## Credits

- Weather icons and data: [Open-Meteo](https://open-meteo.com/)
- Geocoding services: [OpenStreetMap Nominatim](https://nominatim.org/)
- Icons: [Font Awesome](https://fontawesome.com/)

## Support

For issues or suggestions, please feel free to modify the code and customize it to your needs!

---
## Live Demo  https://coodexii.github.io/weatherDashboard-project/

**Enjoy your Weather Dashboard! 🌤️**
