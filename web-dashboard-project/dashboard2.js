// dashboard2.js
const apiKey = "1fa204a3a7940a146fd386978ed059ea"; // Replace with your actual API key

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const todayData = document.getElementById("todayData");
const forecastData = document.getElementById("forecastData");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

async function fetchWeather(city) {
  try {
    todayData.innerHTML = "Loading...";
    forecastData.innerHTML = "";

    // Get current weather
    const todayRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const today = await todayRes.json();

    if (today.cod !== 200) throw new Error(today.message);

    // Get forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecast = await forecastRes.json();

    displayToday(today);
    displayForecast(forecast.list);
  } catch (err) {
    todayData.innerHTML = `<div class='text-danger'>${err.message}</div>`;
  }
}

function displayToday(data) {
  const html = `
    <div class="col-md-4 text-center">
      <h2>${data.main.temp.toFixed(1)}°C</h2>
      <p>${data.weather[0].description}</p>
      <p><strong>${data.name}</strong> | ${new Date().toDateString()}</p>
    </div>
    <div class="col-md-8 row g-2">
      <div class="col-6">Wind: ${data.wind.speed} km/h</div>
      <div class="col-6">Humidity: ${data.main.humidity}%</div>
      <div class="col-6">Pressure: ${data.main.pressure} hPa</div>
      <div class="col-6">Visibility: ${data.visibility / 1000} km</div>
      <div class="col-6">Sunrise: ${new Date(
        data.sys.sunrise * 1000
      ).toLocaleTimeString()}</div>
      <div class="col-6">Sunset: ${new Date(
        data.sys.sunset * 1000
      ).toLocaleTimeString()}</div>
    </div>
  `;
  todayData.innerHTML = html;
}

function displayForecast(list) {
  const daily = {};
  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!daily[date]) daily[date] = item;
  });

  forecastData.innerHTML = Object.keys(daily)
    .slice(0, 5)
    .map((date) => {
      const day = daily[date];
      return `
        <div class="col forecast-item text-center">
          <div><strong>${new Date(day.dt_txt).toLocaleDateString()}</strong></div>
          <div>${day.main.temp.toFixed(1)}°C</div>
          <div>${day.weather[0].main}</div>
        </div>
      `;
    })
    .join("");
}

// Auto-load a default city on page load
window.addEventListener("load", () => {
  fetchWeather("Istanbul");
});
