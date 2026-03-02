/**
 * Sky Realms SMP - UI Components
 * Modals, toasts, navbar, footer, and interactive UI elements
 */

// ========================================
// Toast Notification System
// ========================================

class Toast {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        // Create container if not exists
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:10px;';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    }
    
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        
        const colors = {
            success: '#22C55E',
            error: '#EF4444',
            warning: '#FACC15',
            info: '#7B2FF7'
        };
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.style.cssText = `
            background:${colors[type] || colors.info};
            color:#fff;
            padding:12px 20px;
            border-radius:8px;
            box-shadow:0 4px 12px rgba(0,0,0,0.3);
            display:flex;
            align-items:center;
            gap:10px;
            animation:slideInRight 0.3s ease;
            min-width:200px;
            font-weight:500;
        `;
        
        toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
        this.container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    success(message) { this.show(message, 'success'); }
    error(message) { this.show(message, 'error'); }
    warning(message) { this.show(message, 'warning'); }
    info(message) { this.show(message, 'info'); }
}

const toast = new Toast();

// ========================================
// Modal System
// ========================================

class Modal {
    constructor(options = {}) {
        this.options = {
            closeOnOverlay: true,
            closeOnEscape: true,
            ...options
        };
        this.activeModal = null;
    }
    
    open(content, title = '') {
        // Remove existing modal
        this.close();
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'modal-overlay';
        overlay.style.cssText = `
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            background:rgba(0,0,0,0.7);
            backdrop-filter:blur(5px);
            z-index:9998;
            display:flex;
            align-items:center;
            justify-content:center;
            animation:fadeIn 0.3s ease;
        `;
        
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'modal-content';
        modal.style.cssText = `
            background:#1A1A2E;
            border-radius:16px;
            padding:30px;
            max-width:500px;
            width:90%;
            max-height:90vh;
            overflow-y:auto;
            position:relative;
            border:2px solid rgba(123,47,247,0.3);
            box-shadow:0 0 30px rgba(123,47,247,0.3);
            animation:modalSlideIn 0.3s ease;
        `;
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position:absolute;
            top:15px;
            right:15px;
            background:none;
            border:none;
            color:#A1A1AA;
            font-size:24px;
            cursor:pointer;
            transition:color 0.3s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.color = '#fff';
        closeBtn.onmouseout = () => closeBtn.style.color = '#A1A1AA';
        closeBtn.onclick = () => this.close();
        
        modal.innerHTML = `
            ${title ? `<h2 style="color:#7B2FF7;margin-bottom:20px;font-family:Orbitron;">${title}</h2>` : ''}
            ${content}
        `;
        modal.insertBefore(closeBtn, modal.firstChild);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        this.activeModal = overlay;
        
        // Event listeners
        if (this.options.closeOnOverlay) {
            overlay.onclick = (e) => {
                if (e.target === overlay) this.close();
            };
        }
        
        if (this.options.closeOnEscape) {
            this.escapeHandler = (e) => {
                if (e.key === 'Escape') this.close();
            };
            document.addEventListener('keydown', this.escapeHandler);
        }
        
        return modal;
    }
    
    close() {
        if (this.activeModal) {
            this.activeModal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                this.activeModal.remove();
                this.activeModal = null;
                document.body.style.overflow = '';
            }, 300);
        }
        
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
        }
    }
    
    // Pre-built modals
    showItemPreview(item) {
        const content = `
            <div style="text-align:center;">
                <div style="font-size:60px;margin-bottom:15px;">${item.icon}</div>
                <h3 style="color:#fff;margin-bottom:10px;">${item.name}</h3>
                <p style="color:#FACC15;font-size:24px;font-weight:bold;margin-bottom:20px;">₹${item.price}</p>
                <ul style="text-align:left;color:#A1A1AA;margin-bottom:20px;">
                    ${item.features.map(f => `<li style="padding:5px 0;">✓ ${f}</li>`).join('')}
                </ul>
                <button class="btn btn-yellow" style="width:100%;" onclick="checkoutModal.open(${JSON.stringify(item).replace(/"/g, '"')})">
                    Proceed to Payment
                </button>
            </div>
        `;
        return this.open(content, 'Item Preview');
    }
    
    showCheckout(item) {
        const content = `
            <div style="text-align:center;">
                <div style="font-size:50px;margin-bottom:15px;">${item.icon}</div>
                <h3 style="color:#fff;margin-bottom:10px;">${item.name}</h3>
                <p style="color:#FACC15;font-size:28px;font-weight:bold;margin:20px 0;">₹${item.price}</p>
                <div style="background:rgba(0,0,0,0.3);padding:15px;border-radius:8px;margin:20px 0;text-align:left;">
                    <p style="color:#A1A1AA;font-size:14px;">Order Summary:</p>
                    <p style="color:#fff;">${item.name}</p>
                    <p style="color:#22C55E;">Instant Delivery</p>
                </div>
                
                <!-- PAYMENT API INTEGRATION PLACEHOLDER -->
                <button class="btn btn-primary" style="width:100%;margin-bottom:10px;" onclick="alert('Payment integration coming soon!');">
                    Pay with Card/UPI
                </button>
                <p style="color:#A1A1AA;font-size:12px;margin-top:15px;">
                    This is a demo. No real payment will be processed.
                </p>
            </div>
        `;
        return this.open(content, 'Checkout');
    }
}

const modal = new Modal();
const checkoutModal = new Modal();

// ========================================
// Navbar Component
// ========================================

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (!navbar || !hamburger || !navLinks) return;
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(15,15,26,0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(123,47,247,0.3)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'rgba(15,15,26,0.9)';
            navbar.style.boxShadow = 'none';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Add overlay
        const existingOverlay = document.getElementById('mobile-overlay');
        if (navLinks.classList.contains('active')) {
            if (!existingOverlay) {
                const overlay = document.createElement('div');
                overlay.id = 'mobile-overlay';
                overlay.style.cssText = `
                    position:fixed;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                    background:rgba(0,0,0,0.5);
                    z-index:999;
                `;
                overlay.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    overlay.remove();
                });
                document.body.appendChild(overlay);
            }
        } else {
            existingOverlay?.remove();
        }
    });
    
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.getElementById('mobile-overlay')?.remove();
        });
    });
    
    // Active page indicator
    const path = window.location.pathname;
    const currentPage =
        path === '/' ? '/' :
        path.endsWith('/') ? path :
        path.substring(path.lastIndexOf('/') + 1);
    navLinks.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// ========================================
// Footer Component
// ========================================

function initFooter() {
    // Check if footer already exists
    const existingFooter = document.querySelector('.footer');
    if (existingFooter) return;
    
    // Get the main content wrapper
    const main = document.querySelector('main') || document.querySelector('.section') || document.body;
    
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-logo">Sky Realms SMP</div>
            <div class="footer-links">
                <a href="/">Home</a>
                <a href="/store/">Store</a>
                <a href="/redeem/">Redeem</a>
                <a href="/rules/">Rules</a>
            </div>
            <div class="footer-social">
                <a href="https://discord.gg/" target="_blank" class="social-link" title="Discord">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                </a>
                <a href="https://youtube.com/" target="_blank" class="social-link" title="YouTube">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                </a>
            </div>
            <div class="footer-legal">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </div>
            <p class="footer-copyright">© 2026 Sky Realms SMP. All rights reserved.</p>
        </div>
    `;
    
    document.body.appendChild(footer);
}

// ========================================
// Online Status Badge
// ========================================

function initOnlineStatus() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const statusBadge = document.createElement('div');
    statusBadge.id = 'online-status';
    statusBadge.style.cssText = `
        position:absolute;
        top:100px;
        right:20px;
        background:rgba(26,26,46,0.9);
        padding:10px 20px;
        border-radius:20px;
        display:flex;
        align-items:center;
        gap:8px;
        font-size:14px;
        border:1px solid rgba(123,47,247,0.3);
    `;
    
    const dot = document.createElement('span');
    dot.style.cssText = `
        width:10px;
        height:10px;
        background:#22C55E;
        border-radius:50%;
        animation:pulse 2s infinite;
    `;
    
    statusBadge.appendChild(dot);
    statusBadge.appendChild(document.createTextNode('Online: 42/100'));
    hero.appendChild(statusBadge);
}

// ========================================
// 3D Tilt Effect for Cards
// ========================================

function initTiltCards() {
    const cards = document.querySelectorAll('.store-item, .code-product');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ========================================
// Button Ripple Effect
// ========================================

function initRippleButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position:absolute;
                background:rgba(255,255,255,0.3);
                border-radius:50%;
                pointer-events:none;
                width:100px;
                height:100px;
                transform:translate(-50%,-50%) scale(0);
                animation:ripple 0.6s ease-out;
            `;
            
            const rect = btn.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ========================================
// Initialize All UI Components
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initFooter();
    initOnlineStatus();
    initTiltCards();
    initRippleButtons();
});

// Export UI components
window.SkyRealmsUI = {
    toast,
    modal,
    checkoutModal,
    initNavbar,
    initFooter,
    initOnlineStatus,
    initTiltCards,
    initRippleButtons
};
