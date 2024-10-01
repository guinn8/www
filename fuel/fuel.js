// FILENAME: fuel.js DO NOT REMOVE THIS COMMENT

// Get DOM elements (existing code)
const tripDurationInput = document.getElementById('tripDuration');
const peopleInput = document.getElementById('people');
const mealsPerPersonInput = document.getElementById('mealsPerPerson');
const fuelRateInput = document.getElementById('fuelRate');

const canisterSize = document.getElementById('canisterSize');
const customCanisterInput = document.getElementById('customCanisterInput');
const fullFuelWeightInput = document.getElementById('fullFuelWeight');

const usePartialCanisterInput = document.getElementById('usePartialCanister');
const partialCanisterInputs = document.getElementById('partialCanisterInputs');
const emptyCanisterWeightInput = document.getElementById('emptyCanisterWeight');
const currentCanisterWeightInput = document.getElementById('currentCanisterWeight');

const daysOfFuelDisplay = document.getElementById('daysOfFuel');
const resultMessage = document.getElementById('resultMessage');

// Get the canvas for the chart
const ctx = document.getElementById('fuelChart').getContext('2d');
let fuelChart;

// Update display values and calculations
function updateValues() {
  const tripDuration = parseInt(tripDurationInput.value) || 1;
  const people = parseInt(peopleInput.value) || 1;
  const mealsPerPerson = parseFloat(mealsPerPersonInput.value) || 1;
  const fuelRate = parseFloat(fuelRateInput.value) || 10;

  // Total meals per day
  const totalMealsPerDay = people * mealsPerPerson;

  // Daily fuel consumption
  const dailyFuelConsumption = totalMealsPerDay * fuelRate;

  // Total fuel needed for the trip
  const totalFuelNeeded = dailyFuelConsumption * tripDuration;

  // Add 20% fuel buffer
  const fuelBuffer = totalFuelNeeded * 0.2;
  const totalFuelWithBuffer = totalFuelNeeded + fuelBuffer;

  // Determine fuel available
  let fuelAvailable = 0;
  let canistersNeeded = 0;
  let fullFuelWeight = 0;

  if (usePartialCanisterInput.checked) {
    // Using a partially used canister
    const emptyCanisterWeight = parseFloat(emptyCanisterWeightInput.value) || 150;
    const currentCanisterWeight = parseFloat(currentCanisterWeightInput.value) || 0;
    fuelAvailable = currentCanisterWeight - emptyCanisterWeight;
  } else {
    // Using full canisters
    const canisterOption = canisterSize.value;

    if (canisterOption === 'custom') {
      customCanisterInput.style.display = 'block';
      fullFuelWeight = parseFloat(fullFuelWeightInput.value) || 230;
    } else {
      customCanisterInput.style.display = 'none';
      switch (canisterOption) {
        case 'small':
          fullFuelWeight = 100;
          break;
        case 'medium':
          fullFuelWeight = 230;
          break;
        case 'large':
          fullFuelWeight = 450;
          break;
      }
    }

    // Calculate the number of canisters needed
    canistersNeeded = Math.ceil(totalFuelWithBuffer / fullFuelWeight);
    fuelAvailable = canistersNeeded * fullFuelWeight;
  }

  // Estimated days of fuel based on fuel available
  const estimatedDays = (fuelAvailable / dailyFuelConsumption).toFixed(1);
  daysOfFuelDisplay.textContent = isFinite(estimatedDays) && estimatedDays > 0 ? estimatedDays : '0';

  // Determine if fuel is sufficient
  const fuelSufficient = fuelAvailable >= totalFuelWithBuffer;

  if (fuelSufficient) {
    resultMessage.innerHTML = '<span class="success">Your fuel reserve meets the requirements including a 20% buffer!</span>';
    if (!usePartialCanisterInput.checked) {
      resultMessage.innerHTML += `<br>You need to bring ${canistersNeeded} canister(s).`;
    }
  } else {
    const additionalFuelNeeded = (totalFuelWithBuffer - fuelAvailable).toFixed(1);
    resultMessage.innerHTML = `<span class="error">You need an additional ${additionalFuelNeeded} grams of fuel to meet the 20% buffer.</span>`;

    if (!usePartialCanisterInput.checked) {
      canistersNeeded = Math.ceil(totalFuelWithBuffer / fullFuelWeight);
      resultMessage.innerHTML += `<br>You need to bring ${canistersNeeded} canister(s) of ${fullFuelWeight} grams.`;
    }
  }

  // Update the chart
  updateChart(fuelAvailable, dailyFuelConsumption, tripDuration, totalFuelNeeded, totalFuelWithBuffer);
}

// Initialize or update chart
function updateChart(fuelAvailable, dailyFuelConsumption, tripDuration, totalFuelNeeded, totalFuelWithBuffer) {
  // Prepare data arrays
  const maxDays = tripDuration;
  const daysArray = [];
  const fuelRemainingArray = [];
  const cumulativeFuelConsumptionArray = [];
  const fuelReserveArray = [];

  for (let day = 0; day <= maxDays; day++) {
    daysArray.push(day);
    const cumulativeConsumption = dailyFuelConsumption * day;
    cumulativeFuelConsumptionArray.push(cumulativeConsumption);


    // Fuel remaining decreases each day
    const fuelRemaining = fuelAvailable - cumulativeConsumption;
    fuelRemainingArray.push(fuelRemaining);

    // Fuel reserve line (constant value)
    fuelReserveArray.push(fuelAvailable);
  }

  // Destroy previous chart if it exists
  if (fuelChart) {
    fuelChart.destroy();
  }

  // Create new chart
  fuelChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: daysArray,
      datasets: [
        {
          label: 'Fuel Remaining (grams)',
          data: fuelRemainingArray,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          fill: false,
          tension: 0.1,
          pointRadius: 3,
        },
        {
          label: 'Fuel Requirements',
          data: cumulativeFuelConsumptionArray,
          borderColor: 'green',
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          fill: false,
          tension: 0.1,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: 'Days' },
          grid: { display: false },
        },
        y: {
          title: { display: true, text: 'Fuel (grams)' },
          beginAtZero: true,
          grid: { color: '#eee' },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} grams`;
            },
          },
        },
        legend: {
          display: true,
        },
      },
    },
  });
}

// Event listeners (existing code)
tripDurationInput.addEventListener('input', updateValues);
peopleInput.addEventListener('input', updateValues);
mealsPerPersonInput.addEventListener('input', updateValues);
fuelRateInput.addEventListener('input', updateValues);
canisterSize.addEventListener('change', function () {
  if (canisterSize.value === 'custom') {
    customCanisterInput.style.display = 'block';
  } else {
    customCanisterInput.style.display = 'none';
  }
  updateValues();
});
fullFuelWeightInput.addEventListener('input', updateValues);

usePartialCanisterInput.addEventListener('change', function () {
  if (usePartialCanisterInput.checked) {
    partialCanisterInputs.style.display = 'block';
  } else {
    partialCanisterInputs.style.display = 'none';
  }
  updateValues();
});

emptyCanisterWeightInput.addEventListener('input', updateValues);
currentCanisterWeightInput.addEventListener('input', updateValues);

// Initial calculation
updateValues();
