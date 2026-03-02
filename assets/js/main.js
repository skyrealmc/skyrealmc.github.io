/**
 * Sky Realms SMP - Main JavaScript
 * Shared functionality across all pages
 */

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
    const serverIP = 'play.skyrealm.fun';
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
        textArea.value = serverIP;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        onCopied();
    };

    // Copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(serverIP).then(onCopied).catch(fallbackCopy);
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
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 15, 26, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(139, 92, 246, 0.2)';
            } else {
                navbar.style.background = 'rgba(15, 15, 26, 0.9)';
                navbar.style.boxShadow = 'none';
            }
        });
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
    const launchDate = new Date('2026-04-01T00:00:00');

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
    copyServerIP,
    initScrollAnimations,
    initNavbarScroll,
    initLaunchCountdown
};
