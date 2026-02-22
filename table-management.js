// Table Management JavaScript
let currentTable = null;

document.addEventListener('DOMContentLoaded', () => {
    loadTables();
});

function loadTables() {
    const tables = getTables();
    updateTableSummary(tables);
    renderTablesGrid(tables);
}

function updateTableSummary(tables) {
    const available = tables.filter(t => t.status === 'available').length;
    const occupied = tables.filter(t => t.status === 'occupied').length;
    const cleaning = tables.filter(t => t.status === 'cleaning').length;
    
    document.getElementById('availableTables').textContent = available;
    document.getElementById('occupiedTables').textContent = occupied;
    document.getElementById('cleaningTables').textContent = cleaning;
}

function renderTablesGrid(tables) {
    const grid = document.getElementById('tablesGrid');
    grid.innerHTML = '';
    
    tables.forEach(table => {
        const card = document.createElement('div');
        card.className = `table-card ${table.status}`;
        card.onclick = () => openTableModal(table.number);
        
        const statusText = {
            'available': 'Available',
            'occupied': 'Occupied',
            'cleaning': 'Cleaning'
        };
        
        card.innerHTML = `
            <div class="table-number">Table ${table.number}</div>
            <div class="table-status ${table.status}">${statusText[table.status]}</div>
            ${table.customerName ? `<div class="table-info">👤 ${table.customerName}</div>` : ''}
            ${table.guestCount > 0 ? `<div class="table-info">👥 ${table.guestCount} guests</div>` : ''}
        `;
        
        grid.appendChild(card);
    });
}

function openTableModal(tableNumber) {
    const tables = getTables();
    currentTable = tables.find(t => t.number === tableNumber);
    
    if (!currentTable) return;
    
    document.getElementById('modalTitle').textContent = `Table ${tableNumber}`;
    document.getElementById('modalCustomerName').value = currentTable.customerName || '';
    document.getElementById('modalGuestCount').value = currentTable.guestCount || '';
    document.getElementById('modalStatus').value = currentTable.status;
    document.getElementById('modalNotes').value = currentTable.notes || '';
    
    document.getElementById('tableModal').classList.add('active');
}

function closeTableModal() {
    document.getElementById('tableModal').classList.remove('active');
    currentTable = null;
}

function saveTableDetails() {
    if (!currentTable) return;
    
    currentTable.customerName = document.getElementById('modalCustomerName').value.trim();
    currentTable.guestCount = parseInt(document.getElementById('modalGuestCount').value) || 0;
    currentTable.status = document.getElementById('modalStatus').value;
    currentTable.notes = document.getElementById('modalNotes').value.trim();
    
    const tables = getTables();
    const index = tables.findIndex(t => t.number === currentTable.number);
    
    if (index !== -1) {
        tables[index] = currentTable;
        saveTables(tables);
        loadTables();
        closeTableModal();
        showNotification(`Table ${currentTable.number} updated`, 'success');
    }
}

// Close modal when clicking outside
document.getElementById('tableModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'tableModal') {
        closeTableModal();
    }
});
