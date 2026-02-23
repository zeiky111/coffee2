// Sales Monitoring System

let chartInstances = {};
let filteredOrders = [];
let allOrders = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeDateFilters();
    loadSalesData();
    generateCharts();
    loadRecentOrders();
    updateSummaryStats();
});

function initializeDateFilters() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    document.getElementById('fromDate').valueAsDate = sevenDaysAgo;
    document.getElementById('toDate').valueAsDate = today;
}

function loadSalesData() {
    allOrders = getOrders() || [];
    applyDateFilter();
}

function applyDateFilter() {
    const fromDate = new Date(document.getElementById('fromDate').value);
    const toDate = new Date(document.getElementById('toDate').value);
    
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);
    
    filteredOrders = allOrders.filter(order => {
        if (!order.timestamp) return false;
        const orderDate = new Date(order.timestamp);
        return orderDate >= fromDate && orderDate <= toDate;
    });
    
    updateTopStats();
    generateCharts();
    loadRecentOrders();
    updateSummaryStats();
    showNotification('Date filter applied', 'success');
}

function resetDateFilter() {
    initializeDateFilters();
    applyDateFilter();
}

function updateTopStats() {
    // Today's sales
    const today = new Date().toDateString();
    const todayOrders = filteredOrders.filter(o => new Date(o.timestamp).toDateString() === today);
    const todayTotal = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    document.getElementById('totalSalesToday').textContent = formatCurrency(todayTotal);
    document.getElementById('totalOrdersToday').textContent = todayOrders.length;
    
    const avgOrder = todayOrders.length > 0 ? todayTotal / todayOrders.length : 0;
    document.getElementById('avgOrderValue').textContent = formatCurrency(avgOrder);
    
    // Calculate top category
    const categoryMap = {};
    filteredOrders.forEach(order => {
        if (order.items) {
            order.items.forEach(item => {
                const categories = getMenuCategories();
                const items = getMenuItems();
                const menuItem = items.find(i => i.id === item.id);
                const category = categories.find(c => c.id === menuItem?.category);
                const categoryName = category ? category.name : 'Unknown';
                
                if (!categoryMap[categoryName]) {
                    categoryMap[categoryName] = 0;
                }
                categoryMap[categoryName] += item.price * item.quantity;
            });
        }
    });
    
    let topCategory = '-';
    let topAmount = 0;
    
    Object.entries(categoryMap).forEach(([cat, amount]) => {
        if (amount > topAmount) {
            topAmount = amount;
            topCategory = cat;
        }
    });
    
    document.getElementById('topCategory').textContent = topCategory;
    document.getElementById('topCategoryRevenue').textContent = formatCurrency(topAmount);
}

function generateCharts() {
    generateDailySalesChart();
    generateTopProductsChart();
    generateCategoryChart();
    generateHourlyChart();
}

function generateDailySalesChart() {
    const ctx = document.getElementById('dailySalesChart').getContext('2d');
    
    // Group by date
    const salesByDate = {};
    filteredOrders.forEach(order => {
        const date = new Date(order.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!salesByDate[date]) {
            salesByDate[date] = 0;
        }
        salesByDate[date] += order.total || 0;
    });
    
    const dates = Object.keys(salesByDate).sort();
    const amounts = dates.map(date => salesByDate[date]);
    
    if (chartInstances.dailySales) {
        chartInstances.dailySales.destroy();
    }
    
    chartInstances.dailySales = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Daily Sales',
                data: amounts,
                borderColor: '#C9A961',
                backgroundColor: 'rgba(201, 169, 97, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#5D3C2D',
                pointBorderColor: '#C9A961',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₱' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function generateTopProductsChart() {
    const ctx = document.getElementById('topProductsChart').getContext('2d');
    
    // Calculate top products
    const productMap = {};
    const items = getMenuItems();
    
    filteredOrders.forEach(order => {
        if (order.items) {
            order.items.forEach(item => {
                const product = items.find(i => i.id === item.id);
                const productName = product ? product.name : 'Unknown';
                
                if (!productMap[productName]) {
                    productMap[productName] = { quantity: 0, revenue: 0 };
                }
                productMap[productName].quantity += item.quantity;
                productMap[productName].revenue += item.price * item.quantity;
            });
        }
    });
    
    // Get top 5
    const sorted = Object.entries(productMap)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 5);
    
    const productNames = sorted.map(p => p[0]);
    const revenues = sorted.map(p => p[1].revenue);
    
    if (chartInstances.topProducts) {
        chartInstances.topProducts.destroy();
    }
    
    chartInstances.topProducts = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Revenue',
                data: revenues,
                backgroundColor: '#C9A961',
                borderColor: '#8B6F47',
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        callback: function(value) {
                            return '₱' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function generateCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    const categoryMap = {};
    const categories = getMenuCategories();
    const items = getMenuItems();
    
    filteredOrders.forEach(order => {
        if (order.items) {
            order.items.forEach(item => {
                const menuItem = items.find(i => i.id === item.id);
                const category = categories.find(c => c.id === menuItem?.category);
                const categoryName = category ? category.name : 'Unknown';
                
                if (!categoryMap[categoryName]) {
                    categoryMap[categoryName] = 0;
                }
                categoryMap[categoryName] += item.price * item.quantity;
            });
        }
    });
    
    const categoryNames = Object.keys(categoryMap);
    const categoryAmounts = Object.values(categoryMap);
    const colors = [
        '#C9A961', '#8B6F47', '#5D3C2D', '#D4A574', '#A0805D'
    ];
    
    if (chartInstances.category) {
        chartInstances.category.destroy();
    }
    
    chartInstances.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryNames,
            datasets: [{
                data: categoryAmounts,
                backgroundColor: colors.slice(0, categoryNames.length),
                borderColor: '#FFFAF5',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function generateHourlyChart() {
    const ctx = document.getElementById('hourlyChart').getContext('2d');
    
    // Group by hour
    const hourlyMap = {};
    for (let i = 0; i < 24; i++) {
        hourlyMap[i] = 0;
    }
    
    filteredOrders.forEach(order => {
        const hour = new Date(order.timestamp).getHours();
        hourlyMap[hour] += order.total || 0;
    });
    
    const hours = Object.keys(hourlyMap).map(h => h.toString().padStart(2, '0') + ':00');
    const amounts = Object.values(hourlyMap);
    
    if (chartInstances.hourly) {
        chartInstances.hourly.destroy();
    }
    
    chartInstances.hourly = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Hourly Sales',
                data: amounts,
                backgroundColor: '#C9A961',
                borderColor: '#8B6F47',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '₱' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function loadRecentOrders() {
    const tbody = document.getElementById('recentOrdersBody');
    const recentOrders = filteredOrders.slice(-10).reverse();
    
    if (recentOrders.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No orders in this period</td></tr>';
        return;
    }
    
    tbody.innerHTML = recentOrders.map(order => {
        const time = new Date(order.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const itemCount = (order.items || []).length;
        const discount = order.discount || 0;
        
        return `
            <tr>
                <td><strong>${order.orderNumber || 'N/A'}</strong></td>
                <td>${time}</td>
                <td>${itemCount} item${itemCount !== 1 ? 's' : ''}</td>
                <td><strong>${formatCurrency(order.total)}</strong></td>
                <td><span class="status-badge status-in">Completed</span></td>
            </tr>
        `;
    }).join('');
}

function updateSummaryStats() {
    // Monthly total (30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyOrders = allOrders.filter(o => new Date(o.timestamp) >= thirtyDaysAgo);
    const monthlyTotal = monthlyOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    document.getElementById('monthlyTotal').textContent = formatCurrency(monthlyTotal);
    
    // Weekly total (7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyOrders = allOrders.filter(o => new Date(o.timestamp) >= sevenDaysAgo);
    const weeklyTotal = weeklyOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    document.getElementById('weeklyTotal').textContent = formatCurrency(weeklyTotal);
    
    // Best day
    const salesByDate = {};
    filteredOrders.forEach(order => {
        const date = new Date(order.timestamp).toLocaleDateString();
        if (!salesByDate[date]) {
            salesByDate[date] = 0;
        }
        salesByDate[date] += order.total || 0;
    });
    
    let bestDate = '-';
    let bestAmount = 0;
    
    Object.entries(salesByDate).forEach(([date, amount]) => {
        if (amount > bestAmount) {
            bestAmount = amount;
            bestDate = date;
        }
    });
    
    document.getElementById('bestDay').textContent = bestDate;
    document.getElementById('bestDayAmount').textContent = formatCurrency(bestAmount);
    
    // Average daily
    const daysWithSales = Object.keys(salesByDate).length;
    const avgDaily = daysWithSales > 0 ? Object.values(salesByDate).reduce((a, b) => a + b, 0) / daysWithSales : 0;
    document.getElementById('avgDaily').textContent = formatCurrency(avgDaily);
}

function refreshSalesData() {
    loadSalesData();
    showNotification('Sales data refreshed', 'success');
}
