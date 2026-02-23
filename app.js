// Global navigation function
function navigateTo(page) {
    window.location.href = page;
}

// Initialize default menu data if not exists
function initializeDefaultData() {
    if (!localStorage.getItem('menuCategories')) {
        const defaultCategories = [
            { id: 1, name: 'Coffee Beans', icon: '☕' },
            { id: 2, name: 'Dairy & Milk', icon: '🥛' },
            { id: 3, name: 'Syrups & Flavoring', icon: '🍯' },
            { id: 4, name: 'Pastry Supplies', icon: '🧁' },
            { id: 5, name: 'Cups & Supplies', icon: '📦' },
            { id: 6, name: 'Sweeteners & Additives', icon: '🍬' }
        ];
        localStorage.setItem('menuCategories', JSON.stringify(defaultCategories));
    }

    if (!localStorage.getItem('menuItems')) {
        const defaultItems = [
            // Coffee Beans
            { id: 1, name: 'Arabica Coffee Beans (1kg)', category: 1, price: 450, description: 'Premium arabica beans from Colombia', available: true, supplier: 'Brew Supply Co', costPrice: 380 },
            { id: 2, name: 'Robusta Coffee Beans (1kg)', category: 1, price: 380, description: 'Strong robusta beans for espresso blends', available: true, supplier: 'Brew Supply Co', costPrice: 320 },
            { id: 3, name: 'Decaf Coffee Beans (1kg)', category: 1, price: 520, description: 'Premium decaffeinated arabica', available: true, supplier: 'Brew Supply Co', costPrice: 440 },
            
            // Dairy & Milk
            { id: 4, name: 'Fresh Whole Milk (1L)', category: 2, price: 85, description: '100% fresh whole milk', available: true, supplier: 'Dairy Fresh Ltd', costPrice: 65 },
            { id: 5, name: 'Almond Milk (1L)', category: 2, price: 120, description: 'Plant-based almond milk alternative', available: true, supplier: 'Plant Milk Co', costPrice: 95 },
            { id: 6, name: 'Oat Milk (1L)', category: 2, price: 125, description: 'Creamy oat milk alternative', available: true, supplier: 'Plant Milk Co', costPrice: 100 },
            { id: 7, name: 'Heavy Cream (500ml)', category: 2, price: 180, description: 'Pure heavy cream for whipping', available: true, supplier: 'Dairy Fresh Ltd', costPrice: 140 },
            
            // Syrups & Flavoring
            { id: 8, name: 'Vanilla Syrup (750ml)', category: 3, price: 250, description: 'Pure vanilla flavoring syrup', available: true, supplier: 'Coffee Flavor Hub', costPrice: 180 },
            { id: 9, name: 'Caramel Syrup (750ml)', category: 3, price: 260, description: 'Rich caramel syrup', available: true, supplier: 'Coffee Flavor Hub', costPrice: 190 },
            { id: 10, name: 'Hazelnut Syrup (750ml)', category: 3, price: 280, description: 'Roasted hazelnut flavor', available: true, supplier: 'Coffee Flavor Hub', costPrice: 210 },
            { id: 11, name: 'Chocolate Syrup (750ml)', category: 3, price: 240, description: 'Belgian chocolate syrup', available: true, supplier: 'Coffee Flavor Hub', costPrice: 170 },
            
            // Pastry & Baking Supplies
            { id: 12, name: 'All-Purpose Flour (5kg)', category: 4, price: 320, description: 'Premium all-purpose flour', available: true, supplier: 'Bakers Warehouse', costPrice: 240 },
            { id: 13, name: 'Sugar (2kg)', category: 4, price: 180, description: 'Refined white sugar', available: true, supplier: 'Bakers Warehouse', costPrice: 130 },
            { id: 14, name: 'Butter (500g)', category: 4, price: 350, description: 'Unsalted butter for baking', available: true, supplier: 'Bakers Warehouse', costPrice: 280 },
            { id: 15, name: 'Chocolate Chips (500g)', category: 4, price: 280, description: 'Premium chocolate chips', available: true, supplier: 'Bakers Warehouse', costPrice: 220 },
            
            // Coffee Accessories & Supplies
            { id: 16, name: 'Paper Cups 8oz (1000pcs)', category: 5, price: 850, description: 'Disposable paper cups with lid', available: true, supplier: 'Cup & Lid Factory', costPrice: 650 },
            { id: 17, name: 'Paper Cups 12oz (1000pcs)', category: 5, price: 950, description: 'Large paper cups with lids', available: true, supplier: 'Cup & Lid Factory', costPrice: 750 },
            { id: 18, name: 'Coffee Stirrers (1000pcs)', category: 5, price: 150, description: 'Wooden coffee stirrers', available: true, supplier: 'Cup & Lid Factory', costPrice: 100 },
            { id: 19, name: 'Napkins (500pcs)', category: 5, price: 120, description: 'White paper napkins', available: true, supplier: 'Cup & Lid Factory', costPrice: 80 },
            
            // Sweeteners & Additives
            { id: 20, name: 'Honey (500ml)', category: 6, price: 420, description: 'Raw organic honey', available: true, supplier: 'Natural Foods Inc', costPrice: 340 },
            { id: 21, name: 'Agave Nectar (500ml)', category: 6, price: 380, description: 'Pure agave sweetener', available: true, supplier: 'Natural Foods Inc', costPrice: 300 },
            { id: 22, name: 'Whipped Cream Mix (500g)', category: 6, price: 280, description: 'Ready-to-whip cream powder', available: true, supplier: 'Dairy Fresh Ltd', costPrice: 220 }
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
    initializeDefaultInventory();
    initializeDefaultIngredients();
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
// ========== INVENTORY MANAGEMENT ==========
function getInventoryStocks() {
    const stocks = localStorage.getItem('inventoryStocks');
    return stocks ? JSON.parse(stocks) : {};
}

function saveInventoryStock(itemId, quantity) {
    const stocks = getInventoryStocks();
    stocks[itemId] = quantity;
    localStorage.setItem('inventoryStocks', JSON.stringify(stocks));
}

function updateStockFromOrder(items) {
    const stocks = getInventoryStocks();
    const currentUser = localStorage.getItem('currentUser') || 'Cashier';
    
    items.forEach(item => {
        const currentStock = stocks[item.id] || 0;
        stocks[item.id] = Math.max(0, currentStock - item.quantity);
        
        // Log the transaction as a sale
        logStockTransaction(item.id, item.quantity, 'sale', `Sale - ${item.name} (Qty: ${item.quantity})`, currentUser);
    });
    
    localStorage.setItem('inventoryStocks', JSON.stringify(stocks));
}

function getInventoryThreshold(itemId) {
    const thresholds = localStorage.getItem('inventoryThresholds');
    const data = thresholds ? JSON.parse(thresholds) : {};
    return data[itemId] || 10;
}

function saveInventoryThreshold(itemId, threshold) {
    const thresholds = JSON.parse(localStorage.getItem('inventoryThresholds') || '{}');
    thresholds[itemId] = threshold;
    localStorage.setItem('inventoryThresholds', JSON.stringify(thresholds));
}

function initializeDefaultInventory() {
    const items = getMenuItems();
    const stocks = getInventoryStocks();
    const thresholds = JSON.parse(localStorage.getItem('inventoryThresholds') || '{}');
    
    items.forEach(item => {
        if (!(item.id in stocks)) {
            stocks[item.id] = 100; // Default stock quantity
        }
        if (!(item.id in thresholds)) {
            thresholds[item.id] = 10; // Default low stock threshold
        }
    });
    
    localStorage.setItem('inventoryStocks', JSON.stringify(stocks));
    localStorage.setItem('inventoryThresholds', JSON.stringify(thresholds));
}

// ========== STOCK TRANSACTION LOGGING ==========
function getStockTransactions() {
    const transactions = localStorage.getItem('stockTransactions');
    return transactions ? JSON.parse(transactions) : [];
}

function saveStockTransactions(transactions) {
    localStorage.setItem('stockTransactions', JSON.stringify(transactions));
}

function logStockTransaction(itemId, quantity, type, notes = '', user = 'System') {
    const transactions = getStockTransactions();
    const timestamp = new Date().toISOString();
    
    const transaction = {
        id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        itemId: itemId,
        quantity: quantity,
        type: type, // 'addition', 'sale', 'return', 'adjustment'
        timestamp: timestamp,
        user: user,
        notes: notes
    };
    
    transactions.push(transaction);
    saveStockTransactions(transactions);
    
    // Update current stock based on transaction
    const currentStock = getInventoryStocks()[itemId] || 0;
    let newStock = currentStock;
    
    if (type === 'addition' || type === 'return') {
        newStock = currentStock + quantity;
    } else if (type === 'sale') {
        newStock = Math.max(0, currentStock - quantity);
    } else if (type === 'adjustment') {
        newStock = quantity; // Direct set for adjustments
    }
    
    saveInventoryStock(itemId, newStock);
    
    return transaction;
}

function getTransactionsByItem(itemId) {
    return getStockTransactions().filter(t => t.itemId === itemId);
}

function getTransactionsByDateRange(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return getStockTransactions().filter(t => {
        const txnDate = new Date(t.timestamp).getTime();
        return txnDate >= start && txnDate <= end;
    });
}

function getTransactionsByType(type) {
    return getStockTransactions().filter(t => t.type === type);
}

function computeStockFromTransactions(itemId) {
    const transactions = getTransactionsByItem(itemId);
    let stock = 100; // Starting inventory
    
    transactions.forEach(txn => {
        if (txn.type === 'addition' || txn.type === 'return') {
            stock += txn.quantity;
        } else if (txn.type === 'sale') {
            stock -= txn.quantity;
        } else if (txn.type === 'adjustment') {
            stock = txn.quantity;
        }
    });
    
    return Math.max(0, stock);
}

// ========== INGREDIENTS MANAGEMENT ==========
function getIngredients() {
    const ingredients = localStorage.getItem('ingredients');
    return ingredients ? JSON.parse(ingredients) : [];
}

function saveIngredients(ingredients) {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
}

function getIngredientStocks() {
    const stocks = localStorage.getItem('ingredientStocks');
    return stocks ? JSON.parse(stocks) : {};
}

function saveIngredientStock(ingredientId, quantity) {
    const stocks = getIngredientStocks();
    stocks[ingredientId] = quantity;
    localStorage.setItem('ingredientStocks', JSON.stringify(stocks));
}

function getIngredientThreshold(ingredientId) {
    const thresholds = localStorage.getItem('ingredientThresholds');
    const data = thresholds ? JSON.parse(thresholds) : {};
    return data[ingredientId] || 10;
}

function saveIngredientThreshold(ingredientId, threshold) {
    const thresholds = JSON.parse(localStorage.getItem('ingredientThresholds') || '{}');
    thresholds[ingredientId] = threshold;
    localStorage.setItem('ingredientThresholds', JSON.stringify(thresholds));
}

function initializeDefaultIngredients() {
    const ingredients = getIngredients();
    
    if (ingredients.length === 0) {
        const defaultIngredients = [
            { id: 1, name: 'Arabica Coffee Beans', category: 'Coffee', supplier: 'Bean Traders Co.', unit: 'kg', costPrice: 550 },
            { id: 2, name: 'Robusta Coffee Beans', category: 'Coffee', supplier: 'Bean Traders Co.', unit: 'kg', costPrice: 380 },
            { id: 3, name: 'Fresh Milk', category: 'Dairy', supplier: 'Green Dairy Farm', unit: 'liter', costPrice: 95 },
            { id: 4, name: 'Almond Milk', category: 'Dairy', supplier: 'Nature\'s Pour', unit: 'liter', costPrice: 180 },
            { id: 5, name: 'Oat Milk', category: 'Dairy', supplier: 'Pure Oat Co.', unit: 'liter', costPrice: 150 },
            { id: 6, name: 'Sugar', category: 'Sweeteners', supplier: 'SweetRefined Ltd.', unit: 'kg', costPrice: 85 },
            { id: 7, name: 'Honey', category: 'Sweeteners', supplier: 'Golden Bee', unit: 'liter', costPrice: 380 },
            { id: 8, name: 'Caramel Syrup', category: 'Syrups', supplier: 'Flavor Masters', unit: 'liter', costPrice: 250 },
            { id: 9, name: 'Vanilla Syrup', category: 'Syrups', supplier: 'Flavor Masters', unit: 'liter', costPrice: 220 },
            { id: 10, name: 'Chocolate Powder', category: 'Powders', supplier: 'Cocoa Kingdom', unit: 'kg', costPrice: 420 },
            { id: 11, name: 'Matcha Powder', category: 'Powders', supplier: 'Green Tea Masters', unit: 'kg', costPrice: 890 },
            { id: 12, name: 'English Breakfast Tea', category: 'Tea', supplier: 'Tea Estates', unit: 'kg', costPrice: 420 },
            { id: 13, name: 'Green Tea', category: 'Tea', supplier: 'Tea Estates', unit: 'kg', costPrice: 520 },
            { id: 14, name: 'Chamomile Tea', category: 'Tea', supplier: 'Herbal House', unit: 'kg', costPrice: 350 },
            { id: 15, name: 'Whipped Cream', category: 'Toppings', supplier: 'Creamery Plus', unit: 'kg', costPrice: 280 }
        ];
        
        saveIngredients(defaultIngredients);
    }
    
    // Initialize stocks for ingredients
    const stocks = getIngredientStocks();
    const thresholds = JSON.parse(localStorage.getItem('ingredientThresholds') || '{}');
    
    ingredients.forEach(ingredient => {
        if (!(ingredient.id in stocks)) {
            stocks[ingredient.id] = 50; // Default stock quantity for ingredients
        }
        if (!(ingredient.id in thresholds)) {
            thresholds[ingredient.id] = 10; // Default low stock threshold
        }
    });
    
    localStorage.setItem('ingredientStocks', JSON.stringify(stocks));
    localStorage.setItem('ingredientThresholds', JSON.stringify(thresholds));
}