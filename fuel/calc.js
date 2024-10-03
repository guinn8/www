// FILENAME: calc.js DO NOT REMOVE THIS COMMENT

// Shared calculation functions

// Function to calculate total fuel needed for the trip
function calculateTotalFuelNeeded(people, mealsPerPerson, fuelRate, tripDuration) {
    const totalMealsPerDay = people * mealsPerPerson;
    const dailyFuelConsumption = totalMealsPerDay * fuelRate;
    const totalFuelNeeded = dailyFuelConsumption * tripDuration;
    const fuelBuffer = totalFuelNeeded * 0.2;
    const totalFuelWithBuffer = totalFuelNeeded + fuelBuffer;
    return {
      totalMealsPerDay,
      dailyFuelConsumption,
      totalFuelNeeded,
      totalFuelWithBuffer,
    };
  }
  
  // Function to calculate estimated trip duration based on available fuel
  function calculateEstimatedTripDuration(people, mealsPerPerson, fuelRate, availableFuel) {
    const totalMealsPerDay = people * mealsPerPerson;
    const dailyFuelConsumption = totalMealsPerDay * fuelRate;
  
    let estimatedDays = 0;
    let maxTripDuration = 0;
  
    if (dailyFuelConsumption > 0) {
      estimatedDays = availableFuel / dailyFuelConsumption;
      const fuelBuffer = availableFuel * 0.2;
      maxTripDuration = (availableFuel - fuelBuffer) / dailyFuelConsumption;
    }
  
    return {
      totalMealsPerDay,
      dailyFuelConsumption,
      estimatedDays,
      maxTripDuration,
    };
  }
