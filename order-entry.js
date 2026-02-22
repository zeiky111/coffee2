// Combined Order Entry & POS System
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
let currentMode = 'kitchen'; // 'kitchen' or 'pos'

// Initialize order entry page
document.addEventListener('DOMContentLoaded', () => {
    initializeOrderEntry();
});

function initializeOrderEntry() {
    currentOrder.orderNumber = generateOrderNumber();
    document.getElementById('orderNumber').value = currentOrder.orderNumber;
    
    loadCategoryTabs();
    loadMenuItems();
    updateModeUI();
}

function switchMode(mode, buttonEl) {
    currentMode = mode;
    
    // Update active button
    const buttons = document.querySelectorAll('.mode-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    if (buttonEl) {
        buttonEl.classList.add('active');
    } else if (buttons.length) {
        const targetIndex = mode === 'pos' ? 1 : 0;
        if (buttons[targetIndex]) {
            buttons[targetIndex].classList.add('active');
        }
    }
    
    // Generate new number based on mode
    if (mode === 'pos') {
        currentOrder.orderNumber = generateReceiptNumber();
    } else {
        currentOrder.orderNumber = generateOrderNumber();
    }
    document.getElementById('orderNumber').value = currentOrder.orderNumber;
    
    updateModeUI();
}

function updateModeUI() {
    const orderNumberLabel = document.getElementById('orderNumberLabel');
    const customerField = document.getElementById('customerField');
    const discountRow = document.getElementById('discountRow');
    const paymentNote = document.getElementById('paymentNote');
    const submitBtn = document.getElementById('submitBtn');
    
    if (currentMode === 'pos') {
        orderNumberLabel.textContent = 'Receipt #';
        customerField.style.display = 'none';
        discountRow.style.display = 'flex';
        paymentNote.style.display = 'block';
        submitBtn.textContent = 'Print Receipt';
        submitBtn.className = 'btn btn-success';
    } else {
        orderNumberLabel.textContent = 'Order #';
        customerField.style.display = 'block';
        discountRow.style.display = 'none';
        paymentNote.style.display = 'none';
        submitBtn.textContent = 'Submit to Kitchen';
        submitBtn.className = 'btn btn-primary';
    }
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
    
    // Apply discount if in POS mode
    currentOrder.discount = currentMode === 'pos' ? (parseFloat(document.getElementById('discountAmount').value) || 0) : 0;
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
    
    if (currentMode === 'kitchen') {
        // Kitchen mode - submit to kitchen queue
        const customerName = document.getElementById('customerName').value.trim();
        if (!customerName) {
            showNotification('Please enter table number or customer name', 'error');
            return;
        }
        
        // Auto-occupy table if a table number is provided
        occupyTableIfNeeded(customerName);
        
        currentOrder.customerName = customerName;
        currentOrder.timestamp = new Date().toISOString();
        currentOrder.status = 'pending';
        
        const orders = getOrders();
        orders.push({...currentOrder});
        saveOrders(orders);
        
        showNotification(`Order ${currentOrder.orderNumber} submitted to kitchen!`, 'success');
        
        // Auto-switch to Quick Checkout and print receipt
        setTimeout(() => {
            // Switch to POS mode
            switchMode('pos');
            calculateTotal();
            
            // Print receipt
            printReceipt();
        }, 1000);
    } else {
        // POS mode - print receipt
        printReceipt();
    }
}

function occupyTableIfNeeded(input) {
    const tables = getTables();
    if (!tables.length) {
        return;
    }

    const match = input.match(/\d+/);
    if (!match) {
        return;
    }

    const tableNumber = parseInt(match[0], 10);
    const table = tables.find(t => t.number === tableNumber);
    if (!table) {
        return;
    }

    table.status = 'occupied';
    table.customerName = input;
    table.guestCount = table.guestCount || 0;
    saveTables(tables);
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
        orderNumber: currentMode === 'pos' ? generateReceiptNumber() : generateOrderNumber(),
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

// Order Lookup Functions
function searchOrderNumber() {
    const orderNumber = document.getElementById('orderLookupInput').value.trim().toUpperCase();
    
    if (!orderNumber) {
        showNotification('Please enter an order number', 'error');
        return;
    }
    
    const orders = getKioskOrders();
    const foundOrder = orders.find(o => o.orderNumber === orderNumber);
    
    if (!foundOrder) {
        showNotification(`Order ${orderNumber} not found`, 'error');
        document.getElementById('lookupResult').style.display = 'none';
        return;
    }
    
    displayOrderLookupResult(foundOrder);
}

function displayOrderLookupResult(order) {
    const resultDiv = document.getElementById('lookupResult');
    const clearBtn = document.getElementById('clearLookupBtn');
    
    resultDiv.innerHTML = `
        <div class="lookup-order-card">
            <div class="lookup-order-header">
                <div class="lookup-order-number">Order #${order.orderNumber}</div>
                <div class="lookup-order-time">${formatTime(new Date(order.timestamp))}</div>
            </div>
            
            <div class="lookup-order-items">
                <div class="lookup-items-label">Items:</div>
                ${order.items.map(item => `
                    <div class="lookup-item-row">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>${formatCurrency(item.price * item.quantity)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="lookup-order-footer">
                <div class="lookup-total">
                    <span>Total:</span>
                    <span>${formatCurrency(order.total)}</span>
                </div>
                <button class="btn btn-success" onclick="addLookupOrderToCart('${order.id}')">
                    Add to Checkout
                </button>
            </div>
        </div>
    `;
    
    resultDiv.style.display = 'block';
    clearBtn.style.display = 'inline-block';
    showNotification(`Order found!`, 'success');
}

function addLookupOrderToCart(orderId) {
    const orders = getKioskOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Add order items to current order
    order.items.forEach(item => {
        const existingItem = currentOrder.items.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            currentOrder.items.push({...item});
        }
    });
    
    // Update display
    renderOrderItems();
    calculateTotal();
    
    // Remove from kiosk orders
    removeKioskOrder(orderId);
    clearOrderLookup();
    
    showNotification(`Order #${order.orderNumber} added to checkout`, 'success');
}

function clearOrderLookup() {
    document.getElementById('orderLookupInput').value = '';
    document.getElementById('lookupResult').style.display = 'none';
    document.getElementById('clearLookupBtn').style.display = 'none';
}