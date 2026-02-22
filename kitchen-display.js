// Kitchen Display JavaScript
document.addEventListener('DOMContentLoaded', () => {
    loadKitchenOrders();
    
    // Auto-refresh every 30 seconds
    setInterval(loadKitchenOrders, 30000);
});

function loadKitchenOrders() {
    const orders = getOrders();
    const activeOrders = orders.filter(order => 
        order.status === 'pending' || order.status === 'preparing'
    );
    
    updateKitchenStats(orders);
    renderKitchenQueue(activeOrders);
}

function updateKitchenStats(orders) {
    const today = new Date().toDateString();
    
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const preparingCount = orders.filter(o => o.status === 'preparing').length;
    const completedToday = orders.filter(o => {
        return o.status === 'completed' && 
               new Date(o.timestamp).toDateString() === today;
    }).length;
    
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('preparingCount').textContent = preparingCount;
    document.getElementById('completedTodayCount').textContent = completedToday;
}

function renderKitchenQueue(orders) {
    const container = document.getElementById('kitchenQueue');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✨</div>
                <h3>No Active Orders</h3>
                <p>All caught up! New orders will appear here.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    // Sort by timestamp (oldest first)
    orders.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    orders.forEach(order => {
        const card = document.createElement('div');
        card.className = `kitchen-order-card ${order.status}`;
        
        const itemsList = order.items.map(item => `
            <div class="kitchen-item">
                <span>${item.quantity}x ${item.name}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `).join('');
        
        card.innerHTML = `
            <div class="order-header">
                <div class="order-number">${order.orderNumber}</div>
                <div class="order-time">${formatTime(order.timestamp)}</div>
            </div>
            <div class="order-customer">
                👤 ${order.customerName}
            </div>
            <div class="order-items-list-kitchen">
                ${itemsList}
            </div>
            <div class="order-total">
                <strong>Total: ${formatCurrency(order.total)}</strong>
            </div>
            <div class="order-status-buttons">
                ${order.status === 'pending' ? `
                    <button class="status-btn preparing-btn" onclick="updateOrderStatus('${order.orderNumber}', 'preparing')">
                        Start Preparing
                    </button>
                ` : ''}
                <button class="status-btn complete-btn" onclick="updateOrderStatus('${order.orderNumber}', 'completed')">
                    ${order.status === 'preparing' ? 'Mark Complete' : 'Complete'}
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function updateOrderStatus(orderNumber, newStatus) {
    const orders = getOrders();
    const order = orders.find(o => o.orderNumber === orderNumber);
    
    if (order) {
        order.status = newStatus;
        
        if (newStatus === 'completed') {
            order.completedAt = new Date().toISOString();
        }
        
        saveOrders(orders);
        loadKitchenOrders();
        
        const statusMessages = {
            'preparing': 'Order is being prepared',
            'completed': 'Order completed! ✅'
        };
        
        showNotification(statusMessages[newStatus], 'success');
    }
}