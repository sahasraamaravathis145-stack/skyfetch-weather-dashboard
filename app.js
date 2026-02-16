// Your OpenWeatherMap API Key
const API_KEY = 'fff5dea3a745a394f99b3cbfc63594ad';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const weatherDisplay = document.getElementById('weather-display');
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');


// 🌤️ Show loading spinner
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching weather...</p>
        </div>
    `;
}


// ❌ Show error message
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Oops!</h3>
            <p>${message}</p>
        </div>
    `;
}


// 🌦️ Display weather data
function displayWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    // focus back to input for quick search
    cityInput.focus();
}


// 🌍 Fetch weather using async/await
async function getWeather(city) {

    showLoading();

    // Disable button while loading
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        console.log('Weather Data:', response.data);
        displayWeather(response.data);

    } catch (error) {
        console.error('Error:', error);

        if (error.response && error.response.status === 404) {
            showError('City not found. Please check spelling.');
        } else {
            showError('Unable to fetch weather. Try again later.');
        }

    } finally {
        // Re-enable button
        searchBtn.disabled = false;
        searchBtn.textContent = 'Search';
    }
}


// 🔍 Handle search click
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    if (city.length < 2) {
        showError('City name too short.');
        return;
    }

    getWeather(city);
    cityInput.value = '';
});


// ⌨️ Enter key support
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});


// 👋 Welcome message on page load
weatherDisplay.innerHTML = `
    <div class="welcome-message">
        <h2>🌍 SkyFetch Weather</h2>
        <p>Enter a city name to check the weather!</p>
    </div>
`;