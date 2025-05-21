// dashboard1.js

let cryptoChart;  // to hold chart instance globally

async function fetchAndRenderChart() {
  try {
    const [btcData, ethData] = await Promise.all([
      fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=5").then(res => res.json()),
      fetch("https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=5").then(res => res.json())
    ]);

    const labels = btcData.prices.map(p => {
      const date = new Date(p[0]);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const btcPrices = btcData.prices.map(p => p[1]);
    const ethPrices = ethData.prices.map(p => p[1]);

    const ctx = document.getElementById("cryptoChart").getContext("2d");

    // If chart exists, update data, else create new
    if (cryptoChart) {
      cryptoChart.data.labels = labels;
      cryptoChart.data.datasets[0].data = btcPrices;
      cryptoChart.data.datasets[1].data = ethPrices;
      cryptoChart.update();
    } else {
      cryptoChart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Bitcoin (BTC)",
              data: btcPrices,
              borderColor: "rgba(255, 206, 86, 1)",
              backgroundColor: "rgba(255, 206, 86, 0.2)",
              borderWidth: 2,
              fill: false
            },
            {
              label: "Ethereum (ETH)",
              data: ethPrices,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          stacked: false,
          plugins: {
            title: {
              display: true,
              text: 'Cryptocurrency Price Trends (Last 5 Days)'
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Price in USD'
              }
            }
          }
        }
      });
    }

  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
}

// Export for usage in HTML (if using modules) or just make it global
window.fetchAndRenderChart = fetchAndRenderChart;
