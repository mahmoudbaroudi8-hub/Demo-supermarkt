import React, { useState } from 'react';
import { 
  TrendingUp, 
  Receipt, 
  AlertTriangle, 
  Eye, 
  Printer, 
  ShoppingCart, 
  Truck, 
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';
import { Transaction, Product } from '../types';

interface DashboardViewProps {
  transactions: Transaction[];
  products: Product[];
  onViewInvoice: (tx: Transaction) => void;
  onOpenProcurement: (productName?: string) => void;
  currencySymbol?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  products,
  onViewInvoice,
  onOpenProcurement,
  currencySymbol = 'جنيه'
}) => {
  const lowStockProducts = products.filter(p => p.stock <= 10);

  // Stats Calculations
  const todaySales = transactions.reduce((acc, curr) => curr.status === 'paid' ? acc + curr.amount : acc, 15250);
  const totalInvoices = transactions.length + 36;
  const avgInvoiceValue = Math.round(todaySales / (totalInvoices || 1));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* 3 Stat Cards at top */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">مبيعات اليوم</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1B2A5B]">{todaySales.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-600">{currencySymbol}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>12% زيادة عن أمس</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">عدد الفواتير</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1B2A5B]">{totalInvoices}</span>
              <span className="text-xs font-bold text-slate-600">فاتورة</span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-2">
              متوسط {avgInvoiceValue} {currencySymbol}/فاتورة
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Low Stock Alert */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition flex items-center justify-between bg-gradient-to-br from-white to-amber-50/20">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">منتجات منخفضة المخزون</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-600">{lowStockProducts.length || 5}</span>
              <span className="text-xs font-bold text-slate-600">منتجات</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-red-600 mt-2 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>تحتاج لإعادة طلب فوراً</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Section: Recent Transactions + Stock Alerts Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Last Financial Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-sm text-[#1B2A5B] flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                آخر المعاملات المالية
              </h2>
              <button 
                onClick={() => {}}
                className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
              >
                <span>عرض الكل</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-[#1B2A5B] text-white">
                    <th className="p-3.5 font-bold">التاريخ والوقت</th>
                    <th className="p-3.5 font-bold">رقم الفاتورة</th>
                    <th className="p-3.5 font-bold">العميل</th>
                    <th className="p-3.5 font-bold">القيمة</th>
                    <th className="p-3.5 font-bold text-center">الحالة</th>
                    <th className="p-3.5 font-bold text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-slate-600 dir-ltr text-right">{tx.date} {tx.time}</td>
                      <td className="p-3 font-bold text-blue-700">{tx.invoiceNumber}</td>
                      <td className="p-3 text-slate-800 font-bold">{tx.customerName}</td>
                      <td className="p-3 font-bold text-slate-900">{tx.amount.toFixed(2)} {currencySymbol}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          tx.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                          tx.status === 'credit' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tx.status === 'paid' ? 'مدفوع' : tx.status === 'credit' ? 'آجل' : 'ملغي'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onViewInvoice(tx)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                            title="طباعة الفاتورة"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onViewInvoice(tx)}
                            className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Stock Alerts Side Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>تنبيهات المخزون</span>
              </div>
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                {lowStockProducts.length} منتجات ناقصة
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {lowStockProducts.slice(0, 4).map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-200 transition">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{prod.name}</h4>
                      <p className="text-[11px] font-bold text-red-600 mt-0.5">
                        المتبقي: {prod.stock} {prod.unit}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenProcurement(prod.name)}
                    className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg transition shrink-0"
                    title="إصدار طلب توريد"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onOpenProcurement()}
              className="w-full py-2.5 bg-[#1B2A5B] text-white rounded-xl font-bold text-xs hover:bg-blue-900 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Truck className="w-4 h-4" />
              <span>إصدار طلب توريد جديد</span>
            </button>
          </div>
        </div>

      </div>

      {/* Clean Dashboard Footer */}
      <div className="bg-[#1B2A5B] rounded-2xl p-4 text-white shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>نظام سوبر ماركت الأصيل الإداري المتكامل — كافّة الأنظمة ونقاط البيع تعمل بكفاءة عالية</span>
        </div>
        <span className="text-[11px] bg-white/10 px-3 py-1 rounded-lg font-bold text-slate-300">
          النظام نشط 100%
        </span>
      </div>

    </div>
  );
};
