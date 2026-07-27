import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Truck, 
  Users, 
  BarChart3, 
  Settings, 
  Store,
  UserCheck,
  X
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  lowStockCount?: number;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, lowStockCount = 5, onCloseMobile }) => {
  const navItems = [
    { id: 'dashboard' as TabType, label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'pos' as TabType, label: 'نقطة البيع', icon: ShoppingCart },
    { id: 'inventory' as TabType, label: 'المخزون', icon: Package, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'suppliers' as TabType, label: 'الموردين', icon: Truck },
    { id: 'customers' as TabType, label: 'العملاء', icon: Users },
    { id: 'reports' as TabType, label: 'التقارير', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'الإعدادات', icon: Settings },
  ];

  const handleSelectTab = (id: TabType) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-[#1B2A5B] text-white flex flex-col justify-between shrink-0 h-full min-h-screen sticky top-0 shadow-xl border-l border-slate-800/40 z-30 select-none">
      <div>
        {/* Store Brand Header */}
        <div className="p-5 border-b border-slate-700/60 flex flex-col items-center justify-center text-center bg-[#15224a] relative">
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden absolute top-4 left-4 p-1.5 text-slate-300 hover:text-white bg-slate-800/60 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-600/30 ring-4 ring-blue-500/20">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-wide text-white">سوبر ماركت الأصيل</h1>
          <span className="text-xs text-blue-200/80 font-medium mt-0.5 px-2.5 py-0.5 rounded-full bg-blue-900/50 border border-blue-700/50">
            الإدارة المركزية
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white text-blue-700' : 'bg-red-500 text-white animate-pulse'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info Footer */}
      <div className="p-4 border-t border-slate-700/60 bg-[#15224a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow ring-2 ring-blue-400/40">
            أع
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-white leading-tight">أحمد علي</div>
            <div className="text-xs text-slate-300">مسؤول النظام / كاشير</div>
          </div>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" title="متصل الآن" />
      </div>
    </aside>
  );
};
