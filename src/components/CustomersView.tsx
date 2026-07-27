import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Star, 
  Award, 
  TrendingUp, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Gift
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';
import { Customer, CustomerLevel } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  onOpenAddModal: () => void;
  onEditCustomer?: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  currencySymbol?: string;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onOpenAddModal,
  onEditCustomer,
  onDeleteCustomer,
  currencySymbol = 'جنيه'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCustomers = customers.filter((c) => {
    const matchesLevel = selectedLevel === 'all' || c.level === selectedLevel;
    const matchesSearch =
      c.name.includes(searchQuery) || c.phone.includes(searchQuery);
    return matchesLevel && matchesSearch;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#1B2A5B] flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            إدارة العملاء وبرنامج الولاء - سوبر ماركت الأصيل
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            سجل العملاء، نقاط المكافآت، وتصنيفات شرائح المستهلكين.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة عميل جديد</span>
        </button>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Loyalty Program */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">برنامج الولاء (متوسط النقاط)</span>
            <span className="text-2xl font-black text-[#1B2A5B]">420</span>
            <span className="text-xs text-slate-500 block mt-1 font-bold">إجمالي نقاط النظام: 540k</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
        </div>

        {/* Card 2: Active Customers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">عملاء نشطون</span>
            <span className="text-2xl font-black text-[#1B2A5B]">856</span>
            <span className="text-xs text-emerald-600 block mt-1 font-bold">نسبة النشاط: 66.7%</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي العملاء</span>
            <span className="text-2xl font-black text-[#1B2A5B]">1,284</span>
            <span className="text-xs text-emerald-600 block mt-1 font-bold">📈 +12% من الشهر الماضي</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
            <Award className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Filter Toolbar */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="البحث عن عميل بالاسم أو الهاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              />
            </div>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 outline-none"
            >
              <option value="all">جميع المستويات</option>
              <option value="gold">المستوى الذهبي</option>
              <option value="silver">المستوى الفضي</option>
              <option value="bronze">المستوى البرونزي</option>
            </select>
          </div>

          <button 
            onClick={() => {
              const exportData = filteredCustomers.map(c => ({
                'الاسم': c.name,
                'الهاتف': c.phone,
                'المشتريات': c.totalPurchases,
                'نقاط الولاء': c.loyaltyPoints,
                'تاريخ الانضمام': c.joinDate,
                'المستوى': c.level === 'gold' ? 'ذهبي' : c.level === 'silver' ? 'فضي' : 'برونزي'
              }));
              exportToCsv('العملاء_سوبرماركت_الاصيل.csv', exportData);
            }}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير البيانات</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#1B2A5B] text-white">
                <th className="p-3.5 font-bold">اسم العميل</th>
                <th className="p-3.5 font-bold">رقم الهاتف</th>
                <th className="p-3.5 font-bold">إجمالي المشتريات</th>
                <th className="p-3.5 font-bold">نقاط الولاء</th>
                <th className="p-3.5 font-bold">تاريخ الانضمام</th>
                <th className="p-3.5 font-bold text-center">المستوى</th>
                <th className="p-3.5 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs shrink-0">
                      {cust.name.substring(0, 2)}
                    </span>
                    <span>{cust.name}</span>
                  </td>
                  <td className="p-3 text-slate-700 font-mono" dir="ltr">{cust.phone}</td>
                  <td className="p-3 font-bold text-slate-900">{cust.totalPurchases.toLocaleString()} {currencySymbol}</td>
                  <td className="p-3 font-bold text-blue-700 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{cust.loyaltyPoints}</span>
                  </td>
                  <td className="p-3 text-slate-600">{cust.joinDate}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      cust.level === 'gold' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      cust.level === 'silver' ? 'bg-slate-200 text-slate-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {cust.level === 'gold' ? 'ذهبي' : cust.level === 'silver' ? 'فضي' : 'برونزي'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCustomer(cust.id)}
                        className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
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
          <span>عرض 1 إلى {paginatedCustomers.length} من إجمالي 1,284 عميل</span>
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

      {/* Bottom Section: Rewards Banner + Customer Level Distribution Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: Rewards Banner */}
        <div className="bg-gradient-to-r from-[#1B2A5B] to-blue-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold bg-white/10 px-2.5 py-1 rounded-full text-blue-200 border border-white/10">
              برنامج المكافآت الجديد
            </span>
            <h3 className="text-lg font-black">قم بزيادة ولاء العملاء من خلال حملات تخصيص النقاط</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              يمكنك ربط كل عملية شراء بنقاط استبدال فورية تحفز الزبائن على العودة مجدداً.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button className="px-5 py-2.5 bg-white text-[#1B2A5B] rounded-xl font-bold text-xs hover:bg-slate-100 transition shadow-sm">
              إدارة الحملات
            </button>
            <button className="px-5 py-2.5 bg-transparent border border-white/30 text-white rounded-xl font-bold text-xs hover:bg-white/10 transition">
              إعدادات النقاط
            </button>
          </div>
        </div>

        {/* Right Card: Customer Level Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-[#1B2A5B] border-b border-slate-100 pb-2">
            تحليل توزيع مستويات العملاء
          </h3>

          <div className="space-y-3.5 text-xs font-bold">
            {/* Gold */}
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>ذهبي (Gold)</span>
                <span className="text-amber-600">15% (192 عميل)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            {/* Silver */}
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>فضي (Silver)</span>
                <span className="text-slate-600">35% (449 عميل)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            {/* Bronze */}
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>برونزي (Bronze)</span>
                <span className="text-orange-600">50% (643 عميل)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '50%' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
