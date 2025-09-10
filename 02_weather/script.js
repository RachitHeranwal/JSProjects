
document.addEventListener('DOMContentLoaded', () => {
  const cityInput = document.getElementById("city-input");
  const getWeatherButton = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById('weather-info');
  const cityNameDisplay = document.getElementById('city-name');
  const temperatureDisplay = document.getElementById('temperature');
  const descriptionDisplay = document.getElementById('description');
  const errorMessage = document.getElementById('error-message');

  const API_KEY = "4efa26c3dcafff95cc8484376a5d953f";

  async function handleWeatherRequest() {
    const city = cityInput.value.trim();
    if(!city) return ;
    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherData(weatherData);
    } catch (error) {
      showError();
    }
  }

  getWeatherButton.addEventListener("click", handleWeatherRequest);

  cityInput.addEventListener("keydown", (event) => {
    if(event.key === 'Enter') {
      handleWeatherRequest();
    }
  });

  async function fetchWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);
  return await response.json();
  }

  function displayWeatherData(data) {
    console.log(data);
    
    const {name , main, weather} = data;
    cityNameDisplay.textContent = name;
    temperatureDisplay.textContent = `Temperature: ${main.temp}°C`;
    descriptionDisplay.textContent = `Weather: ${weather[0].description}`

    weatherInfo.classList.remove('hidden');
    errorMessage.classList.add('hidden')
  }

  async function showError() {
    errorMessage.textContent = "Failed to fetch weather data";
    errorMessage.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
  }
})
