// FILENAME: gasCanisterInputComponent.js

class GasCanisterInputComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canisters = [];
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="gas-canister-input-container">
                <div id="canister-list"></div>
                <button id="add-canister">Add Canister</button>
                <div id="total-gas-owned"></div>
            </div>
        `;
        this.updateCanisterList();
    }

    attachEventListeners() {
        this.container.querySelector('#add-canister').addEventListener('click', () => {
            this.addCanister();
        });
    }

    addCanister() {
        this.canisters.push({ size: '', quantity: 1 });
        this.updateCanisterList();
    }

    updateCanisterList() {
        const canisterList = this.container.querySelector('#canister-list');
        canisterList.innerHTML = '';
        this.canisters.forEach((canister, index) => {
            canisterList.innerHTML += `
                <div class="canister-item">
                    <select data-index="${index}" class="canister-size">
                        <option value="">Select Size</option>
                        <option value="100">100g</option>
                        <option value="230">230g</option>
                        <option value="450">450g</option>
                        <option value="custom">Custom</option>
                    </select>
                    <input type="number" data-index="${index}" class="canister-quantity" min="1" value="${canister.quantity}" title="Quantity">
                    <input type="number" data-index="${index}" class="canister-custom-size" placeholder="Custom Size (g)" style="display:none;" title="Custom Size in grams">
                    <button data-index="${index}" class="remove-canister">Remove</button>
                </div>
            `;
        });
        this.attachCanisterEventListeners();
        this.calculateTotalGasOwned();
    }

    attachCanisterEventListeners() {
        const sizeSelectors = this.container.querySelectorAll('.canister-size');
        sizeSelectors.forEach(select => {
            select.addEventListener('change', (event) => {
                const index = event.target.getAttribute('data-index');
                const value = event.target.value;
                this.canisters[index].size = value;
                const customSizeInput = event.target.parentElement.querySelector('.canister-custom-size');
                if (value === 'custom') {
                    customSizeInput.style.display = 'inline-block';
                } else {
                    customSizeInput.style.display = 'none';
                    customSizeInput.value = '';
                }
                this.calculateTotalGasOwned();
            });
        });

        const quantityInputs = this.container.querySelectorAll('.canister-quantity');
        quantityInputs.forEach(input => {
            input.addEventListener('input', (event) => {
                const index = event.target.getAttribute('data-index');
                const value = parseInt(event.target.value) || 1;
                this.canisters[index].quantity = value;
                this.calculateTotalGasOwned();
            });
        });

        const customSizeInputs = this.container.querySelectorAll('.canister-custom-size');
        customSizeInputs.forEach(input => {
            input.addEventListener('input', (event) => {
                const index = event.target.getAttribute('data-index');
                const value = parseFloat(event.target.value) || 0;
                this.canisters[index].customSize = value;
                this.calculateTotalGasOwned();
            });
        });

        const removeButtons = this.container.querySelectorAll('.remove-canister');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                this.canisters.splice(index, 1);
                this.updateCanisterList();
                this.calculateTotalGasOwned();
            });
        });
    }

    calculateTotalGasOwned() {
        let totalGas = 0;
        this.canisters.forEach(canister => {
            let size = 0;
            if (canister.size === 'custom') {
                size = canister.customSize || 0;
            } else {
                size = parseInt(canister.size) || 0;
            }
            totalGas += size * canister.quantity;
        });
        this.container.querySelector('#total-gas-owned').innerText = `Total Gas Owned: ${totalGas} g`;

        // Dispatch an event with the total gas owned
        const gasOwnedEvent = new CustomEvent('gasOwnedChanged', { detail: { totalGasOwned: totalGas } });
        this.container.dispatchEvent(gasOwnedEvent);
    }

    getTotalGasOwned() {
        return this.canisters.reduce((total, canister) => {
            let size = 0;
            if (canister.size === 'custom') {
                size = canister.customSize || 0;
            } else {
                size = parseInt(canister.size) || 0;
            }
            return total + (size * canister.quantity);
        }, 0);
    }
}
