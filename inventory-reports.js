// Inventory Reporting System

let reportData = [];
let currentReportType = 'current';
let allInventoryData = [];

// Initialize reports page
document.addEventListener('DOMContentLoaded', () => {
    loadInventoryData();
    populateFilters();
    setDefaultFilters();
});

function loadInventoryData() {
    const ingredients = getIngredients();
    const stocks = getIngredientStocks();
    
    allInventoryData = ingredients.map(ingredient => ({
        ...ingredient,
        stock: stocks[ingredient.id] || 0,
        threshold: getIngredientThreshold(ingredient.id) || 10,
        totalValue: (stocks[ingredient.id] || 0) * ingredient.costPrice
    }));
}

function populateFilters() {
    const ingredients = getIngredients();
    const categorySelect = document.getElementById('filterCategory');
    
    // Get unique categories from ingredients
    const categories = [...new Set(ingredients.map(ing => ing.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
    
    // Get unique users from transactions
    const transactions = getStockTransactions();
    const uniqueUsers = [...new Set(transactions.map(t => t.user))];
    const userSelect = document.getElementById('filterUser');
    
    uniqueUsers.forEach(user => {
        if (user) {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            userSelect.appendChild(option);
        }
    });
}

function setDefaultFilters() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    document.getElementById('filterFromDate').valueAsDate = lastMonth;
    document.getElementById('filterToDate').valueAsDate = today;
}

function selectReportType(type) {
    currentReportType = type;
    
    // Update button states
    document.querySelectorAll('.report-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide movement header
    const movementHeader = document.getElementById('movementHeader');
    const standardHeader = document.getElementById('reportTableHeader');
    
    if (type === 'movement') {
        standardHeader.style.display = 'none';
        movementHeader.style.display = 'table-row';
    } else {
        standardHeader.style.display = 'table-row';
        movementHeader.style.display = 'none';
    }
    
    generateReport();
}

function generateReport() {
    loadInventoryData();
    
    switch(currentReportType) {
        case 'current':
            generateCurrentStockReport();
            break;
        case 'low':
            generateLowStockReport();
            break;
        case 'movement':
            generateMovementReport();
            break;
        case 'value':
            generateInventoryValueReport();
            break;
    }
}

function generateCurrentStockReport() {
    const categoryFilter = document.getElementById('filterCategory').value;
    const productFilter = document.getElementById('filterProduct').value.toLowerCase();
    
    let filtered = allInventoryData;
    
    if (categoryFilter) {
        filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    if (productFilter) {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(productFilter));
    }
    
    reportData = filtered;
    updateSummary();
    renderCurrentStockReport();
}

function generateLowStockReport() {
    const categoryFilter = document.getElementById('filterCategory').value;
    const productFilter = document.getElementById('filterProduct').value.toLowerCase();
    
    let filtered = allInventoryData.filter(item => item.stock <= item.threshold);
    
    if (categoryFilter) {
        filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    if (productFilter) {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(productFilter));
    }
    
    reportData = filtered.sort((a, b) => a.stock - b.stock);
    updateSummary();
    renderCurrentStockReport();
}

function generateMovementReport() {
    const fromDate = new Date(document.getElementById('filterFromDate').value);
    const toDate = new Date(document.getElementById('filterToDate').value);
    const userFilter = document.getElementById('filterUser').value;
    const productFilter = document.getElementById('filterProduct').value.toLowerCase();
    
    let transactions = getStockTransactions();
    
    // Filter by date range
    transactions = transactions.filter(t => {
        const txnDate = new Date(t.timestamp);
        return txnDate >= fromDate && txnDate <= toDate;
    });
    
    // Filter by user
    if (userFilter) {
        transactions = transactions.filter(t => t.user === userFilter);
    }
    
    // Filter by product
    if (productFilter) {
        transactions = transactions.filter(t => {
            const item = allInventoryData.find(i => i.id === t.itemId);
            return item && item.name.toLowerCase().includes(productFilter);
        });
    }
    
    reportData = transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    updateSummaryForMovement();
    renderMovementReport();
}

function generateInventoryValueReport() {
    const categoryFilter = document.getElementById('filterCategory').value;
    const productFilter = document.getElementById('filterProduct').value.toLowerCase();
    
    let filtered = allInventoryData.map(item => ({
        ...item,
        totalValue: item.stock * (item.price * 0.4) // Assuming cost is 40% of selling price
    })).sort((a, b) => b.totalValue - a.totalValue);
    
    if (categoryFilter) {
        filtered = filtered.filter(item => item.category === parseInt(categoryFilter));
    }
    
    if (productFilter) {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(productFilter));
    }
    
    reportData = filtered;
    updateSummary();
    renderCurrentStockReport();
}

function renderCurrentStockReport() {
    const tableBody = document.getElementById('reportTableBody');
    
    if (reportData.length === 0) {
        tableBody.innerHTML = '<tr class="empty-row"><td colspan="7">No data found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = reportData.map(item => {
        const status = getStockStatus(item.stock, item.threshold);
        const totalValue = item.stock * item.costPrice;
        
        return `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.category}</td>
                <td><strong>${item.stock}</strong></td>
                <td>${item.threshold}</td>
                <td><span class="status-badge status-${status.class}">${status.label}</span></td>
                <td>₱${item.costPrice.toFixed(2)}</td>
                <td>₱${totalValue.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
}

function renderMovementReport() {
    const tableBody = document.getElementById('reportTableBody');
    
    if (reportData.length === 0) {
        tableBody.innerHTML = '<tr class="empty-row"><td colspan="6">No transactions found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = reportData.map(txn => {
        const item = allInventoryData.find(i => i.id === txn.itemId);
        const itemName = item ? item.name : 'Unknown Item';
        const date = new Date(txn.timestamp);
        const dateStr = formatDateTime(date);
        
        const typeLabels = {
            'addition': '➕ Addition',
            'sale': '💸 Sale',
            'return': '↩️ Return',
            'adjustment': '🔄 Adjustment'
        };
        
        return `
            <tr>
                <td>${dateStr}</td>
                <td>${itemName}</td>
                <td>${typeLabels[txn.type] || txn.type}</td>
                <td><strong>${txn.quantity}</strong></td>
                <td>${txn.user}</td>
                <td>${txn.notes || '-'}</td>
            </tr>
        `;
    }).join('');
}

function updateSummary() {
    if (reportData.length === 0) {
        document.getElementById('summaryTotalItems').textContent = '0';
        document.getElementById('summaryTotalUnits').textContent = '0';
        document.getElementById('summaryInventoryValue').textContent = '₱0';
        document.getElementById('summaryLowStock').textContent = '0';
        return;
    }
    
    const totalItems = reportData.length;
    const totalUnits = reportData.reduce((sum, item) => sum + item.stock, 0);
    const totalValue = reportData.reduce((sum, item) => sum + (item.stock * item.costPrice), 0);
    const lowStock = reportData.filter(item => item.stock <= item.threshold).length;
    
    document.getElementById('summaryTotalItems').textContent = totalItems;
    document.getElementById('summaryTotalUnits').textContent = totalUnits;
    document.getElementById('summaryInventoryValue').textContent = formatCurrency(totalValue);
    document.getElementById('summaryLowStock').textContent = lowStock;
}

function updateSummaryForMovement() {
    if (reportData.length === 0) {
        document.getElementById('summaryTotalItems').textContent = '0';
        document.getElementById('summaryTotalUnits').textContent = '0';
        document.getElementById('summaryInventoryValue').textContent = '₱0';
        document.getElementById('summaryLowStock').textContent = '0';
        return;
    }
    
    const totalTransactions = reportData.length;
    const totalQuantityMoved = reportData.reduce((sum, txn) => sum + txn.quantity, 0);
    
    let additions = 0, sales = 0, returns = 0;
    reportData.forEach(txn => {
        if (txn.type === 'addition') additions += txn.quantity;
        else if (txn.type === 'sale') sales += txn.quantity;
        else if (txn.type === 'return') returns += txn.quantity;
    });
    
    document.getElementById('summaryTotalItems').textContent = totalTransactions;
    document.getElementById('summaryTotalUnits').textContent = totalQuantityMoved;
    document.getElementById('summaryInventoryValue').innerHTML = `
        <small>In: ${additions} | Out: ${sales} | Ret: ${returns}</small>
    `;
    document.getElementById('summaryLowStock').textContent = '-';
}

function exportToCSV() {
    if (reportData.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }
    
    let csv = '';
    let headers = [];
    
    if (currentReportType === 'movement') {
        headers = ['Date', 'Product', 'Type', 'Quantity', 'User', 'Notes'];
        csv = headers.join(',') + '\n';
        
        reportData.forEach(txn => {
            const item = allInventoryData.find(i => i.id === txn.itemId);
            const itemName = item ? item.name : 'Unknown';
            const date = formatDateTime(new Date(txn.timestamp));
            csv += `"${date}","${itemName}","${txn.type}",${txn.quantity},"${txn.user}","${txn.notes || ''}"\n`;
        });
    } else {
        headers = ['Ingredient', 'Category', 'Current Stock', 'Threshold', 'Status', 'Cost Price', 'Total Value'];
        csv = headers.join(',') + '\n';
        
        reportData.forEach(item => {
            const totalValue = item.stock * item.costPrice;
            const status = getStockStatus(item.stock, item.threshold);
            csv += `"${item.name}","${item.category}",${item.stock},${item.threshold},"${status.label}",${item.costPrice},${totalValue.toFixed(2)}\n`;
        });
    }
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_report_${currentReportType}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Report exported successfully!', 'success');
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
