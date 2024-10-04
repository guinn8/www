class FuelCalculatorComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="component-container" style="font-family: Arial, sans-serif; margin: 20px;">
                <h1>Backcountry Trip Fuel Calculator</h1>
                <div class="flex-container" style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <div class="input-card" style="background: #f9f9f9; padding: 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: fit-content;">
                        <div class="input-group" style="display: flex; flex-direction: column; align-items: center;">
                            <label for="litresPerPerson" title="Enter the number of liters required per person per day" style="margin-bottom: 5px; font-weight: bold;">Liters/Person</label>
                            <input type="number" id="litresPerPerson" min="0" step="0.1" placeholder="Liters" style="padding: 5px; width: 80px; box-sizing: border-box; text-align: center;">
                        </div>
                    </div>
                    <span>x</span>
                    <div class="input-card" style="background: #f9f9f9; padding: 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: fit-content;">
                        <div class="input-group" style="display: flex; flex-direction: column; align-items: center;">
                            <label for="numPeople" title="Enter the number of people" style="margin-bottom: 5px; font-weight: bold;">People</label>
                            <input type="number" id="numPeople" min="0" placeholder="People" style="padding: 5px; width: 80px; box-sizing: border-box; text-align: center;">
                        </div>
                    </div>
                    <span>x</span>
                    <div class="input-card" style="background: #f9f9f9; padding: 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: fit-content;">
                        <div class="input-group" style="display: flex; flex-direction: column; align-items: center;">
                            <label for="numDays" title="Enter the number of days for the trip" style="margin-bottom: 5px; font-weight: bold;">Days</label>
                            <input type="number" id="numDays" min="0" placeholder="Days" style="padding: 5px; width: 80px; box-sizing: border-box; text-align: center;">
                        </div>
                    </div>
                    <span>=</span>
                    <div class="input-card" style="background: #f9f9f9; padding: 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: fit-content;">
                        <div class="input-group" style="display: flex; flex-direction: column; align-items: center;">
                            <label for="totalLitres" title="Enter the total liters of fuel required" style="margin-bottom: 5px; font-weight: bold;">Total Liters</label>
                            <input type="number" id="totalLitres" min="0" step="0.1" placeholder="Total Liters" style="padding: 5px; width: 80px; box-sizing: border-box; text-align: center;" disabled>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        this.container.querySelector('#litresPerPerson').addEventListener('input', () => this.calculateFuel());
        this.container.querySelector('#numPeople').addEventListener('input', () => this.calculateFuel());
        this.container.querySelector('#numDays').addEventListener('input', () => this.calculateFuel());
        this.container.querySelector('#totalLitres').addEventListener('input', () => this.clearMultiplicands());
    }

    calculateFuel() {
        const numPeople = parseFloat(this.container.querySelector('#numPeople').value);
        const litresPerPerson = parseFloat(this.container.querySelector('#litresPerPerson').value);
        const numDays = parseFloat(this.container.querySelector('#numDays').value);
        let totalLiters = 0;

        if (!isNaN(numPeople) && !isNaN(litresPerPerson) && !isNaN(numDays)) {
            totalLiters = numPeople * litresPerPerson * numDays;
            this.container.querySelector('#totalLitres').value = totalLiters.toFixed(2);
            this.container.querySelector('#totalLitres').disabled = false;
        } else {
            this.container.querySelector('#totalLitres').value = "";
            this.container.querySelector('#totalLitres').disabled = true;
        }
    }

    clearMultiplicands() {
        this.container.querySelector('#numPeople').value = "";
        this.container.querySelector('#litresPerPerson').value = "";
        this.container.querySelector('#numDays').value = "";
    }

    getTotalLiters() {
        return parseFloat(this.container.querySelector('#totalLitres').value) || 0;
    }
}

// Example of how to instantiate this component in your project
document.addEventListener('DOMContentLoaded', () => {
    const fuelCalculator = new FuelCalculatorComponent('fuel-calculator-container');

    // Example usage of the total liters in the application
    document.getElementById('calculate-button').addEventListener('click', () => {
        alert(`Total Liters of Boiled Water Needed: ${fuelCalculator.getTotalLiters()} L`);
    });
});
