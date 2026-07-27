import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  UserCheck, 
  Barcode, 
  ShoppingCart, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { Product, CartItem, Customer, Transaction } from '../types';

interface PosViewProps {
  products: Product[];
  customers: Customer[];
  onCompleteSale: (newTx: Omit<Transaction, 'id' | 'invoiceNumber'>) => void;
  currencySymbol?: string;
  onOpenAddCustomerModal: () => void;
}

export const PosView: React.FC<PosViewProps> = ({
  products,
  customers,
  onCompleteSale,
  currencySymbol = 'جنيه',
  onOpenAddCustomerModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([
    { product: products[0] || { id: 'p1', name: 'حليب جهينة 1 لتر', category: 'الألبان والبيض', barcode: '628100012345', price: 38.00, stock: 154, status: 'in_stock', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&auto=format&fit=crop&q=80', unit: 'عبوة' }, quantity: 2 },
    { product: products[4] || { id: 'p5', name: 'خبز باجيت فرنسي طازج', category: 'المخبوزات', barcode: '628399944556', price: 15.00, stock: 85, status: 'in_stock', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80', unit: 'ربطة' }, quantity: 1 }
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState('نقدي / زبون عابر');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'credit'>('cash');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'الكل',
    'الألبان والبيض',
    'البقوليات والسلع',
    'الزيوت والسمن',
    'المخبوزات',
    'المشروبات والشاي',
    'الخضروات والفواكه',
    'المنظفات والمنزل'
  ];

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert(`عذراً، منتج (${product.name}) نفذت كميته بالكامل من المخزون!`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`الكمية المتاحة بـالمخزن للمنتج هي (${product.stock}) قطعة فقط!`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.14; // 14% VAT
  const total = subtotal + tax;

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'F2') {
        e.preventDefault();
        onOpenAddCustomerModal();
      } else if (e.key === 'F12') {
        e.preventDefault();
        if (cart.length > 0) setShowPaymentModal(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (showPaymentModal) setShowPaymentModal(false);
        else clearCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, showPaymentModal]);

  // Handle Checkout Completion
  const handleFinalCheckout = () => {
    if (cart.length === 0) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

    onCompleteSale({
      date: dateStr,
      time: timeStr,
      customerName: selectedCustomer,
      amount: total,
      subtotal,
      tax,
      status: paymentMethod === 'credit' ? 'credit' : 'paid',
      paymentMethod,
      items: cart.map((i) => ({
        productName: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
      })),
    });

    clearCart();
    setShowPaymentModal(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-[#F5F7FA] overflow-hidden select-none">
      
      {/* Main Grid: Left Products Grid + Right Side Cart */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* PRODUCTS AREA (Left side) */}
        <div className="flex-1 p-5 flex flex-col overflow-y-auto space-y-4">
          
          {/* Top Bar: Search / Barcode Input + Category Tabs */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            {/* Search / Barcode Input */}
            <div className="relative flex-1">
              <Barcode className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="قم بمسح الباركود أو ابحث عن المنتج هنا... (F1)"
                className="w-full pr-11 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-2xs"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1B2A5B] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 mb-2.5 border border-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/70 text-white backdrop-blur-xs">
                      {product.unit}
                    </span>
                    {product.stock <= 5 && (
                      <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                        {product.stock === 0 ? 'نفذت' : `متبقي ${product.stock}`}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-xs text-slate-800 line-clamp-2 leading-snug mb-1">
                    {product.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold block mb-2">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                  <div>
                    <span className="text-sm font-black text-blue-700">{product.price.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-500 font-bold mr-1">{currencySymbol}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`p-2 rounded-xl text-white font-bold transition flex items-center justify-center cursor-pointer ${
                      product.stock === 0
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/30 active:scale-95'
                    }`}
                    title="إضافة للسلة"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* SIDE CART AREA (Right side) */}
        <div className="w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col justify-between shadow-lg shrink-0 z-10">
          
          {/* Cart Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-sm text-[#1B2A5B]">سلة المشتريات</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} أصناف
              </span>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:underline font-bold flex items-center gap-1"
              >
                <span>إفراغ</span>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Customer Selection Capsule */}
          <div className="p-3 bg-blue-50/50 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-bold">العميل الحالي:</span>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-800 focus:outline-none"
            >
              <option value="نقدي / زبون عابر">نقدي / زبون عابر</option>
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.level === 'gold' ? 'ذهبي' : c.level === 'silver' ? 'فضي' : 'برونزي'})
                </option>
              ))}
            </select>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6 space-y-2">
                <ShoppingCart className="w-12 h-12 text-slate-300 stroke-1" />
                <p className="text-xs font-bold">السلة فارغة حالياً</p>
                <p className="text-[11px]">اضغط على المنتجات لإضافتها مباشرة للسلة</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.product.name}</h4>
                    <span className="text-[11px] font-bold text-blue-700">
                      {item.product.price.toFixed(2)} {currencySymbol}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-6 h-6 bg-white hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center justify-center shadow-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-xs text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-6 h-6 bg-white hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center justify-center shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary & Checkout Button */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600 font-semibold">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-800">{subtotal.toFixed(2)} {currencySymbol}</span>
              </div>
              <div className="flex justify-between">
                <span>ضريبة القيمة المضافة (14%):</span>
                <span className="font-bold text-slate-800">{tax.toFixed(2)} {currencySymbol}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#1B2A5B] pt-2 border-t border-slate-200">
                <span>الإجمالي النهائي:</span>
                <span className="text-blue-700">{total.toFixed(2)} {currencySymbol}</span>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0}
              className={`w-full py-3 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 shadow-md transition cursor-pointer ${
                cart.length === 0
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 active:scale-98'
              }`}
            >
              <Check className="w-5 h-5" />
              <span>إتمام البيع (F12)</span>
            </button>
          </div>

        </div>

      </div>

      {/* Bottom Shortcuts Bar */}
      <footer className="bg-[#1B2A5B] text-white px-6 py-2.5 text-xs flex flex-wrap items-center justify-between border-t border-slate-800 shrink-0 font-medium">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><strong className="bg-blue-600 px-1.5 py-0.5 rounded text-[10px]">F1</strong> بحث منتج</span>
          <span className="flex items-center gap-1.5"><strong className="bg-blue-600 px-1.5 py-0.5 rounded text-[10px]">F2</strong> إضافة عميل</span>
          <span className="flex items-center gap-1.5"><strong className="bg-emerald-600 px-1.5 py-0.5 rounded text-[10px]">F12</strong> إتمام البيع</span>
          <span className="flex items-center gap-1.5"><strong className="bg-red-600 px-1.5 py-0.5 rounded text-[10px]">Esc</strong> إلغاء الطلب</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>حالة النظام: متصل بالخادم 🟢</span>
        </div>
      </footer>

      {/* PAYMENT METHOD MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#1B2A5B] flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-600" />
                اختر طريقة الدفع
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 space-y-3">
              <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold block mb-1">المبلغ المطلوب سداده</span>
                <span className="text-3xl font-black text-blue-700">{total.toFixed(2)}</span>
                <span className="text-xs font-bold text-slate-600 mr-1.5">{currencySymbol}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 font-bold text-xs transition cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-600/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-6 h-6" />
                  <span>نقدي (Cash)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 font-bold text-xs transition cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-600/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span>بطاقة (Card)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 font-bold text-xs transition cursor-pointer ${
                    paymentMethod === 'credit'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-600/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-6 h-6" />
                  <span>آجل (Credit)</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleFinalCheckout}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition shadow-md shadow-emerald-600/30 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>تأكيد وطباعة الفاتورة</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
