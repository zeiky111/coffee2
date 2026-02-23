// Inventory Management System - Ingredients

let currentFilter = 'all';
let inventoryData = [];

// Initialize inventory page
document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
    adjustTableColumns();
    updateInventorySummary();
    renderInventoryTable();
});

function loadInventory() {
    const ingredients = getIngredients();
    const stocks = getIngredientStocks();
    
    inventoryData = ingredients.map(ingredient => ({
        ...ingredient,
        stock: stocks[ingredient.id] || 0,
        threshold: getIngredientThreshold(ingredient.id) || 10
    }));
}

function adjustTableColumns() {
    // Dynamically adjust table column span based on content
    const headerRow = document.querySelector('thead tr');
    if (headerRow) {
        const colCount = headerRow.querySelectorAll('th').length;
        const emptyRowCell = document.querySelector('.empty-row td');
        if (emptyRowCell) {
            emptyRowCell.colSpan = colCount;
        }
    }
}

function renderInventoryTable() {
    const tableBody = document.getElementById('inventoryTableBody');
    
    let filteredData = inventoryData;
    
    // Apply stock filter
    if (currentFilter === 'low') {
        filteredData = filteredData.filter(item => item.stock > 0 && item.stock <= item.threshold);
    } else if (currentFilter === 'out') {
        filteredData = filteredData.filter(item => item.stock === 0);
    }
    
    // Apply search filter
    const searchTerm = document.getElementById('inventorySearch').value.toLowerCase();
    if (searchTerm) {
        filteredData = filteredData.filter(item => item.name.toLowerCase().includes(searchTerm));
    }
    
    if (filteredData.length === 0) {
        tableBody.innerHTML = '<tr class="empty-row"><td colspan="7">No ingredients found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = filteredData.map(item => {
        const status = getStockStatus(item.stock, item.threshold);
        
        return `
            <tr class="inventory-row status-${status.class}">
                <td>
                    <div class="item-name">${item.name}</div>
                </td>
                <td>${item.category}</td>
                <td><small>${item.supplier}</small></td>
                <td>₱${item.costPrice.toFixed(2)}</td>
                <td>
                    <div class="stock-display">
                        <span class="stock-number">${item.stock}</span>
                        <span class="stock-unit">${item.unit || 'units'}</span>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${status.class}">${status.label}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="openStockModal(${item.id})">Edit Stock</button>
                </td>
            </tr>
        `;
    }).join('');
}

function getStockStatus(stock, threshold) {
    if (stock === 0) {
        return { label: 'Out of Stock', class: 'out' };
    } else if (stock <= threshold) {
        return { label: 'Low Stock', class: 'low' };
    } else {
        return { label: 'In Stock', class: 'in' };
    }
}

function updateInventorySummary() {
    const inStock = inventoryData.filter(item => item.stock > 0).length;
    const lowStock = inventoryData.filter(item => item.stock > 0 && item.stock <= item.threshold).length;
    const outStock = inventoryData.filter(item => item.stock === 0).length;
    
    document.getElementById('totalItems').textContent = inventoryData.length;
    document.getElementById('inStockItems').textContent = inStock;
    document.getElementById('lowStockItems').textContent = lowStock;
    document.getElementById('outStockItems').textContent = outStock;
}

function filterByStock(filter) {
    currentFilter = filter;
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderInventoryTable();
}

function filterInventory() {
    renderInventoryTable();
}

function openStockModal(itemId) {
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) return;
    
    document.getElementById('editItemId').value = itemId;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemSupplier').value = item.supplier || 'N/A';
    document.getElementById('editItemStock').value = item.stock;
    document.getElementById('editItemThreshold').value = item.threshold;
    
    document.getElementById('updateStockModal').classList.add('active');
}

function closeStockModal() {
    document.getElementById('updateStockModal').classList.remove('active');
}

function saveStockUpdate() {
    const itemId = parseInt(document.getElementById('editItemId').value);
    const newStock = parseInt(document.getElementById('editItemStock').value) || 0;
    const newThreshold = parseInt(document.getElementById('editItemThreshold').value) || 10;
    const notes = document.getElementById('editStockNotes').value || '';
    
    // Find the item to get current stock
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) return;
    
    const currentStock = item.stock;
    
    // Log the transaction
    const currentUser = localStorage.getItem('currentUser') || 'Admin';
    logStockTransaction(itemId, newStock, 'adjustment', `Manual adjustment from ${currentStock} to ${newStock}. ${notes}`, currentUser);
    
    // Save threshold
    saveIngredientThreshold(itemId, newThreshold);
    
    showNotification('Ingredient stock updated successfully!', 'success');
    closeStockModal();
    
    // Reload data
    loadInventory();
    updateInventorySummary();
    renderInventoryTable();
}

// Close modal when clicking outside
document.getElementById('updateStockModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'updateStockModal') {
        closeStockModal();
    }
});
