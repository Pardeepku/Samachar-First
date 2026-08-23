import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, ShieldAlert, CheckCircle, UserCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { UserRole } from '../../types';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { login, demoLogin, isLiveFirebase } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'लॉगिन विफल रहा। कृपया अपनी साख जांचें।');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setError('');
    setLoading(true);
    try {
      await demoLogin(role);
    } catch (err: any) {
      setError(err.message || 'त्वरित लॉगिन विफल रहा।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="bg-red-600 text-white font-black text-2xl px-3 py-1 rounded font-serif">SAMACHAR</span>
          <span className="text-white font-black text-2xl font-serif">FIRST</span>
        </div>
        <h2 className="text-lg font-bold text-slate-200">
          संपादकीय नियंत्रण कक्ष (CMS Login Portal)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          अधिकृत पत्रकार, संपादक एवं एडमिनिस्ट्रेटर लॉगिन
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 bg-rose-950/80 border border-rose-800 text-rose-300 p-3 rounded-lg text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ईमेल आईडी (Email ID)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="saini.pardeep45@gmail.com"
                  className="w-full bg-slate-800 border border-slate-700 text-white pl-9 pr-3 py-2 text-xs rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 text-white pl-9 pr-3 py-2 text-xs rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'प्रमाणीकरण जारी...' : 'CMS लॉगिन करें'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              त्वरित डेमो रोल एक्सेस (Quick Demo Login)
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('super_admin')}
                className="bg-slate-800 hover:bg-slate-700 border border-red-500/40 text-red-300 hover:text-white p-2 rounded-lg text-left transition-colors"
              >
                <div className="text-[11px] font-bold">👑 Super Admin</div>
                <div className="text-[9px] text-slate-400">प्रदीप सैनी (Chief Editor)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('editor')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 p-2 rounded-lg text-left transition-colors"
              >
                <div className="text-[11px] font-bold">📝 Senior Editor</div>
                <div className="text-[9px] text-slate-400">संपादक (Article Review)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('reporter')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 p-2 rounded-lg text-left transition-colors"
              >
                <div className="text-[11px] font-bold">🎤 Reporter</div>
                <div className="text-[9px] text-slate-400">जिला संवाददाता</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 p-2 rounded-lg text-left transition-colors"
              >
                <div className="text-[11px] font-bold">⚙️ CMS Admin</div>
                <div className="text-[9px] text-slate-400">प्रबंधक (Management)</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              पब्लिक वेबसाइट पर वापस जाएं
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
