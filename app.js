// script.js
document.addEventListener('DOMContentLoaded', () => {
    const currentWeatherSection = document.getElementById('current-weather-content');
    const forecastSection = document.getElementById('forecast-content');
    const locationButton = document.getElementById('location-btn');
  
    const API_KEY = 'f44c266ab71365270bfaa156533ec126'; // Replace with your API key f44c266ab71365270bfaa156533ec126

    const BASE_URL = 'https://api.openweathermap.org/data/2.5';
  
    // Fetch current weather
    async function fetchCurrentWeather(lat, lon) {
      const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }
  
    // Fetch 5-day forecast
    async function fetchForecast(lat, lon) {
      const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }
  
    // Update current weather UI
    function updateCurrentWeather(data) {
      currentWeatherSection.innerHTML = `
        <p><strong>Location:</strong> ${data.name}, ${data.sys.country}</p>
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
      `;
    }
  
    // Update forecast UI
    function updateForecast(data) {
      const forecastHTML = data.list
        .filter((item, index) => index % 8 === 0) // Get daily forecast
        .map((item) => `
          <div class="forecast-item">
            <p><strong>Date:</strong> ${new Date(item.dt * 1000).toLocaleDateString()}</p>
            <p><strong>Temp:</strong> ${item.main.temp}°C</p>
            <p><strong>Weather:</strong> ${item.weather[0].description}</p>
          </div>
        `)
        .join('');
      forecastSection.innerHTML = forecastHTML;
    }
  
    // Get user location
    locationButton.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const currentWeather = await fetchCurrentWeather(latitude, longitude);
            const forecast = await fetchForecast(latitude, longitude);
            updateCurrentWeather(currentWeather);
            updateForecast(forecast);
          },
          (error) => {
            console.error('Error fetching location:', error);
            alert('Unable to retrieve your location.');
          }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    });
  });