class FuelUsageChartComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.chart = null;
        this.initChart();
    }

    initChart() {
        this.container.innerHTML = `
            <canvas id="fuelUsageChart" width="400" height="200"></canvas>
        `;

        const ctx = document.getElementById('fuelUsageChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [], // Number of days
                datasets: [{
                    label: 'Total Fuel Required (g)',
                    data: [], // Total fuel required
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.1, // Smooth curves
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Number of Days'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Total Fuel Required (g)'
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: true
                    },
                    legend: {
                        display: true
                    }
                }
            }
        });
    }

    updateChart(dataPoints) {
        this.chart.data.labels = dataPoints.days;
        this.chart.data.datasets[0].data = dataPoints.totalFuel;
        this.chart.update();
    }
}
