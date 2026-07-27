import React, { useState } from 'react';
import { Search, Bell, HelpCircle, Calendar, MapPin, CheckCircle, AlertTriangle, Info, X, LogOut, RotateCcw, Sparkles } from 'lucide-react';
import { NotificationItem } from '../types';

interface TopbarProps {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  activeTabLabel: string;
  currentUser?: { name: string; role: string; isDeveloper?: boolean } | null;
  onLogout?: () => void;
  onQuickDemoReset?: () => void;
  timeLeftMs?: number;
  onResetDemoTimer?: () => void;
  onForceLockSystem?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  notifications,
  setNotifications,
  globalSearch,
  setGlobalSearch,
  activeTabLabel,
  currentUser,
  onLogout,
  onQuickDemoReset,
  timeLeftMs,
  onResetDemoTimer,
  onForceLockSystem
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const getInitials = (name?: string) => {
    if (!name) return 'م';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
    return name.slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search and Current Location / Page Title */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="بحث عام (منتج، فاتورة، عميل، باركود...)"
            className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
          {globalSearch && (
            <button 
              onClick={() => setGlobalSearch('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Date and Location Badge */}
        <div className="hidden xl:flex items-center gap-4 text-xs text-slate-500 font-medium shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>20 أكتوبر 2023</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>فرع القاهرة - الإدارة المركزية</span>
          </div>
        </div>
      </div>

      {/* Right Side Icons & Actions */}
      <div className="flex items-center gap-3">
        {/* Help Button */}
        <button
          onClick={() => setShowHelpModal(true)}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors relative cursor-pointer"
          title="المساعدة والدعم الفني"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors relative cursor-pointer"
            title="التنبيهات والإشعارات"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">التنبيهات والإشعارات</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    تحديد الكل كمعاين
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 text-xs flex gap-3 transition-colors ${
                      notif.unread ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {notif.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      {notif.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 flex items-center justify-between">
                        <span>{notif.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{notif.time}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Demo / Developer Mode Badge with Live Timer */}
        <div className="flex items-center gap-2">
          {currentUser?.isDeveloper ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 ring-2 ring-amber-400/50 rounded-lg text-[11px] font-black shadow-xs">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>المطور ⚡</span>
                {timeLeftMs !== undefined && (
                  <span className="bg-slate-950 text-amber-300 font-mono text-[10px] px-1.5 py-0.5 rounded-md dir-ltr font-bold mr-1">
                    {(() => {
                      const totalSecs = Math.floor(timeLeftMs / 1000);
                      const h = Math.floor(totalSecs / 3600);
                      const m = Math.floor((totalSecs % 3600) / 60);
                      const s = totalSecs % 60;
                      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                    })()}
                  </span>
                )}
                {onResetDemoTimer && (
                  <button
                    onClick={() => {
                      if (window.confirm('تأكيد تمديد وتخصيص 24 ساعة جديدة؟')) {
                        onResetDemoTimer();
                      }
                    }}
                    className="mr-1 p-0.5 hover:bg-slate-900/20 rounded transition text-slate-950"
                    title="تجديد 24 ساعة جديدة"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Developer Remote Kill Switch */}
              {onForceLockSystem && (
                <button
                  onClick={() => {
                    if (window.confirm('⚠️ تحذير المطور: هل تريد قفل السيستم فوراً ومنع أي عميل أو موظف من استخدامه الان؟')) {
                      onForceLockSystem();
                    }
                  }}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-lg text-[11px] transition shadow-xs flex items-center gap-1 cursor-pointer"
                  title="قفل النظام فوراً على الجميع"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>قفل النظام فوراً 🛑</span>
                </button>
              )}

              {/* WhatsApp Quick Button */}
              <a
                href="https://wa.me/201116206227?text=%D8%A5%D8%B4%D8%B9%D8%A7%D8%B1%20%D9%85%D9%86%20%D9%86%D8%B8%D8%A7%D9%85%20%D8%B3%D9%88%D8%A8%D8%B1%20%D9%85%D8%A7%D8%B1%D9%83%D8%AA%20%D8%A7%D9%84%D8%A3%D8%B5%D9%8A%D9%84"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition flex items-center gap-1 cursor-pointer"
                title="واتساب المطور 01116206227"
              >
                <span>واتساب 01116206227</span>
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>ديمو تجريبي:</span>
              {timeLeftMs !== undefined && (
                <span className="font-mono text-amber-900 font-extrabold dir-ltr bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                  {(() => {
                    const totalSecs = Math.floor(timeLeftMs / 1000);
                    const h = Math.floor(totalSecs / 3600);
                    const m = Math.floor((totalSecs % 3600) / 60);
                    const s = totalSecs % 60;
                    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                  })()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* User Info Capsule & Logout */}
        <div className="flex items-center gap-3 pr-3 border-r border-slate-200">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shadow-xs ${
              currentUser?.isDeveloper ? 'bg-amber-500 text-slate-950 font-black' : 'bg-blue-600 text-white'
            }`}>
              {getInitials(currentUser?.name)}
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-slate-800 block leading-tight">{currentUser?.name || 'مستخدم النظام'}</span>
              <span className={`text-[10px] font-bold block ${
                currentUser?.isDeveloper ? 'text-amber-600' : 'text-blue-600'
              }`}>
                {currentUser?.role || 'موظف مبيعات'}
              </span>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
              title="تسجيل الخروج والعودة لشاشة الدخول"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                دليل المساعدة واختصارات النظام
              </h3>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed">
              <p className="bg-blue-50 text-blue-900 p-3 rounded-xl border border-blue-100 font-medium text-xs">
                مرحباً بك في نظام إدارة سوبر ماركت الأصيل (نسخة تجريبية ديمو 100%). يمكنك تجربة جميع الشاشات وإصدار الفواتير وإضافة المنتجات بحرية كاملة.
              </p>
              <h4 className="font-bold text-slate-800 text-xs">اختصارات لوحة المفاتيح في الشاشات:</h4>
              <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <li><strong className="text-blue-700">F1:</strong> البحث السريع عن المنتجات والباركود</li>
                <li><strong className="text-blue-700">F2:</strong> إضافة عميل جديد</li>
                <li><strong className="text-blue-700">F12:</strong> إتمام عملية البيع بسرعة</li>
                <li><strong className="text-blue-700">Esc:</strong> إلغاء الطلب الحالي وإفراغ السلة</li>
              </ul>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
              >
                فهمت ذلك
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
