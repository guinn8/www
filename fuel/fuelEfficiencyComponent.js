// FILENAME: fuelEfficiencyComponent.js

class FuelEfficiencyComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.attachEventListeners();
        this.setDefaultEfficiency(); // Set the default efficiency upon initialization
    }

    render() {
        this.container.innerHTML = `
            <div class="fuel-efficiency-container">
                <label for="stoveEfficiency" title="Select your stove's fuel efficiency">Stove Efficiency:</label>
                <select id="stoveEfficiency">
                    <option value="">Select Efficiency</option>
                    <option value="default">Default Efficiency (12g/L)</option>
                    <option value="efficient">Efficient Stove (9g/L)</option>
                    <option value="manual">Manual Entry</option>
                </select>
                <div id="manualEntryContainer" style="display: none;">
                    <label for="manualEfficiency" title="Enter the fuel efficiency in grams per liter">Efficiency (g/L):</label>
                    <input type="number" id="manualEfficiency" min="0" step="0.1" placeholder="e.g., 10.5">
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const stoveEfficiencySelect = this.container.querySelector('#stoveEfficiency');
        const manualEntryContainer = this.container.querySelector('#manualEntryContainer');
        const manualEfficiencyInput = this.container.querySelector('#manualEfficiency');

        stoveEfficiencySelect.addEventListener('change', (event) => {
            const selectedOption = event.target.value;
            if (selectedOption === 'manual') {
                manualEntryContainer.style.display = 'block';
            } else {
                manualEntryContainer.style.display = 'none';
                manualEfficiencyInput.value = '';
            }
            this.dispatchEfficiencyChange();
        });

        manualEfficiencyInput.addEventListener('input', () => {
            this.dispatchEfficiencyChange();
        });
    }

    setDefaultEfficiency() {
        const stoveEfficiencySelect = this.container.querySelector('#stoveEfficiency');
        stoveEfficiencySelect.value = 'default'; // Set the default option
        this.dispatchEfficiencyChange(); // Trigger the efficiency change event with default value
    }

    dispatchEfficiencyChange() {
        const efficiencyValue = this.getEfficiencyValue();
        const efficiencyChangeEvent = new CustomEvent('efficiencyChanged', { detail: { efficiency: efficiencyValue } });
        this.container.dispatchEvent(efficiencyChangeEvent);
    }

    getEfficiencyValue() {
        const stoveEfficiencySelect = this.container.querySelector('#stoveEfficiency');
        const manualEfficiencyInput = this.container.querySelector('#manualEfficiency');
        const selectedOption = stoveEfficiencySelect.value;

        if (selectedOption === 'default') {
            return 12; // Default efficiency in g/L
        } else if (selectedOption === 'efficient') {
            return 9; // Efficient stove efficiency in g/L
        } else if (selectedOption === 'manual') {
            const manualValue = parseFloat(manualEfficiencyInput.value);
            return !isNaN(manualValue) ? manualValue : null;
        }
        return null;
    }
}
