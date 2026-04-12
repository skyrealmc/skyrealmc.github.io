/**
 * Sky Realms SMP - Main JavaScript
 * Shared functionality across all pages
 */

// ========================================
// Site Constants
// ========================================
const SERVER_IP = 'play.skyrealm.fun';
const DISCORD_INVITE_URL = 'https://discord.gg/tXW3Aj9wQh';
const LAUNCH_DATE_UTC = '2026-04-01T00:00:00Z';
let activeDialogEscapeHandler = null;

// ========================================
// DOM Elements
// ========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// ========================================
// Mobile Navigation (Hamburger Menu)
// ========================================
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// ========================================
// Copy Server IP Functionality
// ========================================
function copyServerIP() {
    const copyBtn = document.getElementById('copyIP');
    
    const onCopied = () => {
        // Visual feedback
        if (copyBtn) {
            copyBtn.classList.add('copied');
            copyBtn.querySelector('span:first-child').textContent = 'Copied!';
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.querySelector('span:first-child').textContent = 'Copy IP';
            }, 2000);
        }
    };

    const fallbackCopy = () => {
        const textArea = document.createElement('textarea');
        textArea.value = SERVER_IP;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        onCopied();
    };

    // Copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SERVER_IP).then(onCopied).catch(fallbackCopy);
        return;
    }

    fallbackCopy();
}

// ========================================
// Scroll Animations (Fade In on Scroll)
// ========================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const selector = this.getAttribute('href');
        if (!selector || selector === '#') return;
        const target = document.querySelector(selector);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// Navbar Background on Scroll
// ========================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const isScrolled = window.scrollY > 50;
                navbar.style.background = isScrolled ? 'rgba(15, 15, 26, 0.95)' : 'rgba(15, 15, 26, 0.9)';
                navbar.style.boxShadow = isScrolled ? '0 2px 20px rgba(139, 92, 246, 0.2)' : 'none';
                ticking = false;
            });
        }, { passive: true });
    }
}

// ========================================
// Launch Countdown (Home Page)
// ========================================
function initLaunchCountdown() {
    const countdownCard = document.getElementById('launchCountdownCard');
    if (!countdownCard) return;

    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minutesEl = document.getElementById('countMinutes');
    const secondsEl = document.getElementById('countSeconds');
    const grid = document.getElementById('launchCountdownGrid');
    const liveText = document.getElementById('launchLiveText');
    const label = document.getElementById('launchCountdownLabel');
    const launchDate = new Date(LAUNCH_DATE_UTC);

    if (label) {
        label.textContent = 'Server Launch: April 1, 2026 at 00:00 UTC';
    }

    const pad = (value) => String(value).padStart(2, '0');

    const update = () => {
        const now = new Date();
        const diff = launchDate.getTime() - now.getTime();

        if (diff <= 0) {
            if (grid) {
                grid.hidden = true;
            }
            if (liveText) {
                liveText.hidden = false;
            }
            return true;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (daysEl) daysEl.textContent = pad(days);
        if (hoursEl) hoursEl.textContent = pad(hours);
        if (minutesEl) minutesEl.textContent = pad(minutes);
        if (secondsEl) secondsEl.textContent = pad(seconds);
        return false;
    };

    if (update()) return;

    const timer = setInterval(() => {
        if (update()) {
            clearInterval(timer);
        }
    }, 1000);
}

// ========================================
// Shared Notice System
// ========================================
function getNoticeContainer() {
    let container = document.getElementById('siteNoticeContainer');
    if (container) return container;

    container = document.createElement('div');
    container.id = 'siteNoticeContainer';
    container.className = 'site-notice-container';
    document.body.appendChild(container);
    return container;
}

function showSiteNotice(message, type = 'info') {
    const container = getNoticeContainer();
    const notice = document.createElement('div');
    notice.className = `site-notice site-notice-${type}`;
    notice.textContent = message;
    container.appendChild(notice);

    window.setTimeout(() => {
        notice.classList.add('is-hiding');
        window.setTimeout(() => notice.remove(), 250);
    }, 3200);
}

// ========================================
// Shared Dialog System
// ========================================
function closeSiteDialog() {
    document.getElementById('siteDialogOverlay')?.remove();
    document.body.classList.remove('dialog-open');
    if (activeDialogEscapeHandler) {
        document.removeEventListener('keydown', activeDialogEscapeHandler);
        activeDialogEscapeHandler = null;
    }
}

function openSiteDialog({ title = '', body = '', actions = [] }) {
    closeSiteDialog();

    const overlay = document.createElement('div');
    overlay.id = 'siteDialogOverlay';
    overlay.className = 'site-dialog-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'site-dialog';

    const header = document.createElement('div');
    header.className = 'site-dialog-header';

    const titleEl = document.createElement('h3');
    titleEl.className = 'site-dialog-title';
    titleEl.textContent = title;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'site-dialog-close';
    closeBtn.setAttribute('aria-label', 'Close dialog');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', closeSiteDialog);

    header.appendChild(titleEl);
    header.appendChild(closeBtn);

    const bodyEl = document.createElement('div');
    bodyEl.className = 'site-dialog-body';
    bodyEl.innerHTML = body;

    const actionsEl = document.createElement('div');
    actionsEl.className = 'site-dialog-actions';

    actions.forEach((action) => {
        const button = action.href ? document.createElement('a') : document.createElement('button');
        if (action.href) {
            button.href = action.href;
            button.target = action.target || '_self';
            if (action.target === '_blank') {
                button.rel = 'noopener noreferrer';
            }
        } else {
            button.type = 'button';
            button.addEventListener('click', () => {
                action.onClick?.();
            });
        }

        button.className = `btn ${action.variant || 'btn-secondary'}`;
        button.textContent = action.label;
        actionsEl.appendChild(button);
    });

    dialog.appendChild(header);
    dialog.appendChild(bodyEl);
    if (actions.length) {
        dialog.appendChild(actionsEl);
    }

    overlay.appendChild(dialog);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeSiteDialog();
        }
    });

    activeDialogEscapeHandler = function onEscape(event) {
        if (event.key === 'Escape') {
            closeSiteDialog();
        }
    };
    document.addEventListener('keydown', activeDialogEscapeHandler);

    document.body.appendChild(overlay);
    document.body.classList.add('dialog-open');
}

// ========================================
// Initialize All Functions
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.getElementById('copyIP');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyServerIP);
    }
    initScrollAnimations();
    initNavbarScroll();
    initLaunchCountdown();
});

// ========================================
// Future Integration Functions
// ========================================

/**
 * DATABASE VALIDATION PLACEHOLDER
 * 
 * When connecting to backend:
 * - Create API service for user authentication
 * - Implement token-based auth
 * - Add request/response interceptors
 * - Handle session management
 * 
 * Example structure:
 * 
 * const API_BASE = 'https://api.skyrealm.fun';
 * 
 * async function validateUser(token) {
 *     const response = await fetch(`${API_BASE}/auth/validate`, {
 *         headers: {
 *             'Authorization': `Bearer ${token}`
 *         }
 *     });
 *     return response.json();
 * }
 */

/**
 * USER DASHBOARD FUTURE
 * 
 * When implementing user dashboard:
 * - User profile management
 * - Purchase history view
 * - Active subscriptions
 * - Account settings
 * - Security settings (2FA)
 * 
 * Example:
 * 
 * function loadUserDashboard() {
 *     const userData = await fetchUserData();
 *     renderDashboard(userData);
 * }
 */

// Export functions for use in other scripts
window.SkyRealms = {
    SERVER_IP,
    DISCORD_INVITE_URL,
    copyServerIP,
    initScrollAnimations,
    initNavbarScroll,
    initLaunchCountdown,
    showSiteNotice,
    openSiteDialog,
    closeSiteDialog
};
