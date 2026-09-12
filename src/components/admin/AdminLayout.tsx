import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Flame,
  FolderTree,
  Users,
  Video,
  Newspaper,
  DollarSign,
  Search,
  Settings,
  Activity,
  LogOut,
  ExternalLink,
  PlusCircle,
  Menu,
  X,
  Bell,
  ShieldCheck,
  Sparkles,
  Bot,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'articles'
  | 'auto_fetch'
  | 'breaking'
  | 'categories'
  | 'authors'
  | 'videos'
  | 'epaper'
  | 'ads'
  | 'seo'
  | 'settings'
  | 'users'
  | 'activity';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onNavigateToPublic: () => void;
  onCreateArticle: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onSelectTab,
  onNavigateToPublic,
  onCreateArticle,
  children,
}) => {
  const { currentUser, logout, isLiveFirebase } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems: { id: AdminTab; label: string; labelHi: string; icon: React.ReactNode; badge?: string; roles?: string[] }[] = [
    { id: 'dashboard', label: 'Dashboard', labelHi: 'डैशबोर्ड', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'articles', label: 'News Articles', labelHi: 'समाचार प्रबंधन', icon: <FileText className="w-4 h-4" /> },
    { id: 'auto_fetch', label: 'Auto Fetch (Bhaskar & AI)', labelHi: 'दैनिक भास्कर ऑटो-फेच', icon: <Sparkles className="w-4 h-4 text-amber-400" />, badge: 'AI' },
    { id: 'breaking', label: 'Breaking News', labelHi: 'बड़ी खबरें (Breaking)', icon: <Flame className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories & Districts', labelHi: 'श्रेणियां व जिले', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'authors', label: 'Reporters & Editors', labelHi: 'पत्रकार व संवाददाता', icon: <Users className="w-4 h-4" /> },
    { id: 'videos', label: 'Video News', labelHi: 'वीडियो बुलेटिन', icon: <Video className="w-4 h-4" /> },
    { id: 'epaper', label: 'E-Paper Editions', labelHi: 'दैनिक ई-पेपर', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'ads', label: 'Advertisements', labelHi: 'विज्ञापन प्रबंधन', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO & Sitemaps', labelHi: 'SEO एवं साइटमैप', icon: <Search className="w-4 h-4" /> },
    { id: 'settings', label: 'Site Settings', labelHi: 'वेबसाइट सेटिंग्स', icon: <Settings className="w-4 h-4" /> },
    { id: 'users', label: 'User Roles & Demo IDs', labelHi: 'यूजर व भूमिकाएं (IDs)', icon: <ShieldCheck className="w-4 h-4 text-amber-400" />, badge: '5 Roles' },
    { id: 'activity', label: 'Activity Logs', labelHi: 'सिस्टम लॉग्स', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* 1. SIDEBAR (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white font-black text-sm px-2 py-0.5 rounded font-serif">SAMACHAR</span>
              <span className="font-bold text-sm tracking-tight text-white font-serif">CMS</span>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Badge */}
          <div className="p-3.5 mx-3 my-3 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs">
              {currentUser?.displayName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{currentUser?.displayName}</div>
              <div className="text-[10px] text-red-400 font-semibold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {currentUser?.role === 'super_admin' ? 'Super Admin' : currentUser?.role}
              </div>
            </div>
          </div>

          {/* Quick Create Button */}
          <div className="px-3 mb-3">
            <button
              onClick={() => {
                onCreateArticle();
                setMobileSidebarOpen(false);
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              नया समाचार जोड़ें
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] no-scrollbar">
            {menuItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 transition-colors ${
                    active
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="truncate">{item.labelHi}</span>
                      {item.badge && (
                        <span className="ml-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-black px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 opacity-80">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            onClick={onNavigateToPublic}
            className="w-full text-left px-3 py-2 rounded text-xs text-amber-300 hover:bg-slate-800 flex items-center gap-2 font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            पब्लिक वेबसाइट देखें
          </button>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2 font-medium"
          >
            <LogOut className="w-4 h-4" />
            लॉगआउट (Sign Out)
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-xs font-semibold text-slate-300 hidden sm:block">
              समाचार फर्स्ट नियंत्रण कक्ष (CMS Control Room)
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live DB Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {isLiveFirebase ? 'Firebase Live Sync' : 'Active Local Store'}
            </div>

            <button
              onClick={onNavigateToPublic}
              className="hidden sm:flex items-center gap-1 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              लाइव पोर्टल
            </button>
          </div>
        </header>

        {/* Dynamic Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">{children}</main>
      </div>
    </div>
  );
};
