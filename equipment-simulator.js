const levelLabels = ["1 - Normal", "2 - Normal", "3 - Normal", "4 - Normal", "5 - Refined", "6 - Refined", "7 - Refined", "8 - Great", "9 - Great", "10 - Epic", "11 - Heavenly", "12 - Godbless"];
const successRates = [100, 100, 90, 75, 60, 45, 30, 20, 15, 10, 5, 1];
const enhancementGuarantees = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const equipmentLevels = [15, 30, 45, 60, 70, 80, 90, 100];

function populateSelectOptions(selectId, options, startIndex = 1) {
    const select = document.getElementById(selectId);
    options.forEach((option, index) => {
        const optionElement = document.createElement("option");
        optionElement.value = startIndex + index;
        optionElement.text = option;
        select.add(optionElement);
    });
}

populateSelectOptions("currentEnhancement", levelLabels);
populateSelectOptions("equipmentLevel", equipmentLevels.map(level => `Level ${level}`));
populateSelectOptions("targetEnhancement", levelLabels.slice(1), 2); // Start from level 2
populateSelectOptions("boostRuneMinLevel", levelLabels.slice(1), 2); // Start from level 2
populateSelectOptions("protectRuneMinLevel", levelLabels.slice(1), 2); // Start from level 2

function toggleRuneMinLevelContainer(checkboxId, containerId) {
    const checkbox = document.getElementById(checkboxId);
    const container = document.getElementById(containerId);
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    });
}

toggleRuneMinLevelContainer('boostRune', 'boostRuneMinLevelContainer');
toggleRuneMinLevelContainer('protectRune', 'protectRuneMinLevelContainer');
toggleRuneMinLevelContainer('runMultipleSimulations', 'numSimulationsContainer');

function appendEquipmentLog(message) {
    const equipmentLog = document.getElementById('equipmentSimulationLog');
    const entry = document.createElement('div');
    entry.textContent = message;
    equipmentLog.appendChild(entry);
}

function resetEquipmentLog(showProgress) {
    const equipmentLog = document.getElementById('equipmentSimulationLog');
    const equipmentProgress = document.getElementById('equipmentProgress');
    equipmentLog.innerHTML = '';
    equipmentProgress.value = 0;
    equipmentProgress.classList.toggle('hidden', !showProgress);
}

document.getElementById('startEnhance').addEventListener('click', async () => {
    const currentEnhancement = parseInt(document.getElementById('currentEnhancement').value);
    const targetEnhancement = parseInt(document.getElementById('targetEnhancement').value);
    const boostRune = document.getElementById('boostRune').checked;
    const protectRune = document.getElementById('protectRune').checked;
    const selectedEquipmentLevelText = document.getElementById('equipmentLevel').options[document.getElementById('equipmentLevel').selectedIndex].text;
    const equipmentLevel = parseInt(selectedEquipmentLevelText.split(' ')[1]);
    const boostRuneMinLevel = boostRune ? parseInt(document.getElementById('boostRuneMinLevel').value) : Number.MAX_SAFE_INTEGER;
    const protectRuneMinLevel = protectRune ? parseInt(document.getElementById('protectRuneMinLevel').value) : Number.MAX_SAFE_INTEGER;
    const interactiveEnhancement = document.getElementById('interactiveEnhancement').checked;

    if (targetEnhancement <= currentEnhancement) {
        alert('Target enhancement level should be higher than the current enhancement level.');
        return;
    }

    const runMultipleSimulations = document.getElementById('runMultipleSimulations').checked;
    let numSimulations = runMultipleSimulations ? parseInt(document.getElementById('numSimulations').value) : 1;
    const equipmentProgress = document.getElementById('equipmentProgress');
    const requireInteractiveSingleRun = interactiveEnhancement && numSimulations > 1;
    resetEquipmentLog(interactiveEnhancement);
    if (requireInteractiveSingleRun) {
        numSimulations = 1;
        appendEquipmentLog('Interactive simulation runs a single session; multi-run average disabled.');
    }

    if (interactiveEnhancement) {
        equipmentProgress.max = targetEnhancement - currentEnhancement;
    }

    let totalAttempts = 0;
    let totalShardsRequired = 0;
    let totalBoostRunesUsed = 0;
    let totalProtectRunesUsed = 0;
    let totalProtectRunesDiamondCost = 0; // Variable to track the total protect rune diamond cost
    let totalBoostRunesDiamondCost = 0; // Variable to track the total boost rune diamond cost across all simulations
    let minAttempts = Number.MAX_SAFE_INTEGER;
    let countOfLowestAttempts = 0;
    const equipmentLevelIndex = equipmentLevels.indexOf(equipmentLevel);
    if (equipmentLevelIndex === -1) {
        alert('Invalid equipment level selected.');
        return;
    }

    //main part of the program
    const shardsPerCrystal = [2, 4, 10, 20, 40, 70, 120, 200];
    const runesPerEquipmentLevel = [1, 2, 4, 7, 11, 15, 21, 24];
    const runeMultiplier = runesPerEquipmentLevel[equipmentLevelIndex];  // Define runeMultiplier here
    let totalGarLevels = 0; // Initialize totalGarLevels before the for loop
    let garLevels = Array(targetEnhancement - currentEnhancement).fill(0);
    let successfulEnhancements = Array(targetEnhancement - currentEnhancement).fill(0);

    for (let sim = 0; sim < numSimulations; sim++) {
        let enhancementLevel = currentEnhancement;
        let attempts = 0;
        let boostRunesUsed = 0;
        let protectRunesUsed = 0;
        let protectRunesDiamondCost = 0; // Variable to track the protect rune diamond cost for the current simulation
        let boostRunesDiamondCost = 0; // Variable to track the boost rune diamond cost for the current simulation
        let hasReachedLevelTwoTwice = false;
        let enhanceGar = 0;
        const delay = interactiveEnhancement ? 400 : 0;

        while (enhancementLevel < targetEnhancement) {
            attempts++;
            enhanceGar++;
            const applyBoostRune = boostRune && enhancementLevel >= boostRuneMinLevel;
            const applyProtectRune = protectRune && enhancementLevel >= protectRuneMinLevel;
            const successRate = successRates[enhancementLevel - 1] + (applyBoostRune ? 5 : 0);
            const enhanceSuccess = enhanceGar >= enhancementGuarantees[enhancementLevel - 1] || Math.random() * 100 < successRate;
            if (interactiveEnhancement) {
                appendEquipmentLog(`Attempt ${attempts}: L${enhancementLevel} -> ${enhancementLevel + 1} (${enhanceGar}/${enhancementGuarantees[enhancementLevel - 1]} guarantee).`);
            }

            if (enhanceSuccess) {
                garLevels[enhancementLevel - currentEnhancement] += enhanceGar;
                successfulEnhancements[enhancementLevel - currentEnhancement]++; // Count the number of successful enhancements for each level
                enhancementLevel++;
                enhanceGar = 0; // Reset enhanceGar whenever the enhancement level changes
                if (interactiveEnhancement) {
                    appendEquipmentLog(`Success! Current level: ${enhancementLevel}.`);
                    equipmentProgress.value = Math.max(0, enhancementLevel - currentEnhancement);
                }
            } else if (!applyProtectRune) {
                enhancementLevel = Math.max(enhancementLevel - 1, 2);
                if (interactiveEnhancement) {
                    appendEquipmentLog(`Failed! Dropped to ${enhancementLevel}.`);
                }
            } else if (enhancementLevel === 2) {
                if (hasReachedLevelTwoTwice) {
                    break;
                }
                hasReachedLevelTwoTwice = true;
                if (interactiveEnhancement) {
                    appendEquipmentLog('Failed at level 2 with protect rune active, stopping simulation.');
                }
            }

            totalGarLevels += enhanceGar;
            if (applyBoostRune) {
                boostRunesUsed += runeMultiplier;
                boostRunesDiamondCost += 5; // Add the diamond cost of the boost rune for the current simulation
            }
            if (applyProtectRune) {
                protectRunesUsed += runeMultiplier;
                protectRunesDiamondCost += 12; // Add the diamond cost of the protect rune for the current simulation
            }

            if (delay) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        if (attempts === minAttempts) {
            countOfLowestAttempts++;
        } else if (attempts < minAttempts) {
            minAttempts = attempts;
            countOfLowestAttempts = 1;
        }
        totalAttempts += attempts;
        totalBoostRunesUsed += boostRunesUsed;
        totalProtectRunesUsed += protectRunesUsed;
        totalProtectRunesDiamondCost += protectRunesDiamondCost; // Add the protect rune diamond cost of the current simulation to the total
        totalBoostRunesDiamondCost += boostRunesDiamondCost; // Add the boost rune diamond cost of the current simulation to the total
    }

    const averageGarLevel = totalGarLevels / numSimulations; // Calculate the average guarantee outside the for loop
    const diamondCostPerProtectRune = 12; // Base cost of protect rune
    const diamondCostPerBoostRune = 5; // Base cost of boost rune
    const shardsRequired = shardsPerCrystal[equipmentLevelIndex] * totalAttempts;
    const diamondsPerDollar = 1000 / 19.99;
    const protectRunesDiamondCost = totalProtectRunesUsed * diamondCostPerProtectRune;
    const boostRunesDiamondCost = totalBoostRunesUsed * diamondCostPerBoostRune;
    const totalDiamondCost = protectRunesDiamondCost + boostRunesDiamondCost;
    const averageTotalDiamondCost = totalDiamondCost / numSimulations;
    const averageDollarCost = (averageTotalDiamondCost / diamondsPerDollar).toFixed(2);
    const averageProtectRunesDiamondCost = totalProtectRunesDiamondCost / numSimulations;
    const averageBoostRunesDiamondCost = totalBoostRunesDiamondCost / numSimulations;
    const probabilityOfLowestChance = countOfLowestAttempts / numSimulations;

    //let's parse together our results
    let resultMessage = '';
    // Calculate average success guarantees for each level

    const averageGarLevels = garLevels.map((totalGar, idx) => totalGar / successfulEnhancements[idx]);
    const averageGarLevelsStr = averageGarLevels.map((avg, idx) => `L${currentEnhancement + idx + 1}: ${avg.toFixed(2)}`).join(', ');

    if (runMultipleSimulations && !interactiveEnhancement) {
        const averageAttempts = Math.round(totalAttempts / numSimulations);
        const averageShardsRequired = Math.round(shardsRequired / numSimulations);
        const averageBoostRunesUsed = Math.round(totalBoostRunesUsed / numSimulations);
        const averageProtectRunesUsed = Math.round(totalProtectRunesUsed / numSimulations);
        const averageShardsUsed = shardsPerCrystal[equipmentLevelIndex] * averageAttempts;
        resultMessage = `On average, it would take you ${averageAttempts} enhancements to go from level ${currentEnhancement} (${levelLabels[currentEnhancement - 1]}) to level ${targetEnhancement} (${levelLabels[targetEnhancement - 1]}).`;
        resultMessage += ` Average Shards required: ${averageShardsRequired}.`;
        resultMessage += ` Average guarantee success: ${averageGarLevel.toFixed(2)}.`; // Add the average
        if (boostRune) {
            resultMessage += ` Average boost rune diamond cost: ${averageBoostRunesDiamondCost.toFixed(2)} diamonds.`;
        }
        if (protectRune) {
            resultMessage += ` Average protect rune diamond cost: ${averageProtectRunesDiamondCost.toFixed(2)} diamonds.`;
        }
        if (boostRune || protectRune) {
            resultMessage += ` Total average diamond cost: ${averageTotalDiamondCost.toFixed(2)} diamonds. This costs around an average of $${averageDollarCost}.`;
        }
        resultMessage += ` Probability of lowest-chance (${minAttempts} enhancements) happening: ${(probabilityOfLowestChance * 100).toFixed(4)}%.`;
    } else {
        resultMessage = `It would take you ${totalAttempts} enhancements to go from level ${currentEnhancement} (${levelLabels[currentEnhancement - 1]}) to level ${targetEnhancement} (${levelLabels[targetEnhancement - 1]}). Shards required: ${shardsRequired}.`;
        resultMessage += ` Average guarantee levels: ${averageGarLevelsStr}.`;
        if (boostRune) {
            resultMessage += `Boost Runes used: ${totalBoostRunesUsed}. Boost runes would cost ${boostRunesDiamondCost} diamonds.`;
        }
        if (protectRune) {
            resultMessage += `Protect Runes used: ${totalProtectRunesUsed}. Protector runes would cost ${protectRunesDiamondCost} diamonds.`;
        }
        if (boostRune || protectRune) {
            resultMessage += `Total diamond cost: ${totalDiamondCost}. This costs around $${(totalDiamondCost / diamondsPerDollar).toFixed(2)}.`;
        }
    }

    // Display the result message in the result field
    document.getElementById('resultField').value = resultMessage;
});
