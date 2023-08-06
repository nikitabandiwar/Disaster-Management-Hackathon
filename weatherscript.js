const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "4ac9b97b1a5a032305376f2f5e5557b0"; 

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}


const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then((response) => response.json())
        .then((data) => {
            // Filter the forecasts to get only one forecast per day
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter((forecast) => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            // Clearing previous weather data
            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

            // Variables to track highest and lowest temperatures, high wind speed, and heavy rain
            let highestTemp = Number.MIN_SAFE_INTEGER;
            let lowestTemp = Number.MAX_SAFE_INTEGER;
            const highWindSpeedThreshold = 30; // Adjust this value according to your preference
            const heavyRainThreshold = 10; // Adjust this value according to your preference

            // Creating weather cards and adding them to the DOM
            fiveDaysForecast.forEach((weatherItem, index) => {
                const tempCelsius = weatherItem.main.temp - 273.15;
                const windSpeed = weatherItem.wind.speed;
                const rainVolume = weatherItem.rain ? weatherItem.rain["3h"] : 0; // Rain volume for the last 3 hours
                
                // Update highest and lowest temperatures
                highestTemp = Math.max(highestTemp, tempCelsius);
                lowestTemp = Math.min(lowestTemp, tempCelsius);

                const html = createWeatherCard(cityName, weatherItem, index);
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", html);
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                }

                // Check for heavy rain and trigger alert
                if (rainVolume >= heavyRainThreshold) {
                    alert(`Heavy rain! (${rainVolume.toFixed(2)} mm in the last 3 hours)`);
                }

                // Check for high wind speed and trigger alert
                if (windSpeed >= highWindSpeedThreshold) {
                    alert(`High wind speed! (${windSpeed} M/S)`);
                }
            });

            // Alert conditions for temperature (same as previous code)
            const highestTempAlert = 30; // Adjust this value according to your preference
            const lowestTempAlert = 10; // Adjust this value according to your preference

            if (highestTemp >= highestTempAlert) {
                alert(`Temperature is high! (${highestTemp.toFixed(2)}°C)`);
            }

            if (lowestTemp <= lowestTempAlert) {
                alert(`Temperature is low! (${lowestTemp.toFixed(2)}°C)`);
            }
        })
        .catch(() => {
            alert("An error occurred while fetching the weather forecast!");
        });
};







const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; // Get coordinates of user location
            // Get city name from coordinates using reverse geocoding API
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => { // Show alert if user denied the location permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());