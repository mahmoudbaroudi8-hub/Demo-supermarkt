import React, { useState } from 'react';
import { X, Printer, CheckCircle, Package, UserPlus, Truck, ShieldCheck, AlertCircle, ShoppingCart, Upload, Image as ImageIcon } from 'lucide-react';
import { Transaction, Product, Supplier, Customer, SystemUser, StockStatus, CustomerLevel, SupplierStatus } from '../types';

/* ==================== INVOICE MODAL ==================== */
interface InvoiceModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  currencySymbol?: string;
  storeName?: string;
  taxNumber?: string;
  footerNote?: string;
  enableQr?: boolean;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  transaction,
  onClose,
  currencySymbol = 'جنيه',
  storeName = 'سوبر ماركت الأصيل',
  taxNumber = '300123456789',
  footerNote = 'شكراً لزيارتكم! البضاعة المباعة ترد وتستبدل خلال 14 يوم بشرط وجود الفاتورة الأصلية.',
  enableQr = true
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 no-print overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-base">
            <CheckCircle className="w-5 h-5" />
            <span>تفاصيل الفاتورة المالية</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRINTABLE AREA */}
        <div className="printable-invoice py-4 text-slate-800">
          {/* Receipt Header */}
          <div className="text-center pb-4 border-b border-slate-200 border-dashed">
            <h2 className="text-xl font-black text-[#1B2A5B]">{storeName}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">فرع القاهرة - الرقم الضريبي: {taxNumber}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
              فاتورة ضريبية مبسطة #{transaction.invoiceNumber}
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-2 my-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div><span className="text-slate-500">التاريخ والوقت:</span> <strong className="text-slate-800">{transaction.date} - {transaction.time}</strong></div>
            <div><span className="text-slate-500">العميل:</span> <strong className="text-slate-800">{transaction.customerName}</strong></div>
            <div>
              <span className="text-slate-500">طريقة الدفع:</span>{' '}
              <strong className="text-slate-800">
                {transaction.paymentMethod === 'cash' ? 'نقدي (Cash)' : transaction.paymentMethod === 'card' ? 'بطاقة ماليّة (Card)' : 'آجل (On Credit)'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">الحالة:</span>{' '}
              <span className={`px-2 py-0.5 rounded font-bold ${
                transaction.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                transaction.status === 'credit' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
              }`}>
                {transaction.status === 'paid' ? 'مدفوع' : transaction.status === 'credit' ? 'آجل' : 'ملغي'}
              </span>
            </div>
          </div>

          {/* Purchased Items Table */}
          <table className="w-full text-xs text-right border-collapse my-4">
            <thead>
              <tr className="bg-[#1B2A5B] text-white">
                <th className="p-2.5 rounded-r-lg">المنتج</th>
                <th className="p-2.5 text-center">الكمية</th>
                <th className="p-2.5 text-center">السعر</th>
                <th className="p-2.5 text-left rounded-l-lg">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transaction.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-800">{item.productName}</td>
                  <td className="p-2.5 text-center">{item.quantity}</td>
                  <td className="p-2.5 text-center">{item.price.toFixed(2)} {currencySymbol}</td>
                  <td className="p-2.5 text-left font-bold">{(item.quantity * item.price).toFixed(2)} {currencySymbol}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Totals */}
          <div className="border-t border-slate-200 pt-3 space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>المجموع الفرعي:</span>
              <span>{transaction.subtotal.toFixed(2)} {currencySymbol}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>ضريبة القيمة المضافة (14%):</span>
              <span>{transaction.tax.toFixed(2)} {currencySymbol}</span>
            </div>
            <div className="flex justify-between text-base font-black text-[#1B2A5B] pt-2 border-t border-slate-300">
              <span>الإجمالي النهائي:</span>
              <span className="text-blue-700">{transaction.amount.toFixed(2)} {currencySymbol}</span>
            </div>
          </div>

          {/* QR Code and Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-200 border-dashed flex items-center gap-4">
            {enableQr && (
              <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg p-1 shrink-0 flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    `INVOICE:${transaction.invoiceNumber}|TOTAL:${transaction.amount}|TAX:${transaction.tax}`
                  )}`}
                  alt="ZATCA QR"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <p className="text-[11px] text-slate-500 leading-tight italic">
              {footerNote}
            </p>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-100 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition"
          >
            إغلاق النافذة
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition flex items-center gap-2 shadow-md shadow-blue-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الفاتورة</span>
          </button>
        </div>
      </div>
    </div>
  );
};


/* ==================== ADD PRODUCT MODAL ==================== */
interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('البقوليات والسلع');
  const [barcode, setBarcode] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('عبوة');
  const [image, setImage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const numStock = parseInt(stock) || 0;
    let status: StockStatus = 'in_stock';
    if (numStock === 0) status = 'out_of_stock';
    else if (numStock <= 10) status = 'low_stock';

    onAddProduct({
      name,
      category,
      barcode: barcode || Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      price: parseFloat(price) || 0,
      stock: numStock,
      status,
      unit: unit || 'قطعة',
      image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80'
    });

    setName('');
    setPrice('');
    setStock('');
    setBarcode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="font-bold text-base text-[#1B2A5B] flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            إضافة منتج جديد للمخزون
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">اسم المنتج الأصلي *</label>
            <input
              type="text"
              required
              placeholder="مثال: حليب المراعي 1 لتر"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">القسم / الفئة</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="الألبان والبيض">الألبان والبيض</option>
                <option value="البقوليات والسلع">البقوليات والسلع</option>
                <option value="الزيوت والسمن">الزيوت والسمن</option>
                <option value="المخبوزات">المخبوزات</option>
                <option value="المشروبات والشاي">المشروبات والشاي</option>
                <option value="الخضروات والفواكه">الخضروات والفواكه</option>
                <option value="المنظفات والمنزل">المنظفات والمنزل</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم الباركود</label>
              <input
                type="text"
                placeholder="تلقائي أو إدخال يدوي"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">سعر البيع *</label>
              <input
                type="number"
                step="0.5"
                required
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">الكمية الأولى</label>
              <input
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">وحدة القياس</label>
              <input
                type="text"
                placeholder="عبوة / كجم / كيس"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">صورة المنتج (رفع ملف أو اختيار صورة جاهزة أو رابط)</label>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  placeholder="رابط الصورة (https://...)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-left outline-none text-[11px]"
                  dir="ltr"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-blue-100 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع صورة من جهازك</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Quick Presets */}
            <p className="text-[10px] text-slate-500 font-bold mb-1">أو اختر صورة جاهزة حسب القسم:</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'ألبان', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&auto=format&fit=crop&q=80' },
                { name: 'أرز وسلع', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=80' },
                { name: 'زيوت', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&auto=format&fit=crop&q=80' },
                { name: 'مخبوزات', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80' },
                { name: 'مشروبات', url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=200&auto=format&fit=crop&q=80' },
                { name: 'خضار', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop&q=80' }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-bold transition cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
            >
              حفظ المنتج
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


/* ==================== ADD SUPPLIER MODAL ==================== */
interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => void;
}

export const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ isOpen, onClose, onAddSupplier }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('مواد غذائية');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    onAddSupplier({
      name,
      category,
      phone,
      lastOrderDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      status: 'active',
      dueAmount: 0
    });

    setName('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="font-bold text-base text-[#1B2A5B] flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            إضافة مورد جديد
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">اسم المورد / الشركة *</label>
            <input
              type="text"
              required
              placeholder="مثال: شركة النيل للتوزيع"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">فئة التوريد</label>
            <input
              type="text"
              placeholder="مثال: مواد غذائية / ألبان / منظفات"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">رقم التواصل / الهاتف *</label>
            <input
              type="text"
              required
              placeholder="050xxxxxxx أو 010xxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
            >
              حفظ المورد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


/* ==================== ADD CUSTOMER MODAL ==================== */
interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onAddCustomer }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState<CustomerLevel>('bronze');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    onAddCustomer({
      name,
      phone,
      totalPurchases: 0,
      loyaltyPoints: 50, // bonus joining points
      joinDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      level
    });

    setName('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="font-bold text-base text-[#1B2A5B] flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            إضافة عميل جديد
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">اسم العميل *</label>
            <input
              type="text"
              required
              placeholder="مثال: عبد الله أحمد"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">رقم الهاتف *</label>
            <input
              type="text"
              required
              placeholder="010xxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">مستوى الولاء الافتراضي</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as CustomerLevel)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="bronze">برونزي (Bronze)</option>
              <option value="silver">فضي (Silver)</option>
              <option value="gold">ذهبي (Gold)</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
            >
              تسجيل العميل
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


/* ==================== PROCUREMENT REORDER MODAL ==================== */
interface ProcurementModalProps {
  productName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (productName: string, quantity: number) => void;
}

export const ProcurementModal: React.FC<ProcurementModalProps> = ({
  productName = '',
  isOpen,
  onClose,
  onSubmitOrder
}) => {
  const [selectedProduct, setSelectedProduct] = useState(productName);
  const [quantity, setQuantity] = useState(50);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitOrder(selectedProduct || productName, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="font-bold text-base text-[#1B2A5B] flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            إصدار طلب توريد / إعادة طلب
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">المنتج المطلوب</label>
            <input
              type="text"
              required
              value={selectedProduct || productName}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">الكمية المطلوبة (وحدة/كرتونة)</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 10)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>سيتم إرسال طلب التوريد لمزودي الخدمة المعتمدين فور إقراره وتحديث حالة الشحنات النشطة.</p>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
            >
              تأكيد وإرسال طلب التوريد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


/* ==================== ADD USER MODAL ==================== */
interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: Omit<SystemUser, 'id'>) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('كاشير / موظف مبيعات');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddUser({
      name,
      role,
      lastLogin: 'لم يسجل دخول بعد',
      status
    });

    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="font-bold text-base text-[#1B2A5B] flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            إضافة مستخدم نظام جديد
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">اسم الموظف / المستخدم *</label>
            <input
              type="text"
              required
              placeholder="مثال: خالد محمود"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">الدور الوظيفي / الصلاحيات</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="مدير النظام">مدير النظام</option>
              <option value="كاشير / موظف مبيعات">كاشير / موظف مبيعات</option>
              <option value="مسؤول مخازن ومشتريات">مسؤول مخازن ومشتريات</option>
              <option value="محاسب مالية">محاسب مالية</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">حالة الحساب</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="active">نشط (مفعل)</option>
              <option value="inactive">غير نشط (معطل)</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
            >
              إضافة المستخدم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


/* ==================== EDIT PRODUCT MODAL ==================== */
interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (updatedProduct: Product) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose, onSaveProduct }) => {
  if (!isOpen || !product) return null;

  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [barcode, setBarcode] = useState(product.barcode);
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [unit, setUnit] = useState(product.unit);
  const [image, setImage] = useState(product.image);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numStock = parseInt(stock) || 0;
    let status: StockStatus = 'in_stock';
    if (numStock === 0) status = 'out_of_stock';
    else if (numStock <= 10) status = 'low_stock';

    onSaveProduct({
      ...product,
      name,
      category,
      barcode,
      price: parseFloat(price) || 0,
      stock: numStock,
      status,
      unit,
      image
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="font-bold text-base text-[#1B2A5B] flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            تعديل بيانات المنتج
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">اسم المنتج *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">القسم</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-bold"
              >
                <option value="الألبان والبيض">الألبان والبيض</option>
                <option value="البقوليات والسلع">البقوليات والسلع</option>
                <option value="الزيوت والسمن">الزيوت والسمن</option>
                <option value="المخبوزات">المخبوزات</option>
                <option value="المشروبات والشاي">المشروبات والشاي</option>
                <option value="الخضروات والفواكه">الخضروات والفواكه</option>
                <option value="المنظفات والمنزل">المنظفات والمنزل</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">الباركود</label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">السعر *</label>
              <input
                type="number"
                step="0.5"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-bold text-blue-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">الكمية بالمخزن</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">الوحدة</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">صورة المنتج (تعديل بالرفع أو رابط أو اختيار صورة)</label>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  placeholder="رابط الصورة (https://...)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-left outline-none text-[11px]"
                  dir="ltr"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-blue-100 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>تغيير الصورة بملف من جهازك</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Quick Presets */}
            <p className="text-[10px] text-slate-500 font-bold mb-1">أو اختيار صورة سريعة:</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'ألبان', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&auto=format&fit=crop&q=80' },
                { name: 'أرز وسلع', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=80' },
                { name: 'زيوت', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&auto=format&fit=crop&q=80' },
                { name: 'مخبوزات', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80' },
                { name: 'مشروبات', url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=200&auto=format&fit=crop&q=80' },
                { name: 'خضار', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop&q=80' }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-bold transition cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

