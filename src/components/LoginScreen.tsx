import React, { useState } from 'react';
import { Store, UserCheck, ShieldCheck, Clock, Sparkles, ArrowLeft, RefreshCw, Lock, Key, X, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (userName: string, role: string, isDeveloper?: boolean) => void;
  onQuickDemoReset: () => void;
  timeLeftMs?: number;
  isDemoExpired?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onQuickDemoReset,
  timeLeftMs,
  isDemoExpired
}) => {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('كاشير / موظف مبيعات');
  const [expiredError, setExpiredError] = useState('');

  // Developer PIN Modal
  const [showDevPinModal, setShowDevPinModal] = useState(false);
  const [devPinInput, setDevPinInput] = useState('');
  const [devNameInput, setDevNameInput] = useState('المهندس المطور (محمود البارودي)');
  const [pinError, setPinError] = useState('');

  // Default Developer PIN stored in localStorage or set to '297062'
  const getStoredDevPin = () => localStorage.getItem('supermarket_dev_pin') || '297062';

  const presetUsers = [
    { name: 'كاشير المبيعات (تجريبي)', role: 'كاشير / موظف مبيعات', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { name: 'مسؤول المخزون (تجريبي)', role: 'مسؤول مخازن ومشتريات', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { name: 'محاسب الإدارة (تجريبي)', role: 'محاسب مالية وتقارير', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' }
  ];

  const handleSubmitStandard = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoExpired) {
      setExpiredError('انتهت فترة الـ 24 ساعة التجريبية! لا يمكن الدخول كعامل عادي. يرجى دخول المطور.');
      return;
    }
    if (!userName.trim()) return;
    onLogin(userName.trim(), role, false);
  };

  const handleSelectPreset = (name: string, presetRole: string) => {
    if (isDemoExpired) {
      setExpiredError('انتهت فترة الـ 24 ساعة التجريبية! يرجى الدخول عبر كود المطور لتفعيل السيستم.');
      return;
    }
    onLogin(name, presetRole, false);
  };

  const handleVerifyDevPin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getStoredDevPin();
    if (devPinInput === correctPin) {
      setPinError('');
      setShowDevPinModal(false);
      
      // Send WhatsApp notification to Developer number 01116206227
      const whatsappText = encodeURIComponent(`تم تسجيل دخول المطور إلى نظام سوبر ماركت الأصيل\nاسم المطور: ${devNameInput.trim()}\nالتاريخ والوقت: ${new Date().toLocaleString('ar-EG')}`);
      const waUrl = `https://wa.me/201116206227?text=${whatsappText}`;
      window.open(waUrl, '_blank');

      onLogin(devNameInput.trim() || 'المهندس المطور المسؤول', 'مدير النظام المطور', true);
    } else {
      setPinError('رمز الحماية غير صحيح! البوابة مخصصة للمطور فقط.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-['Cairo',sans-serif]" dir="rtl">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700/80 p-8 shadow-2xl relative z-10 my-8">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">سوبر ماركت الأصيل</h1>
          <p className="text-xs text-slate-400 mt-1">نظام الإدارة المركزية ونقاط البيع (POS)</p>
        </div>

        {isDemoExpired && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-500/60 rounded-2xl text-red-300 text-xs font-bold flex items-start gap-2 animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-white">⚠️ تم انتهاء صلاحية العرض التجريبي (24 ساعة)!</p>
              <p className="text-[11px] font-normal text-red-300 mt-0.5">تم قفل دخول المستخدمين والعاملين. يرجى استخدام بوابة المطور بالأسفل لفتح النظام.</p>
            </div>
          </div>
        )}

        {expiredError && (
          <div className="mb-4 p-2.5 bg-amber-950/80 border border-amber-500/50 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{expiredError}</span>
          </div>
        )}

        {/* Dedicated Developer Gateway Button */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/60 to-slate-900/80 border border-blue-500/40 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-black text-amber-300">بوابة المطور المسؤول ⚡</span>
            </div>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">محمية بكود سرّي</span>
          </div>
          <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
            منطقة خافية ومحمية برمز حماية خاص بالمهندس المطور للتحكم الكامل بالنظام والسيستم.
          </p>
          <button
            type="button"
            onClick={() => {
              setPinError('');
              setDevPinInput('');
              setShowDevPinModal(true);
            }}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-slate-950" />
            <span>تسجيل دخول المطور (إدخال الكود)</span>
          </button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
          <span className="relative bg-slate-800 px-3 text-[11px] font-bold text-slate-400">أو دخول عادي / ديمو للمستخدمين</span>
        </div>

        {/* Standard User Login Form */}
        <form onSubmit={handleSubmitStandard} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم الموظف / المستخدِم *</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="أدخل اسم الموظف (مثال: أحمد علي)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <UserCheck className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">الصلاحية / الدور الوظيفي</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="كاشير / موظف مبيعات">كاشير / موظف مبيعات (POS)</option>
              <option value="مسؤول مخازن ومشتريات">مسؤول مخازن ومشتريات</option>
              <option value="محاسب مالية">محاسب مالية وتقارير</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>دخول كمستخدم ديمو</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

        {/* Preset Quick Logins */}
        <div className="mt-6 pt-4 border-t border-slate-700/60">
          <p className="text-[11px] font-bold text-slate-400 mb-2">دخول سريع بحساب ديمو تجريبي جاهز:</p>
          <div className="space-y-2">
            {presetUsers.map((u, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectPreset(u.name, u.role)}
                className="w-full flex items-center justify-between p-2.5 bg-slate-900/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl transition text-right group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition">{u.name}</p>
                    <p className="text-[10px] text-slate-400">{u.role}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 group-hover:bg-blue-600 group-hover:text-white px-2.5 py-1 rounded-lg font-bold transition">
                  دخول
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Demo Timer Note & Reset Button */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>النظام مهيأ كديمو متكامل</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('هل تريد إعادة تعيين كافة البيانات الافتراضية للديمو الآن؟')) {
                onQuickDemoReset();
              }
            }}
            className="text-slate-400 hover:text-amber-400 transition flex items-center gap-1 font-bold cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>إعادة ضبط الديمو</span>
          </button>
        </div>
      </div>

      {/* Developer Access Passcode Modal */}
      {showDevPinModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-amber-500/40 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                <Key className="w-5 h-5 text-amber-400" />
                <span>التحقق من المطور المسؤول ⚡</span>
              </div>
              <button
                onClick={() => setShowDevPinModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyDevPin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المهندس المطور</label>
                <input
                  type="text"
                  required
                  value={devNameInput}
                  onChange={(e) => setDevNameInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-300">الكود السرّي للمطور (PIN)</label>
                </div>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="أدخل كود الحماية السرّي الخاص بك"
                  value={devPinInput}
                  onChange={(e) => setDevPinInput(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-center text-lg font-mono tracking-widest text-amber-300 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {pinError && (
                <div className="p-2.5 bg-red-900/40 border border-red-500/50 rounded-xl text-red-300 text-[11px] font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <p className="text-[10px] text-slate-400 leading-normal">
                💡 ملاحظة: يمكنك تغيير كود الحماية الخاص بك لاحقاً من قسم "إعدادات النظام".
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDevPinModal(false)}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-bold text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs transition shadow-md"
                >
                  تأكيد ودخول المطور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

