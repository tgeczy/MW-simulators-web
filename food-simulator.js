// Food and drink data
const items = [
  {
    name: 'Chicken Drumstick',
    description: 'Recover 0.10% max HP and 10 points of HP every 2 seconds for 10 minutes.',
    duration: 600,
    stat: 'HP',
    percentageBoost: 0.1,
    pointsPerInterval: 10,
    interval: 2,
    type: 'food',
  },
  {
    name: 'Pie',
    description: 'Recover 0.10% max HP and 10 points of HP every 2 seconds for 20 minutes.',
    duration: 1200,
    stat: 'HP',
    percentageBoost: 0.1,
    pointsPerInterval: 10,
    interval: 2,
    type: 'food',
  },
  {
    name: 'Hotdog',
    description: 'Recover 0.10% max HP and 10 points of HP every 2 seconds for 30 minutes.',
    duration: 1800,
    stat: 'HP',
    percentageBoost: 0.1,
    pointsPerInterval: 10,
    interval: 2,
    type: 'food',
  },
  {
    name: 'Steak or pet jerky',
    description: 'Recover 0.20% max HP and 20 points of HP every 2 seconds for 10 minutes.',
    duration: 600,
    stat: 'HP',
    percentageBoost: 0.2,
    pointsPerInterval: 20,
    interval: 2,
    type: 'food',
  },
  {
    name: 'Burrito',
    description: 'Recover 0.20% max HP and 20 points of HP every 2 seconds for 20 minutes.',
    duration: 1200,
    stat: 'HP',
    percentageBoost: 0.2,
    pointsPerInterval: 20,
    interval: 2,
    type: 'food',
  },
  {
    name: 'Sandwich',
    description: 'Recover 0.20% max HP and 20 points of HP every 2 seconds for 30 minutes.',
    duration: 1800,
    stat: 'HP',
    percentageBoost: 0.2,
    pointsPerInterval: 20,
    interval: 2,
    type: 'food',
  },
  {
    name: "Ham' or pet sausage",
    description: 'Recover 0.30% max HP and 30 points of HP every 2 seconds for 10 minutes.',
    duration: 600,
    stat: 'HP',
    percentageBoost: 0.3,
    pointsPerInterval: 30,
    interval: 2,
    type: 'food',
  },
  {
    name: 'Pizza',
    description: 'Recover 0.30% max HP and 30 points of HP every 2 seconds for 20 minutes.',
    duration: 1200,
    stat: 'HP',
    percentageBoost: 0.3,
    pointsPerInterval: 30,
    interval: 2,
    type: 'food',
  },
  {
    name: 'Hamburger',
    description: 'Recover 0.30% max HP and 30 points of HP every 2 seconds for 20 minutes.',
    duration: 1800,
    stat: 'HP',
    percentageBoost: 0.3,
    pointsPerInterval: 30,
    interval: 2,
    type: 'food',
  },
  {
    name: 'Gouging Knife Strike force',
    description: 'A wedding champagne; specialty of Gouging knife city. Increase 3% attack damage for 1 minute, the effect can be stacked. Cannot be used in competitions',
    duration: 60,
    stat: 'Attack',
    percentageBoost: 3,
    pointsPerInterval: 0,
    interval: 1,
    type: 'drink', // New 'type' property to distinguish drinks
  },
  {
    name: 'Bloody Holy Blood',
    description: 'A wedding champagne; specialty of Holy Blood city. Increase 6% attack damage for 1 minute, the effect can be stacked. Cannot be used in competitions',
    duration: 60,
    stat: 'Attack',
    percentageBoost: 6,
    pointsPerInterval: 0,
    interval: 1,
    type: 'drink', // New 'type' property to distinguish drinks
  },
  {
    name: 'Princess William',
    description: 'A wedding champagne; specialty of Giant rock city. Increase 10% attack damage for 1 minute, the effect can be stacked. Cannot be used in competitions.',
    duration: 60,
    stat: 'Attack',
    percentageBoost: 10,
    pointsPerInterval: 0,
    interval: 1,
    type: 'drink', // New 'type' property to distinguish drinks
  },
  {
    name: 'innocent moon',
    description: 'A wedding champagne; specialty of Moon City. Reduce 3% attack damage taken for 1 minute, the effect can be stacked. Cannot be used in competitions',
    duration: 60,
    stat: 'Defense',
    percentageBoost: 3,
    pointsPerInterval: 0,
    interval: 1,
    type: 'drink',
  },
  {
    name: 'Free White Sand',
    description: 'A wedding champagne; specialty of White Sand City. Reduce 6% attack damage taken for 1 minute, the effect can be stacked. Cannot be used in competitions',
    duration: 60,
    stat: 'Defense',
    percentageBoost: 6,
    pointsPerInterval: 0,
    interval: 1,
    type: 'drink',
  },
  {
    name: 'White Tulip',
    description: 'A wedding champagne; specialty of Tulip City. Reduce 10% attack damage taken for 1 minute, the effect can be stacked. Cannot be used in competitions.',
    duration: 60,
    stat: 'Defense',
    percentageBoost: 10,
    pointsPerInterval: 0,
    interval: 1,
    type: 'drink',
  },
];

// Array to store references to progress bars
const progressBars = [];

// Variable to store the total attack value
let baseAttack = 0;
let boostAmount = 0;

// Function to populate item select element with food and drink options
function populateItemSelect() {
  const itemStore = document.getElementById('itemStore');

  // Clear previous options
  itemStore.innerHTML = '';

  for (const item of items) {
    const option = document.createElement('option');
    option.value = item.name;
    option.textContent = `${item.name} - ${item.description}`;
    itemStore.appendChild(option);
  }
}

// Function to update progress bar
function updateProgressBar(progressBar, duration, interval, recoveryAmount) {
  let progress = 0;
  const increment = (100 / duration) * interval;

  progressBar.value = 0;
  progressBar.setAttribute('max', 100);
  progressBar.setAttribute('aria-valuemin', 0);
  progressBar.setAttribute('aria-valuemax', 100);
  progressBar.setAttribute('aria-valuenow', 0);
  progressBar.classList.remove('hidden');

  const intervalId = setInterval(() => {
    progress += increment;
    progressBar.value = progress;
    progressBar.setAttribute('aria-valuenow', progress);

    if (progress >= 100) {
      clearInterval(intervalId);
      progressBar.classList.add('hidden');

      // Remove progress bar from the array if it reaches 100%
      const progressBarIndex = progressBars.findIndex((item) => item.progressBar === progressBar);
      if (progressBarIndex !== -1) {
        progressBars.splice(progressBarIndex, 1);

        // Update the total attack value in the result field
        updateTotalAttack();

        // If interactive mode is enabled, show the lowered value in the result field
        if (document.getElementById('interactiveMode').checked) {
          const resultField = document.getElementById('itemResultField');
          const existingResult = resultField.value;
          const newResult = existingResult.replace(`Total ${progressBar.stat}: ${baseAttack + calculateTotalBoostAmount()}`, `Total ${progressBar.stat}: ${baseAttack + calculateTotalBoostAmount() - progressBar.boost}`);
          resultField.value = newResult;
        }
      }
    }
  }, interval * 1000);
}

// Function to calculate the adjusted total attack value based on the progress bars
function calculateAdjustedTotalAttack(totalValue) {
  let adjustedTotalValue = totalValue;

  for (const progressBar of progressBars) {
    const statBoost = Math.floor(totalValue * (progressBar.percentageBoost / 100));
    adjustedTotalValue -= statBoost;
  }

  return adjustedTotalValue;
}

// Function to calculate the total boost amount from active progress bars
function calculateTotalBoostAmount() {
  let totalBoostAmount = 0;

  for (const progressBar of progressBars) {
    totalBoostAmount += progressBar.boost;
  }

  return totalBoostAmount;
}

// Function to update the total attack value in the result field
function updateTotalAttack() {
  const resultField = document.getElementById('itemResultField');
  const existingTotalAttack = resultField.value.match(/Total Attack: (\d+)/);

  let existingTotalAttackValue;
  if (existingTotalAttack) {
    existingTotalAttackValue = parseInt(existingTotalAttack[1]);
  } else {
    existingTotalAttackValue = 0; // Default to 0 if no match
  }

  const total = baseAttack + calculateTotalBoostAmount();

  resultField.value = resultField.value.replace(existingTotalAttack[0], `Total Attack: ${total}`);
}

// Function to calculate the food/drink usage based on the selected item
function calculateUsage() {
  const itemName = document.getElementById('itemStore').value;
  const selectedItem = items.find((item) => item.name === itemName);
  const totalValue = Number(document.getElementById('totalValue').value);
  const isInteractive = document.getElementById('interactiveMode').checked;

  let resultText = '';

  if (totalValue && totalValue > 0) {
    if (selectedItem.type === 'food') {
      const recoveryDuration = selectedItem.duration / 60;
      const recoveryAmountPerInterval =
        Math.floor((totalValue * selectedItem.percentageBoost) / 100) +
        selectedItem.pointsPerInterval * (selectedItem.interval / 2);
      const recoveryAmount = Math.floor(recoveryAmountPerInterval * (recoveryDuration * (60 / selectedItem.interval)));
      resultText = `Using ${itemName}, you can recover ${recoveryAmount} of ${selectedItem.stat} over ${recoveryDuration} minutes. (${recoveryAmountPerInterval} per ${selectedItem.interval} seconds)`;

      if (isInteractive) {
        const progressBarDuration = recoveryDuration * 60;
        const interval = selectedItem.interval;

        // Create new progress bar element
        const progressBar = document.createElement('progress');
        progressBar.id = `progressBar${progressBars.length + 1}`;
        progressBar.classList.add('progress-bar');
        progressBar.classList.add('hidden');
        progressBar.percentageBoost = selectedItem.percentageBoost;

        // Append progress bar and label to the container
        const container = document.getElementById('progressContainer');
        container.appendChild(progressBar);

        // Store references to the progress bar
        progressBars.push({
          progressBar,
          boost: recoveryAmount,
          stat: selectedItem.stat,
        });

        // Update the new progress bar
        updateProgressBar(progressBar, progressBarDuration, interval, recoveryAmount);
      }
    } else if (selectedItem.type === 'drink') {
      const statBoost = Math.floor(totalValue * (selectedItem.percentageBoost / 100));
      const statBoostDuration = selectedItem.duration / 60;

      // Check if base attack has been added
      const baseValueAdded = baseAttack !== 0;

      if (!baseValueAdded) {
        baseAttack = totalValue;
      }

      // When boost added
      boostAmount += statBoost;

      resultText = `Using ${itemName}, you get an ${selectedItem.stat} boost of ${statBoost} for ${statBoostDuration} minutes. Total ${selectedItem.stat}: ${baseAttack + calculateTotalBoostAmount()}.`;

      if (isInteractive) {
        const progressBarDuration = selectedItem.duration;
        const interval = selectedItem.interval;

        // Create new progress bar element
        const progressBar = document.createElement('progress');
        progressBar.id = `progressBar${progressBars.length + 1}`;
        progressBar.classList.add('progress-bar');
        progressBar.classList.add('hidden');
        progressBar.percentageBoost = selectedItem.percentageBoost;

        // Append progress bar to the container
        const container = document.getElementById('progressContainer');
        container.appendChild(progressBar);

        // Store reference to the progress bar
        progressBars.push({
          progressBar,
          boost: statBoost,
          stat: selectedItem.stat,
        });

        // Update the new progress bar
        updateProgressBar(progressBar, progressBarDuration, interval, statBoost);
      }
    }
  } else {
    resultText = 'Please enter a valid total value for the character.';
  }

  const resultField = document.getElementById('itemResultField');
  resultField.value = resultText;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  populateItemSelect();
  document.getElementById('calculateButton').addEventListener('click', calculateUsage);
});
