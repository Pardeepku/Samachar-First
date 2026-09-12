import React, { useState } from 'react';
import { Article, Category, Author, VideoNews, BreakingNews, ActivityLog } from '../../types';
import {
  FileText,
  Flame,
  FolderTree,
  Users,
  Video,
  Eye,
  Plus,
  Clock,
  CheckCircle,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Database,
  RefreshCw,
  Copy,
  Check,
  LogIn,
} from 'lucide-react';
import { AdminTab } from './AdminLayout';
import { DEMO_ACCOUNTS } from '../../data/demoAccounts';
import { useAuth } from '../../contexts/AuthContext';
import { dbService } from '../../services/db';

interface AdminDashboardProps {
  articles: Article[];
  categories: Category[];
  authors: Author[];
  videos: VideoNews[];
  breakingNews: BreakingNews[];
  activityLogs: ActivityLog[];
  onNavigateTab: (tab: AdminTab) => void;
  onCreateArticle: () => void;
  onEditArticle: (article: Article) => void;
  onRefreshData?: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  categories,
  authors,
  videos,
  breakingNews,
  activityLogs,
  onNavigateTab,
  onCreateArticle,
  onEditArticle,
  onRefreshData,
}) => {
  const { currentUser, quickDemoLogin } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedSuccess(null);
    try {
      const res = await dbService.seedInitialDataToFirestore();
      setSeedSuccess(res.message);
      if (onRefreshData && res.success) {
        await onRefreshData();
      }
    } catch (e: any) {
      setSeedSuccess(e.message || 'सीडिंग विफल');
    } finally {
      setIsSeeding(false);
    }
  };

  const copyCreds = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stats = [
    {
      title: 'कुल समाचार (Articles)',
      value: articles.length,
      sub: `${publishedCount} लाइव, ${draftCount} ड्राफ्ट`,
      icon: <FileText className="w-5 h-5 text-red-500" />,
      tab: 'articles' as AdminTab,
    },
    {
      title: 'बड़ी खबरें (Breaking)',
      value: breakingNews.filter((b) => b.isActive).length,
      sub: `${breakingNews.length} कुल दर्ज`,
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      tab: 'breaking' as AdminTab,
    },
    {
      title: 'श्रेणियां व जिले',
      value: categories.length,
      sub: 'सक्रिय न्यूज़ श्रेणियां',
      icon: <FolderTree className="w-5 h-5 text-indigo-500" />,
      tab: 'categories' as AdminTab,
    },
    {
      title: 'संवाददाता / रिपोर्टर',
      value: authors.length,
      sub: 'संपादकीय टीम सदस्य',
      icon: <Users className="w-5 h-5 text-emerald-500" />,
      tab: 'authors' as AdminTab,
    },
    {
      title: 'वीडियो बुलेटिन',
      value: videos.length,
      sub: 'YouTube बुलेटिन',
      icon: <Video className="w-5 h-5 text-sky-500" />,
      tab: 'videos' as AdminTab,
    },
    {
      title: 'कुल पाठक व्यूज (Views)',
      value: totalViews.toLocaleString(),
      sub: 'डिजिटल न्यूज़ इंप्रेशन',
      icon: <Eye className="w-5 h-5 text-purple-500" />,
      tab: 'articles' as AdminTab,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-xl text-white">
            समाचार फर्स्ट संपादकीय डैशबोर्ड (Dashboard)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            वेबसाइट सामग्री, बड़ी खबरों और मल्टीमीडिया का लाइव नियंत्रण केंद्र
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('auto_fetch')}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            दैनिक भास्कर ऑटो-फेच (AI)
          </button>
          <button
            onClick={onCreateArticle}
            className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            नया समाचार बनाएं
          </button>
          <button
            onClick={() => onNavigateTab('breaking')}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Flame className="w-4 h-4" />
            Breaking News
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((st, i) => (
          <div
            key={i}
            onClick={() => onNavigateTab(st.tab)}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-slate-800 rounded-lg">{st.icon}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-mono">{st.value}</div>
              <div className="text-[11px] font-semibold text-slate-300 truncate">{st.title}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{st.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Credentials & Firestore Seeding Quick Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                डेमो लॉगिन क्रेडेंशियल्स व भूमिकाएं (5 Demo User Accounts)
              </h2>
              <p className="text-[11px] text-slate-400">
                सुपर एडमिन, एडमिन, सीनियर एडिटर, रिपोर्टर व यूजर अकाउंट से 1-क्लिक में परीक्षण करें
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              title="Firestore में सभी 14 लेख, 7 श्रेणियां, 5 रिपोर्टर, 4 वीडियो, 5 डेमो यूजर्स व सेटिंग्स लोड करें"
            >
              {isSeeding ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  डेटाबेस सिंक हो रहा है...
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5" />
                  डेटाबेस सिंक करें (Seed Demo Data)
                </>
              )}
            </button>
            <button
              onClick={() => onNavigateTab('users')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              पूर्ण यूजर सूची →
            </button>
          </div>
        </div>

        {seedSuccess && (
          <div className="mb-3 p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{seedSuccess}</span>
            </div>
            <button onClick={() => setSeedSuccess(null)} className="underline text-[10px]">हटाएं</button>
          </div>
        )}

        {/* 5 Demo Accounts Horizontal Carousel / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {DEMO_ACCOUNTS.map((acc) => {
            const isActive = currentUser?.email === acc.email;
            return (
              <div
                key={acc.id}
                className={`bg-slate-950/80 rounded-lg p-3 border transition-colors flex flex-col justify-between ${
                  isActive ? 'border-red-500 bg-red-950/10' : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${acc.badgeColor}`}>
                      {acc.role.toUpperCase()}
                    </span>
                    {isActive && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> सक्रिय
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-white truncate">{acc.name.split(' (')[0]}</div>
                  <div className="text-[10px] text-slate-400 truncate mb-2">{acc.designation.split(' (')[0]}</div>

                  <div className="space-y-1 bg-slate-900 p-2 rounded text-[10px] font-mono border border-slate-800/60 mb-2">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="truncate text-emerald-400 select-all">{acc.email.split('@')[0]}@..</span>
                      <button
                        onClick={() => copyCreds(acc.email, `${acc.id}-em`)}
                        className="text-slate-400 hover:text-white p-0.5"
                        title="ईमेल कॉपी करें"
                      >
                        {copiedId === `${acc.id}-em` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800">
                      <span className="truncate text-amber-400 select-all">{acc.password}</span>
                      <button
                        onClick={() => copyCreds(acc.password, `${acc.id}-pw`)}
                        className="text-slate-400 hover:text-white p-0.5"
                        title="पासवर्ड कॉपी करें"
                      >
                        {copiedId === `${acc.id}-pw` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  {isActive ? (
                    <div className="text-[10px] font-bold text-center text-emerald-400 py-1 bg-emerald-950/40 rounded border border-emerald-900/60">
                      वर्तमान यूजर
                    </div>
                  ) : (
                    <button
                      onClick={() => quickDemoLogin(acc)}
                      className="w-full bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <LogIn className="w-3 h-3" /> स्विच करें
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Content: Recent Articles & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Articles (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h2 className="font-serif font-bold text-base text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-500" />
              हालिया प्रकाशित व ड्राफ्ट समाचार
            </h2>
            <button
              onClick={() => onNavigateTab('articles')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold"
            >
              सभी समाचार देखें ({articles.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">समाचार शीर्षक</th>
                  <th className="py-2.5 px-3">श्रेणी / जिला</th>
                  <th className="py-2.5 px-3">लेखक</th>
                  <th className="py-2.5 px-3">स्थिति</th>
                  <th className="py-2.5 px-3">व्यूज</th>
                  <th className="py-2.5 px-3 text-right">कार्य</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {articles.slice(0, 7).map((art) => (
                  <tr key={art.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3 max-w-[220px]">
                      <div className="font-semibold text-white truncate">{art.title}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(art.publishedAt || art.createdAt).toLocaleDateString('hi-IN')}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                        {art.categoryName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{art.authorName}</td>
                    <td className="py-2.5 px-3">
                      {art.status === 'published' ? (
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                          प्रकाशित
                        </span>
                      ) : (
                        <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                          ड्राफ्ट
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono">{art.views.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onEditArticle(art)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[11px] font-medium"
                      >
                        संपादित करें
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Logs & Quick System Status (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="font-serif font-bold text-base text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                सिस्टम गतिविधि (Activity Logs)
              </h2>
            </div>

            <div className="space-y-3">
              {activityLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-200">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{log.details}</p>
                  <div className="text-[10px] text-slate-500 mt-1">द्वारा: {log.userName}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigateTab('activity')}
              className="w-full text-center text-xs text-slate-400 hover:text-white"
            >
              सभी गतिविधि लॉग्स देखें →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
