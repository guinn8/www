// Function to get URL parameters
function getURLParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const vars = queryString.split('&');
    vars.forEach(function(v) {
      const pair = v.split('=');
      if (pair.length === 2) {
        params[pair[0]] = decodeURIComponent(pair[1]);
      }
    });
    return params;
  }
  
  // Get DOM elements
  const canisterSize = document.getElementById('canisterSize');
  const customCanisterInput = document.getElementById('customCanisterInput');
  const emptyCanisterWeightInput = document.getElementById('emptyCanisterWeight');
  const currentCanisterWeightInput = document.getElementById('currentCanisterWeight');
  const peopleInput = document.getElementById('people');
  const waterPerPersonInput = document.getElementById('waterPerPerson');
  const fuelRateInput = document.getElementById('fuelRate');
  const daysOfFuelDisplay = document.getElementById('daysOfFuel');
  
  let emptyCanisterWeight = 150; // Default empty canister weight for medium size
  
  // Update display values and calculations
  function updateValues() {
    const canisterOption = canisterSize.value;
  
    if (canisterOption === 'custom') {
      customCanisterInput.style.display = 'block';
      emptyCanisterWeight = parseFloat(emptyCanisterWeightInput.value);
    } else {
      customCanisterInput.style.display = 'none';
      switch (canisterOption) {
        case 'small':
          emptyCanisterWeight = 100;
          break;
        case 'medium':
          emptyCanisterWeight = 150;
          break;
        case 'large':
          emptyCanisterWeight = 220;
          break;
      }
    }
  
    const currentCanisterWeight = parseFloat(currentCanisterWeightInput.value);
    const netFuelWeight = currentCanisterWeight - emptyCanisterWeight;
  
    const people = parseInt(peopleInput.value);
    const waterPerPerson = parseFloat(waterPerPersonInput.value);
    const fuelRate = parseFloat(fuelRateInput.value);
  
    const dailyWaterNeed = people * waterPerPerson;
    const dailyFuelConsumption = dailyWaterNeed * fuelRate;
    const daysOfFuel = (netFuelWeight / dailyFuelConsumption).toFixed(1);
  
    daysOfFuelDisplay.textContent = isFinite(daysOfFuel) && daysOfFuel > 0 ? daysOfFuel : '0';
  
    updateChart(netFuelWeight, dailyFuelConsumption);
  }
  
  // Initialize chart
  const ctx = document.getElementById('chart').getContext('2d');
  let chart;
  
  function updateChart(netFuelWeight, dailyFuelConsumption) {
    const maxDays = Math.ceil(netFuelWeight / dailyFuelConsumption) + 2;
    const daysArray = [];
    const fuelRemainingArray = [];
  
    for (let day = 0; day <= maxDays; day++) {
      daysArray.push(day);
      fuelRemainingArray.push(Math.max(netFuelWeight - (dailyFuelConsumption * day), 0));
    }
  
    if (chart) {
      chart.destroy();
    }
  
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: daysArray,
        datasets: [{
          label: 'Fuel Remaining (grams)',
          data: fuelRemainingArray,
          borderColor: 'blue',
          fill: false,
          tension: 0.1,
        }]
      },
      options: {
        scales: {
          x: { title: { display: true, text: 'Days' } },
          y: { 
            title: { display: true, text: 'Fuel Remaining (grams)' },
            beginAtZero: true,
          }
        }
      }
    });
  }
  
  // Set initial values from URL parameters
  function setInitialValues() {
    const params = getURLParams();
  
    if (params.canisterSize) {
      canisterSize.value = params.canisterSize;
    }
    if (canisterSize.value === 'custom') {
      customCanisterInput.style.display = 'block';
      if (params.emptyCanisterWeight) {
        emptyCanisterWeightInput.value = params.emptyCanisterWeight;
      }
    }
  
    if (params.currentCanisterWeight) {
      currentCanisterWeightInput.value = params.currentCanisterWeight;
    }
    if (params.people) {
      peopleInput.value = params.people;
    }
    if (params.waterPerPerson) {
      waterPerPersonInput.value = params.waterPerPerson;
    }
    if (params.fuelRate) {
      fuelRateInput.value = params.fuelRate;
    }
  
    updateValues();
  }
  
  // Event listeners
  canisterSize.addEventListener('change', updateValues);
  emptyCanisterWeightInput.addEventListener('input', updateValues);
  currentCanisterWeightInput.addEventListener('input', updateValues);
  peopleInput.addEventListener('input', updateValues);
  waterPerPersonInput.addEventListener('input', updateValues);
  fuelRateInput.addEventListener('input', updateValues);
  
  // Initial calculation and chart rendering
  setInitialValues();
  