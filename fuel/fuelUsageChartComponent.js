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
        this.totalFuelRequired = 0;
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
                    // Total Fuel Required Dataset
                    {
                        label: 'Total Fuel Required (g)',
                        data: [],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.1,
                    },
                    // Total Gas Owned Dataset
                    {
                        label: 'Total Gas Owned (g)',
                        data: [],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                        borderDash: [5, 5],
                        pointStyle: 'rectRot',
                        tension: 0.1,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Number of Days',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Fuel (g)',
                        },
                        beginAtZero: true,
                    },
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: (context) => {
                                const day = context.label;
                                const totalFuel = context.parsed.y;
                                const dataIndex = context.dataIndex;
                                const extraInfo = this.tooltipData[dataIndex];
                                if (context.datasetIndex === 0) {
                                    // Total Fuel Required dataset
                                    return [
                                        `Day: ${day}`,
                                        `Total Fuel Required: ${totalFuel} g`,
                                        `Total Liters: ${extraInfo.totalLiters} L`,
                                        `Efficiency: ${extraInfo.efficiency} g/L`,
                                        `People: ${extraInfo.numPeople}`,
                                        `Liters/Person/Day: ${extraInfo.litresPerPerson} L`,
                                    ];
                                } else {
                                    // Total Gas Owned dataset
                                    return [
                                        `Day: ${day}`,
                                        `Total Gas Owned: ${totalFuel} g`,
                                    ];
                                }
                            },
                        },
                    },
                    legend: {
                        display: true,
                    },
                    annotation: {
                        annotations: {
                            sufficiencyLine: {
                                type: 'line',
                                mode: 'horizontal',
                                scaleID: 'y',
                                value: 0, // Will be updated dynamically
                                borderColor: 'rgba(255, 99, 132, 0.5)',
                                borderWidth: 2,
                                borderDash: [5, 5],
                                label: {
                                    content: 'Total Gas Owned',
                                    enabled: true,
                                    position: 'end',
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
        const totalFuelArray = [];
        const gasOwnedArray = [];
        this.tooltipData = [];

        this.totalFuelRequired = 0;

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

            totalFuel = parseFloat(totalFuel.toFixed(2));
            totalFuelArray.push(totalFuel);

            // For the gas owned, it's the same across all days
            gasOwnedArray.push(totalGasOwned);

            // Update total fuel required for sufficiency calculation
            if (day === selectedDays) {
                this.totalFuelRequired = totalFuel;
            }

            // Store data for tooltips
            this.tooltipData.push({
                totalLiters: totalLiters.toFixed(2),
                efficiency: efficiency,
                numPeople: numPeople,
                litresPerPerson: litresPerPerson,
            });
        }

        // Determine sufficiency
        let sufficiencyMessage = '';
        let isSufficient = false;
        if (this.totalGasOwned != null) {
            if (this.totalGasOwned >= this.totalFuelRequired) {
                isSufficient = true;
                sufficiencyMessage = `✅ Your gas supply is sufficient for the trip.`;
            } else {
                const additionalGasNeeded = (this.totalFuelRequired - this.totalGasOwned).toFixed(2);
                isSufficient = false;
                sufficiencyMessage = `⚠️ You need an additional ${additionalGasNeeded} g of gas.`;
            }
        }

        // Update the chart and display the message
        this.updateChart({ days: daysArray, totalFuel: totalFuelArray, totalGasOwned: gasOwnedArray }, sufficiencyMessage, isSufficient);
    }

    updateChart(dataPoints, sufficiencyMessage, isSufficient) {
        // Update chart data
        this.chart.data.labels = dataPoints.days;
        this.chart.data.datasets[0].data = dataPoints.totalFuel;
        this.chart.data.datasets[1].data = dataPoints.totalGasOwned;

        // Update annotation line for total gas owned
        this.chart.options.plugins.annotation.annotations.sufficiencyLine.value = this.totalGasOwned;
        this.chart.options.plugins.annotation.annotations.sufficiencyLine.label.content = `Total Gas Owned (${this.totalGasOwned} g)`;

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
