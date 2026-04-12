/**
 * Sky Realms SMP - Store JavaScript
 * Category filtering, search, and purchase CTA handling
 */

let activeCategory = 'ranks';
let activeSearch = '';
const RANKS_DATA_URL = '/data/ranks.json';

document.addEventListener('DOMContentLoaded', async () => {
    await loadRankCatalog();
    initStoreFilters();
    initStoreSearch();
    initStoreActions();
    renderStoreItems();
});

function initStoreFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;

    const activeButton = document.querySelector('.filter-btn.active');
    if (activeButton) {
        activeCategory = activeButton.getAttribute('data-category') || 'ranks';
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            activeCategory = button.getAttribute('data-category') || 'ranks';
            renderStoreItems();
        });
    });
}

function initStoreSearch() {
    const searchInput = document.getElementById('storeSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (event) => {
        activeSearch = event.target.value.toLowerCase().trim();
        renderStoreItems();
    });
}

function renderStoreItems() {
    const storeItems = document.querySelectorAll('.store-item');
    const emptyState = document.getElementById('storeEmptyState');
    let visibleCount = 0;

    storeItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category') || '';
        const name = item.querySelector('.store-item-name')?.textContent?.toLowerCase() || '';
        const features = Array.from(item.querySelectorAll('.store-item-features li'))
            .map((li) => li.textContent.toLowerCase())
            .join(' ');

        const matchesCategory = itemCategory === activeCategory;
        const matchesSearch =
            activeSearch === '' || name.includes(activeSearch) || features.includes(activeSearch);

        if (matchesCategory && matchesSearch) {
            item.style.display = 'block';
            item.style.animation = 'none';
            visibleCount += 1;
        } else {
            item.style.display = 'none';
        }
    });

    if (emptyState) {
        emptyState.hidden = visibleCount > 0;
    }
}

function initStoreActions() {
    const storeGrid = document.querySelector('.store-grid');
    if (!storeGrid) return;

    storeGrid.addEventListener('click', (event) => {
        const purchaseButton = event.target.closest('.purchase-btn');
        if (purchaseButton) {
            const item = getStoreItemDetails(purchaseButton.closest('.store-item'));
            if (item) {
                initiatePurchase(item);
            }
            return;
        }

        const previewButton = event.target.closest('.store-item-buttons .btn-secondary');
        if (previewButton) {
            const item = getStoreItemDetails(previewButton.closest('.store-item'));
            if (item) {
                openPreview(item);
            }
        }
    });
}

function getStoreItemDetails(card) {
    if (!card) return null;

    return {
        icon: card.querySelector('.store-item-image')?.textContent?.trim() || '✨',
        name: card.querySelector('.store-item-name')?.textContent?.trim() || 'Unknown Item',
        priceText: card.querySelector('.store-item-price')?.textContent?.trim() || '₹0',
        features: Array.from(card.querySelectorAll('.store-item-features li')).map((li) => li.textContent.trim())
    };
}

function openPreview(item) {
    window.SkyRealms.openSiteDialog({
        title: item.name,
        body: `
            <div class="site-dialog-hero">${item.icon}</div>
            <p class="site-dialog-price">${item.priceText}</p>
            <ul class="site-dialog-list">
                ${item.features.map((feature) => `<li>${feature}</li>`).join('')}
            </ul>
            <p class="site-dialog-note">Manual checkout is currently handled through Discord while automated payments are being finalized.</p>
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

/**
 * Manual checkout until backend-driven payments are added.
 */
function initiatePurchase(item) {
    window.SkyRealms.openSiteDialog({
        title: 'Complete Purchase on Discord',
        body: `
            <div class="site-dialog-hero">${item.icon}</div>
            <p class="site-dialog-price">${item.priceText}</p>
            <p class="site-dialog-copy"><strong>${item.name}</strong></p>
            <p class="site-dialog-note">Automated payments are not live yet. Open Discord and send staff the item name for manual checkout support.</p>
        `,
        actions: [
            {
                label: 'Join Discord',
                variant: 'btn-primary',
                href: window.SkyRealms.DISCORD_INVITE_URL,
                target: '_blank'
            },
            {
                label: 'Copy Server IP',
                variant: 'btn-secondary',
                onClick: () => {
                    window.SkyRealms.copyServerIP();
                    window.SkyRealms.showSiteNotice('Server IP copied to clipboard.', 'success');
                    window.SkyRealms.closeSiteDialog();
                }
            }
        ]
    });
}

async function loadRankCatalog() {
    const rankCards = await fetchRankCards();
    if (!rankCards) return;

    const storeGrid = document.querySelector('.store-grid');
    if (!storeGrid) return;

    const existingRankCards = storeGrid.querySelectorAll('.store-item[data-category="ranks"]');
    existingRankCards.forEach((card) => card.remove());

    const insertBeforeNode = storeGrid.querySelector('.store-item');
    if (insertBeforeNode) {
        storeGrid.insertBefore(rankCards, insertBeforeNode);
    } else {
        storeGrid.appendChild(rankCards);
    }
}

async function fetchRankCards() {
    try {
        const response = await fetch(RANKS_DATA_URL, { cache: 'no-store' });
        if (!response.ok) {
            console.warn(`Unable to load ${RANKS_DATA_URL}: ${response.status}`);
            return null;
        }

        const payload = await response.json();
        if (!payload || !Array.isArray(payload.ranks) || payload.ranks.length === 0) {
            console.warn(`Invalid rank catalog format in ${RANKS_DATA_URL}`);
            return null;
        }

        const fragment = document.createDocumentFragment();
        payload.ranks.forEach((rank) => {
            if (!isValidRank(rank)) return;
            fragment.appendChild(buildRankCard(rank));
        });
        return fragment;
    } catch (error) {
        console.warn(`Rank catalog fetch failed (${RANKS_DATA_URL}). Using HTML fallback.`, error);
        return null;
    }
}

function isValidRank(rank) {
    return (
        rank &&
        typeof rank.name === 'string' &&
        typeof rank.icon === 'string' &&
        (typeof rank.price === 'number' || typeof rank.price === 'string') &&
        Array.isArray(rank.perks) &&
        rank.perks.length > 0
    );
}

function buildRankCard(rank) {
    const card = document.createElement('div');
    const highlightClass = rank.highlight === 'popular'
        ? ' store-item--popular'
        : rank.highlight === 'ultimate'
            ? ' store-item--ultimate'
            : '';
    card.className = `store-item${highlightClass}`;
    card.setAttribute('data-category', 'ranks');

    const badgeMarkup = rank.badge
        ? `<span class="store-item-badge${rank.highlight === 'ultimate' ? ' store-item-badge--ultimate' : ''}">${escapeHtml(rank.badge)}</span>`
        : '';

    card.innerHTML = `
        <div class="store-item-image">${escapeHtml(rank.icon)}</div>
        <div class="store-item-content">
            ${badgeMarkup}
            <h3 class="store-item-name">${escapeHtml(rank.name)} Rank</h3>
            <div class="store-item-plan">${escapeHtml(rank.planLabel || 'Monthly Plan')}</div>
            <div class="store-item-price">₹${formatPrice(rank.price)}/month</div>
            <ul class="store-item-features">
                ${rank.perks.map((perk) => `<li>${escapeHtml(perk)}</li>`).join('')}
            </ul>
            <div class="store-item-buttons">
                <button class="btn btn-yellow btn-small purchase-btn" type="button">Buy Now</button>
                <button class="btn btn-secondary btn-small" type="button">Preview</button>
            </div>
        </div>
    `;

    return card;
}

function formatPrice(price) {
    const numericPrice = Number(price);
    if (!Number.isNaN(numericPrice)) {
        return numericPrice.toLocaleString('en-IN');
    }
    return String(price);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

window.StoreFunctions = {
    initStoreFilters,
    renderStoreItems,
    initStoreActions,
    loadRankCatalog,
    initiatePurchase
};
