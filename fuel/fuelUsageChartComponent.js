// FILENAME: fuelUsageChartComponent.js

class FuelUsageChartComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.includeBuffer = false;
        this.selectedDays = 0;
        this.numPeople = 0;
        this.litresPerPerson = 0;
        this.efficiency = 0;
        this.totalGasOwned = 0;
        this.tooltipData = [];
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
            <div id="sufficiency-message"></div>
        `;

        const ctx = document.getElementById('fuelUsageChart').getContext('2d');

        // Initialize the chart
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [], // Days
                datasets: [
                    // Remaining Gas Dataset
                    {
                        label: 'Remaining Gas (g)',
                        data: [],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.1,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Day',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Remaining Gas (g)',
                        },
                        beginAtZero: true,
                        suggestedMax: 100, // Will be updated dynamically
                    },
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: (context) => {
                                const day = context.label;
                                const remainingGas = context.parsed.y;
                                const dataIndex = context.dataIndex;
                                const extraInfo = this.tooltipData[dataIndex];

                                return [
                                    `Day: ${day}`,
                                    `Remaining Gas: ${remainingGas.toFixed(2)} g`,
                                    `Total Consumed: ${extraInfo.cumulativeFuel.toFixed(2)} g`,
                                    `Total Liters Used: ${extraInfo.totalLiters.toFixed(2)} L`,
                                ];
                            },
                        },
                    },
                    legend: {
                        display: true,
                    },
                    annotation: {
                        annotations: {
                            zeroLine: {
                                type: 'line',
                                mode: 'horizontal',
                                scaleID: 'y',
                                value: 0,
                                borderColor: 'red',
                                borderWidth: 2,
                                label: {
                                    content: 'Gas Depleted',
                                    enabled: true,
                                    position: 'start',
                                    color: 'red',
                                },
                            },
                        },
                    },
                },
            },
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
                this.efficiency,
                this.totalGasOwned
            );
        });
    }

    // Method to update the chart with new data
    updateChartData(selectedDays, numPeople, litresPerPerson, efficiency, totalGasOwned) {
        this.selectedDays = selectedDays;
        this.numPeople = numPeople;
        this.litresPerPerson = litresPerPerson;
        this.efficiency = efficiency;
        this.totalGasOwned = totalGasOwned;

        const daysArray = [];
        const remainingGasArray = [];
        this.tooltipData = [];

        let cumulativeFuel = 0;
        let gasDepletedDay = null;

        for (let day = 1; day <= selectedDays; day++) {
            daysArray.push(day);

            // Calculate liters used on this day
            const dailyLiters = numPeople * litresPerPerson;
            let dailyFuel = dailyLiters * efficiency;

            // Include 20% buffer if selected
            if (this.includeBuffer) {
                dailyFuel *= 1.20;
            }

            // Cumulative fuel consumption
            cumulativeFuel += dailyFuel;

            // Remaining gas
            let remainingGas = this.totalGasOwned - cumulativeFuel;
            remainingGas = parseFloat(remainingGas.toFixed(2));

            // Prevent negative values
            if (remainingGas < 0 && gasDepletedDay === null) {
                gasDepletedDay = day;
                remainingGas = 0;
            }

            remainingGasArray.push(remainingGas);

            // Store data for tooltips
            this.tooltipData.push({
                cumulativeFuel,
                totalLiters: dailyLiters * day,
            });
        }

        // Update chart Y-axis max
        const maxGas = Math.max(this.totalGasOwned, ...remainingGasArray);
        this.chart.options.scales.y.suggestedMax = maxGas;

        // Determine sufficiency
        let sufficiencyMessage = '';
        let isSufficient = false;
        if (remainingGasArray[remainingGasArray.length - 1] > 0) {
            isSufficient = true;
            sufficiencyMessage = `✅ Your gas supply is sufficient for the trip.`;
        } else {
            isSufficient = false;
            sufficiencyMessage = `⚠️ Your gas supply will be depleted on day ${gasDepletedDay}.`;
        }

        // Update the chart and display the message
        this.updateChart({ days: daysArray, remainingGas: remainingGasArray }, sufficiencyMessage, isSufficient);
    }

    updateChart(dataPoints, sufficiencyMessage, isSufficient) {
        // Update chart data
        this.chart.data.labels = dataPoints.days;
        this.chart.data.datasets[0].data = dataPoints.remainingGas;

        // Update the chart
        this.chart.update();

        // Display sufficiency message
        this.displaySufficiencyMessage(sufficiencyMessage, isSufficient);
    }

    displaySufficiencyMessage(sufficiencyMessage, isSufficient) {
        const messageContainer = this.container.querySelector('#sufficiency-message');
        messageContainer.innerHTML = sufficiencyMessage;
        messageContainer.className = `sufficiency-message ${isSufficient ? 'sufficient' : 'insufficient'}`;
    }
}

