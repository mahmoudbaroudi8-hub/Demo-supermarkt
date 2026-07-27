export type TabType = 
  | 'dashboard' 
  | 'pos' 
  | 'inventory' 
  | 'suppliers' 
  | 'customers' 
  | 'reports' 
  | 'settings';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type InvoiceStatus = 'paid' | 'credit' | 'cancelled';

export type CustomerLevel = 'gold' | 'silver' | 'bronze';

export type SupplierStatus = 'active' | 'inactive';

export type ProcurementStatus = 'pending' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  category: string;
  barcode: string;
  price: number;
  costPrice?: number;
  stock: number;
  status: StockStatus;
  image: string;
  unit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  customerName: string;
  amount: number;
  subtotal: number;
  tax: number;
  status: InvoiceStatus;
  paymentMethod: 'cash' | 'card' | 'credit';
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  phone: string;
  lastOrderDate: string;
  status: SupplierStatus;
  dueAmount?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalPurchases: number;
  loyaltyPoints: number;
  joinDate: string;
  level: CustomerLevel;
}

export interface DailyReport {
  id: string;
  date: string;
  transactionsCount: number;
  totalSales: number;
  avgInvoice: number;
  netProfit: number;
  status: 'stable' | 'high_growth' | 'low';
}

export interface SystemUser {
  id: string;
  name: string;
  role: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

export interface SupplyOrder {
  id: string;
  orderNumber: string;
  supplierName: string;
  category: string;
  status: ProcurementStatus;
  timeAgo: string;
  amount?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'warning' | 'info' | 'success';
}
