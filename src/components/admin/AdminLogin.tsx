import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Lock,
  Mail,
  ShieldAlert,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Copy,
  Zap,
  Check,
  UserCheck,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { DEMO_ACCOUNTS, DemoAccount } from '../../data/demoAccounts';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { login, quickDemoLogin, resetPassword, isLiveFirebase } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickLoadingId, setQuickLoadingId] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAutoFill = (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
    setSuccessMessage(`क्रेडेंशियल्स भरे गए: ${acc.name} (${acc.role})`);
  };

  const handleQuickLogin = async (acc: DemoAccount) => {
    setError('');
    setSuccessMessage('');
    setQuickLoadingId(acc.id);
    try {
      await quickDemoLogin(acc);
    } catch (err: any) {
      setError(err.message || 'त्वरित लॉगिन विफल रहा');
    } finally {
      setQuickLoadingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = 'लॉगिन विफल रहा। कृपया अपनी साख जांचें।';
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        msg = 'अमान्य ईमेल अथवा पासवर्ड। कृपया पुनः प्रयास करें या नीचे दिए डेमो खातों से लॉगिन करें।';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'अत्यधिक असफल प्रयासों के कारण खाता अस्थायी रूप से लॉक है। कृपया कुछ समय बाद प्रयास करें।';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetLoading(true);
    setError('');
    try {
      await resetPassword(resetEmail.trim());
      setSuccessMessage('पासवर्ड रीसेट निर्देश प्रदर्शित या भेजे गए हैं।');
      setShowForgotModal(false);
      setResetEmail('');
    } catch (err: any) {
      setError(err.message || 'पासवर्ड रीसेट ईमेल भेजने में विफल। कृपया ईमेल जांचें।');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      {/* Brand Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center justify-center space-x-2 mb-3">
          <span className="bg-red-600 text-white font-black text-2xl sm:text-3xl px-3 py-1 rounded font-serif shadow-lg shadow-red-950/50">
            SAMACHAR
          </span>
          <span className="text-white font-black text-2xl sm:text-3xl font-serif tracking-wide">
            FIRST
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight">
          संपादकीय एवं प्रशासनिक नियंत्रण कक्ष
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          सुपर एडमिन, एडमिन, वरिष्ठ संपादक, संवाददाता एवं यूजर लॉगिन पैनल
        </p>
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Login Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-500" />
                CMS लॉगिन फॉर्म
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">ईमेल व पासवर्ड द्वारा प्रवेश करें</p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
              Secure
            </span>
          </div>

          {error && (
            <div className="mb-4 bg-rose-950/80 border border-rose-800 text-rose-300 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <div className="leading-relaxed">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ईमेल आईडी (User ID / Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@samacharfirst.com"
                  className="w-full bg-slate-950 border border-slate-700 text-white pl-10 pr-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  पासवर्ड (Password)
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
                >
                  पासवर्ड भूल गए?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 text-white pl-10 pr-10 py-2.5 text-xs rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white py-3 px-4 rounded-xl font-bold text-xs shadow-lg shadow-red-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>प्रमाणीकरण जारी...</span>
              ) : (
                <>
                  <span>CMS में प्रवेश करें (Login)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Forgot Password Modal */}
          {showForgotModal && (
            <div className="mt-5 p-4 bg-slate-950 rounded-xl border border-slate-700 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-200 mb-2">
                <KeyRound className="w-4 h-4 text-red-400" />
                <span>पासवर्ड रीसेट सहायता</span>
              </div>
              <p className="text-slate-400 mb-3 text-[11px] leading-relaxed">
                डेमो खातों के लिए पासवर्ड नीचे दी गई सूची में उपलब्ध हैं। वास्तविक ईमेल रीसेट के लिए पंजीकृत ईमेल दर्ज करें:
              </p>
              <form onSubmit={handleResetPassword} className="space-y-3">
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="अपना ईमेल दर्ज करें"
                  className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-red-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
                  >
                    {resetLoading ? 'जांच रहे हैं...' : 'रीसेट करें'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              पब्लिक वेबसाइट पर वापस जाएं
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              पोर्टल लाइव
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Demo Accounts & 1-Click Login Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  डेमो क्रेडेंशियल्स व त्वरित 1-क्लिक लॉगिन (Demo Roles)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  परीक्षण के लिए किसी भी भूमिका पर <strong className="text-slate-200">"त्वरित लॉगिन"</strong> बटन दबाकर सीधे CMS खोलें
                </p>
              </div>
              <span className="text-[11px] bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full font-medium whitespace-nowrap self-start sm:self-auto">
                5 सक्रिय भूमिकाएं
              </span>
            </div>

            {/* List of Accounts */}
            <div className="space-y-3">
              {DEMO_ACCOUNTS.map((acc) => {
                const isLoggingIn = quickLoadingId === acc.id;
                return (
                  <div
                    key={acc.id}
                    className="bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                  >
                    {/* User Info & Avatar */}
                    <div className="flex items-start sm:items-center gap-3.5">
                      <img
                        src={acc.photoURL}
                        alt={acc.name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-white">{acc.name}</h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${acc.badgeColor}`}
                          >
                            {acc.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{acc.designation}</p>

                        {/* Credentials Row with Copy */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px]">
                          <div className="flex items-center gap-1 font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            <span className="text-slate-500">ID:</span>
                            <span>{acc.email}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(acc.email, `${acc.id}-email`)}
                              className="text-slate-400 hover:text-white ml-0.5"
                              title="Copy Email"
                            >
                              {copiedKey === `${acc.id}-email` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-1 font-mono text-amber-300/90 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            <span className="text-slate-500">पासवर्ड:</span>
                            <span>{acc.password}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(acc.password, `${acc.id}-pass`)}
                              className="text-slate-400 hover:text-white ml-0.5"
                              title="Copy Password"
                            >
                              {copiedKey === `${acc.id}-pass` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed hidden sm:block">
                          {acc.permissionsDescription}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => handleQuickLogin(acc)}
                        disabled={isLoggingIn}
                        className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        {isLoggingIn ? 'प्रवेश...' : 'त्वरित लॉगिन'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAutoFill(acc)}
                        className="flex-1 sm:flex-none text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                      >
                        फॉर्म भरें
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Reference Table Callout */}
            <div className="mt-4 p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  सभी डेमो खातों के प्रोफाइल, अवतार और अनुमतियां डेटाबेस में प्री-कॉन्फिगर हैं।
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-mono shrink-0">
                v2026.1
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
