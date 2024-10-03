// FILENAME: app.js DO NOT REMOVE THIS COMMENT

// Get DOM elements
const tripDurationInput = document.getElementById('tripDuration');
const peopleInput = document.getElementById('people');
const mealsPerPersonInput = document.getElementById('mealsPerPerson');
const fuelRateInput = document.getElementById('fuelRate');

const availableFuelInput = document.getElementById('availableFuel');

const totalFuelNeededDisplay = document.getElementById('totalFuelNeeded');
const fuelNeededMessage = document.getElementById('fuelNeededMessage');

const estimatedTripDurationDisplay = document.getElementById('estimatedTripDuration');
const tripDurationMessage = document.getElementById('tripDurationMessage');

// Sections
const fuelNeededContent = document.getElementById('fuelNeededContent');
const tripDurationContent = document.getElementById('tripDurationContent');

// Collapsible Headers
const fuelNeededHeader = document.getElementById('fuelNeededHeader');
const tripDurationHeader = document.getElementById('tripDurationHeader');

// Update display values and calculations
function updateValues() {
  // Shared inputs
  const people = parseInt(peopleInput.value) || 1;
  const mealsPerPerson = parseFloat(mealsPerPersonInput.value) || 1;
  const fuelRate = parseFloat(fuelRateInput.value) || 10;

  let totalFuelNeeded = 0;
  let fuelAvailable = 0;
  let estimatedTripDuration = 0;
  let dailyFuelConsumption = 0;

  // Flags to determine which modes are active
  const isFuelNeededActive = fuelNeededContent.style.display !== 'none';
  const isTripDurationActive = tripDurationContent.style.display !== 'none';

  // Data for chart
  let chartData = {
    fuelAvailable: 0,
    dailyFuelConsumption: 0,
    totalFuelNeeded: 0,
    modesActive: {
      fuelNeeded: isFuelNeededActive,
      tripDuration: isTripDurationActive,
    },
    verticalLineDay: null,
  };

  // Estimate Fuel Needed functionality
  if (isFuelNeededActive) {
    const tripDuration = parseInt(tripDurationInput.value) || 1;

    const fuelNeededData = calculateTotalFuelNeeded(
      people,
      mealsPerPerson,
      fuelRate,
      tripDuration
    );

    dailyFuelConsumption = fuelNeededData.dailyFuelConsumption;
    totalFuelNeeded = fuelNeededData.totalFuelNeeded;
    const totalFuelWithBuffer = fuelNeededData.totalFuelWithBuffer;

    // Display total fuel needed
    totalFuelNeededDisplay.textContent = totalFuelWithBuffer.toFixed(1);

    fuelNeededMessage.innerHTML = `<span>Your estimated total fuel needed including a 20% buffer is ${totalFuelWithBuffer.toFixed(1)} grams.</span>`;

    chartData.fuelAvailable = totalFuelWithBuffer;
    chartData.dailyFuelConsumption = dailyFuelConsumption;
    chartData.totalFuelNeeded = totalFuelWithBuffer;

    // Set verticalLineDay to tripDuration
    chartData.verticalLineDay = tripDuration;
  }

  // Estimate Isobutane Can Duration functionality
  if (isTripDurationActive) {
    const availableFuel = parseFloat(availableFuelInput.value) || 0;

    const tripDurationData = calculateEstimatedTripDuration(
      people,
      mealsPerPerson,
      fuelRate,
      availableFuel
    );

    dailyFuelConsumption = tripDurationData.dailyFuelConsumption;
    const estimatedDays = tripDurationData.estimatedDays;
    const maxTripDuration = tripDurationData.maxTripDuration;

    estimatedTripDurationDisplay.textContent =
      isFinite(estimatedDays) && estimatedDays > 0 ? estimatedDays.toFixed(1) : '0';

    tripDurationMessage.innerHTML = `<span class="success">With a 20% buffer, you can go for ${
      maxTripDuration > 0 ? maxTripDuration.toFixed(1) : '0'
    } days.</span>`;

    chartData.fuelAvailable = availableFuel;
    chartData.dailyFuelConsumption = dailyFuelConsumption;
    chartData.totalFuelNeeded =
      dailyFuelConsumption * (maxTripDuration > 0 ? maxTripDuration : 0);

    // Set verticalLineDay to maxTripDuration if valid
    if (isFinite(maxTripDuration) && maxTripDuration > 0) {
      chartData.verticalLineDay = maxTripDuration;
    }
  }

  // Update the chart
  updateChart(chartData);
}

// Event listeners for inputs
peopleInput.addEventListener('input', updateValues);
mealsPerPersonInput.addEventListener('input', updateValues);
fuelRateInput.addEventListener('input', updateValues);

tripDurationInput.addEventListener('input', updateValues);

availableFuelInput.addEventListener('input', updateValues);

// Collapsible card functionality
function toggleCardContent(header, content) {
  header.addEventListener('click', function () {
    const isVisible = content.style.display === 'block';
    content.style.display = isVisible ? 'none' : 'block';
    header.classList.toggle('active');
    updateValues();
  });
}

// Initialize collapsible cards
fuelNeededContent.style.display = 'block'; // Show the first card by default
fuelNeededHeader.classList.add('active');

tripDurationContent.style.display = 'none';

toggleCardContent(fuelNeededHeader, fuelNeededContent);
toggleCardContent(tripDurationHeader, tripDurationContent);

// Initial calculation
updateValues();
