// Kiosk Ordering System JavaScript
let kioskCart = [];
let selectedKioskCategory = null;

document.addEventListener('DOMContentLoaded', () => {
    loadKioskCategories();
    loadKioskMenu();
    updateCartDisplay();
});

function loadKioskCategories() {
    const categories = getMenuCategories();
    const tabsContainer = document.getElementById('kioskCategoryTabs');
    
    tabsContainer.innerHTML = `
        <div class="category-tab active" onclick="selectKioskCategory(null)">All Items</div>
    `;
    
    categories.forEach(category => {
        const tab = document.createElement('div');
        tab.className = 'category-tab';
        tab.textContent = `${category.icon} ${category.name}`;
        tab.onclick = () => selectKioskCategory(category.id);
        tabsContainer.appendChild(tab);
    });
}

function selectKioskCategory(categoryId) {
    selectedKioskCategory = categoryId;
    
    const tabs = document.querySelectorAll('.kiosk-category-tabs .category-tab');
    tabs.forEach((tab, index) => {
        if ((categoryId === null && index === 0) || 
            (categoryId !== null && tab.textContent.includes(getMenuCategories().find(c => c.id === categoryId)?.name))) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    loadKioskMenu();
}

function loadKioskMenu() {
    const categories = getMenuCategories();
    const allItems = getMenuItems();
    const items = selectedKioskCategory 
        ? allItems.filter(item => item.category === selectedKioskCategory && item.available)
        : allItems.filter(item => item.available);
    
    const container = document.getElementById('qrMenuContainer');
    container.innerHTML = '';
    
    if (selectedKioskCategory === null) {
        // Show by categories
        categories.forEach(category => {
            const categoryItems = allItems.filter(item => item.category === category.id && item.available);
            
            if (categoryItems.length === 0) return;
            
            const categorySection = document.createElement('div');
            categorySection.className = 'menu-category';
            
            const itemsHTML = categoryItems.map(item => `
                <div class="menu-item-card clickable" onclick='addToKioskCart(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
                    <div class="menu-item-details">
                        <div class="menu-item-title">${item.name}</div>
                        ${item.description ? `<div class="menu-item-description">${item.description}</div>` : ''}
                    </div>
                    <div class="menu-item-footer">
                        <div class="menu-item-price-tag">${formatCurrency(item.price)}</div>
                        <button class="btn-add-item">+ Add</button>
                    </div>
                </div>
            `).join('');
            
            categorySection.innerHTML = `
                <div class="category-header">
                    <div class="category-icon">${category.icon}</div>
                    <div class="category-title">${category.name}</div>
                </div>
                <div class="menu-items-list">
                    ${itemsHTML}
                </div>
            `;
            
            container.appendChild(categorySection);
        });
    } else {
        // Show single category grid
        const gridContainer = document.createElement('div');
        gridContainer.className = 'menu-items-grid';
        
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'menu-item-card clickable';
            itemDiv.onclick = () => addToKioskCart(item);
            itemDiv.innerHTML = `
                <div class="menu-item-details">
                    <div class="menu-item-title">${item.name}</div>
                    ${item.description ? `<div class="menu-item-description">${item.description}</div>` : ''}
                </div>
                <div class="menu-item-footer">
                    <div class="menu-item-price-tag">${formatCurrency(item.price)}</div>
                    <button class="btn-add-item">+ Add</button>
                </div>
            `;
            gridContainer.appendChild(itemDiv);
        });
        
        container.appendChild(gridContainer);
    }
}

function filterKioskMenu() {
    const searchTerm = document.getElementById('kioskSearch').value.toLowerCase();
    
    if (!searchTerm) {
        loadKioskMenu();
        return;
    }
    
    const allItems = getMenuItems().filter(item => item.available);
    const filteredItems = allItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm))
    );
    
    const container = document.getElementById('qrMenuContainer');
    container.innerHTML = '';
    
    if (filteredItems.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No items found</p></div>';
        return;
    }
    
    const gridContainer = document.createElement('div');
    gridContainer.className = 'menu-items-grid';
    
    filteredItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item-card clickable';
        itemDiv.onclick = () => addToKioskCart(item);
        itemDiv.innerHTML = `
            <div class="menu-item-details">
                <div class="menu-item-title">${item.name}</div>
                ${item.description ? `<div class="menu-item-description">${item.description}</div>` : ''}
            </div>
            <div class="menu-item-footer">
                <div class="menu-item-price-tag">${formatCurrency(item.price)}</div>
                <button class="btn-add-item">+ Add</button>
            </div>
        `;
        gridContainer.appendChild(itemDiv);
    });
    
    container.appendChild(gridContainer);
}

function addToKioskCart(item) {
    const existingItem = kioskCart.find(i => i.id === item.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        kioskCart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${item.name} added to cart`, 'success');
}

function updateCartDisplay() {
    const container = document.getElementById('kioskCartItems');
    const footer = document.getElementById('cartFooter');
    const clearBtn = document.getElementById('clearCartBtn');
    
    if (kioskCart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <p class="small-text">Add items from the menu</p>
            </div>
        `;
        footer.style.display = 'none';
        clearBtn.style.display = 'none';
        return;
    }
    
    footer.style.display = 'block';
    clearBtn.style.display = 'block';
    
    container.innerHTML = '';
    
    kioskCart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)} each</div>
            </div>
            <div class="cart-item-controls">
                <button class="btn-qty" onclick="decreaseQuantity(${index})">-</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="btn-qty" onclick="increaseQuantity(${index})">+</button>
                <button class="btn-remove" onclick="removeFromCart(${index})">🗑️</button>
            </div>
            <div class="cart-item-total">${formatCurrency(item.price * item.quantity)}</div>
        `;
        container.appendChild(itemDiv);
    });
    
    updateCartTotal();
}

function increaseQuantity(index) {
    kioskCart[index].quantity++;
    updateCartDisplay();
}

function decreaseQuantity(index) {
    if (kioskCart[index].quantity > 1) {
        kioskCart[index].quantity--;
        updateCartDisplay();
    } else {
        removeFromCart(index);
    }
}

function removeFromCart(index) {
    kioskCart.splice(index, 1);
    updateCartDisplay();
}

function clearKioskCart() {
    if (confirm('Clear all items from cart?')) {
        kioskCart = [];
        updateCartDisplay();
        showNotification('Cart cleared', 'success');
    }
}

function updateCartTotal() {
    const totalItems = kioskCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = kioskCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('cartItemCount').textContent = totalItems;
    document.getElementById('cartGrandTotal').textContent = formatCurrency(totalAmount);
}

function placeKioskOrder() {
    if (kioskCart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const order = {
        id: generateOrderNumber(),
        orderNumber: generateOrderNumber(),
        items: kioskCart.map(item => ({...item})),
        total: kioskCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        source: 'kiosk',
        timestamp: new Date().toISOString()
    };
    
    // Add to kiosk orders queue
    addKioskOrder(order);
    
    // Show success modal
    showOrderSuccess(order);
    
    // Clear cart
    kioskCart = [];
    updateCartDisplay();
}

function showOrderSuccess(order) {
    const modal = document.getElementById('orderSuccessModal');
    const summaryDiv = document.getElementById('orderSummaryDetails');
    
    summaryDiv.innerHTML = `
        <div class="order-number-display">
            <div class="order-label">Your Order Number</div>
            <div class="order-number-big">${order.orderNumber}</div>
            <div class="order-copy-hint">Show this to the cashier or just tell them the number</div>
        </div>
        <div class="order-items-summary">
            <div class="order-summary-title">Items:</div>
            ${order.items.map(item => `
                <div class="summary-item">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>${formatCurrency(item.price * item.quantity)}</span>
                </div>
            `).join('')}
        </div>
        <div class="order-total-summary">
            <strong>Total: ${formatCurrency(order.total)}</strong>
        </div>
        <p class="order-note">👉 Proceed to the cashier counter and show them your order number.</p>
    `;
    
    modal.classList.add('active');
}

function closeOrderModal() {
    document.getElementById('orderSuccessModal').classList.remove('active');
}

// Close modal when clicking outside
document.getElementById('orderSuccessModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'orderSuccessModal') {
        closeOrderModal();
    }
});
