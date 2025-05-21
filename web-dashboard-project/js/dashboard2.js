const apiKey = "1fa204a3a7940a146fd386978ed059ea"; // Replace this with your real API key

function loadWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city name.");

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const labels = data.list.slice(0, 6).map(entry => entry.dt_txt.split(" ")[1].slice(0, 5));
      const temps = data.list.slice(0, 6).map(entry => entry.main.temp);

      const ctx = document.getElementById("weatherChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: `Temperature in ${city}`,
            data: temps,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Next Few Hours Temperature in ${city}`
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: "°C"
              }
            }
          }
        }
      });
    })
    .catch(() => alert("City not found or API error"));
}
