import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, AlertTriangle, Phone, Sparkles, RefreshCw, X } from 'lucide-react';

interface DemoExpiredLockProps {
  onDeveloperUnlock: (devName: string, isDeveloper: boolean) => void;
  onResetDemoTimer?: () => void;
  currentUser?: { name: string; role: string; isDeveloper?: boolean } | null;
}

export const DemoExpiredLock: React.FC<DemoExpiredLockProps> = ({
  onDeveloperUnlock,
  onResetDemoTimer,
  currentUser
}) => {
  const [showDevModal, setShowDevModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [devName, setDevName] = useState('المهندس المطور (محمود البارودي)');

  const getStoredDevPin = () => localStorage.getItem('supermarket_dev_pin') || '297062';

  const handleVerifyDevPin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getStoredDevPin();
    if (pinInput.trim() === correctPin) {
      setPinError('');
      setShowDevModal(false);

      // Open WhatsApp notification to Developer number 01116206227
      const whatsappText = encodeURIComponent(`تم إلغاء قفل النظام وتفعيل 24 ساعة جديدة بواسطة المطور\nاسم المطور: ${devName.trim()}\nالتاريخ والوقت: ${new Date().toLocaleString('ar-EG')}`);
      const waUrl = `https://wa.me/201116206227?text=${whatsappText}`;
      window.open(waUrl, '_blank');

      if (onResetDemoTimer) onResetDemoTimer();
      onDeveloperUnlock(devName.trim() || 'المهندس المطور المسؤول', true);
    } else {
      setPinError('رمز الحماية غير صحيح! دخول المطور مغلق.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 text-slate-100 flex items-center justify-center p-4 z-50 font-['Cairo',sans-serif]" dir="rtl">
      {/* Background ambient light */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-lg w-full bg-slate-900 border border-red-500/30 rounded-3xl p-8 shadow-2xl relative z-10 text-center">
        {/* Lock Icon Header */}
        <div className="w-20 h-20 bg-gradient-to-tr from-red-600 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-red-600/20 ring-8 ring-red-500/10 animate-bounce">
          <Lock className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-2">انتهت الفترة التجريبية للنظام! ⏳</h1>
        <p className="text-xs text-red-400 font-bold mb-4">تم إغلاق نظام إدارة السوبر ماركت ونقاط البيع (POS) تلقائياً (24 ساعة).</p>

        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-right text-xs text-slate-300 space-y-2 mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              عزيزي العميل، لقد انقضت مدة العرض التجريبي للنظام (24 ساعة). تم قفل كافّة الشاشات والعمليات للحفاظ على خصوصية السيستم والبيانات.
            </p>
          </div>
          <div className="border-t border-slate-700/80 pt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>حالة النظام: <strong className="text-red-400">مغلق مؤقتاً</strong></span>
            <span>بوابة التطوير: <strong className="text-amber-400">مفتوحة بكود المطور</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              setPinError('');
              setPinInput('');
              setShowDevModal(true);
            }}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Key className="w-4 h-4 text-slate-950" />
            <span>فتح النظام وإعادة التفعيل (خاص بالمهندس المطور ⚡)</span>
          </button>

          <a
            href="https://wa.me/201116206227?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%B7%D9%84%D8%A2%20%D8%AA%D9%81%D8%B9%D9%8A%D9%84%20%D9%88%D8%B4%D8%B1%D8%A7%D8%A1%20%D8%A7%D9%84%D9%86%D8%B3%D8%AE%D8%A9%20%D8%A7%D9%84%D9%83%D8%A7%D9%85%D9%84%D8%A9%20%D9%88%D8%A7%D9%84%D8%AF%D8%A7%D8%A3%D9%85%D8%A9%20%D9%85%D9%86%20%D9%86%D8%B8%D8%A7%D9%85%20%D8%B3%D9%88%D8%A8%D8%B1%20%D9%85%D8%A7%D8%B1%D9%83%D8%AA%20%D8%A7%D9%84%D8%A3%D8%B5%D9%8A%D9%84"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>واتساب المطور (01116206227) — طلب التفعيل الدائم</span>
          </a>
        </div>

        <p className="text-[10px] text-slate-500 mt-6">سوبر ماركت الأصيل — جميع الحقوق محفوظة للمهندس المطور ©</p>
      </div>

      {/* Developer Unlock Modal */}
      {showDevModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-slate-100 text-right">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>إلغاء القفل — دخول المطور المسؤول</span>
              </div>
              <button
                onClick={() => setShowDevModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyDevPin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المطور</label>
                <input
                  type="text"
                  required
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">أدخل الكود السرّي للمطور (PIN)</label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="أدخل كود الحماية السرّي"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg font-mono tracking-widest text-amber-300 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {pinError && (
                <div className="p-2.5 bg-red-900/40 border border-red-500/50 rounded-xl text-red-300 text-[11px] font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDevModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs transition shadow-md"
                >
                  فتح وتفعيل 24 ساعة جديدة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
