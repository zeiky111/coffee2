// Global navigation function
function navigateTo(page) {
    window.location.href = page;
}

// Initialize default menu data if not exists
function initializeDefaultData() {
    if (!localStorage.getItem('menuCategories')) {
        const defaultCategories = [
            { id: 1, name: 'Hot Coffee', icon: '☕' },
            { id: 2, name: 'Cold Coffee', icon: '🧊' },
            { id: 3, name: 'Tea', icon: '🍵' },
            { id: 4, name: 'Pastries', icon: '🥐' },
            { id: 5, name: 'Sandwiches', icon: '🥪' }
        ];
        localStorage.setItem('menuCategories', JSON.stringify(defaultCategories));
    }

    if (!localStorage.getItem('menuItems')) {
        const defaultItems = [
            // Hot Coffee
            { id: 1, name: 'Espresso', category: 1, price: 95, description: 'Strong and bold espresso shot', available: true },
            { id: 2, name: 'Americano', category: 1, price: 110, description: 'Espresso with hot water', available: true },
            { id: 3, name: 'Cappuccino', category: 1, price: 135, description: 'Espresso with steamed milk and foam', available: true },
            { id: 4, name: 'Caffe Latte', category: 1, price: 145, description: 'Espresso with steamed milk', available: true },
            { id: 5, name: 'Caramel Macchiato', category: 1, price: 165, description: 'Espresso with vanilla, steamed milk, and caramel drizzle', available: true },
            { id: 6, name: 'Mocha', category: 1, price: 155, description: 'Espresso with chocolate and steamed milk', available: true },
            
            // Cold Coffee
            { id: 7, name: 'Iced Americano', category: 2, price: 120, description: 'Chilled espresso with cold water', available: true },
            { id: 8, name: 'Iced Latte', category: 2, price: 155, description: 'Espresso with cold milk over ice', available: true },
            { id: 9, name: 'Iced Caramel Macchiato', category: 2, price: 175, description: 'Cold version of caramel macchiato', available: true },
            { id: 10, name: 'Cold Brew', category: 2, price: 145, description: 'Smooth cold-steeped coffee', available: true },
            { id: 11, name: 'Frappe', category: 2, price: 165, description: 'Blended iced coffee with whipped cream', available: true },
            
            // Tea
            { id: 12, name: 'English Breakfast Tea', category: 3, price: 85, description: 'Classic black tea', available: true },
            { id: 13, name: 'Green Tea', category: 3, price: 85, description: 'Healthy green tea', available: true },
            { id: 14, name: 'Chamomile Tea', category: 3, price: 90, description: 'Calming herbal tea', available: true },
            { id: 15, name: 'Milk Tea', category: 3, price: 115, description: 'Tea with milk', available: true },
            
            // Pastries
            { id: 16, name: 'Croissant', category: 4, price: 95, description: 'Buttery flaky pastry', available: true },
            { id: 17, name: 'Chocolate Muffin', category: 4, price: 85, description: 'Rich chocolate muffin', available: true },
            { id: 18, name: 'Blueberry Scone', category: 4, price: 90, description: 'Fresh blueberry scone', available: true },
            { id: 19, name: 'Cinnamon Roll', category: 4, price: 105, description: 'Sweet cinnamon roll with icing', available: true },
            
            // Sandwiches
            { id: 20, name: 'Ham & Cheese', category: 5, price: 145, description: 'Classic ham and cheese sandwich', available: true },
            { id: 21, name: 'Tuna Melt', category: 5, price: 155, description: 'Tuna with melted cheese', available: true },
            { id: 22, name: 'Club Sandwich', category: 5, price: 175, description: 'Triple decker with chicken, bacon, and veggies', available: true }
        ];
        localStorage.setItem('menuItems', JSON.stringify(defaultItems));
    }

    // Initialize tables
    if (!localStorage.getItem('tables')) {
        const tables = [];
        for (let i = 1; i <= 12; i++) {
            tables.push({
                number: i,
                status: 'available',
                customerName: '',
                guestCount: 0,
                notes: ''
            });
        }
        localStorage.setItem('tables', JSON.stringify(tables));
    }

    // Initialize orders array
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }

    // Initialize settings
    if (!localStorage.getItem('settings')) {
        const settings = {
            shopName: 'Brew & Bean',
            tableCount: 12,
            taxRate: 0
        };
        localStorage.setItem('settings', JSON.stringify(settings));
    }
}

// Generate unique order number
function generateOrderNumber() {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    return `ORD${timestamp}`;
}

// Generate receipt number
function generateReceiptNumber() {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    return `RCP${timestamp}`;
}

// Format currency
function formatCurrency(amount) {
    return `₱${parseFloat(amount).toFixed(2)}`;
}

// Format date/time
function formatDateTime(date) {
    return new Date(date).toLocaleString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get data from localStorage
function getMenuCategories() {
    return JSON.parse(localStorage.getItem('menuCategories')) || [];
}

function getMenuItems() {
    return JSON.parse(localStorage.getItem('menuItems')) || [];
}

function getTables() {
    return JSON.parse(localStorage.getItem('tables')) || [];
}

function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

function getSettings() {
    return JSON.parse(localStorage.getItem('settings')) || {
        shopName: 'Brew & Bean',
        tableCount: 12,
        taxRate: 0
    };
}

// Save data to localStorage
function saveMenuItems(items) {
    localStorage.setItem('menuItems', JSON.stringify(items));
}

function saveMenuCategories(categories) {
    localStorage.setItem('menuCategories', JSON.stringify(categories));
}

function saveTables(tables) {
    localStorage.setItem('tables', JSON.stringify(tables));
}

function saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function saveSettings(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 20px 30px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.4s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeDefaultData();
});

// Kiosk Order Management
function getKioskOrders() {
    return JSON.parse(localStorage.getItem('kioskOrders')) || [];
}

function saveKioskOrders(orders) {
    localStorage.setItem('kioskOrders', JSON.stringify(orders));
}

function addKioskOrder(order) {
    const orders = getKioskOrders();
    orders.push(order);
    saveKioskOrders(orders);
    
    // Trigger storage event for POS to detect new order
    window.dispatchEvent(new Event('storage'));
}

function removeKioskOrder(orderId) {
    let orders = getKioskOrders();
    orders = orders.filter(order => order.id !== orderId);
    saveKioskOrders(orders);
}

function clearProcessedKioskOrders() {
    saveKioskOrders([]);
}
