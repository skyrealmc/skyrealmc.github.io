/**
 * Sky Realms SMP - Redeem JavaScript
 * Code redemption and purchase CTA handling
 */

const STORAGE_KEY = 'skyrealms-used-codes-v1';

const redeemCodes = [
    {
        code: 'VIP2026',
        reward: 'VIP Rank',
        description: 'Unlocks VIP rank with /fly and 3 homes'
    },
    {
        code: 'STARTER50',
        reward: 'Starter Bundle',
        description: 'Diamond tools + 50k in-game money'
    },
    {
        code: 'MVP2026',
        reward: 'MVP Rank',
        description: 'Unlimited /fly, /homes, and access to /nick'
    },
    {
        code: 'FREE5000',
        reward: '5000 Coins',
        description: '5000 in-game coins to get started'
    },
    {
        code: 'WELCOME',
        reward: 'Welcome Pack',
        description: 'Starter items + 24 hour VIP trial'
    }
];

const usedCodes = new Set();

let redeemCard;
let redeemIcon;
let redeemInput;
let redeemError;
let redeemResult;
let rewardTitle;
let rewardDescription;

document.addEventListener('DOMContentLoaded', () => {
    loadUsedCodes();
    initRedeem();
    initBuyCodeButtons();
});

function initRedeem() {
    redeemCard = document.getElementById('redeemCard');
    redeemIcon = document.getElementById('redeemIcon');
    redeemInput = document.getElementById('redeemCode');
    redeemError = document.getElementById('redeemError');
    redeemResult = document.getElementById('redeemResult');
    rewardTitle = document.getElementById('rewardTitle');
    rewardDescription = document.getElementById('rewardDescription');

    const redeemSubmit = document.getElementById('redeemSubmit');
    if (redeemSubmit) {
        redeemSubmit.addEventListener('click', redeemCode);
    }

    if (redeemInput) {
        redeemInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                redeemCode();
            }
        });

        redeemInput.addEventListener('input', clearMessages);
    }
}

function loadUsedCodes() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        JSON.parse(stored).forEach((code) => usedCodes.add(code));
    } catch (error) {
        console.warn('Failed to load redeemed codes from local storage', error);
    }
}

function saveUsedCodes() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(usedCodes)));
    } catch (error) {
        console.warn('Failed to save redeemed codes to local storage', error);
    }
}

function redeemCode() {
    if (!redeemInput) return;

    const code = redeemInput.value.trim().toUpperCase();

    if (!code) {
        showError('Please enter a redeem code!');
        return;
    }

    if (usedCodes.has(code)) {
        showError('This code has already been redeemed!');
        return;
    }

    const foundCode = redeemCodes.find((entry) => entry.code === code);

    if (!foundCode) {
        showError('Invalid code! Please check and try again.');
        return;
    }

    usedCodes.add(code);
    saveUsedCodes();
    showSuccess(foundCode);
}

function initBuyCodeButtons() {
    const triggers = document.querySelectorAll('.buy-code-trigger');
    triggers.forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.code-product');
            if (!card) return;

            const code = card.querySelector('.code-text')?.textContent?.trim() || 'N/A';
            const itemName = card.querySelector('.code-name')?.textContent?.trim() || 'Unknown Item';
            const priceText = card.querySelector('.code-value')?.textContent || '';
            const price = Number(priceText.replace(/[^0-9.]/g, '')) || 0;

            buyCode(code, itemName, price);
        });
    });
}

/**
 * PAYMENT INTEGRATION PLACEHOLDER
 * Replace with backend-driven payment flow.
 */
function buyCode(code, itemName, price) {
    window.SkyRealms.openSiteDialog({
        title: 'Buy Code on Discord',
        body: `
            <div class="site-dialog-hero">🎟️</div>
            <p class="site-dialog-price">₹${price}</p>
            <p class="site-dialog-copy"><strong>${itemName}</strong></p>
            <p class="site-dialog-note">Code sales are currently handled manually on Discord. Mention the showcase code <strong>${code}</strong> to staff when ordering.</p>
        `,
        actions: [
            {
                label: 'Open Discord',
                variant: 'btn-primary',
                href: window.SkyRealms.DISCORD_INVITE_URL,
                target: '_blank'
            },
            {
                label: 'Close',
                variant: 'btn-secondary',
                onClick: window.SkyRealms.closeSiteDialog
            }
        ]
    });
}

function showSuccess(reward) {
    clearMessages();

    redeemCard.classList.remove('error');
    redeemCard.classList.add('success');
    redeemIcon.textContent = '🎉';

    rewardTitle.textContent = '🎉 ' + reward.reward + ' Unlocked!';
    rewardDescription.textContent = reward.description;

    redeemResult.classList.add('show');
    redeemError.classList.remove('show');

    redeemInput.value = '';
}

function showError(message) {
    clearMessages();

    redeemCard.classList.remove('success');
    redeemCard.classList.add('error');
    redeemIcon.textContent = '❌';

    redeemError.textContent = '❌ ' + message;
    redeemError.classList.add('show');
    redeemResult.classList.remove('show');
}

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

function resetForm() {
    clearMessages();
    if (redeemInput) {
        redeemInput.value = '';
        redeemInput.focus();
    }
}

window.redeemCode = redeemCode;
window.resetForm = resetForm;
window.buyCode = buyCode;
window.RedeemFunctions = {
    redeemCode,
    resetForm,
    buyCode,
    redeemCodes,
    usedCodes
};
