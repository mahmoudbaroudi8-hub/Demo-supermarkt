import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  PieChart, 
  AlertCircle,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { exportToCsv } from '../utils/exportCsv';
import { DailyReport } from '../types';

interface ReportsViewProps {
  dailyReports: DailyReport[];
  currencySymbol?: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  dailyReports,
  currencySymbol = 'جنيه'
}) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  // Chart Mock Data
  const chartData = [
    { name: '1 مارس', sales: 3200, profit: 800 },
    { name: '8 مارس', sales: 4500, profit: 1200 },
    { name: '15 مارس', sales: 3900, profit: 950 },
    { name: '22 مارس', sales: 5200, profit: 1400 },
    { name: '30 مارس', sales: 4800, profit: 1250 }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header & Export Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#1B2A5B] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            التقارير المالية والتحليلات
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            عرض تفصيلي لأداء المبيعات، الأرباح الصافية، والأنشطة المالية خلال الفترة المحددة.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
          >
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="90d">آخر 3 أشهر</option>
            <option value="year">هذا العام 2023</option>
          </select>

          <button 
            onClick={() => {
              const exportData = dailyReports.map(r => ({
                'التاريخ': r.date,
                'عدد العمليات': r.transactionsCount,
                'إجمالي المبيعات': r.totalSales,
                'متوسط الفاتورة': r.avgInvoice,
                'صافي الربح': r.netProfit,
                'الحالة': r.status === 'high_growth' ? 'نمو مرتفع' : r.status === 'stable' ? 'مستقر' : 'منخفض'
              }));
              exportToCsv('التقرير_المالي_اليومي.csv', exportData);
            }}
            className="px-5 py-2.5 bg-[#1B2A5B] text-white rounded-xl font-bold text-xs hover:bg-blue-900 transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تصدير التقرير (CSV)</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Sales */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">إجمالي المبيعات</span>
            <span className="text-xl font-black text-[#1B2A5B] mt-1 block">45,280.50</span>
            <span className="text-[10px] text-slate-500 font-bold">{currencySymbol}</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12%</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Net Profit */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">صافي الربح</span>
            <span className="text-xl font-black text-emerald-700 mt-1 block">12,140.00</span>
            <span className="text-[10px] text-slate-500 font-bold">{currencySymbol}</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8%</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Avg Order Value */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">متوسط قيمة الطلب</span>
            <span className="text-xl font-black text-[#1B2A5B] mt-1 block">142.30</span>
            <span className="text-[10px] text-slate-500 font-bold">{currencySymbol}</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-3%</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: New Customers Growth */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">نمو العملاء الجدد</span>
            <span className="text-xl font-black text-[#1B2A5B] mt-1 block">124</span>
            <span className="text-[10px] text-slate-500 font-bold">عميل جديد</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+24%</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
            <Users className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Middle Section: Top Selling Categories + Sales Trends Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Col: Top Selling Categories */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-[#1B2A5B] border-b border-slate-100 pb-2">
            الفئات الأكثر مبيعاً
          </h3>

          <div className="space-y-4 text-xs font-bold">
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>الألبان والبيض</span>
                <span className="text-blue-700">45%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>المخبوزات</span>
                <span className="text-blue-700">25%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>البقوليات والسلع</span>
                <span className="text-blue-700">18%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>المنظفات والمنزل</span>
                <span className="text-blue-700">12%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Composite Sales Trends Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-[#1B2A5B]">اتجاهات مبيعات الشهر</h3>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  viewMode === 'daily' ? 'bg-[#1B2A5B] text-white' : 'text-slate-600'
                }`}
              >
                يومي
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  viewMode === 'weekly' ? 'bg-[#1B2A5B] text-white' : 'text-slate-600'
                }`}
              >
                أسبوعي
              </button>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="sales" fill="#1B2A5B" radius={[6, 6, 0, 0]} barSize={36} />
                <Line type="monotone" dataKey="profit" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Daily Operations Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <h2 className="font-bold text-sm text-[#1B2A5B]">ملخص العمليات اليومية</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#1B2A5B] text-white">
                <th className="p-3.5 font-bold">التاريخ</th>
                <th className="p-3.5 font-bold text-center">عدد العمليات</th>
                <th className="p-3.5 font-bold">إجمالي المبيعات</th>
                <th className="p-3.5 font-bold">متوسط الفاتورة</th>
                <th className="p-3.5 font-bold">صافي الربح</th>
                <th className="p-3.5 font-bold text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {dailyReports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-800">{rep.date}</td>
                  <td className="p-3 text-center font-bold text-slate-700">{rep.transactionsCount}</td>
                  <td className="p-3 font-bold text-slate-900">{rep.totalSales.toFixed(2)} {currencySymbol}</td>
                  <td className="p-3 text-slate-600">{rep.avgInvoice.toFixed(2)} {currencySymbol}</td>
                  <td className="p-3 font-bold text-emerald-700">{rep.netProfit.toFixed(2)} {currencySymbol}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      rep.status === 'high_growth' ? 'bg-emerald-100 text-emerald-800' :
                      rep.status === 'stable' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {rep.status === 'high_growth' ? 'نمو مرتفع' : rep.status === 'stable' ? 'مستقر' : 'منخفض'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-bold text-slate-600">
          <span>عرض 5 من أصل 30 يوم</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100">
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-[#1B2A5B] text-white rounded-lg">1</span>
            <button className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2 Bottom Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#1B2A5B]">تنبيه المخزون والطلبات</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              هناك 12 منتجاً في قسم البقالة تقترب من نقطة إعادة الطلب بناءً على معدل المبيعات الحالي.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#1B2A5B]">المنتج الأكثر ربحاً هذا الشهر</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              حليب المراعي 2 لتر تصدر القائمة بهامش ربح 15% خلال الأسابيع الماضية.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
