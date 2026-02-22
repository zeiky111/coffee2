// Admin Dashboard JavaScript
let currentAdminTab = 'menu';
let editingItemId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadAdminMenu();
});

function switchAdminTab(tab) {
    currentAdminTab = tab;
    
    // Update tab buttons
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(tab)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Show/hide panels
    document.getElementById('menuPanel').classList.toggle('hidden', tab !== 'menu');
    document.getElementById('categoriesPanel').classList.toggle('hidden', tab !== 'categories');
    document.getElementById('settingsPanel').classList.toggle('hidden', tab !== 'settings');
    
    // Load data for the active tab
    if (tab === 'menu') loadAdminMenu();
    if (tab === 'categories') loadAdminCategories();
    if (tab === 'settings') loadAdminSettings();
}

// ========== MENU ITEMS ==========
function loadAdminMenu() {
    const items = getMenuItems();
    const categories = getMenuCategories();
    const container = document.getElementById('adminItemsTable');
    
    if (items.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px;">No menu items yet. Add one to get started!</p>';
        return;
    }
    
    const tableHTML = `
        <table class="items-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => {
                    const category = categories.find(c => c.id === item.category);
                    return `
                        <tr>
                            <td><strong>${item.name}</strong><br><small>${item.description || ''}</small></td>
                            <td>${category ? category.icon + ' ' + category.name : 'Unknown'}</td>
                            <td>${formatCurrency(item.price)}</td>
                            <td>
                                <span style="color: ${item.available ? 'var(--success)' : 'var(--danger)'}; font-weight: 600;">
                                    ${item.available ? '✓ Available' : '✗ Hidden'}
                                </span>
                            </td>
                            <td>
                                <div class="action-btns">
                                    <button class="action-btn edit-btn" onclick="editMenuItem(${item.id})">Edit</button>
                                    <button class="action-btn toggle-btn" onclick="toggleItemAvailability(${item.id})">
                                        ${item.available ? 'Hide' : 'Show'}
                                    </button>
                                    <button class="action-btn delete-btn" onclick="deleteMenuItem(${item.id})">Delete</button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

function filterAdminMenu() {
    const searchTerm = document.getElementById('adminSearch').value.toLowerCase();
    const rows = document.querySelectorAll('.items-table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function openAddItemModal() {
    editingItemId = null;
    document.getElementById('itemModalTitle').textContent = 'Add Menu Item';
    document.getElementById('editItemId').value = '';
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemDescription').value = '';
    document.getElementById('itemAvailable').checked = true;
    
    loadCategoryOptions();
    document.getElementById('itemModal').classList.add('active');
}

function editMenuItem(itemId) {
    const items = getMenuItems();
    const item = items.find(i => i.id === itemId);
    
    if (!item) return;
    
    editingItemId = itemId;
    document.getElementById('itemModalTitle').textContent = 'Edit Menu Item';
    document.getElementById('editItemId').value = itemId;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemDescription').value = item.description || '';
    document.getElementById('itemAvailable').checked = item.available;
    
    loadCategoryOptions();
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemModal').classList.add('active');
}

function loadCategoryOptions() {
    const categories = getMenuCategories();
    const select = document.getElementById('itemCategory');
    
    select.innerHTML = categories.map(cat => 
        `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
    ).join('');
}

function saveMenuItem() {
    const name = document.getElementById('itemName').value.trim();
    const category = parseInt(document.getElementById('itemCategory').value);
    const price = parseFloat(document.getElementById('itemPrice').value);
    const description = document.getElementById('itemDescription').value.trim();
    const available = document.getElementById('itemAvailable').checked;
    
    if (!name || !category || !price) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const items = getMenuItems();
    
    if (editingItemId) {
        // Update existing item
        const index = items.findIndex(i => i.id === editingItemId);
        if (index !== -1) {
            items[index] = {
                ...items[index],
                name,
                category,
                price,
                description,
                available
            };
        }
        showNotification('Item updated successfully', 'success');
    } else {
        // Add new item
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        items.push({
            id: newId,
            name,
            category,
            price,
            description,
            available
        });
        showNotification('Item added successfully', 'success');
    }
    
    saveMenuItems(items);
    loadAdminMenu();
    closeItemModal();
}

function toggleItemAvailability(itemId) {
    const items = getMenuItems();
    const item = items.find(i => i.id === itemId);
    
    if (item) {
        item.available = !item.available;
        saveMenuItems(items);
        loadAdminMenu();
        showNotification(`Item ${item.available ? 'shown' : 'hidden'}`, 'success');
    }
}

function deleteMenuItem(itemId) {
    if (!confirm('Delete this menu item? This cannot be undone.')) return;
    
    const items = getMenuItems();
    const filtered = items.filter(i => i.id !== itemId);
    saveMenuItems(filtered);
    loadAdminMenu();
    showNotification('Item deleted', 'success');
}

function closeItemModal() {
    document.getElementById('itemModal').classList.remove('active');
    editingItemId = null;
}

// ========== CATEGORIES ==========
function loadAdminCategories() {
    const categories = getMenuCategories();
    const container = document.getElementById('categoriesList');
    
    container.innerHTML = categories.map(cat => `
        <div class="category-card">
            <div class="category-card-icon">${cat.icon}</div>
            <div class="category-card-name">${cat.name}</div>
            <div class="action-btns" style="margin-top: 15px;">
                <button class="action-btn delete-btn" onclick="deleteCategory(${cat.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function openAddCategoryModal() {
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryIcon').value = '';
    document.getElementById('categoryModal').classList.add('active');
}

function saveCategory() {
    const name = document.getElementById('categoryName').value.trim();
    const icon = document.getElementById('categoryIcon').value.trim();
    
    if (!name || !icon) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const categories = getMenuCategories();
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    
    categories.push({ id: newId, name, icon });
    saveMenuCategories(categories);
    loadAdminCategories();
    closeCategoryModal();
    showNotification('Category added', 'success');
}

function deleteCategory(categoryId) {
    const items = getMenuItems();
    const hasItems = items.some(item => item.category === categoryId);
    
    if (hasItems) {
        showNotification('Cannot delete category with items. Remove items first.', 'error');
        return;
    }
    
    if (!confirm('Delete this category?')) return;
    
    const categories = getMenuCategories();
    const filtered = categories.filter(c => c.id !== categoryId);
    saveMenuCategories(filtered);
    loadAdminCategories();
    showNotification('Category deleted', 'success');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
}

// ========== SETTINGS ==========
function loadAdminSettings() {
    const settings = getSettings();
    document.getElementById('shopName').value = settings.shopName;
    document.getElementById('tableCount').value = settings.tableCount;
    document.getElementById('taxRate').value = settings.taxRate;
}

function saveSettings() {
    const settings = {
        shopName: document.getElementById('shopName').value.trim(),
        tableCount: parseInt(document.getElementById('tableCount').value) || 12,
        taxRate: parseFloat(document.getElementById('taxRate').value) || 0
    };
    
    saveSettings(settings);
    
    // Update tables if count changed
    const currentTables = getTables();
    if (currentTables.length !== settings.tableCount) {
        const tables = [];
        for (let i = 1; i <= settings.tableCount; i++) {
            const existing = currentTables.find(t => t.number === i);
            tables.push(existing || {
                number: i,
                status: 'available',
                customerName: '',
                guestCount: 0,
                notes: ''
            });
        }
        saveTables(tables);
    }
    
    showNotification('Settings saved', 'success');
}

// Close modals when clicking outside
document.getElementById('itemModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'itemModal') closeItemModal();
});

document.getElementById('categoryModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'categoryModal') closeCategoryModal();
});
