# ☕ Brew & Bean - Coffee Shop Management System

A professional, high-end coffee shop management system with a beautiful coffee-themed design. Built with pure HTML, CSS, and JavaScript - no frameworks needed!

## ✨ Features

### 1️⃣ Order Tracking / Kitchen Queue Helper
- **Order Entry**: Staff can quickly enter orders at the counter
- **Kitchen Display**: Real-time order queue showing pending, preparing, and completed orders
- **Order Status**: Track orders from pending → preparing → completed
- **Visual Stats**: Dashboard showing order counts and activity

**How to Use:**
1. Click "New Order" from the main dashboard
2. Select items from the menu by clicking on them
3. Adjust quantities with +/- buttons
4. Enter table number or customer name
5. Click "Submit to Kitchen"
6. Orders appear instantly on the Kitchen Queue page

### 2️⃣ Table / Queue Management
- **Table Status Tracking**: Available, Occupied, or Cleaning
- **Customer Information**: Track customer names and guest counts
- **Quick Overview**: Summary cards showing table availability
- **Table Notes**: Add special requests or notes to tables

**How to Use:**
1. Click "Table Management" from the main dashboard
2. Click on any table to view/edit details
3. Update status, customer name, guest count, and notes
4. Tables are color-coded by status for easy identification

### 3️⃣ Manual POS Helper (Without Payments)
- **Quick Checkout**: Fast item selection and billing
- **Auto-Calculate**: Automatic subtotal and total calculation
- **Discount Support**: Apply discounts to orders
- **Receipt Generation**: Print professional receipts
- **Search Function**: Quick search for menu items

**How to Use:**
1. Click "POS Helper" from the main dashboard
2. Add items by clicking on them
3. Apply discount if needed
4. Click "Print Receipt" to generate receipt
5. Handle payment manually (cash/card)

### 4️⃣ QR Menu + Update Dashboard
- **Customer-Facing Menu**: Beautiful mobile-friendly digital menu
- **Real-Time Updates**: Changes reflect immediately
- **Item Availability**: Hide unavailable items automatically
- **Admin Control**: Easy price and item management
- **No Printing Needed**: "Hindi na po kailangan magpa-print ulit ng menu!"

**How to Use:**
- **For Customers**: Access qr-menu.html (share via QR code)
- **For Admin**: 
  1. Click "Admin Panel" from main dashboard
  2. Add/edit/delete menu items
  3. Update prices instantly
  4. Toggle item availability (hide/show)
  5. Manage categories

## 🚀 Getting Started

### Installation
1. Extract all files to a folder
2. Open `index.html` in a web browser
3. That's it! No installation or setup required

### Files Structure
```
coffeeshop/
├── index.html              (Main Dashboard)
├── order-entry.html        (Order Entry Page)
├── kitchen-display.html    (Kitchen Queue)
├── table-management.html   (Table Management)
├── pos-system.html         (POS Helper)
├── qr-menu.html           (Customer Menu)
├── admin-dashboard.html    (Admin Panel)
├── styles.css             (All Styling)
├── app.js                 (Core Functions)
├── order-entry.js         (Order Entry Logic)
├── kitchen-display.js     (Kitchen Logic)
├── table-management.js    (Table Logic)
├── pos-system.js          (POS Logic)
├── qr-menu.js            (Menu Display Logic)
└── admin-dashboard.js     (Admin Logic)
```

## 🎨 Design Features

- **Coffee Shop Vibes**: Warm brown, cream, and coffee-themed colors
- **Smooth Animations**: Professional transitions and hover effects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Intuitive UI**: Easy to use, even for non-technical staff
- **Visual Feedback**: Notifications for all actions
- **Modern Look**: Clean, professional interface

## 💾 Data Storage

- All data stored in browser's **LocalStorage**
- No database or server required
- Data persists between sessions
- Works offline completely

## 📱 How to Create QR Code for Menu

1. Use any QR code generator (like qr-code-generator.com)
2. Generate QR code pointing to your menu page URL
3. Print and display QR code for customers to scan
4. Customers can view menu on their phones

## 🔧 Customization

### Change Shop Name:
1. Go to Admin Panel → Settings
2. Update "Shop Name"
3. Click "Save Settings"

### Add New Menu Items:
1. Go to Admin Panel → Menu Items
2. Click "+ Add Item"
3. Fill in details
4. Click "Save Item"

### Change Number of Tables:
1. Go to Admin Panel → Settings
2. Update "Number of Tables"
3. Click "Save Settings"

### Add New Categories:
1. Go to Admin Panel → Categories
2. Click "+ Add Category"
3. Enter name and emoji icon
4. Click "Save Category"

## 🎯 Best Practices

1. **Regular Updates**: Update menu prices and availability daily
2. **Clear Orders**: Review and clear completed orders regularly
3. **Table Management**: Update table status after each customer
4. **Backup Data**: Occasionally export/backup localStorage data
5. **Staff Training**: Train staff on each module

## 🌟 Pro Tips

- Use keyboard shortcuts by focusing search bars
- Double-click items to add them quickly
- Right-click to see browser options
- Keep Kitchen Display on a dedicated screen
- Refresh Kitchen Display periodically for updates

## 🎨 Color Palette

- Primary Brown: `#6F4E37`
- Secondary Brown: `#A0826D`
- Accent Gold: `#D4A574`
- Dark Brown: `#3E2723`
- Light Cream: `#F5E6D3`
- Cream: `#FFF8E7`

## 📄 Browser Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- LocalStorage enabled
- Minimum 1024px width for best experience

## 🆘 Troubleshooting

**Orders not appearing in Kitchen?**
- Refresh the kitchen display page
- Check that orders were submitted (look for success notification)

**Menu items not showing?**
- Go to Admin Panel and ensure items are marked as "Available"
- Refresh the page

**Data lost?**
- Data is stored in browser's LocalStorage
- Clearing browser data will reset everything
- Use same browser/device to maintain data

## 📞 Support

For customization or additional features, contact your developer.

---

## 🎉 Enjoy Your Professional Coffee Shop Management System!

**Built with ❤️ and ☕**

Hindi na kailangan mag-alala sa lost orders, manual calculations, o mag-print ng menu!
Everything is digital, organized, and professional! 🚀
