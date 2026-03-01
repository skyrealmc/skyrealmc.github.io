/**
 * Sky Realms SMP - Utility Functions
 * Common helper functions used across the website
 */

// ========================================
// DOM Utilities
// ========================================

/**
 * Cache DOM elements for performance
 */
const DOMCache = {};
function getElement(selector) {
    if (!DOMCache[selector]) {
        DOMCache[selector] = document.querySelector(selector);
    }
    return DOMCache[selector];
}

function getAllElements(selector) {
    return document.querySelectorAll(selector);
}

// ========================================
// Event Utilities
// ========================================

/**
 * Add event listener with automatic cleanup
 */
function on(element, event, handler, options) {
    if (element) {
        element.addEventListener(event, handler, options);
    }
}

/**
 * Delegate event handling
 */
function delegate(parent, selector, event, handler) {
    parent.addEventListener(event, function(e) {
        const target = e.target.closest(selector);
        if (target && parent.contains(target)) {
            handler.call(target, e);
        }
    });
}

// ========================================
// Debounce Function
// ========================================

/**
 * Debounce function for search and scroll events
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// Throttle Function
// ========================================

/**
 * Throttle function for scroll events
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// Local Storage Helpers
// ========================================

/**
 * Save data to localStorage
 */
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.warn('LocalStorage not available:', e);
        return false;
    }
}

/**
 * Load data from localStorage
 */
function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.warn('LocalStorage not available:', e);
        return null;
    }
}

// ========================================
// Random Utilities
// ========================================

/**
 * Generate random ID
 */
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate random number in range
 */
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ========================================
// String Utilities
// ========================================

/**
 * Capitalize first letter
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format price to INR
 */
function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

/**
 * Mask code for display
 */
function maskCode(code, visibleChars = 3) {
    if (!code || code.length <= visibleChars) return code;
    const visible = code.slice(0, visibleChars);
    const masked = '*'.repeat(code.length - visibleChars);
    return visible + masked;
}

// ========================================
// Date/Time Utilities
// ========================================

/**
 * Format date to readable string
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Get time ago string
 */
function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    return 'Just now';
}

// ========================================
// Validation Utilities
// ========================================

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate redeem code format
 */
function isValidCodeFormat(code) {
    const codeRegex = /^[A-Z0-9]{4,20}$/;
    return codeRegex.test(code.toUpperCase());
}

// ========================================
// Cookie Utilities (Placeholder)
// ========================================

/**
 * CSRF Token placeholder for future backend integration
 */
const CSRF_TOKEN = {
    get: () => {
        // Future: Retrieve from server
        return 'csrf_placeholder_' + Date.now();
    },
    validate: (token) => {
        // Future: Validate with server
        return token && token.startsWith('csrf_');
    }
};

// ========================================
// Rate Limiting (Mock)
// ========================================

/**
 * Rate limit mock for API calls
 */
const RateLimiter = {
    attempts: {},
    
    // Check if action is allowed
    canPerform(action, maxAttempts = 5, windowMs = 60000) {
        const now = Date.now();
        const key = `${action}_${Math.floor(now / windowMs)}`;
        
        if (!this.attempts[key]) {
            this.attempts[key] = 0;
        }
        
        if (this.attempts[key] >= maxAttempts) {
            return false;
        }
        
        this.attempts[key]++;
        return true;
    },
    
    // Get remaining attempts
    getRemaining(action, maxAttempts = 5, windowMs = 60000) {
        const now = Date.now();
        const key = `${action}_${Math.floor(now / windowMs)}`;
        const attempts = this.attempts[key] || 0;
        return Math.max(0, maxAttempts - attempts);
    },
    
    // Reset attempts
    reset(action) {
        Object.keys(this.attempts).forEach(key => {
            if (key.startsWith(action)) {
                delete this.attempts[key];
            }
        });
    }
};

// Export utilities
window.SkyRealmsUtils = {
    getElement,
    getAllElements,
    on,
    delegate,
    debounce,
    throttle,
    saveToStorage,
    loadFromStorage,
    generateId,
    randomInRange,
    capitalize,
    formatPrice,
    maskCode,
    formatDate,
    timeAgo,
    isValidEmail,
    isValidCodeFormat,
    CSRF_TOKEN,
    RateLimiter
};
