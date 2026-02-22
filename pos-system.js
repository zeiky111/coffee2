// POS System JavaScript
let posCart = [];
let selectedPOSCategory = null;
let kioskOrdersVisible = false;

document.addEventListener('DOMContentLoaded', () => {
    initializePOS();
    loadKioskOrders();
    startKioskOrderListener();
});

function initializePOS() {
    document.getElementById('receiptNumber').textContent = generateReceiptNumber();
    updateReceiptTime();
    loadPOSCategories();
    loadPOSItems();
    
    // Update time every minute
    setInterval(updateReceiptTime, 60000);
}

function startKioskOrderListener() {
    // Check for new orders every 2 seconds
    setInterval(() => {
        loadKioskOrders();
    }, 2000);
    
    // Also listen to storage events
    window.addEventListener('storage', () => {
        loadKioskOrders();
    });
}

function loadKioskOrders() {
    const orders = getKioskOrders();
    const ordersList = document.getElementById('kioskOrdersList');
    const ordersSection = document.getElementById('kioskOrdersSection');
    const badge = document.getElementById('kioskOrdersBadge');
    const count = document.getElementById('kioskOrdersCount');
    
    if (orders.length === 0) {
        ordersSection.style.display = 'none';
        badge.style.display = 'none';
        return;
    }
    
    // Show badge
    badge.style.display = 'flex';
    count.textContent = orders.length;
    
    // Show section if not manually hidden
    if (!kioskOrdersVisible) {
        ordersSection.style.display = 'block';
        kioskOrdersVisible = true;
    }
    
    // Render orders
    ordersList.innerHTML = '';
    
    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'kiosk-order-card';
        orderDiv.innerHTML = `
            <div class="kiosk-order-header">
                <div class="kiosk-order-number">Order #${order.orderNumber}</div>
                <div class="kiosk-order-time">${formatTime(new Date(order.timestamp))}</div>
            </div>
            <div class="kiosk-order-items">
                ${order.items.map(item => `
                    <div class="kiosk-order-item">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>${formatCurrency(item.price * item.quantity)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="kiosk-order-footer">
                <div class="kiosk-order-total">Total: ${formatCurrency(order.total)}</div>
                <button class="btn btn-primary btn-sm" onclick="acceptKioskOrder('${order.id}')">Accept & Add to POS</button>
            </div>
        `;
        ordersList.appendChild(orderDiv);
    });
}

function toggleKioskOrders() {
    const ordersSection = document.getElementById('kioskOrdersSection');
    kioskOrdersVisible = !kioskOrdersVisible;
    
    if (kioskOrdersVisible) {
        ordersSection.style.display = 'block';
    } else {
        ordersSection.style.display = 'none';
    }
}

function acceptKioskOrder(orderId) {
    const orders = getKioskOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Add order items to POS cart
    order.items.forEach(item => {
        const existingItem = posCart.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            posCart.push({...item});
        }
    });
    
    // Update POS display
    renderPOSReceipt();
    calculatePOSTotal();
    
    // Remove from kiosk orders
    removeKioskOrder(orderId);
    
    // Reload kiosk orders display
    loadKioskOrders();
    
    showNotification(`Order #${order.orderNumber} added to checkout`, 'success');
}

function updateReceiptTime() {
    const now = new Date();
    document.getElementById('receiptTime').textContent = formatTime(now);
}

function loadPOSCategories() {
    const categories = getMenuCategories();
    const tabsContainer = document.getElementById('posCategoryTabs');
    
    tabsContainer.innerHTML = `
        <div class="category-tab active" onclick="selectPOSCategory(null)">All</div>
    `;
    
    categories.forEach(category => {
        const tab = document.createElement('div');
        tab.className = 'category-tab';
        tab.textContent = `${category.icon} ${category.name}`;
        tab.onclick = () => selectPOSCategory(category.id);
        tabsContainer.appendChild(tab);
    });
}

function selectPOSCategory(categoryId) {
    selectedPOSCategory = categoryId;
    
    const tabs = document.querySelectorAll('.pos-category-tabs .category-tab');
    tabs.forEach((tab, index) => {
        if ((categoryId === null && index === 0) || 
            (categoryId !== null && tab.textContent.includes(getMenuCategories().find(c => c.id === categoryId)?.name))) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    loadPOSItems();
}

function loadPOSItems() {
    const allItems = getMenuItems();
    const items = selectedPOSCategory 
        ? allItems.filter(item => item.category === selectedPOSCategory && item.available)
        : allItems.filter(item => item.available);
    
    const grid = document.getElementById('posItemsGrid');
    grid.innerHTML = '';
    
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.onclick = () => addToPOSCart(item);
        itemDiv.innerHTML = `
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-price">${formatCurrency(item.price)}</div>
        `;
        grid.appendChild(itemDiv);
    });
}

function filterPOSMenu() {
    const searchTerm = document.getElementById('posSearch').value.toLowerCase();
    const allItems = getMenuItems().filter(item => item.available);
    
    const filteredItems = searchTerm 
        ? allItems.filter(item => item.name.toLowerCase().includes(searchTerm))
        : allItems;
    
    const grid = document.getElementById('posItemsGrid');
    grid.innerHTML = '';
    
    filteredItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.onclick = () => addToPOSCart(item);
        itemDiv.innerHTML = `
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-price">${formatCurrency(item.price)}</div>
        `;
        grid.appendChild(itemDiv);
    });
}

function addToPOSCart(item) {
    const existingItem = posCart.find(i => i.id === item.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        posCart.push({
            ...item,
            quantity: 1
        });
    }
    
    renderPOSReceipt();
    calculatePOSTotal();
}

function renderPOSReceipt() {
    const container = document.getElementById('receiptItems');
    
    if (posCart.length === 0) {
        container.innerHTML = `
            <div class="empty-receipt">
                <div class="empty-icon">🧾</div>
                <p>Add items to start checkout</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    posCart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div>${formatCurrency(item.price)} × ${item.quantity}</div>
            </div>
            <div class="order-item-controls">
                <div>${formatCurrency(item.price * item.quantity)}</div>
                <button class="remove-btn" onclick="removePOSItem(${index})">×</button>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}

function removePOSItem(index) {
    posCart.splice(index, 1);
    renderPOSReceipt();
    calculatePOSTotal();
}

function calculatePOSTotal() {
    const subtotal = posCart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    
    const discount = parseFloat(document.getElementById('discountAmount').value) || 0;
    const total = subtotal - discount;
    
    document.getElementById('posSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('posGrandTotal').textContent = formatCurrency(total);
}

function clearPOS() {
    if (posCart.length === 0) {
        showNotification('Cart is already empty', 'error');
        return;
    }
    
    if (confirm('Clear all items?')) {
        posCart = [];
        document.getElementById('discountAmount').value = 0;
        renderPOSReceipt();
        calculatePOSTotal();
        showNotification('Cart cleared', 'success');
    }
}

function printReceipt() {
    if (posCart.length === 0) {
        showNotification('Add items before printing receipt', 'error');
        return;
    }
    
    const receiptNumber = document.getElementById('receiptNumber').textContent;
    const subtotal = parseFloat(document.getElementById('posSubtotal').textContent.replace('₱', ''));
    const discount = parseFloat(document.getElementById('discountAmount').value) || 0;
    const total = parseFloat(document.getElementById('posGrandTotal').textContent.replace('₱', ''));
    
    // Populate print modal
    document.getElementById('printReceiptNumber').textContent = receiptNumber;
    document.getElementById('printReceiptDate').textContent = formatDateTime(new Date());
    
    const itemsList = document.getElementById('printReceiptItems');
    itemsList.innerHTML = '';
    
    posCart.forEach(item => {
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
    
    // Reset after printing
    posCart = [];
    document.getElementById('discountAmount').value = 0;
    document.getElementById('receiptNumber').textContent = generateReceiptNumber();
    renderPOSReceipt();
    calculatePOSTotal();
}

// Close modal when clicking outside
document.getElementById('receiptModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'receiptModal') {
        closeReceiptModal();
    }
});
