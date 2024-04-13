// Utility function to determine if an operation is successful based on a given chance
function isSuccess(successChance) {
    return Math.random() < successChance;
}

// Calculate the number of shards from arnebia
function calculateNumShards(arnebiaAmount, arnebiaPrice) {
    return arnebiaPrice > 0 ? Math.floor(arnebiaAmount / arnebiaPrice) : 0;
}

// Calculate gem levels from the number of shards
function calculateGemLevels(numShards, useExtraShard, ProtLevel, arnebiaPrice) {
    let gemLevels = new Array(10).fill(0);
    let leftoverShardsByLevel = new Array(10).fill(0);
    let totalShardsUsed = 0;
    let runesUsed = 0;

    gemLevels[1] = Math.floor(numShards / 4);
    leftoverShardsByLevel[1] = numShards % 4;

    for (let currentLevel = 1; currentLevel < 9; currentLevel++) {
        while (gemLevels[currentLevel] >= 3) {
            let successRate = 0.50; // Default success rate
            let isProtected = currentLevel >= ProtLevel;
            if (useExtraShard && leftoverShardsByLevel[currentLevel] > 0 && !isProtected) {
                successRate = 0.70; // Increased success rate when using an extra shard
            }
// the loop that attempts gem combinations
if (isSuccess(successRate)) {
    gemLevels[currentLevel] -= 3;
    gemLevels[currentLevel + 1] += 1;
    if (useExtraShard && leftoverShardsByLevel[currentLevel] > 0 && !isProtected) {
        leftoverShardsByLevel[currentLevel]--; // Decrementing an extra shard if used
    }
} else {
    if (!isProtected) {
        leftoverShardsByLevel[currentLevel]++; // Incrementing leftover shards if the gem shatters
        gemLevels[currentLevel]--; // Decrementing a gem as it shatters
    }
    runesUsed += isProtected ? 1 : 0;
}
        }
    }

    totalShardsUsed = numShards - leftoverShardsByLevel.reduce((a, b) => a + b, 0);

    return {
        shardsUsed: totalShardsUsed,
        totalGemCreationCost: totalShardsUsed * arnebiaPrice,
        gemLevels: gemLevels,
        leftoverShards: leftoverShardsByLevel.reduce((a, b) => a + b, 0),
    leftoverShardsByLevel: leftoverShardsByLevel,  // Make sure this is included
        runesUsed: runesUsed
    };
}

// Calculate target gem level from shards
function calculateTargetGemLevel(numShards, targetGemLevel, useExtraShard) {
    let shardsNeeded = 4;
    let level = 1;
    let totalShardsRequired = 0;

    while (level < targetGemLevel) {
        totalShardsRequired += shardsNeeded;
        let successRate = useExtraShard ? 0.70 : 0.50;
        if (isSuccess(successRate)) {
            level++;
            shardsNeeded *= 3;
        } else {
            if (useExtraShard) {
                totalShardsRequired++;
            }
        }
    }

    return totalShardsRequired;
}

// Event listeners for UI controls
document.getElementById('calcByLevel').addEventListener('change', function() {
    document.getElementById('targetGemLevelContainer').classList.remove('hidden');
    document.getElementById('numShardsContainer').classList.add('hidden');
    document.getElementById('arnebiaContainer').classList.add('hidden');
    document.getElementById('ProtLevel').setAttribute('disabled', true);
});

document.getElementById('calcByShards').addEventListener('change', function() {
    document.getElementById('targetGemLevelContainer').classList.add('hidden');
    document.getElementById('numShardsContainer').classList.remove('hidden');
    document.getElementById('arnebiaContainer').classList.add('hidden');
    document.getElementById('ProtLevel').removeAttribute('disabled');
});

document.getElementById('calcByArnebia').addEventListener('change', function() {
    document.getElementById('targetGemLevelContainer').classList.add('hidden');
    document.getElementById('numShardsContainer').classList.add('hidden');
    document.getElementById('arnebiaContainer').classList.remove('hidden');
    document.getElementById('ProtLevel').removeAttribute('disabled');
});

// Main function to handle gem enhancement process
document.getElementById('startGemEnhance').addEventListener('click', function() {
    const gemTypeElement = document.getElementById("gemType");
    const gemTypeName = gemTypeElement.options[gemTypeElement.selectedIndex].text;
    const calcByLevel = document.getElementById('calcByLevel').checked;
    const calcByShards = document.getElementById('calcByShards').checked;
    const calcByArnebia = document.getElementById('calcByArnebia').checked;
    const useExtraShard = document.getElementById('useExtraShard').checked;
    const ProtLevel = document.getElementById('ProtLevel').value === 'none' ? 100 : parseInt(document.getElementById('ProtLevel').value);
    let resultMessage = '';
    const selectedGemType = gemTypeElement.value;
    const arnebiaPrice = selectedGemType === 'none' ? 0 : parseInt(gemTypeElement.selectedOptions[0].dataset.price);

    if (gemTypeElement.value === 'none') {
        alert("Please select a valid gem type.");
        return;
    }

    let numShards = 0;
    if (calcByArnebia) {
        const arnebiaAmount = parseInt(document.getElementById('arnebiaAmount').value);
        if (isNaN(arnebiaAmount) || arnebiaAmount <= 0) {
            alert("Please enter a valid amount of arnebia greater than 0.");
            return;
        }
        numShards = calculateNumShards(arnebiaAmount, arnebiaPrice);
    } else if (calcByShards) {
        numShards = parseInt(document.getElementById('numShards').value);
        if (isNaN(numShards) || numShards <= 0) {
            alert("Please enter a valid number of shards greater than 0.");
            return;
        }
    }

    if (calcByLevel) {
        const targetGemLevel = parseInt(document.getElementById('targetGemLevel').value);
        if (isNaN(targetGemLevel) || targetGemLevel <= 0 || targetGemLevel > 9) {
            alert("Please enter a valid target gem level between 1 and 9.");
            return;
        }
        const totalShardsRequired = calculateTargetGemLevel(numShards, targetGemLevel, useExtraShard);
        resultMessage = `To create a Level ${targetGemLevel} of ${gemTypeName}, you need ${totalShardsRequired} shards.`;
    } else {
        const resultData = calculateGemLevels(numShards, useExtraShard, ProtLevel, arnebiaPrice);
        resultMessage = `You used ${resultData.shardsUsed} shards to create `;
        for (let level in resultData.gemLevels) {
            if (resultData.gemLevels[level] > 0) {
                resultMessage += `Level ${level}: ${resultData.gemLevels[level]}, `;
            }
        }
        resultMessage = resultMessage.slice(0, -2); // Remove the trailing comma and space
        resultMessage += `. You have ${resultData.leftoverShards} total leftover shards.`;
        resultMessage += " Leftover shards by level: ";
resultData.leftoverShardsByLevel.forEach((shards, index) => {
    if (index > 0 && shards > 0) {  // Ensure you only display levels with non-zero leftovers
        resultMessage += `Level ${index}: ${shards}, `;
    }
});
        resultMessage = resultMessage.slice(0, -2); 
        if (arnebiaPrice > 0) {
            const totalArnebiaCost = numShards * arnebiaPrice;
            resultMessage += ` The total arnebia cost is ${totalArnebiaCost}.`;
        }
        resultMessage += ` Runes used: ${resultData.runesUsed}`;
    }

    // Display the result
    document.getElementById('gemResultField').value = resultMessage;
});
