/**
 * Sky Realms SMP - Store JavaScript
 * Category filter functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initStoreFilters();
});

/**
 * Initialize store category filters
 */
function initStoreFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const storeItems = document.querySelectorAll('.store-item');

    if (!filterButtons.length || !storeItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');

            // Get category
            const category = button.getAttribute('data-category');

            // Filter items
            filterStoreItems(category, storeItems);
        });
    });
}

/**
 * Filter store items by category
 * @param {string} category - Category to filter by
 * @param {NodeList} items - Store items
 */
function filterStoreItems(category, items) {
    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            // Show item
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.5s ease';
        } else {
            // Hide item
            item.style.display = 'none';
        }
    });
}

/**
 * Search store items
 * @param {string} query - Search query
 */
function searchStoreItems(query) {
    const storeItems = document.querySelectorAll('.store-item');
    const searchTerm = query.toLowerCase().trim();

    storeItems.forEach(item => {
        const name = item.querySelector('.store-item-name').textContent.toLowerCase();
        const description = item.querySelector('.store-item-description');
        
        if (name.includes(searchTerm) || (description && description.textContent.toLowerCase().includes(searchTerm))) {
            item.style.display = 'block';
        } else if (searchTerm === '') {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Add keyboard support for Enter key on store page
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('search-input')) {
            searchStoreItems(activeElement.value);
        }
    }
});

// Export functions
window.StoreFunctions = {
    initStoreFilters,
    filterStoreItems,
    searchStoreItems
};
