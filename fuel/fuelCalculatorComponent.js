// DO NOT REMOVE COMMENT: fuelCalculatorComponent.js 

class FuelCalculatorComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="component-container">
                <h1>Backcountry Trip Fuel Calculator</h1>
                <div class="flex-container">
                    <div class="input-card">
                        <div class="input-group">
                            <label for="litresPerPerson" title="Enter the number of liters required per person per day">Liters/Person</label>
                            <input type="number" id="litresPerPerson" min="0" step="0.1" placeholder="Liters">
                        </div>
                    </div>
                    <span>x</span>
                    <div class="input-card">
                        <div class="input-group">
                            <label for="numPeople" title="Enter the number of people">People</label>
                            <input type="number" id="numPeople" min="0" placeholder="People">
                        </div>
                    </div>
                    <span>=</span>
                    <div class="input-card">
                        <div class="input-group">
                            <label for="totalLitres" title="Enter the total liters of fuel required">Total Liters</label>
                            <input type="number" id="totalLitres" min="0" step="0.1" placeholder="Total Liters" disabled>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        this.container.querySelector('#litresPerPerson').addEventListener('input', () => this.calculateFuel());
        this.container.querySelector('#numPeople').addEventListener('input', () => this.calculateFuel());
        this.container.querySelector('#totalLitres').addEventListener('input', () => this.clearMultiplicands());
    }

    calculateFuel() {
        const numPeople = parseFloat(this.container.querySelector('#numPeople').value);
        const litresPerPerson = parseFloat(this.container.querySelector('#litresPerPerson').value);
        let totalLiters = 0;

        if (!isNaN(numPeople) && !isNaN(litresPerPerson)) {
            totalLiters = numPeople * litresPerPerson;
            this.container.querySelector('#totalLitres').value = totalLiters.toFixed(2);
            this.container.querySelector('#totalLitres').disabled = false;

            // Dispatch an event with the updated values
            const fuelCalculatedEvent = new CustomEvent('fuelCalculated', { detail: { numPeople, litresPerPerson, totalLiters } });
            this.container.dispatchEvent(fuelCalculatedEvent);
        } else {
            this.container.querySelector('#totalLitres').value = "";
            this.container.querySelector('#totalLitres').disabled = true;
        }
    }

    clearMultiplicands() {
        this.container.querySelector('#numPeople').value = "";
        this.container.querySelector('#litresPerPerson').value = "";
    }

    getTotalLiters() {
        return parseFloat(this.container.querySelector('#totalLitres').value) || 0;
    }
}
