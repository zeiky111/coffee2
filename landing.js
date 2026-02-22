// Landing Page Animations and Interactions

// Smooth scroll function
function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Animate on scroll observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.addEventListener('DOMContentLoaded', () => {
    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach(el => observer.observe(el));
    
    // Animate stats counter
    animateStats();
    
    // Add parallax effect to hero section
    addParallaxEffect();
    
    // Add smooth reveal for cards
    addCardRevealEffect();
});

// Animate statistics counter
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-count'));
                animateCounter(target, 0, finalValue, 2000);
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => statsObserver.observe(stat));
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Parallax effect for hero section
function addParallaxEffect() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (hero) {
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    });
}

// Card reveal effect with stagger
function addCardRevealEffect() {
    const cards = document.querySelectorAll('.dashboard-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        cardObserver.observe(card);
    });
}

// Mouse move effect for gradient orbs
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = mouseX * speed;
        const y = mouseY * speed;
        
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add hover glow effect to cards
document.querySelectorAll('.dashboard-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
        }
    });
});

// Smooth page transitions
document.querySelectorAll('a[href^="http"], .dashboard-card').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.onclick) return; // Let onclick handle it
        
        e.preventDefault();
        const href = this.getAttribute('href') || this.getAttribute('onclick');
        
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease-out';
        
        setTimeout(() => {
            if (href && typeof href === 'string') {
                window.location.href = href;
            }
        }, 300);
    });
});

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add ripple effect on button click
document.querySelectorAll('.hero-btn, .btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: rippleEffect 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 9999;
        transform-origin: left;
        transition: transform 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / windowHeight);
        progressBar.style.transform = `scaleX(${scrolled})`;
        progressBar.style.width = '100%';
    });
}

addScrollProgress();

// Easter egg: Coffee cup animation on logo click
let clickCount = 0;
const logo = document.querySelector('.coffee-cup-logo');

if (logo) {
    logo.addEventListener('click', () => {
        clickCount++;
        
        if (clickCount === 5) {
            createCoffeeRain();
            clickCount = 0;
            showNotification('☕ Coffee rain activated!', 'success');
        }
    });
}

function createCoffeeRain() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const cup = document.createElement('div');
            cup.textContent = '☕';
            cup.style.cssText = `
                position: fixed;
                top: -50px;
                left: ${Math.random() * 100}vw;
                font-size: ${20 + Math.random() * 30}px;
                pointer-events: none;
                z-index: 10000;
                animation: fallCoffee ${3 + Math.random() * 2}s linear forwards;
            `;
            document.body.appendChild(cup);
            
            setTimeout(() => cup.remove(), 5000);
        }, i * 200);
    }
}

const fallAnimation = document.createElement('style');
fallAnimation.textContent = `
    @keyframes fallCoffee {
        from {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(fallAnimation);

console.log('%c☕ Brew & Bean Coffee Shop System', 'font-size: 20px; color: #6F4E37; font-weight: bold;');
console.log('%cBuilt with ❤️ and lots of coffee!', 'font-size: 14px; color: #A0826D;');
console.log('%cTip: Click the coffee cup logo 5 times for a surprise! 🎉', 'font-size: 12px; color: #D4A574;');
