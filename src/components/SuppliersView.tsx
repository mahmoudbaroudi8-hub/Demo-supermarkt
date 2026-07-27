import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  AlertOctagon, 
  ClipboardList, 
  Users, 
  Eye, 
  Edit3, 
  ChevronRight, 
  ChevronLeft,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';
import { Supplier, SupplyOrder } from '../types';
import { TOP_PURCHASED_PRODUCTS } from '../data/mockData';

interface SuppliersViewProps {
  suppliers: Supplier[];
  supplyOrders: SupplyOrder[];
  onOpenAddModal: () => void;
  onEditSupplier?: (supplier: Supplier) => void;
  onDeleteSupplier?: (id: string) => void;
  onUpdateOrderStatus?: (orderId: string, status: 'delivered' | 'cancelled') => void;
  currencySymbol?: string;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  supplyOrders,
  onOpenAddModal,
  onEditSupplier,
  onDeleteSupplier,
  onUpdateOrderStatus,
  currencySymbol = 'جنيه'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.includes(searchQuery) ||
      s.category.includes(searchQuery) ||
      s.phone.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage) || 1;
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#1B2A5B] flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            إدارة الموردين وطلبات التوريد
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            إدارة بيانات الموردين المعتمدين وتتبع مستحقات الشركات وطلبات الشراء.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مورد جديد</span>
        </button>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: High Risk Pending Dues */}
        <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-red-50/20">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 mb-1">
              <AlertOctagon className="w-4 h-4" />
              <span>عالية المخاطر</span>
            </div>
            <span className="text-2xl font-black text-[#1B2A5B]">45,290</span>
            <span className="text-xs font-bold text-slate-600 mr-1">{currencySymbol}</span>
            <span className="text-xs text-slate-500 block mt-1 font-bold">مستحقات معلقة</span>
          </div>
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center border border-red-200">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Active Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">8 متأخرة</span>
            <span className="text-2xl font-black text-[#1B2A5B]">28</span>
            <span className="text-xs font-bold text-slate-600 mr-1">طلب</span>
            <span className="text-xs text-slate-500 block mt-1 font-bold">طلبات نشطة</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Total Suppliers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 block mb-1">+12% هذا الشهر</span>
            <span className="text-2xl font-black text-[#1B2A5B]">142</span>
            <span className="text-xs font-bold text-slate-600 mr-1">مورد</span>
            <span className="text-xs text-slate-500 block mt-1 font-bold">إجمالي الموردين</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <h2 className="font-bold text-sm text-[#1B2A5B]">قائمة الموردين المعتمدين</h2>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث عن مورد أو رقم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              />
            </div>

            <button 
              onClick={() => {
                const exportData = filteredSuppliers.map(s => ({
                  'اسم المورد': s.name,
                  'الفئة': s.category,
                  'الهاتف': s.phone,
                  'آخر طلبية': s.lastOrderDate,
                  'المستحقات': s.dueAmount || 0,
                  'الحالة': s.status === 'active' ? 'نشط' : 'غير نشط'
                }));
                exportToCsv('الموردين_سوبرماركت_الاصيل.csv', exportData);
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير البيانات</span>
            </button>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#1B2A5B] text-white">
                <th className="p-3.5 font-bold">اسم المورد</th>
                <th className="p-3.5 font-bold">الفئة</th>
                <th className="p-3.5 font-bold">رقم التواصل</th>
                <th className="p-3.5 font-bold">آخر طلبية</th>
                <th className="p-3.5 font-bold text-center">الحالة</th>
                <th className="p-3.5 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedSuppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-7 h-7 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-bold text-xs">
                      {s.name.charAt(0)}
                    </span>
                    <span>{s.name}</span>
                  </td>
                  <td className="p-3 text-slate-600">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold">
                      {s.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 font-mono" dir="ltr">{s.phone}</td>
                  <td className="p-3 text-slate-600">{s.lastOrderDate}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      s.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {s.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg" title="عرض التفاصيل">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg" title="تعديل">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-bold text-slate-600">
          <span>عرض {paginatedSuppliers.length} من أصل 142 مورد</span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-[#1B2A5B] text-white rounded-lg">{currentPage}</span>
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

      {/* 2 Bottom Columns: Top Purchased Products + Recent Supply Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Most Purchased Products */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-sm text-[#1B2A5B] border-b border-slate-100 pb-2">
            أكثر المنتجات شراءً من الموردين
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-2.5 rounded-r-lg font-bold">المنتج</th>
                  <th className="p-2.5 font-bold">الفئة</th>
                  <th className="p-2.5 rounded-l-lg font-bold">الكمية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {TOP_PURCHASED_PRODUCTS.map((prod, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-800">{prod.name}</td>
                    <td className="p-2.5 text-slate-600">{prod.category}</td>
                    <td className="p-2.5 font-bold text-blue-700">{prod.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Supply Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-sm text-[#1B2A5B] border-b border-slate-100 pb-2">
            آخر طلبات التوريد
          </h3>

          <div className="space-y-3">
            {supplyOrders.map((ord) => (
              <div key={ord.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-blue-700">{ord.orderNumber}</span>
                    <span className="text-slate-800 font-bold">{ord.supplierName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">{ord.timeAgo}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                    ord.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {ord.status === 'pending' && <Clock className="w-3 h-3" />}
                    {ord.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                    {ord.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                    {ord.status === 'pending' ? 'قيد المراجعة' : ord.status === 'delivered' ? 'تم التسليم' : 'ملغي'}
                  </span>

                  {ord.status === 'pending' && onUpdateOrderStatus && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, 'delivered')}
                        className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 transition"
                        title="تأكيد الاستلام والتوريد"
                      >
                        تأكيد استلام
                      </button>
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, 'cancelled')}
                        className="px-2 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg hover:bg-slate-300 transition"
                        title="إلغاء الطلب"
                      >
                        إلغاء
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
