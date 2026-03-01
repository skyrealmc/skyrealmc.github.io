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
        } else {
            item.style.display = 'none';
        }
    });
}

function initPurchaseButtons() {
    document.querySelectorAll('.purchase-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.store-item');
            if (!card) return;

            const itemName = card.querySelector('.store-item-name')?.textContent?.trim() || 'Unknown Item';
            const priceText = card.querySelector('.store-item-price')?.textContent || '';
            const numericPrice = Number(priceText.replace(/[^0-9.]/g, '')) || 0;

            initiatePurchase(itemName, numericPrice);
        });
    });
}

/**
 * PAYMENT INTEGRATION PLACEHOLDER
 * Replace this with payment gateway logic (Stripe/Razorpay/PayPal) via backend APIs.
 */
function initiatePurchase(itemName, price) {
    alert(
        'Purchase functionality coming soon!\n\nItem: ' + itemName + '\nPrice: \u20b9' + price
    );
}

window.StoreFunctions = {
    initStoreFilters,
    renderStoreItems,
    initiatePurchase
};
