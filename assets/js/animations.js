/**
 * Sky Realms SMP - Animation System
 * Canvas particles, confetti, and visual effects
 */

// ========================================
// Canvas Particle System
// ========================================

class ParticleCanvas {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.options = {
            particleCount: options.particleCount || 50,
            particleColor: options.particleColor || '#7B2FF7',
            particleSize: options.particleSize || 3,
            speed: options.speed || 0.5,
            connectDistance: options.connectDistance || 150,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                size: Math.random() * this.options.particleSize + 1
            });
        }
    }
    
    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.options.particleColor;
            this.ctx.globalAlpha = 0.6;
            this.ctx.fill();
            
            // Draw connections
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.options.connectDistance) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.options.particleColor;
                    this.ctx.globalAlpha = 0.2 * (1 - dist / this.options.connectDistance);
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// Confetti Animation
// ========================================

class Confetti {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.isActive = false;
    }
    
    start(container = document.body) {
        if (this.isActive) return;
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
        container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Create confetti particles
        const colors = ['#7B2FF7', '#A855F7', '#FACC15', '#22C55E', '#EF4444', '#3B82F6'];
        
        for (let i = 0; i < 150; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -20 - Math.random() * 100,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }
        
        this.isActive = true;
        this.animate();
        
        // Auto stop after 3 seconds
        setTimeout(() => this.stop(), 3000);
    }
    
    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.vy += 0.1; // gravity
            
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            this.ctx.fillStyle = p.color;
            
            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
            
            // Reset particle if off screen
            if (p.y > this.canvas.height) {
                p.y = -20;
                p.x = Math.random() * this.canvas.width;
                p.vy = Math.random() * 3 + 2;
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    stop() {
        this.isActive = false;
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.particles = [];
    }
}

// Global confetti instance
const confetti = new Confetti();

// ========================================
// Animation Functions
// ========================================

/**
 * Fade in animation for elements
 */
function fadeIn(element, duration = 500) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        
        element.style.opacity = progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}

/**
 * Fade out animation
 */
function fadeOut(element, duration = 500) {
    let start = null;
    const startOpacity = parseFloat(getComputedStyle(element).opacity);
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        
        element.style.opacity = startOpacity * (1 - progress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    requestAnimationFrame(animate);
}

/**
 * Slide in from direction
 */
function slideIn(element, direction = 'left', duration = 500) {
    const transforms = {
        left: { from: '-100%', to: '0%' },
        right: { from: '100%', to: '0%' },
        up: { from: '100%', to: '0%' },
        down: { from: '-100%', to: '0%' }
    };
    
    const transform = transforms[direction] || transforms.left;
    
    element.style.transition = 'none';
    element.style.transform = `translate${direction === 'up' || direction === 'down' ? 'Y' : 'X'}(${transform.from})`;
    element.style.opacity = '0';
    
    requestAnimationFrame(() => {
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        element.style.transform = `translate${direction === 'up' || direction === 'down' ? 'Y' : 'X'}(${transform.to})`;
        element.style.opacity = '1';
    });
}

/**
 * Success pulse animation
 */
function successPulse(element) {
    element.classList.add('success-pulse');
    setTimeout(() => {
        element.classList.remove('success-pulse');
    }, 2000);
}

/**
 * Error shake animation
 */
function errorShake(element) {
    element.classList.add('error-shake');
    setTimeout(() => {
        element.classList.remove('error-shake');
    }, 500);
}

/**
 * Glow burst animation
 */
function glowBurst(element) {
    element.classList.add('glow-burst');
    setTimeout(() => {
        element.classList.remove('glow-burst');
    }, 1000);
}

/**
 * Typing effect for text
 */
function typingEffect(element, text, speed = 50) {
    element.textContent = '';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    type();
}

/**
 * Number counter animation
 */
function countUp(element, end, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ========================================
// Scroll Animations
// ========================================

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.fade-in, .animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Scroll progress bar
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:3px;background:linear-gradient(90deg,#7B2FF7,#A855F7);z-index:10000;transition:width 0.1s ease;';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    }, 50));
}

// ========================================
// Export
// ========================================

window.SkyRealmsAnimations = {
    ParticleCanvas,
    confetti,
    fadeIn,
    fadeOut,
    slideIn,
    successPulse,
    errorShake,
    glowBurst,
    typingEffect,
    countUp,
    initScrollAnimations,
    initScrollProgress
};
