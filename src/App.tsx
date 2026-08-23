import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { dbService } from './services/db';
import {
  Article,
  Category,
  Subcategory,
  Author,
  VideoNews,
  BreakingNews,
  Advertisement,
  EPaperEdition,
  SeoSettings,
  SiteSettings,
  ActivityLog,
} from './types';

// Layout & Common
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { AuthorPage } from './pages/AuthorPage';
import { VideosPage } from './pages/VideosPage';
import { PhotosPage } from './pages/PhotosPage';
import { EPaperPage } from './pages/EPaperPage';
import { StaticPage, StaticPageType } from './pages/StaticPages';
import { SitemapPage } from './pages/SitemapPage';

// Admin Components
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { ArticleManager } from './components/admin/ArticleManager';
import { ArticleEditorModal } from './components/admin/ArticleEditorModal';
import { BreakingNewsManager } from './components/admin/BreakingNewsManager';
import { CategoryManager } from './components/admin/CategoryManager';
import { AuthorManager } from './components/admin/AuthorManager';
import { VideoManager } from './components/admin/VideoManager';
import { EPaperManager } from './components/admin/EPaperManager';
import { AdManager } from './components/admin/AdManager';
import { SeoSettingsManager } from './components/admin/SeoSettingsManager';
import { SiteSettingsManager } from './components/admin/SiteSettingsManager';
import { ActivityLogViewer } from './components/admin/ActivityLogViewer';

export type AppView =
  | 'home'
  | 'article'
  | 'category'
  | 'search'
  | 'author'
  | 'videos'
  | 'photos'
  | 'epaper'
  | 'static'
  | 'sitemap'
  | 'admin_login'
  | 'admin';

const MainApp: React.FC = () => {
  const { currentUser } = useAuth();

  // Route State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('');
  const [activeAuthorSlug, setActiveAuthorSlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [staticPageType, setStaticPageType] = useState<StaticPageType>('about');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Modal State for Article Editor
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Dynamic Data Store States
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [videos, setVideos] = useState<VideoNews[]>([]);
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [epaperEditions, setEpaperEditions] = useState<EPaperEdition[]>([]);
  const [seoSettings, setSeoSettings] = useState<SeoSettings>(dbService.getSeoSettings());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(dbService.getSiteSettings());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh all state from DB
  const refreshData = async () => {
    try {
      const [
        fetchedArticles,
        fetchedCategories,
        fetchedSubcategories,
        fetchedAuthors,
        fetchedVideos,
        fetchedBreaking,
        fetchedAds,
        fetchedEpaper,
        fetchedSeo,
        fetchedSite,
        fetchedLogs,
      ] = await Promise.all([
        dbService.getArticles({ limit: 100 }),
        dbService.getCategories(),
        dbService.getSubcategories(),
        dbService.getAuthors(),
        dbService.getVideos(),
        dbService.getBreakingNews(),
        dbService.getAds(),
        dbService.getEPaperEditions(),
        dbService.getSeoSettings(),
        dbService.getSiteSettings(),
        dbService.getActivityLogs(),
      ]);

      setArticles(fetchedArticles);
      setCategories(fetchedCategories);
      setSubcategories(fetchedSubcategories);
      setAuthors(fetchedAuthors);
      setVideos(fetchedVideos);
      setBreakingNews(fetchedBreaking);
      setAds(fetchedAds);
      setEpaperEditions(fetchedEpaper);
      setSeoSettings(fetchedSeo);
      setSiteSettings(fetchedSite);
      setActivityLogs(fetchedLogs);
    } catch (err) {
      console.error('Error refreshing data from DB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handle Navigation Callbacks
  const navigateToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToArticle = (rawSlug: string) => {
    if (!rawSlug) return;
    const cleanSlug = typeof rawSlug === 'string'
      ? decodeURIComponent(rawSlug).replace(/^\/?(news\/)?/, '').replace(/\/$/, '').trim()
      : String(rawSlug);
    setActiveSlug(cleanSlug);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (slug: string) => {
    const cleanSlug = typeof slug === 'string'
      ? decodeURIComponent(slug).replace(/^\/?(category\/)?/, '').replace(/\/$/, '').trim()
      : String(slug);
    setActiveCategorySlug(cleanSlug);
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAuthor = (slug: string) => {
    setActiveAuthorSlug(slug);
    setCurrentView('author');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToVideos = () => {
    setCurrentView('videos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPhotos = () => {
    setCurrentView('photos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToEPaper = () => {
    setCurrentView('epaper');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStatic = (type: StaticPageType) => {
    setStaticPageType(type);
    setCurrentView('static');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSitemap = () => {
    setCurrentView('sitemap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    if (!currentUser) {
      setCurrentView('admin_login');
    } else {
      setCurrentView('admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Article Actions
  const handleOpenCreateArticle = () => {
    setEditingArticle(null);
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (article: Article) => {
    setEditingArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (articleData: Partial<Article>) => {
    if (editingArticle) {
      await dbService.updateArticle(
        editingArticle.id,
        articleData,
        currentUser?.displayName || 'संपादक'
      );
    } else {
      await dbService.createArticle(
        articleData as any,
        currentUser?.displayName || 'संपादक'
      );
    }
    await refreshData();
  };

  const handleDeleteArticle = async (id: string) => {
    await dbService.deleteArticle(id, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleToggleArticleStatus = async (id: string, newStatus: 'published' | 'draft') => {
    await dbService.updateArticle(
      id,
      { status: newStatus },
      currentUser?.displayName || 'संपादक'
    );
    await refreshData();
  };

  // Breaking News Actions
  const handleAddBreaking = async (item: Omit<BreakingNews, 'id' | 'createdAt'>) => {
    await dbService.addBreakingNews(item, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleUpdateBreaking = async (id: string, item: Partial<BreakingNews>) => {
    await dbService.updateBreakingNews(id, item, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleDeleteBreaking = async (id: string) => {
    await dbService.deleteBreakingNews(id, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  // Category Actions
  const handleAddCategory = async (cat: Omit<Category, 'id'>) => {
    await dbService.addCategory(cat, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleUpdateCategory = async (id: string, cat: Partial<Category>) => {
    await dbService.updateCategory(id, cat, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleDeleteCategory = async (id: string) => {
    await dbService.deleteCategory(id, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleAddSubcategory = async (sub: Omit<Subcategory, 'id'>) => {
    await dbService.addSubcategory(sub, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleDeleteSubcategory = async (id: string) => {
    await dbService.deleteSubcategory(id, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  // Author Actions
  const handleAddAuthor = async (author: Omit<Author, 'id'>) => {
    await dbService.addAuthor(author, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleUpdateAuthor = async (id: string, author: Partial<Author>) => {
    await dbService.updateAuthor(id, author, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleDeleteAuthor = async (id: string) => {
    await dbService.deleteAuthor(id, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  // Video Actions
  const handleAddVideo = async (vid: Omit<VideoNews, 'id' | 'views'>) => {
    await dbService.addVideo(vid, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleDeleteVideo = async (id: string) => {
    await dbService.deleteVideo(id, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  // EPaper Actions
  const handleAddEPaper = async (edition: Omit<EPaperEdition, 'id'>) => {
    await dbService.addEPaperEdition(edition, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleDeleteEPaper = async (id: string) => {
    await dbService.deleteEPaperEdition(id, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  // Ad Actions
  const handleAddAd = async (ad: Omit<Advertisement, 'id' | 'createdAt'>) => {
    await dbService.addAd(ad, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleUpdateAd = async (id: string, ad: Partial<Advertisement>) => {
    await dbService.updateAd(id, ad, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleDeleteAd = async (id: string) => {
    await dbService.deleteAd(id, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  // SEO & Settings Actions
  const handleSaveSeo = async (settings: SeoSettings) => {
    await dbService.updateSeoSettings(settings, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  const handleSaveSiteSettings = async (settings: SiteSettings) => {
    await dbService.updateSiteSettings(settings, currentUser?.displayName || 'संपादक');
    await refreshData();
  };

  // Auto redirect from login to admin if user logs in
  useEffect(() => {
    if (currentView === 'admin_login' && currentUser) {
      setCurrentView('admin');
    }
  }, [currentUser, currentView]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-red-600 selection:text-white">
      {/* 1. ADMIN LOGIN VIEW */}
      {currentView === 'admin_login' && (
        <AdminLogin onBackToSite={navigateToHome} />
      )}

      {/* 2. CMS / ADMIN CONTROL PANEL VIEW */}
      {currentView === 'admin' && currentUser && (
        <AdminLayout
          activeTab={adminTab}
          onSelectTab={setAdminTab}
          onNavigateToPublic={navigateToHome}
          onCreateArticle={handleOpenCreateArticle}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard
              articles={articles}
              categories={categories}
              authors={authors}
              videos={videos}
              breakingNews={breakingNews}
              activityLogs={activityLogs}
              onNavigateTab={setAdminTab}
              onCreateArticle={handleOpenCreateArticle}
              onEditArticle={handleOpenEditArticle}
            />
          )}

          {adminTab === 'articles' && (
            <ArticleManager
              articles={articles}
              categories={categories}
              subcategories={subcategories}
              authors={authors}
              onCreateArticle={handleOpenCreateArticle}
              onEditArticle={handleOpenEditArticle}
              onDeleteArticle={handleDeleteArticle}
              onToggleStatus={handleToggleArticleStatus}
              onViewLiveArticle={navigateToArticle}
            />
          )}

          {adminTab === 'breaking' && (
            <BreakingNewsManager
              breakingNews={breakingNews}
              onAdd={handleAddBreaking}
              onUpdate={handleUpdateBreaking}
              onDelete={handleDeleteBreaking}
            />
          )}

          {adminTab === 'categories' && (
            <CategoryManager
              categories={categories}
              subcategories={subcategories}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onAddSubcategory={handleAddSubcategory}
              onDeleteSubcategory={handleDeleteSubcategory}
            />
          )}

          {adminTab === 'authors' && (
            <AuthorManager
              authors={authors}
              onAddAuthor={handleAddAuthor}
              onUpdateAuthor={handleUpdateAuthor}
              onDeleteAuthor={handleDeleteAuthor}
            />
          )}

          {adminTab === 'videos' && (
            <VideoManager
              videos={videos}
              onAddVideo={handleAddVideo}
              onDeleteVideo={handleDeleteVideo}
            />
          )}

          {adminTab === 'epaper' && (
            <EPaperManager
              editions={epaperEditions}
              onAddEdition={handleAddEPaper}
              onDeleteEdition={handleDeleteEPaper}
            />
          )}

          {adminTab === 'ads' && (
            <AdManager
              ads={ads}
              onAddAd={handleAddAd}
              onUpdateAd={handleUpdateAd}
              onDeleteAd={handleDeleteAd}
            />
          )}

          {adminTab === 'seo' && (
            <SeoSettingsManager
              seoSettings={seoSettings}
              articles={articles}
              categories={categories}
              onSaveSeo={handleSaveSeo}
            />
          )}

          {adminTab === 'settings' && (
            <SiteSettingsManager
              siteSettings={siteSettings}
              onSave={handleSaveSiteSettings}
            />
          )}

          {adminTab === 'activity' && (
            <ActivityLogViewer logs={activityLogs} />
          )}
        </AdminLayout>
      )}

      {/* 3. PUBLIC WEBSITE VIEWS */}
      {currentView !== 'admin_login' && currentView !== 'admin' && (
        <div className="flex flex-col min-h-screen">
          {/* Main Website Header */}
          <Header
            categories={categories}
            breakingNews={breakingNews}
            onSelectCategory={navigateToCategory}
            onSelectArticle={navigateToArticle}
            onSearch={navigateToSearch}
            onNavigateHome={navigateToHome}
            onNavigateEPaper={navigateToEPaper}
            onNavigateVideos={navigateToVideos}
            onNavigateAdmin={navigateToAdmin}
          />

          {/* Dynamic Page Routing */}
          <main className="flex-1">
            {currentView === 'home' && (
              <HomePage
                articles={articles}
                categories={categories}
                videos={videos}
                breakingNews={breakingNews}
                onSelectArticle={navigateToArticle}
                onSelectCategory={navigateToCategory}
                onSelectVideo={navigateToVideos}
                onSelectDistrict={(dist) => navigateToCategory(`haryana?district=${encodeURIComponent(dist)}`)}
              />
            )}

            {currentView === 'article' && (
              <ArticlePage
                slug={activeSlug}
                articles={articles}
                categories={categories}
                siteSettings={siteSettings}
                onSelectArticle={navigateToArticle}
                onSelectCategory={navigateToCategory}
                onSelectAuthor={navigateToAuthor}
                onNavigate={(path) => {
                  if (path === '/' || path === '/home') navigateToHome();
                  else if (path.startsWith('/news/')) navigateToArticle(path.replace('/news/', ''));
                  else if (path.startsWith('/category/')) navigateToCategory(path.replace('/category/', ''));
                  else if (path === '/videos') navigateToVideos();
                  else if (path === '/e-paper' || path === '/epaper') navigateToEPaper();
                }}
              />
            )}

            {currentView === 'category' && (
              <CategoryPage
                categorySlug={activeCategorySlug}
                categories={categories}
                subcategories={subcategories}
                onSelectArticle={navigateToArticle}
                onSelectCategory={navigateToCategory}
              />
            )}

            {currentView === 'search' && (
              <SearchPage
                initialQuery={searchQuery}
                categories={categories}
                onSelectArticle={navigateToArticle}
                onSelectCategory={navigateToCategory}
              />
            )}

            {currentView === 'author' && (
              <AuthorPage
                authorSlug={activeAuthorSlug}
                authors={authors}
                categories={categories}
                onSelectArticle={navigateToArticle}
                onSelectCategory={navigateToCategory}
              />
            )}

            {currentView === 'videos' && (
              <VideosPage
                videos={videos}
                onSelectArticle={navigateToArticle}
              />
            )}

            {currentView === 'photos' && (
              <PhotosPage
                articles={articles}
                onSelectArticle={navigateToArticle}
              />
            )}

            {currentView === 'epaper' && (
              <EPaperPage
                onNavigateHome={navigateToHome}
              />
            )}

            {currentView === 'static' && (
              <StaticPage
                pageType={staticPageType}
                onNavigateHome={navigateToHome}
                onSelectPage={navigateToStatic}
              />
            )}

            {currentView === 'sitemap' && (
              <SitemapPage
                articles={articles}
                categories={categories}
                onSelectArticle={navigateToArticle}
                onSelectCategory={navigateToCategory}
              />
            )}
          </main>

          {/* Main Website Footer */}
          <Footer
            categories={categories}
            onSelectCategory={navigateToCategory}
            onSelectStaticPage={navigateToStatic}
            onSelectSitemap={navigateToSitemap}
            onNavigateEPaper={navigateToEPaper}
            onNavigateVideos={navigateToVideos}
            onNavigateAdmin={navigateToAdmin}
          />
        </div>
      )}

      {/* Global Article Editor Modal */}
      <ArticleEditorModal
        article={editingArticle}
        categories={categories}
        subcategories={subcategories}
        authors={authors}
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        onSave={handleSaveArticle}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
