// FILENAME: chart.js DO NOT REMOVE THIS COMMENT

let fuelChart;

// Function to initialize or update the chart
function updateChart(chartData) {
  const ctx = document.getElementById('fuelChart').getContext('2d');

  // Prepare data arrays
  const maxDays = Math.ceil(chartData.fuelAvailable / chartData.dailyFuelConsumption) || 1;
  const daysArray = [];
  const fuelRemainingArray = [];
  const cumulativeFuelConsumptionArray = [];

  for (let day = 0; day <= maxDays; day++) {
    daysArray.push(day);
    const cumulativeConsumption = chartData.dailyFuelConsumption * day;
    cumulativeFuelConsumptionArray.push(cumulativeConsumption);

    // Fuel remaining decreases each day
    const fuelRemaining = chartData.fuelAvailable - cumulativeConsumption;
    fuelRemainingArray.push(fuelRemaining);
  }

  // Determine datasets based on active modes
  const datasets = [];

  if (chartData.modesActive.fuelNeeded) {
    datasets.push({
      label: 'Fuel Needed (grams)',
      data: cumulativeFuelConsumptionArray,
      borderColor: 'green',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      fill: false,
      tension: 0.1,
      pointRadius: 3,
    });
  }

  if (chartData.modesActive.tripDuration) {
    datasets.push({
      label: 'Fuel Remaining (grams)',
      data: fuelRemainingArray,
      borderColor: 'blue',
      backgroundColor: 'rgba(0, 0, 255, 0.1)',
      fill: false,
      tension: 0.1,
      pointRadius: 3,
    });
  }

  // Destroy previous chart if it exists
  if (fuelChart) {
    fuelChart.destroy();
  }

  // Create new chart with annotation
  fuelChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: daysArray,
      datasets: datasets,
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: 'Days' },
          grid: { display: false },
        },
        y: {
          title: { display: true, text: 'Fuel (grams)' },
          beginAtZero: true,
          grid: { color: '#eee' },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} grams`;
            },
          },
        },
        legend: {
          display: true,
        },
        // Add annotation plugin settings
        annotation: {
          annotations: {
            verticalLine: {
              type: 'line',
              xMin: chartData.verticalLineDay,
              xMax: chartData.verticalLineDay,
              borderColor: 'red',
              borderWidth: 2,
              label: {
                content: `Day ${
                  chartData.verticalLineDay ? chartData.verticalLineDay.toFixed(1) : ''
                }`,
                enabled: true,
                position: 'top',
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                color: '#fff',
                padding: 6,
              },
              display:
                chartData.verticalLineDay !== null &&
                !isNaN(chartData.verticalLineDay) &&
                ((chartData.modesActive.fuelNeeded && chartData.modesActive.tripDuration === false) ||
                  (chartData.modesActive.tripDuration && chartData.modesActive.fuelNeeded === false)),
            },
          },
        },
      },
    },
  });
}
