import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Truck, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Layers,
  Box,
  CheckCircle2
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';
import { Product, StockStatus } from '../types';

interface InventoryViewProps {
  products: Product[];
  onOpenAddModal: () => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onOpenProcurement: (productName?: string) => void;
  currencySymbol?: string;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onOpenAddModal,
  onEditProduct,
  onDeleteProduct,
  onOpenProcurement,
  currencySymbol = 'جنيه'
}) => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedStockStatus, setSelectedStockStatus] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchesStatus =
      selectedStockStatus === 'الكل' ||
      (selectedStockStatus === 'متوفر' && p.status === 'in_stock') ||
      (selectedStockStatus === 'منخفض' && p.status === 'low_stock') ||
      (selectedStockStatus === 'نفذ' && p.status === 'out_of_stock');
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      p.category.includes(searchQuery);

    return matchesCat && matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Summary Metrics
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const totalItemsCount = products.length;
  const inStockCount = products.filter((p) => p.status === 'in_stock').length;
  const lowOrOutCount = products.filter((p) => p.status !== 'in_stock').length;
  const lowStockAlertList = products.filter((p) => p.status !== 'in_stock');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#1B2A5B] flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            إدارة المخزون والسلع
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            متابعة الأصناف، والكميات المتاحة في المستودع وإصدار طلبات التوريد الفورية.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const exportData = filteredProducts.map(p => ({
                'الاسم': p.name,
                'القسم': p.category,
                'الباركود': p.barcode,
                'السعر': p.price,
                'المخزون': p.stock,
                'الوحدة': p.unit,
                'الحالة': p.status === 'in_stock' ? 'متوفر' : p.status === 'low_stock' ? 'منخفض' : 'نفذ'
              }));
              exportToCsv('المخزون_سوبرماركت_الاصيل.csv', exportData);
            }}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>تصدير البيانات (CSV)</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Filters + Table on Left, Alert & Stats on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Filters & Products Table */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-3 items-center justify-between text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="ابحث عن منتج، باركود، أو قسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">القسم:</span>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">الحالة:</span>
              <select
                value={selectedStockStatus}
                onChange={(e) => { setSelectedStockStatus(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 outline-none"
              >
                <option value="الكل">الكل</option>
                <option value="متوفر">متوفر</option>
                <option value="منخفض">مخزون منخفض</option>
                <option value="نفذ">نفذت الكمية</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-[#1B2A5B] text-white">
                    <th className="p-3.5 font-bold">الصورة</th>
                    <th className="p-3.5 font-bold">اسم المنتج</th>
                    <th className="p-3.5 font-bold">القسم</th>
                    <th className="p-3.5 font-bold">الباركود</th>
                    <th className="p-3.5 font-bold">سعر الوحدة</th>
                    <th className="p-3.5 font-bold text-center">الكمية</th>
                    <th className="p-3.5 font-bold text-center">الحالة</th>
                    <th className="p-3.5 font-bold text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                        لا توجد منتجات مطابقة لخيارات البحث والتصفية
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-9 h-9 object-cover rounded-xl border border-slate-200"
                          />
                        </td>
                        <td className="p-3 font-bold text-slate-800">{product.name}</td>
                        <td className="p-3 text-slate-600">{product.category}</td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{product.barcode}</td>
                        <td className="p-3 font-bold text-blue-700">{product.price.toFixed(2)} {currencySymbol}</td>
                        <td className="p-3 text-center font-bold text-slate-800">{product.stock} {product.unit}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            product.status === 'in_stock' ? 'bg-emerald-100 text-emerald-800' :
                            product.status === 'low_stock' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.status === 'in_stock' ? 'متوفر' : product.status === 'low_stock' ? 'مخزون منخفض' : 'نفذت الكمية'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {onEditProduct && (
                              <button
                                onClick={() => onEditProduct(product)}
                                className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                                title="تعديل المنتج"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => onOpenProcurement(product.name)}
                              className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                              title="طلب توريد"
                            >
                              <Truck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(product.id)}
                              className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition"
                              title="حذف المنتج"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>عرض {paginatedProducts.length} من أصل {filteredProducts.length} منتج</span>
              
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                      currentPage === idx + 1
                        ? 'bg-[#1B2A5B] text-white shadow-xs'
                        : 'bg-white border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Urgent Stock Alerts Side Card + Summary Metrics */}
        <div className="space-y-6">
          
          {/* Urgent Stock Alerts Card */}
          <div className="bg-white rounded-2xl border border-red-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>تنبيهات المخزون</span>
              </div>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {lowOrOutCount} تنبيهات
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">منتجات بحاجة لطلب توريد فوري:</p>

            <div className="space-y-3">
              {lowStockAlertList.map((item) => (
                <div key={item.id} className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">{item.name}</h4>
                    <span className="text-[11px] text-red-600 font-bold block mt-0.5">
                      {item.stock === 0 ? 'الحالة: غير متوفر' : `المتبقي: ${item.stock} ${item.unit}`}
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenProcurement(item.name)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                  >
                    اطلب الآن
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Summary Metrics Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#1B2A5B] border-b border-slate-100 pb-2">ملخص المخزون</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-bold block">إجمالي القيمة</span>
                <span className="text-base font-black text-blue-700">{totalValue.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-slate-500 mr-1">{currencySymbol}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-bold block">إجمالي الأصناف</span>
                <span className="text-base font-black text-slate-800">{totalItemsCount}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-800 font-bold block">أصناف متوفرة</span>
                <span className="text-base font-black text-emerald-700">{inStockCount}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-[11px] text-amber-800 font-bold block">أصناف ناقصة</span>
                <span className="text-base font-black text-amber-700">{lowOrOutCount}</span>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>سعة المستودع المستخدمة</span>
                <span className="text-blue-700">78%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>

          {/* AI Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-[#1B2A5B] text-white p-4 rounded-2xl shadow-sm text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>تحليل الذكاء الاصطناعي</span>
            </div>
            <p className="text-slate-200 leading-relaxed">
              توقع الطلب للأسبوع القادم بناءً على المبيعات السابقة يُظهر زيادة متوقعة في طلب منتجات الألبان بنسبة 15%.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
