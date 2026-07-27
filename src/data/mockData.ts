import { Product, Transaction, Supplier, Customer, DailyReport, SystemUser, SupplyOrder, NotificationItem } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'حليب جهينة كامل الدسم 1 لتر',
    category: 'الألبان والبيض',
    barcode: '628100012345',
    price: 38.00,
    costPrice: 31.00,
    stock: 154,
    status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&auto=format&fit=crop&q=80',
    unit: 'عبوة'
  },
  {
    id: 'prod-2',
    name: 'حليب المراعي 1 لتر',
    category: 'الألبان والبيض',
    barcode: '628100012346',
    price: 42.00,
    costPrice: 34.00,
    stock: 12,
    status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80',
    unit: 'عبوة'
  },
  {
    id: 'prod-3',
    name: 'أرز بسمتي أبيض 5 كجم',
    category: 'البقوليات والسلع',
    barcode: '628211122334',
    price: 245.00,
    costPrice: 210.00,
    stock: 3,
    status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80',
    unit: 'كيس'
  },
  {
    id: 'prod-4',
    name: 'زيت دوار الشمس عافية 1.5 لتر',
    category: 'الزيوت والسمن',
    barcode: '628400055667',
    price: 115.00,
    costPrice: 95.00,
    stock: 0,
    status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80',
    unit: 'زجاجة'
  },
  {
    id: 'prod-5',
    name: 'خبز باجيت فرنسي طازج',
    category: 'المخبوزات',
    barcode: '628399944556',
    price: 15.00,
    costPrice: 8.00,
    stock: 85,
    status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
    unit: 'ربطة'
  },
  {
    id: 'prod-6',
    name: 'سكر أبيض ناعم 1 كجم',
    category: 'البقوليات والسلع',
    barcode: '628111222333',
    price: 32.00,
    costPrice: 26.00,
    stock: 200,
    status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=300&auto=format&fit=crop&q=80',
    unit: 'كيس'
  },
  {
    id: 'prod-7',
    name: 'شاي أسود العروسة عبوة 100 فتلة',
    category: 'المشروبات والشاي',
    barcode: '628112233445',
    price: 65.00,
    costPrice: 52.00,
    stock: 5,
    status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=80',
    unit: 'علبة'
  },
  {
    id: 'prod-8',
    name: 'زيت زيتون بكر ممتاز 500 مل',
    category: 'الزيوت والسمن',
    barcode: '628113344556',
    price: 185.00,
    costPrice: 150.00,
    stock: 42,
    status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80',
    unit: 'زجاجة'
  },
  {
    id: 'prod-9',
    name: 'طماطم طازجة درجة أولى 1 كجم',
    category: 'الخضروات والفواكه',
    barcode: '628114455667',
    price: 18.00,
    costPrice: 12.00,
    stock: 60,
    status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop&q=80',
    unit: 'كجم'
  },
  {
    id: 'prod-10',
    name: 'طبق بيض أحمر (30 بيضة)',
    category: 'الألبان والبيض',
    barcode: '628115566778',
    price: 155.00,
    costPrice: 135.00,
    stock: 35,
    status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=300&auto=format&fit=crop&q=80',
    unit: 'طبق'
  },
  {
    id: 'prod-11',
    name: 'مكرونة الملكة 400 جم',
    category: 'البقوليات والسلع',
    barcode: '628116677889',
    price: 14.00,
    costPrice: 10.00,
    stock: 120,
    status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1621996346565-e3def6163353?w=300&auto=format&fit=crop&q=80',
    unit: 'كيس'
  },
  {
    id: 'prod-12',
    name: 'رقائق كورن فليكس 375 جم',
    category: 'وجبات الإفطار',
    barcode: '628117788990',
    price: 85.00,
    costPrice: 68.00,
    stock: 28,
    status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=300&auto=format&fit=crop&q=80',
    unit: 'علبة'
  },
  {
    id: 'prod-13',
    name: 'جبنة بيضاء فيتا 500 جم',
    category: 'الألبان والبيض',
    barcode: '628118899001',
    price: 48.00,
    costPrice: 38.00,
    stock: 8,
    status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&auto=format&fit=crop&q=80',
    unit: 'علبة'
  },
  {
    id: 'prod-14',
    name: 'منظف أرضيات ديتول 1 لتر',
    category: 'المنظفات والمنزل',
    barcode: '628119900112',
    price: 78.00,
    costPrice: 60.00,
    stock: 45,
    status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300&auto=format&fit=crop&q=80',
    unit: 'عبوة'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    invoiceNumber: 'INV-9842#',
    date: '2023-10-20',
    time: '14:30',
    customerName: 'نقدي / زبون عابر',
    amount: 245.50,
    subtotal: 215.35,
    tax: 30.15,
    status: 'paid',
    paymentMethod: 'cash',
    items: [
      { productName: 'أرز بسمتي أبيض 5 كجم', quantity: 1, price: 245.00 }
    ]
  },
  {
    id: 'tx-2',
    invoiceNumber: 'INV-9841#',
    date: '2023-10-20',
    time: '14:15',
    customerName: 'شركة الهدى للتوريد',
    amount: 1850.00,
    subtotal: 1622.80,
    tax: 227.20,
    status: 'credit',
    paymentMethod: 'credit',
    items: [
      { productName: 'حليب جهينة كامل الدسم', quantity: 30, price: 38.00 },
      { productName: 'طبق بيض أحمر', quantity: 5, price: 155.00 }
    ]
  },
  {
    id: 'tx-3',
    invoiceNumber: 'INV-9840#',
    date: '2023-10-20',
    time: '13:45',
    customerName: 'نقدي / زبون عابر',
    amount: 56.00,
    subtotal: 49.12,
    tax: 6.88,
    status: 'paid',
    paymentMethod: 'card',
    items: [
      { productName: 'خبز باجيت فرنسي طازج', quantity: 2, price: 15.00 },
      { productName: 'سكر أبيض ناعم', quantity: 1, price: 26.00 }
    ]
  },
  {
    id: 'tx-4',
    invoiceNumber: 'INV-9839#',
    date: '2023-10-20',
    time: '13:20',
    customerName: 'أحمد محمد',
    amount: 120.00,
    subtotal: 105.26,
    tax: 14.74,
    status: 'cancelled',
    paymentMethod: 'cash',
    items: [
      { productName: 'شاي أسود العروسة', quantity: 2, price: 60.00 }
    ]
  },
  {
    id: 'tx-5',
    invoiceNumber: 'INV-9838#',
    date: '2023-10-20',
    time: '12:50',
    customerName: 'سارة صالح',
    amount: 320.00,
    subtotal: 280.70,
    tax: 39.30,
    status: 'paid',
    paymentMethod: 'card',
    items: [
      { productName: 'زيت زيتون بكر ممتاز', quantity: 1, price: 185.00 },
      { productName: 'طبق بيض أحمر', quantity: 1, price: 135.00 }
    ]
  },
  {
    id: 'tx-6',
    invoiceNumber: 'INV-9837#',
    date: '2023-10-20',
    time: '12:10',
    customerName: 'محمود خالد',
    amount: 410.00,
    subtotal: 359.65,
    tax: 50.35,
    status: 'paid',
    paymentMethod: 'cash',
    items: [
      { productName: 'سكر أبيض ناعم 1 كجم', quantity: 5, price: 32.00 },
      { productName: 'رقائق كورن فليكس', quantity: 2, price: 85.00 },
      { productName: 'حليب جهينة 1 لتر', quantity: 2, price: 40.00 }
    ]
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'شركة الهدى للتوريدات الغذائية',
    category: 'مواد غذائية',
    phone: '0501234567',
    lastOrderDate: '2023/10/24',
    status: 'active',
    dueAmount: 25400
  },
  {
    id: 'sup-2',
    name: 'مزارع الأصيل للألبان والبيض',
    category: 'ألبان وبيض',
    phone: '0559876543',
    lastOrderDate: '2023/10/25',
    status: 'active',
    dueAmount: 12890
  },
  {
    id: 'sup-3',
    name: 'توزيع النقاء للكيماويات والمنظفات',
    category: 'منظفات منزلية',
    phone: '0512345678',
    lastOrderDate: '2023/09/12',
    status: 'inactive',
    dueAmount: 0
  },
  {
    id: 'sup-4',
    name: 'مؤسسة الشرق للمعلبات والزيوت',
    category: 'معلبات وزيوت',
    phone: '0566554433',
    lastOrderDate: '2023/10/22',
    status: 'active',
    dueAmount: 7000
  },
  {
    id: 'sup-5',
    name: 'شركة المخبوزات الذهبية العالمية',
    category: 'مخبوزات وحلويات',
    phone: '0544332211',
    lastOrderDate: '2023/10/21',
    status: 'active',
    dueAmount: 0
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'محمد علي الهائم',
    phone: '01023456789',
    totalPurchases: 12500,
    loyaltyPoints: 1250,
    joinDate: '2023/05/12',
    level: 'gold'
  },
  {
    id: 'cust-2',
    name: 'سارة صالح العتيبي',
    phone: '01129384756',
    totalPurchases: 8200,
    loyaltyPoints: 820,
    joinDate: '2023/08/20',
    level: 'silver'
  },
  {
    id: 'cust-3',
    name: 'محمود خالد عبد الرحيم',
    phone: '01239485761',
    totalPurchases: 2100,
    loyaltyPoints: 210,
    joinDate: '2024/01/05',
    level: 'bronze'
  },
  {
    id: 'cust-4',
    name: 'ليلى أحمد القحطاني',
    phone: '01556677889',
    totalPurchases: 15750,
    loyaltyPoints: 1575,
    joinDate: '2023/03/15',
    level: 'gold'
  },
  {
    id: 'cust-5',
    name: 'عمر كمال الشريف',
    phone: '01011223344',
    totalPurchases: 4500,
    loyaltyPoints: 450,
    joinDate: '2023/11/30',
    level: 'silver'
  }
];

export const INITIAL_DAILY_REPORTS: DailyReport[] = [
  { id: 'rep-1', date: '2023-10-25', transactionsCount: 142, totalSales: 4250.00, avgInvoice: 29.90, netProfit: 1120.00, status: 'stable' },
  { id: 'rep-2', date: '2023-10-24', transactionsCount: 128, totalSales: 3890.00, avgInvoice: 30.40, netProfit: 945.00, status: 'stable' },
  { id: 'rep-3', date: '2023-10-23', transactionsCount: 156, totalSales: 5100.00, avgInvoice: 32.70, netProfit: 1430.00, status: 'high_growth' },
  { id: 'rep-4', date: '2023-10-22', transactionsCount: 115, totalSales: 2450.00, avgInvoice: 21.30, netProfit: 610.00, status: 'low' },
  { id: 'rep-5', date: '2023-10-21', transactionsCount: 134, totalSales: 4110.00, avgInvoice: 30.60, netProfit: 1080.00, status: 'stable' }
];

export const INITIAL_USERS: SystemUser[] = [
  { id: 'usr-1', name: 'أحمد المدير', role: 'مدير النظام', lastLogin: 'منذ ساعة', status: 'active' },
  { id: 'usr-2', name: 'كاشير 1 (محمد)', role: 'فني مبيعات / كاشير', lastLogin: 'منذ 3 ساعات', status: 'active' },
  { id: 'usr-3', name: 'سارة ممدوح', role: 'مسؤول مخازن ومشتريات', lastLogin: 'منذ يومين', status: 'inactive' }
];

export const INITIAL_SUPPLY_ORDERS: SupplyOrder[] = [
  { id: 'ord-1', orderNumber: 'ORD-2241#', supplierName: 'مزارع الأصيل - ألبان طازجة', category: 'ألبان وبيض', status: 'pending', timeAgo: 'منذ ساعتين', amount: 3400 },
  { id: 'ord-2', orderNumber: 'ORD-2238#', supplierName: 'شركة الهدى - زيوت نباتية', category: 'زيوت وسمن', status: 'delivered', timeAgo: 'أمس', amount: 8900 },
  { id: 'ord-3', orderNumber: 'ORD-2235#', supplierName: 'مؤسسة الشرق - معلبات', category: 'معلبات', status: 'cancelled', timeAgo: 'منذ يومين', amount: 1500 }
];

export const TOP_PURCHASED_PRODUCTS = [
  { name: 'أرز بسمتي هندي 5 كجم', category: 'مواد غذائية', qty: '1,250 وحدة' },
  { name: 'حليب طويل الأجل 1 لتر', category: 'ألبان', qty: '840 كرتون' },
  { name: 'زيت دوار الشمس 1.5 لتر', category: 'زيوت', qty: '620 وحدة' },
  { name: 'منظف أرضيات 3 لتر', category: 'منظفات', qty: '415 وحدة' }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', title: 'مخزون حرج', message: 'منتج أرز بسمتي 5 كجم شارف على الانتهاء (3 قطع متبقية)', time: 'منذ 10 دقائق', unread: true, type: 'warning' },
  { id: 'notif-2', title: 'طلب توريد جديد', message: 'تم استلام شحنة شركة الهدى بنجاح رقم ORD-2238#', time: 'منذ ساعة', unread: true, type: 'success' },
  { id: 'notif-3', title: 'تنبيه النظام', message: 'تم تحديث نظام الضريبة وتفعيل QR Code الفواتير الإلكترونية', time: 'أمس', unread: false, type: 'info' }
];
