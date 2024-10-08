// FILENAME: fuelUsageChartComponent.js

class FuelUsageChartComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.includeBuffer = false; // New property to track buffer option
        this.initChart();
        this.attachEventListeners();
    }

    initChart() {
        this.container.innerHTML = `
            <div class="chart-controls">
                <label>
                    <input type="checkbox" id="includeBuffer">
                    Include 20% Buffer
                </label>
            </div>
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
                        enabled: true,
                        callbacks: {
                            // Customize tooltip content
                            label: (context) => {
                                const day = context.label;
                                const totalFuel = context.parsed.y;
                                const dataIndex = context.dataIndex;
                                const extraInfo = this.tooltipData[dataIndex];
                                return [
                                    `Day: ${day}`,
                                    `Total Fuel: ${totalFuel} g`,
                                    `Total Liters: ${extraInfo.totalLiters} L`,
                                    `Efficiency: ${extraInfo.efficiency} g/L`,
                                    `People: ${extraInfo.numPeople}`,
                                    `Liters/Person/Day: ${extraInfo.litresPerPerson} L`
                                ];
                            }
                        }
                    },
                    legend: {
                        display: true
                    }
                }
            }
        });
    }

    attachEventListeners() {
        const includeBufferCheckbox = this.container.querySelector('#includeBuffer');
        includeBufferCheckbox.addEventListener('change', (event) => {
            this.includeBuffer = event.target.checked;
            // Recalculate and update the chart when buffer option changes
            this.updateChartData(
                this.selectedDays,
                this.numPeople,
                this.litresPerPerson,
                this.efficiency
            );
        });
    }

    // Method to update the chart with new data
    updateChartData(selectedDays, numPeople, litresPerPerson, efficiency) {
        this.selectedDays = selectedDays;
        this.numPeople = numPeople;
        this.litresPerPerson = litresPerPerson;
        this.efficiency = efficiency;

        const daysArray = [];
        const totalFuelArray = [];
        this.tooltipData = []; // Store extra info for tooltips

        for (let day = 1; day <= selectedDays; day++) {
            daysArray.push(day);

            // Calculate total liters of water needed
            const totalLiters = numPeople * litresPerPerson * day;

            // Calculate total fuel in grams (using efficiency in g/L)
            let totalFuel = totalLiters * efficiency;

            // Include 20% buffer if selected
            if (this.includeBuffer) {
                totalFuel *= 1.20; // Add 20% buffer
            }

            totalFuelArray.push(totalFuel.toFixed(2));

            // Store data for tooltips
            this.tooltipData.push({
                totalLiters: totalLiters.toFixed(2),
                efficiency: efficiency,
                numPeople: numPeople,
                litresPerPerson: litresPerPerson
            });
        }

        this.updateChart({ days: daysArray, totalFuel: totalFuelArray });
    }

    updateChart(dataPoints) {
        this.chart.data.labels = dataPoints.days;
        this.chart.data.datasets[0].data = dataPoints.totalFuel;
        this.chart.update();
    }
}
