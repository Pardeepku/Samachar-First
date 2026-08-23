import React, { useState, useEffect } from 'react';
import {
  Search,
  Menu,
  X,
  Flame,
  Globe,
  Radio,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Volume2,
} from 'lucide-react';
import { Category, BreakingNews } from '../../types';
import { dbService } from '../../services/db';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';

export interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  categories?: Category[];
  breakingNews?: BreakingNews[];
  onSelectCategory?: (slug: string) => void;
  onSelectArticle?: (slug: string) => void;
  onSearch?: (query: string) => void;
  onNavigateHome?: () => void;
  onNavigateEPaper?: () => void;
  onNavigateVideos?: () => void;
  onNavigateAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath = '/',
  onNavigate,
  categories = [],
  breakingNews: initialBreakingNews,
  onSelectCategory,
  onSelectArticle,
  onSearch,
  onNavigateHome,
  onNavigateEPaper,
  onNavigateVideos,
  onNavigateAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>(initialBreakingNews || []);
  const [currentBreakingIndex, setCurrentBreakingIndex] = useState(0);
  const [currentDateString, setCurrentDateString] = useState('');

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (path === '/' && onNavigateHome) {
      onNavigateHome();
    } else if (path.startsWith('/category/') && onSelectCategory) {
      onSelectCategory(path.replace('/category/', ''));
    } else if (path.startsWith('/news/') && onSelectArticle) {
      onSelectArticle(path.replace('/news/', ''));
    } else if (path.startsWith('/search') && onSearch) {
      const match = path.match(/q=([^&]*)/);
      onSearch(match ? decodeURIComponent(match[1]) : '');
    } else if ((path === '/e-paper' || path === '/epaper') && onNavigateEPaper) {
      onNavigateEPaper();
    } else if (path === '/videos' && onNavigateVideos) {
      onNavigateVideos();
    } else if (path === '/admin' && onNavigateAdmin) {
      onNavigateAdmin();
    }
  };

  useEffect(() => {
    // Format Hindi Date
    const now = new Date();
    const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
    const formatted = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    setCurrentDateString(formatted);

    // Fetch Breaking News if not provided
    if (!initialBreakingNews || initialBreakingNews.length === 0) {
      dbService.getBreakingNews().then((data) => {
        setBreakingNews(data || []);
      });
    }

    const handleUpdate = () => {
      dbService.getBreakingNews().then((data) => setBreakingNews(data || []));
    };
    window.addEventListener('samachar_store_updated', handleUpdate);
    return () => window.removeEventListener('samachar_store_updated', handleUpdate);
  }, [initialBreakingNews]);

  // Rotate breaking news item every 5s
  useEffect(() => {
    if (!breakingNews || breakingNews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBreakingIndex((prev) => (prev + 1) % breakingNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [breakingNews]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const activeCategories = (categories || [])
    .filter((c) => c.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const currentBreaking = breakingNews && breakingNews.length > 0 ? breakingNews[currentBreakingIndex] : null;

  return (
    <header className="w-full bg-white text-slate-900 border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Date, Location, Weather */}
          <div className="flex items-center space-x-3 text-slate-300">
            <span className="font-medium text-slate-100 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {currentDateString}
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden md:inline-flex items-center text-slate-300">
              📍 चंडीगढ़ / पानीपत: 28°C आंशिक बादल
            </span>
          </div>

          {/* Right: Language Selector, Quick Links, E-Paper, Admin Panel */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Top Right Indian Languages + English Selector */}
            <LanguageSelector />

            <button
              onClick={() => (onNavigateEPaper ? onNavigateEPaper() : navigate('/e-paper'))}
              id="header-epaper-btn"
              className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              ई-पेपर (E-Paper)
            </button>
            <button
              onClick={() => navigate('/contact')}
              id="header-contact-btn"
              className="text-slate-300 hover:text-white transition-colors hidden sm:inline"
            >
              संपर्क करें
            </button>
            <button
              onClick={() => (onNavigateAdmin ? onNavigateAdmin() : navigate('/admin'))}
              id="header-admin-login-btn"
              className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-xs"
            >
              <User className="w-3 h-3" />
              CMS / एडमिन
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => (onNavigateHome ? onNavigateHome() : navigate('/'))}
          className="cursor-pointer flex items-center space-x-3 select-none"
        >
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="bg-red-600 text-white font-black text-2xl sm:text-3xl px-2.5 py-0.5 rounded font-serif tracking-tight shadow-xs">
                समाचार
              </span>
              <span className="text-slate-900 font-black text-2xl sm:text-3xl font-serif tracking-tight">
                FIRST
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-red-600 font-bold tracking-widest uppercase mt-0.5 pl-0.5">
              आपकी खबर, सबसे पहले • 24x7 लाइव
            </p>
          </div>
        </div>

        {/* Header Right Actions: Search Bar & Live TV Badge */}
        <div className="flex items-center space-x-3">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="खबरें, जिला या विषय खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 md:w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-neutral-200 rounded-full focus:outline-none focus:border-red-500 focus:bg-white transition-all text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
          </form>

          {/* Live Bulletin Indicator */}
          <button
            onClick={() => (onNavigateVideos ? onNavigateVideos() : navigate('/videos'))}
            className="flex items-center space-x-1.5 bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span>लाइव बुलेटिन</span>
          </button>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 sm:hidden text-slate-700 hover:text-red-600 rounded-md"
            aria-label="खोजें"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-slate-700 hover:text-red-600 rounded-md"
            aria-label="मेनू खोलें"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {searchOpen && (
        <div className="sm:hidden px-4 py-2 bg-slate-100 border-t border-neutral-200">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative">
            <input
              type="text"
              autoFocus
              placeholder="खबरें खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          </form>
        </div>
      )}

      {/* 3. MAIN NAVIGATION BAR (Desktop) */}
      <nav className="hidden md:block bg-slate-900 text-white border-t border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 py-1">
            <button
              onClick={() => (onNavigateHome ? onNavigateHome() : navigate('/'))}
              className={`px-3.5 py-2 rounded text-sm font-semibold whitespace-nowrap transition-colors ${
                currentPath === '/' ? 'bg-red-600 text-white' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              होम
            </button>

            {activeCategories.slice(0, 10).map((cat) => (
              <button
                key={cat.id}
                onClick={() => (onSelectCategory ? onSelectCategory(cat.slug) : navigate(`/category/${cat.slug}`))}
                className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap transition-colors ${
                  currentPath === `/category/${cat.slug}`
                    ? 'bg-red-600 text-white'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.nameHi}
              </button>
            ))}

            <button
              onClick={() => (onNavigateVideos ? onNavigateVideos() : navigate('/videos'))}
              className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap transition-colors ${
                currentPath === '/videos' ? 'bg-red-600 text-white' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              वीडियो
            </button>

            <button
              onClick={() => navigate('/photos')}
              className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap transition-colors ${
                currentPath === '/photos' ? 'bg-red-600 text-white' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              फोटो
            </button>
          </div>

          <div className="flex items-center pl-2">
            <button
              onClick={() => navigate('/latest-news')}
              className="text-xs bg-red-800 hover:bg-red-700 text-white font-semibold px-2.5 py-1.5 rounded flex items-center gap-1 whitespace-nowrap"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              ताजा खबरें
            </button>
          </div>
        </div>
      </nav>

      {/* 4. BREAKING NEWS TICKER */}
      {breakingNews && breakingNews.length > 0 && currentBreaking && (
        <div className="bg-red-600 text-white text-xs sm:text-sm overflow-hidden flex items-center border-t border-red-700">
          <div className="bg-slate-950 px-3 py-1.5 font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 z-10">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-white">बड़ी खबर</span>
          </div>

          <div className="flex-1 overflow-hidden px-4 py-1.5 font-medium flex items-center justify-between">
            <div
              className="truncate cursor-pointer hover:underline flex items-center gap-2"
              onClick={() => {
                if (currentBreaking.link) {
                  if (currentBreaking.link.startsWith('/news/') && onSelectArticle) {
                    onSelectArticle(currentBreaking.link.replace('/news/', ''));
                  } else {
                    navigate(currentBreaking.link);
                  }
                }
              }}
            >
              <span className="bg-red-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                {currentBreaking.priority === 'urgent' ? '🚨 अत्यंत महत्वपूर्ण' : 'फ्लैश'}
              </span>
              <span>{currentBreaking.title}</span>
            </div>

            <div className="hidden sm:flex items-center space-x-1 pl-4 text-xs text-red-200 shrink-0">
              <span>{currentBreakingIndex + 1} / {breakingNews.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. MOBILE EXPANDABLE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 text-white border-t border-slate-800 p-4 space-y-4 shadow-xl">
          <div className="space-y-1">
            <button
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
                else navigate('/');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded text-sm font-semibold hover:bg-slate-800 flex items-center justify-between text-white"
            >
              <span>होम (Home)</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(cat.slug);
                  else navigate(`/category/${cat.slug}`);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded text-sm font-medium hover:bg-slate-800 flex items-center justify-between text-slate-300"
              >
                <span>{cat.nameHi} ({cat.name})</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            ))}

            <button
              onClick={() => {
                if (onNavigateVideos) onNavigateVideos();
                else navigate('/videos');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded text-sm font-medium hover:bg-slate-800 flex items-center justify-between text-slate-300"
            >
              <span>वीडियो बुलेटिन (Videos)</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => {
                navigate('/photos');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded text-sm font-medium hover:bg-slate-800 flex items-center justify-between text-slate-300"
            >
              <span>फोटो गैलरी (Photos)</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => {
                if (onNavigateEPaper) onNavigateEPaper();
                else navigate('/e-paper');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded text-sm font-medium hover:bg-slate-800 flex items-center justify-between text-amber-400"
            >
              <span>ई-पेपर (Digital E-Paper)</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-slate-400 font-medium">भाषा (Language):</span>
              <LanguageSelector />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  navigate('/about');
                  setMobileMenuOpen(false);
                }}
                className="p-2 bg-slate-900 rounded text-slate-300 hover:text-white"
              >
                हमारे बारे में
              </button>
              <button
                onClick={() => {
                  navigate('/contact');
                  setMobileMenuOpen(false);
                }}
                className="p-2 bg-slate-900 rounded text-slate-300 hover:text-white"
              >
                संपर्क करें
              </button>
              <button
                onClick={() => {
                  if (onNavigateAdmin) onNavigateAdmin();
                  else navigate('/admin');
                  setMobileMenuOpen(false);
                }}
                className="col-span-2 p-2 bg-red-600 rounded text-white font-bold text-center"
              >
                CMS / एडमिन पोर्टल
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
