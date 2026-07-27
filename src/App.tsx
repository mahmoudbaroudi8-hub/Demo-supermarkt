import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoginScreen } from './components/LoginScreen';
import { DemoExpiredLock } from './components/DemoExpiredLock';
import { DashboardView } from './components/DashboardView';
import { PosView } from './components/PosView';
import { InventoryView } from './components/InventoryView';
import { SuppliersView } from './components/SuppliersView';
import { CustomersView } from './components/CustomersView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { 
  InvoiceModal, 
  AddProductModal, 
  EditProductModal,
  AddSupplierModal, 
  AddCustomerModal, 
  ProcurementModal,
  AddUserModal
} from './components/Modals';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_SUPPLIERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_DAILY_REPORTS, 
  INITIAL_USERS, 
  INITIAL_SUPPLY_ORDERS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';

import { 
  TabType, 
  Product, 
  StockStatus,
  Transaction, 
  Supplier, 
  Customer, 
  DailyReport, 
  SystemUser, 
  SupplyOrder, 
  NotificationItem 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Application Data States initialized with LocalStorage fallback
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('supermarket_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('supermarket_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('supermarket_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('supermarket_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [dailyReports, setDailyReports] = useState<DailyReport[]>(() => {
    const saved = localStorage.getItem('supermarket_dailyReports');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_REPORTS;
  });

  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem('supermarket_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [supplyOrders, setSupplyOrders] = useState<SupplyOrder[]>(() => {
    const saved = localStorage.getItem('supermarket_supplyOrders');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLY_ORDERS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Sync to LocalStorage on changes
  React.useEffect(() => {
    localStorage.setItem('supermarket_products', JSON.stringify(products));
  }, [products]);

  React.useEffect(() => {
    localStorage.setItem('supermarket_transactions', JSON.stringify(transactions));
  }, [transactions]);

  React.useEffect(() => {
    localStorage.setItem('supermarket_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  React.useEffect(() => {
    localStorage.setItem('supermarket_customers', JSON.stringify(customers));
  }, [customers]);

  React.useEffect(() => {
    localStorage.setItem('supermarket_users', JSON.stringify(users));
  }, [users]);

  React.useEffect(() => {
    localStorage.setItem('supermarket_supplyOrders', JSON.stringify(supplyOrders));
  }, [supplyOrders]);

  // Current User Session State
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; isDeveloper?: boolean } | null>(() => {
    const saved = localStorage.getItem('supermarket_user');
    return saved ? JSON.parse(saved) : null;
  });

  // 24-Hour Demo Expiration Timer Engine & Developer Kill Switch
  const DEMO_DURATION_MS = 24 * 60 * 60 * 1000;

  const [isForceLocked, setIsForceLocked] = useState<boolean>(() => {
    return localStorage.getItem('supermarket_force_locked') === 'true';
  });

  const [demoStartTime, setDemoStartTime] = useState<number>(() => {
    const saved = localStorage.getItem('supermarket_demo_start');
    if (saved) return parseInt(saved, 10);
    const now = Date.now();
    localStorage.setItem('supermarket_demo_start', now.toString());
    return now;
  });

  const [timeLeftMs, setTimeLeftMs] = useState<number>(() => {
    if (localStorage.getItem('supermarket_force_locked') === 'true') return 0;
    return Math.max(0, (demoStartTime + DEMO_DURATION_MS) - Date.now());
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem('supermarket_force_locked') === 'true') {
        setTimeLeftMs(0);
      } else {
        const remaining = Math.max(0, (demoStartTime + DEMO_DURATION_MS) - Date.now());
        setTimeLeftMs(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [demoStartTime]);

  const isDemoExpired = isForceLocked || timeLeftMs <= 0;

  const handleForceLockSystem = () => {
    localStorage.setItem('supermarket_force_locked', 'true');
    setIsForceLocked(true);
    setTimeLeftMs(0);
  };

  const handleResetDemoTimer = () => {
    const now = Date.now();
    setDemoStartTime(now);
    localStorage.setItem('supermarket_demo_start', now.toString());
    localStorage.removeItem('supermarket_force_locked');
    setIsForceLocked(false);
    setTimeLeftMs(DEMO_DURATION_MS);
  };

  // Global State & Settings
  const [globalSearch, setGlobalSearch] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('جنيه مصري');
  const [storeName, setStoreName] = useState('سوبر ماركت الأصيل');
  const [taxNumber, setTaxNumber] = useState('300123456789');
  const [footerNote, setFooterNote] = useState(
    'شكراً لزيارتكم! البضاعة المباعة ترد وتستبدل خلال 14 يوم بشرط وجود الفاتورة الأصلية.'
  );
  const [enableQr, setEnableQr] = useState(true);

  const handleLogin = (name: string, role: string, isDeveloper?: boolean) => {
    const user = { name, role, isDeveloper: !!isDeveloper };
    setCurrentUser(user);
    localStorage.setItem('supermarket_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('supermarket_user');
  };

  // Modals visibility state
  const [activeInvoice, setActiveInvoice] = useState<Transaction | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isProcurementOpen, setIsProcurementOpen] = useState(false);
  const [procurementProductName, setProcurementProductName] = useState('');

  // Handlers
  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleAddSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`
    };
    setSuppliers(prev => [newSupplier, ...prev]);
  };

  const handleAddCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`
    };
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const handleAddUser = (userData: Omit<SystemUser, 'id'>) => {
    const newUser: SystemUser = {
      ...userData,
      id: `usr-${Date.now()}`
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleUpdateSupplyOrderStatus = (orderId: string, status: 'delivered' | 'cancelled') => {
    setSupplyOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status } : ord));
    
    // Add Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: status === 'delivered' ? 'تم استلام وتوريد الطلبية' : 'تم إلغاء طلب التوريد',
        message: status === 'delivered' ? `تم إغلاق طلب التوريد وتأكيد استلام السلع.` : `تم إلغاء طلب التوريد بنجاح.`,
        time: 'الآن',
        unread: true,
        type: status === 'delivered' ? 'success' : 'warning'
      },
      ...prev
    ]);
  };

  const handleResetData = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSuppliers(INITIAL_SUPPLIERS);
    setCustomers(INITIAL_CUSTOMERS);
    setDailyReports(INITIAL_DAILY_REPORTS);
    setUsers(INITIAL_USERS);
    setSupplyOrders(INITIAL_SUPPLY_ORDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const handleOpenProcurement = (productName?: string) => {
    setProcurementProductName(productName || '');
    setIsProcurementOpen(true);
  };

  const handleSubmitProcurement = (prodName: string, quantity: number) => {
    const newOrder: SupplyOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}#`,
      supplierName: 'شركة الهدى للتوريدات',
      category: 'مواد غذائية',
      status: 'pending',
      timeAgo: 'الآن',
      amount: quantity * 50
    };
    setSupplyOrders(prev => [newOrder, ...prev]);
    
    // Add Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'طلب توريد جديد',
        message: `تم إصدار طلب توريد لمنتج (${prodName}) بالكمية ${quantity} قطعة.`,
        time: 'الآن',
        unread: true,
        type: 'info'
      },
      ...prev
    ]);
  };

  const handleCompleteSale = (newTxData: Omit<Transaction, 'id' | 'invoiceNumber'>) => {
    const invNumber = `INV-${9843 + transactions.length}#`;
    const newTransaction: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
      invoiceNumber: invNumber
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Deduct stock from products
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const soldItem = newTxData.items.find(item => item.productName === prod.name);
        if (soldItem) {
          const newStock = Math.max(0, prod.stock - soldItem.quantity);
          let newStatus: StockStatus = 'in_stock';
          if (newStock === 0) newStatus = 'out_of_stock';
          else if (newStock <= 10) newStatus = 'low_stock';
          
          return {
            ...prod,
            stock: newStock,
            status: newStatus
          };
        }
        return prod;
      });
    });

    // Update customer points & purchases if customer is matched
    if (newTxData.customerName && newTxData.customerName !== 'نقدي / زبون عابر') {
      setCustomers(prevCustomers => {
        return prevCustomers.map(cust => {
          if (cust.name === newTxData.customerName || newTxData.customerName.includes(cust.name)) {
            const addedPurchases = newTxData.amount;
            const addedPoints = Math.floor(newTxData.amount / 10);
            const totalPurchases = cust.totalPurchases + addedPurchases;
            let level = cust.level;
            if (totalPurchases >= 10000) level = 'gold';
            else if (totalPurchases >= 5000) level = 'silver';

            return {
              ...cust,
              totalPurchases,
              loyaltyPoints: cust.loyaltyPoints + addedPoints,
              level
            };
          }
          return cust;
        });
      });
    }

    // Show invoice modal automatically
    setActiveInvoice(newTransaction);

    // Add success notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'عملية بيع ناجحة',
        message: `تم إصدار الفاتورة ${invNumber} بقيمة ${newTxData.amount.toFixed(2)} ${currencySymbol}`,
        time: 'الآن',
        unread: true,
        type: 'success'
      },
      ...prev
    ]);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const lowStockCount = products.filter(p => p.stock <= 10).length;

  // 1. If Demo is expired and current user is NOT a developer, show full Lock screen
  if (isDemoExpired && !currentUser?.isDeveloper) {
    return (
      <DemoExpiredLock
        onDeveloperUnlock={(devName, isDev) => {
          handleResetDemoTimer();
          handleLogin(devName, 'مدير النظام المطور', isDev);
        }}
        onResetDemoTimer={handleResetDemoTimer}
        currentUser={currentUser}
      />
    );
  }

  // 2. If no user is logged in
  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onQuickDemoReset={handleResetData}
        timeLeftMs={timeLeftMs}
        isDemoExpired={isDemoExpired}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-slate-800 font-['Cairo',sans-serif] antialiased pb-16 lg:pb-0">
      
      {/* Mobile Sidebar Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-[#1B2A5B] z-10 shadow-2xl h-full">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              lowStockCount={lowStockCount} 
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          lowStockCount={lowStockCount} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Navigation & Search */}
        <Topbar 
          notifications={notifications}
          setNotifications={setNotifications}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          activeTabLabel={activeTab}
          currentUser={currentUser}
          onLogout={handleLogout}
          onQuickDemoReset={handleResetData}
          timeLeftMs={timeLeftMs}
          onResetDemoTimer={handleResetDemoTimer}
          onForceLockSystem={handleForceLockSystem}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              transactions={transactions}
              products={products}
              onViewInvoice={(tx) => setActiveInvoice(tx)}
              onOpenProcurement={handleOpenProcurement}
              currencySymbol={currencySymbol}
            />
          )}

          {activeTab === 'pos' && (
            <PosView
              products={products}
              customers={customers}
              onCompleteSale={handleCompleteSale}
              currencySymbol={currencySymbol}
              onOpenAddCustomerModal={() => setIsAddCustomerOpen(true)}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              onOpenAddModal={() => setIsAddProductOpen(true)}
              onEditProduct={(product) => setEditingProduct(product)}
              onDeleteProduct={handleDeleteProduct}
              onOpenProcurement={handleOpenProcurement}
              currencySymbol={currencySymbol}
            />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersView
              suppliers={suppliers}
              supplyOrders={supplyOrders}
              onOpenAddModal={() => setIsAddSupplierOpen(true)}
              onUpdateOrderStatus={handleUpdateSupplyOrderStatus}
              currencySymbol={currencySymbol}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              onOpenAddModal={() => setIsAddCustomerOpen(true)}
              onDeleteCustomer={handleDeleteCustomer}
              currencySymbol={currencySymbol}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              dailyReports={dailyReports}
              currencySymbol={currencySymbol}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              users={users}
              onOpenAddUserModal={() => setIsAddUserOpen(true)}
              onDeleteUser={handleDeleteUser}
              onResetData={handleResetData}
              currencySymbol={currencySymbol}
              setCurrencySymbol={setCurrencySymbol}
              storeName={storeName}
              setStoreName={setStoreName}
              taxNumber={taxNumber}
              setTaxNumber={setTaxNumber}
              footerNote={footerNote}
              setFooterNote={setFooterNote}
              enableQr={enableQr}
              setEnableQr={setEnableQr}
              currentUser={currentUser}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      <InvoiceModal
        transaction={activeInvoice}
        onClose={() => setActiveInvoice(null)}
        currencySymbol={currencySymbol}
        storeName={storeName}
        taxNumber={taxNumber}
        footerNote={footerNote}
        enableQr={enableQr}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <EditProductModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSaveProduct={handleEditProduct}
      />

      <AddSupplierModal
        isOpen={isAddSupplierOpen}
        onClose={() => setIsAddSupplierOpen(false)}
        onAddSupplier={handleAddSupplier}
      />

      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onAddCustomer={handleAddCustomer}
      />

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddUser={handleAddUser}
      />

      <ProcurementModal
        productName={procurementProductName}
        isOpen={isProcurementOpen}
        onClose={() => setIsProcurementOpen(false)}
        onSubmitOrder={handleSubmitProcurement}
      />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1B2A5B] border-t border-slate-700/80 px-2 py-1.5 flex items-center justify-around z-40 text-white shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'dashboard' ? 'text-amber-400 font-extrabold bg-white/10' : 'text-slate-300'
          }`}
        >
          <span className="text-[10px]">الرئيسية</span>
        </button>

        <button
          onClick={() => setActiveTab('pos')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'pos' ? 'text-amber-400 font-extrabold bg-white/10' : 'text-slate-300'
          }`}
        >
          <span className="text-[10px]">نقطة البيع</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'inventory' ? 'text-amber-400 font-extrabold bg-white/10' : 'text-slate-300'
          }`}
        >
          <span className="text-[10px]">المخزون</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-300 hover:text-white"
        >
          <span className="text-[10px]">القائمة ☰</span>
        </button>
      </nav>

    </div>
  );
}
