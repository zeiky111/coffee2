// Cashier System - Order Entry & Checkout
let currentOrder = {
    orderNumber: '',
    customerName: '',
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    timestamp: null
};

let selectedCategory = null;

// Initialize order entry page
document.addEventListener('DOMContentLoaded', () => {
    initializeOrderEntry();
});

function initializeOrderEntry() {
    currentOrder.orderNumber = generateReceiptNumber();
    document.getElementById('orderNumber').value = currentOrder.orderNumber;
    
    loadCategoryTabs();
    loadMenuItems();
}

function loadCategoryTabs() {
    const categories = getMenuCategories();
    const tabsContainer = document.getElementById('categoryTabs');
    
    tabsContainer.innerHTML = `
        <div class="category-tab active" onclick="selectCategory(null)">All Items</div>
    `;
    
    categories.forEach(category => {
        const tab = document.createElement('div');
        tab.className = 'category-tab';
        tab.textContent = `${category.icon} ${category.name}`;
        tab.onclick = () => selectCategory(category.id);
        tabsContainer.appendChild(tab);
    });
}

function selectCategory(categoryId) {
    selectedCategory = categoryId;
    
    // Update active tab
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach((tab, index) => {
        if ((categoryId === null && index === 0) || 
            (categoryId !== null && tab.textContent.includes(getMenuCategories().find(c => c.id === categoryId)?.name))) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    loadMenuItems();
}

function loadMenuItems() {
    const allItems = getMenuItems();
    const items = selectedCategory 
        ? allItems.filter(item => item.category === selectedCategory && item.available)
        : allItems.filter(item => item.available);
    
    const grid = document.getElementById('menuItemsGrid');
    grid.innerHTML = '';
    
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.onclick = () => addItemToOrder(item);
        itemDiv.innerHTML = `
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-price">${formatCurrency(item.price)}</div>
        `;
        grid.appendChild(itemDiv);
    });
}

function addItemToOrder(item) {
    const existingItem = currentOrder.items.find(i => i.id === item.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        currentOrder.items.push({
            ...item,
            quantity: 1
        });
    }
    
    calculateTotal();
    renderOrderItems();
}

function renderOrderItems() {
    const container = document.getElementById('orderItemsList');
    
    if (currentOrder.items.length === 0) {
        container.innerHTML = `
            <div class="empty-order">
                <div class="empty-icon">🛒</div>
                <p>No items added yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    currentOrder.items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div>${formatCurrency(item.price)}</div>
            </div>
            <div class="order-item-controls">
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div>${formatCurrency(item.price * item.quantity)}</div>
                <button class="remove-btn" onclick="removeItem(${index})">×</button>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}

function updateQuantity(index, change) {
    currentOrder.items[index].quantity += change;
    
    if (currentOrder.items[index].quantity <= 0) {
        currentOrder.items.splice(index, 1);
    }
    
    calculateTotal();
    renderOrderItems();
}

function removeItem(index) {
    currentOrder.items.splice(index, 1);
    calculateTotal();
    renderOrderItems();
}

function calculateTotal() {
    currentOrder.subtotal = currentOrder.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    
    // Apply discount
    currentOrder.discount = parseFloat(document.getElementById('discountAmount').value) || 0;
    currentOrder.total = currentOrder.subtotal - currentOrder.discount;
    
    document.getElementById('subtotalAmount').textContent = formatCurrency(currentOrder.subtotal);
    document.getElementById('totalAmount').textContent = formatCurrency(currentOrder.total);
}

function filterMenu() {
    const searchTerm = document.getElementById('menuSearch').value.toLowerCase();
    const allItems = getMenuItems();
    
    const filteredItems = searchTerm 
        ? allItems.filter(item => item.available && item.name.toLowerCase().includes(searchTerm))
        : (selectedCategory ? allItems.filter(item => item.category === selectedCategory && item.available) : allItems.filter(item => item.available));
    
    const grid = document.getElementById('menuItemsGrid');
    grid.innerHTML = '';
    
    filteredItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.onclick = () => addItemToOrder(item);
        itemDiv.innerHTML = `
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-price">${formatCurrency(item.price)}</div>
        `;
        grid.appendChild(itemDiv);
    });
}

function clearOrder() {
    if (currentOrder.items.length === 0) {
        showNotification('Order is already empty', 'error');
        return;
    }
    
    if (confirm('Clear all items from this order?')) {
        currentOrder.items = [];
        currentOrder.subtotal = 0;
        currentOrder.total = 0;
        calculateTotal();
        renderOrderItems();
        showNotification('Order cleared', 'success');
    }
}

function submitOrder() {
    if (currentOrder.items.length === 0) {
        showNotification('Please add items to the order', 'error');
        return;
    }
    
    // Save the complete order
    currentOrder.timestamp = new Date().toISOString();
    const orders = getOrders();
    orders.push({...currentOrder});
    saveOrders(orders);
    
    // Update inventory - deduct ordered items from stock
    updateStockFromOrder(currentOrder.items);
    
    // Print receipt
    printReceipt();
}

function printReceipt() {
    const receiptNumber = currentOrder.orderNumber;
    const subtotal = currentOrder.subtotal;
    const discount = currentOrder.discount;
    const total = currentOrder.total;
    
    // Populate print modal
    document.getElementById('printReceiptNumber').textContent = receiptNumber;
    document.getElementById('printReceiptDate').textContent = formatDateTime(new Date());
    
    const itemsList = document.getElementById('printReceiptItems');
    itemsList.innerHTML = '';
    
    currentOrder.items.forEach(item => {
        const itemLine = document.createElement('div');
        itemLine.className = 'receipt-item-line';
        itemLine.innerHTML = `
            <span>${item.quantity}x ${item.name}</span>
            <span>${formatCurrency(item.price * item.quantity)}</span>
        `;
        itemsList.appendChild(itemLine);
    });
    
    const totalsDiv = document.getElementById('printReceiptTotals');
    totalsDiv.innerHTML = `
        <div class="receipt-item-line">
            <span>Subtotal:</span>
            <span>${formatCurrency(subtotal)}</span>
        </div>
        ${discount > 0 ? `
        <div class="receipt-item-line">
            <span>Discount:</span>
            <span>-${formatCurrency(discount)}</span>
        </div>
        ` : ''}
        <div class="receipt-item-line" style="font-weight: bold; font-size: 1.1em;">
            <span>TOTAL:</span>
            <span>${formatCurrency(total)}</span>
        </div>
    `;
    
    document.getElementById('receiptModal').classList.add('active');
}

function closeReceiptModal() {
    document.getElementById('receiptModal').classList.remove('active');
    resetOrder();
}

function resetOrder() {
    currentOrder = {
        orderNumber: generateReceiptNumber(),
        customerName: '',
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        timestamp: null
    };
    
    document.getElementById('orderNumber').value = currentOrder.orderNumber;
    document.getElementById('customerName').value = '';
    document.getElementById('discountAmount').value = 0;
    renderOrderItems();
    calculateTotal();
}

// Close modal when clicking outside
document.getElementById('receiptModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'receiptModal') {
        closeReceiptModal();
    }
});