// daysSelectorComponent.js
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
                <select id="numDays">
                    ${this.generateDayOptions()}
                </select>
            </div>
        `;
    }

    generateDayOptions() {
        let options = '<option value="">Select Days</option>';
        for (let i = 1; i <= this.maxDays; i++) {
            options += `<option value="${i}">${i}</option>`;
        }
        return options;
    }

    attachEventListeners() {
        this.container.querySelector('#numDays').addEventListener('change', (event) => {
            const selectedDays = parseInt(event.target.value) || 0;
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

