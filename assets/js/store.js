/**
 * Sky Realms SMP - Store JavaScript
 * Category filtering, search, and purchase CTA handling
 */

let activeCategory = 'all';
let activeSearch = '';

document.addEventListener('DOMContentLoaded', () => {
    initStoreFilters();
    initStoreSearch();
    initPurchaseButtons();
    initPreviewButtons();
    renderStoreItems();
});

function initStoreFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            activeCategory = button.getAttribute('data-category') || 'all';
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

        const matchesCategory = activeCategory === 'all' || itemCategory === activeCategory;
        const matchesSearch =
            activeSearch === '' || name.includes(activeSearch) || features.includes(activeSearch);

        if (matchesCategory && matchesSearch) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.35s ease';
            visibleCount += 1;
        } else {
            item.style.display = 'none';
        }
    });

    if (emptyState) {
        emptyState.hidden = visibleCount > 0;
    }
}

function initPurchaseButtons() {
    document.querySelectorAll('.purchase-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const item = getStoreItemDetails(button.closest('.store-item'));
            if (!item) return;
            initiatePurchase(item);
        });
    });
}

function initPreviewButtons() {
    document.querySelectorAll('.store-item-buttons .btn-secondary').forEach((button) => {
        button.addEventListener('click', () => {
            const item = getStoreItemDetails(button.closest('.store-item'));
            if (!item) return;
            openPreview(item);
        });
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

window.StoreFunctions = {
    initStoreFilters,
    renderStoreItems,
    initPreviewButtons,
    initiatePurchase
};
