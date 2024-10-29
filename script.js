// Select elements to update with data
const currentPriceEl = document.getElementById('currentPrice');
const highPriceEl = document.getElementById('highPrice');
const lowPriceEl = document.getElementById('lowPrice');

// Initialize the Chart
const ctx = document.getElementById('bitcoinChart').getContext('2d');
const bitcoinChart = new Chart(ctx, {
  type: 'line', // Line chart as an example, change to 'candlestick' if using Chart.js Financial plugin
  data: {
    labels: [], // Time labels
    datasets: [
      {
        label: 'BTC/USDT',
        data: [], // Price data
        borderColor: '#FFA500',
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
        },
        ticks: {
          color: '#FFFFFF',
        },
      },
      y: {
        ticks: {
          color: '#FFFFFF',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});

// Function to fetch and update chart data
async function fetchChartData() {
  try {
    // Fetch data from a crypto API (replace 'YOUR_API_URL' with an actual endpoint)
    const response = await axios.get(
      'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=30'
    );
    const data = response.data;

    const chartData = data.map((candle) => ({
      t: moment(candle[0]).toDate(), // Convert timestamp
      y: parseFloat(candle[4]), // Closing price
    }));

    // Update the chart
    bitcoinChart.data.labels = chartData.map((d) => d.t);
    bitcoinChart.data.datasets[0].data = chartData.map((d) => d.y);
    bitcoinChart.update();

    // Set current, high, and low prices
    currentPriceEl.textContent = chartData[chartData.length - 1].y.toFixed(4);
    highPriceEl.textContent = Math.max(...chartData.map((d) => d.y)).toFixed(4);
    lowPriceEl.textContent = Math.min(...chartData.map((d) => d.y)).toFixed(4);
  } catch (error) {
    console.error('Error fetching data', error);
  }
}

// Fetch data every minute
setInterval(fetchChartData, 60000);
fetchChartData();
