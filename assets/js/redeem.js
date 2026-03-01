/**
 * Sky Realms SMP - Redeem JavaScript
 * Code redemption functionality
 */

// ========================================
// Mock Code Data
// ========================================
const redeemCodes = [
    {
        code: "VIP2026",
        reward: "VIP Rank",
        description: "Unlocks VIP rank with /fly and 3 homes"
    },
    {
        code: "STARTER50",
        reward: "Starter Bundle",
        description: "Diamond tools + 50k in-game money"
    },
    {
        code: "MVP2026",
        reward: "MVP Rank",
        description: "Unlimited /fly, /homes, and access to /nick"
    },
    {
        code: "FREE5000",
        reward: "5000 Coins",
        description: "5000 in-game coins to get started"
    },
    {
        code: "WELCOME",
        reward: "Welcome Pack",
        description: "Starter items + 24 hour VIP trial"
    }
];

// Track used codes (client-side only - mock)
const usedCodes = new Set();

// ========================================
// DOM Elements
// ========================================
let redeemCard;
let redeemIcon;
let redeemInput;
let redeemError;
let redeemResult;
let rewardTitle;
let rewardDescription;

// ========================================
// Initialize on DOM Ready
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initRedeem();
});

function initRedeem() {
    // Get DOM elements
    redeemCard = document.getElementById('redeemCard');
    redeemIcon = document.getElementById('redeemIcon');
    redeemInput = document.getElementById('redeemCode');
    redeemError = document.getElementById('redeemError');
    redeemResult = document.getElementById('redeemResult');
    rewardTitle = document.getElementById('rewardTitle');
    rewardDescription = document.getElementById('rewardDescription');

    // Add Enter key listener
    if (redeemInput) {
        redeemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                redeemCode();
            }
        });

        // Clear error when typing
        redeemInput.addEventListener('input', () => {
            clearMessages();
        });
    }
}

/**
 * Main redeem function
 */
function redeemCode() {
    const code = redeemInput.value.trim().toUpperCase();

    // Validate input
    if (!code) {
        showError("Please enter a redeem code!");
        return;
    }

    // Check if code was already used
    if (usedCodes.has(code)) {
        showError("This code has already been redeemed!");
        return;
    }

    // Find the code in our database
    const foundCode = redeemCodes.find(c => c.code === code);

    if (foundCode) {
        // Success!
        showSuccess(foundCode);
        
        // Mark code as used (client-side mock)
        usedCodes.add(code);
        
        /**
         * DATABASE VALIDATION PLACEHOLDER
         * 
         * When connecting to backend:
         * - Send code to server for validation
         * - Check code validity and usage status
         * - Update code as used in database
         * - Add reward to user's inventory
         * 
         * Example:
         * 
         * async function validateCode(code) {
         *     const response = await fetch(`${API_BASE}/redeem/validate`, {
         *         method: 'POST',
         *         headers: {
         *             'Content-Type': 'application/json',
         *             'Authorization': `Bearer ${userToken}`
         *         },
         *         body: JSON.stringify({ code: code })
         *     });
         *     return response.json();
         * }
         */
    } else {
        // Invalid code
        showError("Invalid code! Please check and try again.");
    }
}

/**
 * Show success state
 * @param {Object} reward - Reward object
 */
function showSuccess(reward) {
    // Clear previous states
    clearMessages();

    // Update card styling
    redeemCard.classList.remove('error');
    redeemCard.classList.add('success');

    // Update icon
    redeemIcon.textContent = '🎉';

    // Show reward details
    rewardTitle.textContent = '🎉 ' + reward.reward + ' Unlocked!';
    rewardDescription.textContent = reward.description;

    // Show result
    redeemResult.classList.add('show');
    redeemError.classList.remove('show');

    // Clear input
    redeemInput.value = '';
}

/**
 * Show error state
 * @param {string} message - Error message
 */
function showError(message) {
    // Clear previous states
    clearMessages();

    // Update card styling
    redeemCard.classList.remove('success');
    redeemCard.classList.add('error');

    // Update icon
    redeemIcon.textContent = '❌';

    // Show error message
    redeemError.textContent = '❌ ' + message;
    redeemError.classList.add('show');
    redeemResult.classList.remove('show');
}

/**
 * Clear all messages and reset state
 */
function clearMessages() {
    if (redeemCard) {
        redeemCard.classList.remove('success', 'error');
    }
    if (redeemIcon) {
        redeemIcon.textContent = '🎁';
    }
    if (redeemError) {
        redeemError.classList.remove('show');
    }
    if (redeemResult) {
        redeemResult.classList.remove('show');
    }
}

/**
 * Reset the redeem form
 */
function resetForm() {
    clearMessages();
    if (redeemInput) {
        redeemInput.value = '';
        redeemInput.focus();
    }
}

// Export functions for global access
window.redeemCode = redeemCode;
window.resetForm = resetForm;

// Export for testing
window.RedeemFunctions = {
    redeemCode,
    resetForm,
    redeemCodes,
    usedCodes
};
