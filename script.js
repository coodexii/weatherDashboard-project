// Weather Dashboard Script

class WeatherDashboard {
    constructor() {
        this.apiKey = null; // Using free Open-Meteo API - no key needed
        this.currentWeatherData = {};
        this.forecastData = {};
        this.hourlyData = {};
        this.currentCity = 'Saudi Arabia';
        this.currentLat = 51.5074;
        this.currentLon = -0.1278;
        
        this.initElements();
        this.initEventListeners();
        this.loadTheme();
        this.fetchWeather(this.currentLat, this.currentLon, this.currentCity);
    }

    initElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.currentWeatherDiv = document.getElementById('currentWeather');
        this.weatherDetailsDiv = document.getElementById('weatherDetails');
        this.forecastContainer = document.getElementById('forecastContainer');
        this.hourlyContainer = document.getElementById('hourlyContainer');
        this.errorMessage = document.getElementById('errorMessage');
        this.suggestionsList = document.getElementById('suggestionsList');
    }

    initEventListeners() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        this.searchInput.addEventListener('input', (e) => this.handleSuggestions(e.target.value));
        this.locationBtn.addEventListener('click', () => this.getUserLocation());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        document.addEventListener('click', (e) => {
            if (e.target !== this.searchInput && e.target !== this.suggestionsList) {
                this.suggestionsList.classList.remove('show');
            }
        });
    }

    // Theme Management
    loadTheme() {
        const savedTheme = localStorage.getItem('weatherDashboardTheme') || 'light';
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        this.updateThemeIcon();
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('weatherDashboardTheme', isDarkMode ? 'dark' : 'light');
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        this.themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    // Search and Suggestions
    handleSearch() {
        const city = this.searchInput.value.trim();
        if (city) {
            this.geocodeCity(city);
        }
    }

    handleSuggestions(value) {
        if (value.length < 2) {
            this.suggestionsList.classList.remove('show');
            return;
        }

        this.searchCities(value).then(cities => {
            this.suggestionsList.innerHTML = '';
            if (cities.length === 0) {
                this.suggestionsList.innerHTML = '<li>No cities found</li>';
            } else {
                cities.forEach(city => {
                    const li = document.createElement('li');
                    li.textContent = `${city.name}, ${city.country}`;
                    li.addEventListener('click', () => {
                        this.currentCity = city.name;
                        this.currentLat = city.lat;
                        this.currentLon = city.lon;
                        this.fetchWeather(city.lat, city.lon, city.name);
                        this.searchInput.value = '';
                        this.suggestionsList.classList.remove('show');
                    });
                    this.suggestionsList.appendChild(li);
                });
            }
            this.suggestionsList.classList.add('show');
        });
    }

    async searchCities(query) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?city=${query}&limit=5&format=json`
            );
            const data = await response.json();
            return data.slice(0, 5).map(city => ({
                name: city.address?.city || city.address?.town || city.name,
                country: city.address?.country || '',
                lat: parseFloat(city.lat),
                lon: parseFloat(city.lon)
            }));
        } catch (error) {
            console.error('Error searching cities:', error);
            return [];
        }
    }

    geocodeCity(city) {
        fetch(`https://nominatim.openstreetmap.org/search?city=${city}&limit=1&format=json`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    this.currentCity = city;
                    this.currentLat = parseFloat(lat);
                    this.currentLon = parseFloat(lon);
                    this.fetchWeather(this.currentLat, this.currentLon, city);
                    this.searchInput.value = '';
                    this.suggestionsList.classList.remove('show');
                } else {
                    this.showError(`City "${city}" not found. Please try again.`);
                }
            })
            .catch(error => {
                console.error('Geocoding error:', error);
                this.showError('Error searching for city. Please try again.');
            });
    }

    // Geolocation
    getUserLocation() {
        if (navigator.geolocation) {
            this.locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
            this.locationBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.currentLat = latitude;
                    this.currentLon = longitude;
                    this.reverseGeocode(latitude, longitude);
                    this.locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
                    this.locationBtn.disabled = false;
                },
                (error) => {
                    this.showError('Error getting your location. Please enable location access.');
                    this.locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
                    this.locationBtn.disabled = false;
                }
            );
        } else {
            this.showError('Geolocation is not supported by your browser.');
        }
    }

    reverseGeocode(lat, lon) {
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
            .then(response => response.json())
            .then(data => {
                this.currentCity = data.address?.city || data.address?.town || 'Current Location';
                this.fetchWeather(lat, lon, this.currentCity);
            })
            .catch(error => {
                console.error('Reverse geocoding error:', error);
                this.fetchWeather(lat, lon, 'Current Location');
            });
    }

    // Weather API Calls
    fetchWeather(lat, lon, city) {
        this.currentWeatherDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading weather data...</div>';
        
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,apparent_temperature,precipitation,weather_code&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto&forecast_days=5`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.currentWeatherData = data.current;
                this.forecastData = data.daily;
                this.hourlyData = data.hourly;
                this.displayCurrentWeather(city, lat, lon);
                this.displayWeatherDetails();
                this.displayForecast();
                this.displayHourlyForecast();
                this.hideError();
            })
            .catch(error => {
                console.error('Weather API error:', error);
                this.showError('Error fetching weather data. Please try again.');
            });
    }

    // Display Weather
    displayCurrentWeather(city, lat, lon) {
        const { temperature_2m, weather_code, apparent_temperature } = this.currentWeatherData;
        const weatherDescription = this.getWeatherDescription(weather_code);
        const weatherIcon = this.getWeatherIcon(weather_code);

        this.currentWeatherDiv.innerHTML = `
            <div class="weather-icon">${weatherIcon}</div>
            <div class="temperature">${Math.round(temperature_2m)}°C</div>
            <div class="weather-description">${weatherDescription}</div>
            <div class="location-info">
                <i class="fas fa-map-marker-alt"></i> ${city}
            </div>
            <div class="feels-like">
                Feels like <strong>${Math.round(apparent_temperature)}°C</strong>
            </div>
        `;
    }

    displayWeatherDetails() {
        const { humidity, wind_speed_10m, precipitation, relative_humidity_2m } = this.currentWeatherData;
        
        this.weatherDetailsDiv.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">
                    <i class="fas fa-tint"></i> Humidity
                </span>
                <span class="detail-value">${relative_humidity_2m}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">
                    <i class="fas fa-wind"></i> Wind Speed
                </span>
                <span class="detail-value">${Math.round(wind_speed_10m)} km/h</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">
                    <i class="fas fa-cloud-rain"></i> Precipitation
                </span>
                <span class="detail-value">${precipitation || 0} mm</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">
                    <i class="fas fa-eye"></i> UV Index
                </span>
                <span class="detail-value">Moderate</span>
            </div>
        `;
    }

    displayForecast() {
        const { time, temperature_2m_max, temperature_2m_min, weather_code } = this.forecastData;
        this.forecastContainer.innerHTML = '';

        // Show next 5 days (skip today)
        for (let i = 1; i < Math.min(6, time.length); i++) {
            const date = new Date(time[i]);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <div class="forecast-date">${dayName}, ${monthDate}</div>
                <div class="forecast-icon">${this.getWeatherIcon(weather_code[i])}</div>
                <div class="forecast-temp">${Math.round(temperature_2m_max[i])}°C</div>
                <div class="forecast-temp-range">Low: ${Math.round(temperature_2m_min[i])}°C</div>
                <div class="forecast-description">${this.getWeatherDescription(weather_code[i])}</div>
            `;
            this.forecastContainer.appendChild(card);
        }
    }

    displayHourlyForecast() {
        const { time, temperature_2m, weather_code, precipitation_probability, wind_speed_10m } = this.hourlyData;
        this.hourlyContainer.innerHTML = '';

        const now = new Date();
        const currentHour = now.getHours();
        
        // Show next 24 hours
        for (let i = currentHour; i < Math.min(currentHour + 24, time.length); i++) {
            const hourTime = new Date(time[i]);
            const hour = hourTime.getHours().toString().padStart(2, '0');
            
            const card = document.createElement('div');
            card.className = 'hourly-card';
            card.innerHTML = `
                <div class="hourly-time">${hour}:00</div>
                <div class="hourly-icon">${this.getWeatherIcon(weather_code[i])}</div>
                <div class="hourly-temp">${Math.round(temperature_2m[i])}°C</div>
                <div class="hourly-description">${this.getWeatherDescription(weather_code[i])}</div>
                <div class="hourly-details">
                    <div><i class="fas fa-droplets"></i> ${precipitation_probability[i]}%</div>
                    <div><i class="fas fa-wind"></i> ${Math.round(wind_speed_10m[i])} km/h</div>
                </div>
            `;
            this.hourlyContainer.appendChild(card);
        }
    }

    // Weather Code to Icon/Description Mapping
    getWeatherIcon(code) {
        const iconMap = {
            0: '☀️',      // Clear sky
            1: '🌤️',     // Mainly clear
            2: '⛅',      // Partly cloudy
            3: '☁️',      // Overcast
            45: '🌫️',    // Foggy
            48: '🌫️',    // Foggy
            51: '🌧️',    // Drizzle
            53: '🌧️',    // Drizzle
            55: '🌧️',    // Drizzle
            61: '🌧️',    // Rain
            63: '🌧️',    // Rain
            65: '⛈️',    // Heavy rain
            71: '❄️',    // Snow
            73: '❄️',    // Snow
            75: '❄️',    // Heavy snow
            77: '❄️',    // Snow grains
            80: '🌧️',    // Rain showers
            81: '🌧️',    // Rain showers
            82: '⛈️',    // Violent rain showers
            85: '❄️',    // Snow showers
            86: '❄️',    // Heavy snow showers
            95: '⛈️',    // Thunderstorm
            96: '⛈️',    // Thunderstorm with hail
            99: '⛈️'     // Thunderstorm with hail
        };
        return iconMap[code] || '🌍';
    }

    getWeatherDescription(code) {
        const descriptions = {
            0: 'Clear Sky',
            1: 'Mainly Clear',
            2: 'Partly Cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Foggy',
            51: 'Light Drizzle',
            53: 'Drizzle',
            55: 'Heavy Drizzle',
            61: 'Rain',
            63: 'Rain',
            65: 'Heavy Rain',
            71: 'Snow',
            73: 'Snow',
            75: 'Heavy Snow',
            77: 'Snow Grains',
            80: 'Rain Showers',
            81: 'Heavy Showers',
            82: 'Violent Showers',
            85: 'Snow Showers',
            86: 'Heavy Snow Showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with Hail',
            99: 'Thunderstorm with Hail'
        };
        return descriptions[code] || 'Unknown';
    }

    // Error Handling
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        setTimeout(() => this.hideError(), 5000);
    }

    hideError() {
        this.errorMessage.classList.remove('show');
    }
}

// Initialize the dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WeatherDashboard();
});
