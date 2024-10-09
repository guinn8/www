// FILENAME: daysSelectorComponent.js

class DaysSelectorComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.maxDays = options.maxDays || 30; // Default maximum number of days
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="days-selector-container">
                <label for="numDays" title="Select the number of days for your trip">Number of Days:</label>
                <input type="number" id="numDays" min="1" max="${this.maxDays}" placeholder="Enter days (1-${this.maxDays})" />
            </div>
        `;
    }

    attachEventListeners() {
        this.container.querySelector('#numDays').addEventListener('input', (event) => {
            let selectedDays = parseInt(event.target.value);

            if (selectedDays > this.maxDays) {
                selectedDays = this.maxDays; // Cap at maxDays
                event.target.value = this.maxDays; // Update input value
            } else if (selectedDays < 1 || isNaN(selectedDays)) {
                selectedDays = 0;
            }

            console.log(`Number of Days Selected: ${selectedDays}`);

            // Dispatch a custom event
            const daysSelectedEvent = new CustomEvent('daysSelected', { detail: { days: selectedDays } });
            this.container.dispatchEvent(daysSelectedEvent);

            // Dispatch an event with the updated number of days
            const daysChangedEvent = new CustomEvent('daysChanged', { detail: { days: selectedDays } });
            this.container.dispatchEvent(daysChangedEvent);
        });
    }

    getSelectedDays() {
        const value = this.container.querySelector('#numDays').value;
        return parseInt(value) || null;
    }
}
