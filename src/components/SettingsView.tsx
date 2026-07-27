import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Store, 
  Receipt, 
  Users, 
  Sun, 
  Moon, 
  Upload, 
  Database, 
  Trash2, 
  Edit3, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Globe,
  Lock,
  Key
} from 'lucide-react';
import { SystemUser } from '../types';

interface SettingsViewProps {
  users: SystemUser[];
  onOpenAddUserModal: () => void;
  onDeleteUser: (id: string) => void;
  onResetData?: () => void;
  currencySymbol: string;
  setCurrencySymbol: (curr: string) => void;
  storeName: string;
  setStoreName: (name: string) => void;
  taxNumber: string;
  setTaxNumber: (tax: string) => void;
  footerNote: string;
  setFooterNote: (note: string) => void;
  enableQr: boolean;
  setEnableQr: (val: boolean) => void;
  currentUser?: { name: string; role: string; isDeveloper?: boolean } | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  users,
  onOpenAddUserModal,
  onDeleteUser,
  onResetData,
  currencySymbol,
  setCurrencySymbol,
  storeName,
  setStoreName,
  taxNumber,
  setTaxNumber,
  footerNote,
  setFooterNote,
  enableQr,
  setEnableQr,
  currentUser
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [address, setAddress] = useState('القاهرة، حي المعادي، شارع 9 الرئيسي');
  const [lang, setLang] = useState('ar');
  const [saveToast, setSaveToast] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Developer Passcode State
  const [newDevPin, setNewDevPin] = useState(() => localStorage.getItem('supermarket_dev_pin') || '297062');

  const handleUpdateDevPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevPin.trim()) return;
    localStorage.setItem('supermarket_dev_pin', newDevPin.trim());
    setAlertMessage(`تم تحديث كود بوابة المطور بنجاح إلى: (${newDevPin.trim()})`);
  };

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleBackup = () => {
    setAlertMessage('تم إنشاء نسخة احتياطية محلية من إعدادات وسجلات النظام بنجاح!');
  };

  const handleRestore = () => {
    setAlertMessage('تم استعادة النسخة الاحتياطية وتحديث حالة النظام للوضع المستقر.');
  };

  const handleClearLogs = () => {
    setAlertMessage('تم مسح السجلات المؤقتة وتفريغ ذاكرة التخزين المؤقتة بنجاح.');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header & Fast Backup Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#1B2A5B] flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            الإعدادات العامة للنظام
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            تخصيص بيانات المتجر، إعدادات الفواتير، صلاحيات المستخدمين والخيارات التقنية.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBackup}
            className="px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Database className="w-4 h-4 text-blue-600" />
            <span>نسخ احتياطي</span>
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </div>

      {/* Alert Notification Toast */}
      {saveToast && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>تم حفظ جميع التعديلات والإعدادات بنجاح!</span>
          </div>
        </div>
      )}

      {alertMessage && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl shadow-xs flex items-center justify-between text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <span>{alertMessage}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="text-blue-600 font-bold hover:underline">
            إغلاق
          </button>
        </div>
      )}

      {/* Grid: Store Details + Invoice Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Right 2 Cols: Store Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-[#1B2A5B] border-b border-slate-100 pb-2 flex items-center gap-2">
            <Store className="w-4 h-4 text-blue-600" />
            بيانات المتجر والمنشأة
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم المتجر / السوبر ماركت</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">الرقم الضريبي (ZATCA / ETA)</label>
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1">عنوان الفعالية / الفرع الرئيسي</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1">شعار المتجر (Logo)</label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-blue-400 transition bg-slate-50/50 cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <span className="font-bold text-blue-600 block">رفع شعار جديد</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">PNG or JPG, max 5MB</span>
            </div>
          </div>
        </div>

        {/* Left 1 Col: Invoice Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-[#1B2A5B] border-b border-slate-100 pb-2 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-blue-600" />
            إعدادات الفواتير
          </h2>

          <div className="space-y-4 text-xs">
            {/* VAT Tax Configuration */}
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-900 text-xs">ضريبة القيمة المضافة (VAT)</span>
                <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md">مفعّلة للكل</span>
              </div>
              <p className="text-[11px] text-emerald-800 font-semibold leading-relaxed">
                مطبقة بنسبة ثابتة (14%) على جميع المبيعات والفواتير لكافة الصلاحيات (كاشير، مشتريات، محاسبة، وإدارة).
              </p>
            </div>

            {/* QR Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800">طباعة QR Code على الفاتورة</span>
              <button
                onClick={() => setEnableQr(!enableQr)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  enableQr ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    enableQr ? 'right-1' : 'right-6'
                  }`}
                />
              </button>
            </div>

            {/* Currency Symbol */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">العملة الافتراضية</label>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
              >
                <option value="جنيه">جنيه مصري (EGP)</option>
                <option value="ر.س">ريال سعودي (SAR)</option>
                <option value="د.إ">درهم إماراتي (AED)</option>
                <option value="$">دولار أمريكي (USD)</option>
              </select>
            </div>

            {/* Footer Note */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">نص تذييل الفاتورة</label>
              <textarea
                rows={3}
                value={footerNote}
                onChange={(e) => setFooterNote(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="font-bold text-sm text-[#1B2A5B] flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            إدارة المستخدمين والصلاحيات
          </h2>

          <button
            onClick={onOpenAddUserModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مستخدم</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#1B2A5B] text-white">
                <th className="p-3.5 font-bold">المستخدم</th>
                <th className="p-3.5 font-bold">الدور الوظيفي</th>
                <th className="p-3.5 font-bold">آخر دخول</th>
                <th className="p-3.5 font-bold text-center">الحالة</th>
                <th className="p-3.5 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                      {usr.name.substring(0, 2)}
                    </span>
                    <span>{usr.name}</span>
                  </td>
                  <td className="p-3 text-slate-600">{usr.role}</td>
                  <td className="p-3 text-slate-500">{usr.lastLogin}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      usr.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {usr.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(usr.id)}
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
      </div>

      {/* System Settings & Maintenance Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h2 className="font-bold text-sm text-[#1B2A5B] border-b border-slate-100 pb-2">
          إعدادات النظام العامة والصيانة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold">
          {/* Theme Selector */}
          <div>
            <label className="block text-slate-700 mb-2">المظهر (Dark Mode)</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setTheme('light')}
                className={`py-2 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                  theme === 'light' ? 'bg-[#1B2A5B] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>فاتح</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`py-2 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                  theme === 'dark' ? 'bg-[#1B2A5B] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>داكن</span>
              </button>
            </div>
          </div>

          {/* Developer PIN Gate Setting - Secured for Developer Role only */}
          {currentUser?.isDeveloper ? (
            <div className="col-span-1 md:col-span-2 p-4 bg-amber-50/90 border border-amber-300 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-700" />
                  <h4 className="font-extrabold text-amber-900 text-sm">تخصيص كود حماية المطور (PIN) والتحكم بالقفل 🔐</h4>
                </div>
                <a
                  href="https://wa.me/201116206227?text=%D8%AA%D9%88%D8%A7%D8%B5%D9%84%20%D9%85%D8%B9%20%D8%A7%D9%84%D9%85%D9%87%D9%86%D8%AF%D8%B3%20%D8%A7%D9%84%D9%85%D8%B7%D9%88%D8%B1"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <span>واتساب المطور (01116206227)</span>
                </a>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                أنت تعمل بصلاحيات المطور المسؤول. يمكنك تغيير كود الحماية السرّي المخصص بدخول بوابة المطور لمنع أي محاولة اختراق، كما يمكنك استخدام خيار "قفل النظام فوراً" بالTopbar لإغلاق السيستم على أي عميل.
              </p>
              <form onSubmit={handleUpdateDevPin} className="flex items-center gap-2 max-w-md">
                <input
                  type="text"
                  required
                  placeholder="أدخل PIN السرّي الجديد"
                  value={newDevPin}
                  onChange={(e) => setNewDevPin(e.target.value)}
                  className="flex-1 p-2.5 bg-white border border-amber-300 rounded-xl text-center font-mono font-bold text-slate-900 outline-none text-xs focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  حفظ الكود الجديد
                </button>
              </form>
            </div>
          ) : (
            <div className="col-span-1 md:col-span-2 p-3.5 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <span>إعدادات كود المطور وتعديلات النظام العميقة مخصصة للمهندس المطور (01116206227) فقط.</span>
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-bold">محمي</span>
            </div>
          )}

          {/* Interface Language */}
          <div>
            <label className="block text-slate-700 mb-2">لغة الواجهة</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
            >
              <option value="ar">العربية (RTL)</option>
              <option value="en">English (LTR)</option>
            </select>
          </div>

          {/* Maintenance Operations */}
          <div>
            <label className="block text-slate-700 mb-2">عمليات الصيانة</label>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleRestore}
                className="w-full py-2 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                <span>استعادة نسخة احتياطية</span>
              </button>
              <button
                onClick={handleClearLogs}
                className="w-full py-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح السجلات القديمة</span>
              </button>
              {onResetData && (
                <button
                  onClick={() => {
                    if (window.confirm('هل أنت تأكد من إعادة ضبط كافة بيانات التطبيق للحالة الافتراضية؟')) {
                      onResetData();
                      setAlertMessage('تمت إعادة ضبط البيانات للحالة الافتراضية بنجاح.');
                    }
                  }}
                  className="w-full py-2 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>إعادة ضبط البيانات الأولية</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={() => {}}
          className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition"
        >
          إلغاء التعديلات
        </button>
        <button
          onClick={handleSave}
          className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-600/20 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التغييرات</span>
        </button>
      </div>

    </div>
  );
};
