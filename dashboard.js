// Dashboard Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Page entry animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'all 0.6s ease-out';
        document.body.style.opacity = '1';
    }, 100);
    
    // Load dashboard stats
    updateDashboardStats();
    animateStatCards();
    
    // Animate cards on load
    animateDashboardCards();
    
    // Setup card interactions
    setupCardInteractions();
});

function updateDashboardStats() {
    const orders = getOrders();
    const tables = getTables();
    const menuItems = getMenuItems();
    
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.timestamp).toDateString() === today);
    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
    const availableTables = tables.filter(t => t.status === 'available');
    
    // Animate stats
    animateStatValue('todayOrders', todayOrders.length);
    animateStatValue('activeOrders', activeOrders.length);
    animateStatValue('availableTables', availableTables.length);
    animateStatValue('menuItems', menuItems.length);
}

function animateStatValue(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = targetValue / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 30);
}

function animateDashboardCards() {
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.9)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 100 + 300);
    });
}

function animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card-dash');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        const icon = card.querySelector('.stat-icon');
        if (icon) {
            icon.style.animationDelay = `${index * 0.4}s`;
        }

        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 80 + 150);
    });
}

function setupCardInteractions() {
    const cards = document.querySelectorAll('.dashboard-card');
    
    cards.forEach(card => {
        // 3D tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const tiltX = (y - 0.5) * -8;
            const tiltY = (x - 0.5) * 8;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${tiltX}deg)
                rotateY(${tiltY}deg)
                translateY(-10px)
                scale(1.03)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
        
        // Click animation
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Refresh stats periodically
setInterval(updateDashboardStats, 30000);
