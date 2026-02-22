// Landing Page Enhanced Animations

function enterDashboard() {
    // Fade out animation
    document.body.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}

// Smooth scroll with enhanced easing
function smoothScrollTo(element) {
    element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Enhanced intersection observer
const enhancedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
});

document.addEventListener('DOMContentLoaded', () => {
    // Page load animation
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Observe all animated elements
    observeElements();
    
    // Animate stats
    animateStatsLanding();
    
    // Feature cards animation
    animateFeatureCards();
    
    // Parallax effects
    setupParallax();
    
    // Mouse effects
    setupMouseEffects();
    
    // CTA particles
    setupCTAParticles();
});

function observeElements() {
    const elements = document.querySelectorAll('[data-aos], .feature-card-preview, .benefit-item');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.95)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        enhancedObserver.observe(el);
    });
}

function animateStatsLanding() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.stat-number-large');
                numbers.forEach(num => {
                    const target = parseInt(num.getAttribute('data-count'));
                    animateNumber(num, 0, target, 2500);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-section-landing');
    if (statsSection) observer.observe(statsSection);
}

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 20);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 20);
}

function animateFeatureCards() {
    const cards = document.querySelectorAll('.feature-card-preview');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) rotateX(0)';
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(60px) rotateX(-15deg)';
        card.style.transition = 'all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)';
        observer.observe(card);
    });
}

function setupParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Hero parallax
                const hero = document.querySelector('.hero-section');
                if (hero) {
                    hero.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
                    hero.style.opacity = 1 - (scrolled / 600);
                }
                
                // Orbs parallax
                const orbs = document.querySelectorAll('.gradient-orb');
                orbs.forEach((orb, i) => {
                    const speed = 0.1 + (i * 0.05);
                    orb.style.transform = `translate(${scrolled * speed}px, ${scrolled * speed * 0.5}px)`;
                });
                
                // Floating elements
                const floating = document.querySelectorAll('.floating-cup');
                floating.forEach((el, i) => {
                    const speed = 0.05 + (i * 0.02);
                    el.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

function setupMouseEffects() {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
    });
    
    function updateOrbs() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        const orbs = document.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 30;
            const x = currentX * speed;
            const y = currentY * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        requestAnimationFrame(updateOrbs);
    }
    
    updateOrbs();
    
    // Card tilt effect
    document.querySelectorAll('.feature-card-preview').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const tiltX = (y - 0.5) * -10;
            const tiltY = (x - 0.5) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
            
            const shine = card.querySelector('.feature-shine');
            if (shine) {
                shine.style.left = `${x * 100}%`;
                shine.style.top = `${y * 100}%`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

function setupCTAParticles() {
    const button = document.querySelector('.cta-button');
    if (!button) return;
    
    button.addEventListener('mouseenter', () => {
        const particles = button.querySelector('.cta-particles');
        if (particles) {
            particles.style.animation = 'particleFloat 2s ease-in-out infinite';
        }
    });
}

// Scroll progress bar
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress-bar';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / windowHeight);
    progressBar.style.transform = `scaleX(${scrolled})`;
});

// Add ripple effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 800);
    });
});

// Easter egg - coffee logo click
let logoClicks = 0;
const logo = document.querySelector('.coffee-cup-logo-large');
if (logo) {
    logo.addEventListener('click', () => {
        logoClicks++;
        logo.style.animation = 'none';
        setTimeout(() => {
            logo.style.animation = 'bounceRotate 3s ease-in-out infinite';
        }, 10);
        
        if (logoClicks === 5) {
            createCoffeeExplosion();
            logoClicks = 0;
        }
    });
}

function createCoffeeExplosion() {
    const emojis = ['☕', '🥐', '🍰', '🧁', '🥤', '✨'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.className = 'coffee-explosion';
            emoji.style.left = '50%';
            emoji.style.top = '30%';
            emoji.style.setProperty('--angle', Math.random() * 360 + 'deg');
            emoji.style.setProperty('--distance', (200 + Math.random() * 200) + 'px');
            document.body.appendChild(emoji);
            setTimeout(() => emoji.remove(), 2000);
        }, i * 50);
    }
}

console.log('%c☕ Welcome to Brew & Bean!', 'font-size: 24px; color: #6F4E37; font-weight: bold;');
console.log('%cClick the coffee cup 5 times for magic! ✨', 'font-size: 14px; color: #D4A574;');
