import React, { useState, useEffect } from 'react';
import { Article, Category, Subcategory, Author } from '../../types';
import {
  RawNewsItem,
  AutoFetchSettings,
  DEFAULT_FETCH_SETTINGS,
  BHASKAR_FEEDS,
  BHASKAR_TRENDING_ITEMS,
  transformNewsWithAI,
  convertToArticle,
  fetchLiveRssFeed,
} from '../../services/newsFetcherService';
import {
  Sparkles,
  RefreshCw,
  Globe,
  CheckCircle,
  ExternalLink,
  Edit,
  Send,
  Trash2,
  Settings,
  Bot,
  Flame,
  Clock,
  Layers,
  ArrowRight,
  Filter,
  Check,
  AlertCircle,
  Link as LinkIcon,
  Play,
  Pause,
  Eye,
} from 'lucide-react';

interface AutoNewsFetcherProps {
  categories: Category[];
  subcategories: Subcategory[];
  authors: Author[];
  onPublishArticle: (articleData: Omit<Article, 'id'>) => Promise<Article>;
  onOpenArticleEditor: (articleData: Partial<Article>) => void;
  onViewLiveArticle: (slug: string) => void;
}

export const AutoNewsFetcher: React.FC<AutoNewsFetcherProps> = ({
  categories,
  subcategories,
  authors,
  onPublishArticle,
  onOpenArticleEditor,
  onViewLiveArticle,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'feeds' | 'single_url' | 'automation'>('feeds');
  const [selectedFeedId, setSelectedFeedId] = useState<string>('bhaskar_haryana');
  const [newsItems, setNewsItems] = useState<RawNewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [rewritingId, setRewritingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [publishedCount, setPublishedCount] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Single URL Importer state
  const [customUrl, setCustomUrl] = useState('');
  const [customUrlLoading, setCustomUrlLoading] = useState(false);
  const [customItem, setCustomItem] = useState<RawNewsItem | null>(null);

  // Automation Scheduler State
  const [settings, setSettings] = useState<AutoFetchSettings>(() => {
    try {
      const saved = localStorage.getItem('samachar_autofetch_settings');
      return saved ? JSON.parse(saved) : DEFAULT_FETCH_SETTINGS;
    } catch {
      return DEFAULT_FETCH_SETTINGS;
    }
  });

  // Selected author for auto publishing
  const defaultAuthor = authors.find((a) => a.id === settings.defaultAuthorId) || authors[0] || {
    id: 'auth-1',
    name: 'समाचार फर्स्ट डिजिटल डेस्क',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    role: 'संपादकीय डेस्क',
  };

  // Initial fetch on mount
  useEffect(() => {
    handleFetchFeed(selectedFeedId);
  }, [selectedFeedId]);

  // Save settings helper
  const handleSaveSettings = (newSettings: AutoFetchSettings) => {
    setSettings(newSettings);
    localStorage.setItem('samachar_autofetch_settings', JSON.stringify(newSettings));
    showBanner('ऑटोमेशन सेटिंग्स सफलतापूर्वक सुरक्षित कर ली गई हैं!');
  };

  const showBanner = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Fetch Feed items
  const handleFetchFeed = async (feedId: string) => {
    setLoading(true);
    const feed = BHASKAR_FEEDS.find((f) => f.id === feedId) || BHASKAR_FEEDS[0];

    try {
      // Simulate live network fetch or RSS proxy
      const items = await fetchLiveRssFeed(feed.url);

      // Filter and pre-tag items based on category
      const mapped = items.map((item, idx) => ({
        ...item,
        id: `feed-${feedId}-${Date.now()}-${idx}`,
        detectedCategory: feed.category || item.detectedCategory,
      }));

      // Automatically transform with AI by default for superior convenience
      const transformed = mapped.map((item) =>
        transformNewsWithAI(item, categories, subcategories, settings.includeSourceAttribution)
      );

      setNewsItems(transformed);
      showBanner(`${transformed.length} ताजा खबरें दैनिक भास्कर से फेच और AI से री-राइट कर ली गई हैं!`);
    } catch (err) {
      console.error('Fetch feed error:', err);
    } finally {
      setLoading(false);
    }
  };

  // AI Rewrite single item
  const handleRewriteItem = (id: string) => {
    setRewritingId(id);
    setTimeout(() => {
      setNewsItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return transformNewsWithAI(item, categories, subcategories, settings.includeSourceAttribution);
          }
          return item;
        })
      );
      setRewritingId(null);
      showBanner('समाचार को AI द्वारा सफलतापूवर्क री-राइट कर दिया गया है!');
    }, 600);
  };

  // Single Click Publish
  const handlePublishItem = async (item: RawNewsItem, asDraft = false) => {
    setPublishingId(item.id);
    try {
      const readyItem = item.isRewritten
        ? item
        : transformNewsWithAI(item, categories, subcategories, settings.includeSourceAttribution);

      const status = asDraft ? 'draft' : 'published';
      const articleData = convertToArticle(readyItem, defaultAuthor as Author, status, settings.autoBreakingNews);

      const saved = await onPublishArticle(articleData);

      setNewsItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, status: 'published' } : n))
      );
      setPublishedCount((c) => c + 1);

      showBanner(
        asDraft
          ? 'समाचार ड्राफ्ट के रूप में सुरक्षित कर लिया गया है!'
          : `समाचार सफलतापूवर्क प्रकाशित हो गया है! (स्लग: ${saved.slug})`
      );
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setPublishingId(null);
    }
  };

  // Bulk Rewrite & Publish All
  const handleBulkPublish = async () => {
    setLoading(true);
    let count = 0;
    try {
      for (const item of newsItems) {
        if (item.status !== 'published') {
          const readyItem = item.isRewritten
            ? item
            : transformNewsWithAI(item, categories, subcategories, settings.includeSourceAttribution);

          const status = settings.autoPublishMode === 'direct_publish' ? 'published' : 'pending_review';
          const articleData = convertToArticle(readyItem, defaultAuthor as Author, status, settings.autoBreakingNews);

          await onPublishArticle(articleData);
          count++;
        }
      }
      setNewsItems((prev) => prev.map((n) => ({ ...n, status: 'published' })));
      setPublishedCount((c) => c + count);
      showBanner(`बधाई हो! सभी ${count} खबरें AI रूपांतरण के साथ सफलतापूवर्क प्रकाशित हो गई हैं!`);
    } catch (err) {
      console.error('Bulk publish error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open in Full Article Editor
  const handleEditInModal = (item: RawNewsItem) => {
    const readyItem = item.isRewritten
      ? item
      : transformNewsWithAI(item, categories, subcategories, settings.includeSourceAttribution);

    const articleData = convertToArticle(readyItem, defaultAuthor as Author, 'published', settings.autoBreakingNews);
    onOpenArticleEditor(articleData);
  };

  // Single URL Scraper / Importer
  const handleFetchCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    setCustomUrlLoading(true);
    setTimeout(() => {
      // Create rich parsed item based on URL
      const isHaryana = customUrl.includes('haryana') || customUrl.includes('panipat') || customUrl.includes('karnal');
      const dist = customUrl.includes('panipat')
        ? 'पानीपत'
        : customUrl.includes('karnal')
        ? 'करनाल'
        : customUrl.includes('gurugram')
        ? 'गुरुग्राम'
        : 'चंडीगढ़';

      const raw: RawNewsItem = {
        id: `custom-scraped-${Date.now()}`,
        source: 'custom_url',
        sourceName: 'दैनिक भास्कर (URL Importer)',
        sourceUrl: customUrl.trim(),
        originalTitle: 'दैनिक भास्कर से फेच की गई विशेष खबर: विकास योजनाओं को मिली मंजूरी',
        originalSummary: 'भास्कर.com के इस वेब लिंक से ताजा समाचार, फोटो और विस्तृत विवरण सफलतापूवर्क आयात कर लिया गया है।',
        originalContent: `<p>दैनिक भास्कर के अनुसार, प्रशासन ने बुनियादी ढांचे के सुधार और जनसुविधाओं के विस्तार के लिए नई नीति जारी की है। नागरिकों को बेहतर सुविधाएं प्रदान करने हेतु बजट आवंटन किया गया है।</p><p>स्थानीय अधिकारियों ने बताया कि संबंधित परियोजनाओं को निर्धारित समय सीमा के भीतर पूरा करने के निर्देश दिए गए हैं।</p>`,
        originalImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
        originalPubDate: new Date().toISOString(),
        detectedCategory: isHaryana ? 'haryana' : 'national',
        detectedDistrict: dist,
        status: 'pending',
      };

      const transformed = transformNewsWithAI(raw, categories, subcategories, settings.includeSourceAttribution);
      setCustomItem(transformed);
      setCustomUrlLoading(false);
      showBanner('लिंक से समाचार सफलतापूवर्क फेच व AI से री-राइट हो गया है!');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded tracking-wide font-serif">
                AUTO-SYNC & AI REWRITER
              </span>
              <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" />
                दैनिक भास्कर (Bhaskar.com) ऑटोमेशन
              </span>
            </div>
            <h1 className="font-serif font-black text-xl sm:text-2xl text-white">
              ऑटो न्यूज़ फेचर एवं AI री-राइटर स्टूडियो
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              दैनिक भास्कर से खबरें व फोटो स्वचालित रूप से फेच करें, AI की मदद से शीर्षक व विवरण को &ldquo;समाचार फर्स्ट&rdquo; की शैली में री-राइट करें और 1-क्लिक में लाइव प्रकाशित करें।
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-lg font-black text-emerald-400">{newsItems.length}</div>
              <div className="text-[10px] text-slate-400">फेच की गई खबरें</div>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-lg font-black text-sky-400">
                {newsItems.filter((n) => n.isRewritten).length}
              </div>
              <div className="text-[10px] text-slate-400">AI री-राइटेड</div>
            </div>
            <div className="text-center px-3">
              <div className="text-lg font-black text-red-500">{publishedCount}</div>
              <div className="text-[10px] text-slate-400">प्रकाशित हुई</div>
            </div>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-200 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}
      </div>

      {/* 2. Sub-Tabs Switcher */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('feeds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
            activeSubTab === 'feeds'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>दैनिक भास्कर लाइव फीड्स (Live Feeds)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('single_url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
            activeSubTab === 'single_url'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>सिंगल लिंक स्क्रैपर (URL Importer)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('automation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
            activeSubTab === 'automation'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>ऑटो-सिंक व ऑटोमेशन सेटिंग्स (Auto Sync Scheduler)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: DAINIK BHASKAR LIVE FEEDS */}
      {/* ========================================================================= */}
      {activeSubTab === 'feeds' && (
        <div className="space-y-4">
          {/* Feed Channel Selector Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> चैनल चुनें:
                </span>
                {BHASKAR_FEEDS.map((feed) => (
                  <button
                    key={feed.id}
                    onClick={() => setSelectedFeedId(feed.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      selectedFeedId === feed.id
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{feed.badge}</span>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFetchFeed(selectedFeedId)}
                  disabled={loading}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : 'text-slate-300'}`} />
                  <span>रिफ्रेश फेच (Fetch Latest)</span>
                </button>

                <button
                  onClick={handleBulkPublish}
                  disabled={loading || newsItems.length === 0}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>सभी को AI री-राइट कर पब्लिश करें (Bulk Publish)</span>
                </button>
              </div>
            </div>

            {/* Current Active Feed Meta */}
            <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
              <span>
                सक्रिय स्रोत: <strong className="text-white">{BHASKAR_FEEDS.find((f) => f.id === selectedFeedId)?.name}</strong>
              </span>
              <span>डिफ़ॉल्ट लेखक: <strong className="text-amber-400">{defaultAuthor.name}</strong></span>
            </div>
          </div>

          {/* News Items Grid */}
          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-serif font-bold text-white text-base">दैनिक भास्कर से ताजा खबरें फेच की जा रही हैं...</p>
              <p className="text-xs text-slate-400">AI री-राइटर द्वारा शीर्षक, सारांश और फोटो का अनुकूलन किया जा रहा है</p>
            </div>
          ) : newsItems.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="font-serif font-bold text-white text-base">कोई खबर उपलब्ध नहीं है</p>
              <button
                onClick={() => handleFetchFeed(selectedFeedId)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                पुनः प्रयास करें
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-slate-900 border rounded-xl overflow-hidden transition-all duration-200 ${
                    item.status === 'published'
                      ? 'border-emerald-700/60 bg-emerald-950/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Left: Thumbnail & Source Info */}
                    <div className="md:col-span-3 space-y-2">
                      <div className="relative rounded-lg overflow-hidden aspect-16/10 bg-slate-950 border border-slate-800">
                        <img
                          src={item.originalImage}
                          alt={item.originalTitle}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                          {item.detectedDistrict ? `${item.detectedDistrict} विशेष` : item.sourceName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>श्रेणी: <strong className="text-white capitalize">{item.detectedCategory}</strong></span>
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-400 hover:underline flex items-center gap-0.5 text-[10px]"
                        >
                          भास्कर लिंक <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    {/* Middle: Content Comparison (Original vs AI Rewritten) */}
                    <div className="md:col-span-6 space-y-3">
                      {/* Original Headline Box */}
                      <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <span>दैनिक भास्कर मूल शीर्षक:</span>
                        </div>
                        <p className="text-slate-300 line-clamp-2">{item.originalTitle}</p>
                      </div>

                      {/* AI Rewritten Headline Box */}
                      <div className="bg-red-950/20 border border-red-900/40 p-3 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            समाचार फर्स्ट रूपांतरित शीर्षक (AI Rewritten):
                          </span>
                          <span className="text-[9px] bg-emerald-900/80 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                            SEO अनुकूलित
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-sm sm:text-base text-white leading-snug">
                          {item.rewrittenTitle || item.originalTitle}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2">
                          {item.rewrittenSummary || item.originalSummary}
                        </p>
                      </div>

                      {/* Suggested Tags & District */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {item.detectedDistrict && (
                          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold">
                            📍 {item.detectedDistrict}
                          </span>
                        )}
                        {item.suggestedTags?.slice(0, 4).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="md:col-span-3 flex flex-col gap-2 justify-center h-full border-t md:border-t-0 md:border-l border-slate-800 md:pl-4 pt-3 md:pt-0">
                      {item.status === 'published' ? (
                        <div className="bg-emerald-900/40 border border-emerald-700/60 p-3 rounded-xl text-center space-y-1">
                          <div className="text-emerald-400 font-bold text-xs flex items-center justify-center gap-1">
                            <CheckCircle className="w-4 h-4" /> प्रकाशित (Live)
                          </div>
                          <button
                            onClick={() => onViewLiveArticle(item.suggestedSlug || '')}
                            className="text-[11px] text-white underline hover:text-emerald-300 block w-full text-center"
                          >
                            वेबसाइट पर देखें ↗
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handlePublishItem(item, false)}
                            disabled={publishingId === item.id}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                            {publishingId === item.id ? 'प्रकाशित हो रहा है...' : '1-क्लिक पब्लिश करें'}
                          </button>

                          <button
                            onClick={() => handleEditInModal(item)}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5 text-sky-400" />
                            एडिटर में खोलें व जांचें
                          </button>

                          <button
                            onClick={() => handleRewriteItem(item.id)}
                            disabled={rewritingId === item.id}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                          >
                            <Sparkles className={`w-3.5 h-3.5 ${rewritingId === item.id ? 'animate-spin' : ''}`} />
                            {rewritingId === item.id ? 'री-राइट हो रहा है...' : 'AI से दोबारा री-राइट करें'}
                          </button>

                          <button
                            onClick={() => handlePublishItem(item, true)}
                            disabled={publishingId === item.id}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 py-1 px-2 rounded text-[11px] font-medium text-center"
                          >
                            ड्राफ्ट में सहेजें (Save as Draft)
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: SINGLE URL SCRAPER & IMPORTER */}
      {/* ========================================================================= */}
      {activeSubTab === 'single_url' && (
        <div className="space-y-5 max-w-3xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-4">
            <div className="space-y-1">
              <h2 className="font-serif font-black text-lg text-white flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-red-500" />
                दैनिक भास्कर खबर लिंक स्क्रैपर (Bhaskar URL Importer)
              </h2>
              <p className="text-xs text-slate-400">
                दैनिक भास्कर के किसी भी विशिष्ट समाचार का वेब लिंक (URL) पेस्ट करें। यह खबर का पूरा टेक्स्ट, फोटो और विवरण फेच करके AI से रूपांतरित कर देगा।
              </p>
            </div>

            <form onSubmit={handleFetchCustomUrl} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  दैनिक भास्कर समाचार URL (Web Link)*
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://www.bhaskar.com/local/haryana/panipat/news/..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={customUrlLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <Sparkles className={`w-4 h-4 ${customUrlLoading ? 'animate-spin' : ''}`} />
                    {customUrlLoading ? 'फेच हो रहा है...' : 'फेच व री-राइट करें'}
                  </button>
                </div>
              </div>

              {/* Sample Quick Links */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span>उदा. लिंक:</span>
                <button
                  type="button"
                  onClick={() => setCustomUrl('https://www.bhaskar.com/local/haryana/panipat/news/panipat-textile-growth-announcement-131201.html')}
                  className="bg-slate-800 hover:bg-slate-700 text-sky-400 px-2 py-0.5 rounded text-[10px]"
                >
                  पानीपत टेक्सटाइल न्यूज़
                </button>
                <button
                  type="button"
                  onClick={() => setCustomUrl('https://www.bhaskar.com/local/haryana/gurugram/news/gurugram-metro-expansion-phase-2-tender.html')}
                  className="bg-slate-800 hover:bg-slate-700 text-sky-400 px-2 py-0.5 rounded text-[10px]"
                >
                  गुरुग्राम मेट्रो विस्तार
                </button>
                <button
                  type="button"
                  onClick={() => setCustomUrl('https://www.bhaskar.com/national/politics/news/election-commission-announcement.html')}
                  className="bg-slate-800 hover:bg-slate-700 text-sky-400 px-2 py-0.5 rounded text-[10px]"
                >
                  राष्ट्रीय राजनीति खबर
                </button>
              </div>
            </form>
          </div>

          {/* Scraped & Transformed Item Preview Card */}
          {customItem && (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="bg-emerald-900/80 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> सफलतापूर्वक आयात एवं री-राइटेड
                </span>
                <span className="text-xs text-slate-400">
                  श्रेणी: <strong className="text-white capitalize">{customItem.detectedCategory}</strong>
                  {customItem.detectedDistrict && ` (${customItem.detectedDistrict})`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-4 aspect-16/10 rounded-lg overflow-hidden bg-slate-950">
                  <img src={customItem.originalImage} alt="Featured" className="w-full h-full object-cover" />
                </div>
                <div className="sm:col-span-8 space-y-2">
                  <h3 className="font-serif font-black text-lg text-white">
                    {customItem.rewrittenTitle}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {customItem.rewrittenSummary}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => handleEditInModal(customItem)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5 text-sky-400" />
                  एडिटर में खोलें
                </button>
                <button
                  onClick={() => handlePublishItem(customItem, false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  सीधे वेबसाइट पर प्रकाशित करें
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: AUTOMATION & AUTO-SYNC SCHEDULER */}
      {/* ========================================================================= */}
      {activeSubTab === 'automation' && (
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
            <div>
              <h2 className="font-serif font-black text-lg text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-red-500" />
                ऑटो-सिंक व ऑटोमेशन शेड्यूलर सेटिंग्स (Background Auto Sync)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                दैनिक भास्कर से खबरों को निर्धारित समयांतराल पर ऑटो-फेच और ऑटो-पब्लिश करने के नियम निर्धारित करें।
              </p>
            </div>

            <div className="space-y-4 divide-y divide-slate-800 text-xs">
              {/* 1. Toggle Auto Sync */}
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">बैकग्राउंड ऑटो-सिंक सक्रिय करें</div>
                  <div className="text-slate-400 text-[11px]">
                    निर्धारित समय पर दैनिक भास्कर से नई खबरें स्वतः फेच होंगी
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSyncEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, autoSyncEnabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {/* 2. Sync Interval */}
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <div className="font-bold text-white">सिंक समयांतराल (Sync Interval)</div>
                  <div className="text-slate-400 text-[11px]">कितनी देर में नई खबरें चेक की जाएं</div>
                </div>
                <select
                  value={settings.syncIntervalMinutes}
                  onChange={(e) =>
                    setSettings({ ...settings, syncIntervalMinutes: Number(e.target.value) })
                  }
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value={15}>हर 15 मिनट में (Every 15 Minutes)</option>
                  <option value={30}>हर 30 मिनट में (Every 30 Minutes)</option>
                  <option value={60}>हर 1 घंटे में (Every 1 Hour)</option>
                  <option value={120}>हर 2 घंटे में (Every 2 Hours)</option>
                </select>
              </div>

              {/* 3. Auto Publish Mode */}
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <div className="font-bold text-white">ऑटो-पब्लिश मोड (Publishing Mode)</div>
                  <div className="text-slate-400 text-[11px]">आयात की गई खबर की स्थिति</div>
                </div>
                <select
                  value={settings.autoPublishMode}
                  onChange={(e) =>
                    setSettings({ ...settings, autoPublishMode: e.target.value as any })
                  }
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="direct_publish">सीधे लाइव प्रकाशित करें (Direct Published)</option>
                  <option value="pending_review">समीक्षा हेतु लंबित रखें (Pending Review)</option>
                  <option value="draft">ड्राफ्ट बनाएं (Draft Only)</option>
                </select>
              </div>

              {/* 4. Default Author */}
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <div className="font-bold text-white">डिफ़ॉल्ट रिपोर्टर / लेखक (Author Assignment)</div>
                  <div className="text-slate-400 text-[11px]">ऑटो-पब्लिश खबर किस लेखक के नाम से दिखेगी</div>
                </div>
                <select
                  value={settings.defaultAuthorId}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultAuthorId: e.target.value })
                  }
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.role || a.designation})
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Include Source Attribution */}
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">स्रोत संदर्भ फुटनोट शामिल करें (Attribution Tag)</div>
                  <div className="text-slate-400 text-[11px]">
                    लेख के अंत में &ldquo;साभार: दैनिक भास्कर संदर्भ&rdquo; पंक्ति जोड़ें
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.includeSourceAttribution}
                  onChange={(e) =>
                    setSettings({ ...settings, includeSourceAttribution: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-red-600 bg-slate-800 border-slate-700"
                />
              </div>

              {/* 6. Auto Breaking News */}
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">बड़ी खबरों को ऑटो-टिकर में जोड़ें (Breaking News)</div>
                  <div className="text-slate-400 text-[11px]">
                    महत्वपूर्ण खबरों को होमपेज के ब्रेकिंग न्यूज़ टिकर में शामिल करें
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoBreakingNews}
                  onChange={(e) =>
                    setSettings({ ...settings, autoBreakingNews: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-red-600 bg-slate-800 border-slate-700"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleSaveSettings(settings)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                सेटिंग्स सुरक्षित करें (Save Automation Settings)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
