import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
} from 'firebase/firestore';
import { db, isLive } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import {
  Article,
  Category,
  Subcategory,
  BreakingNews,
  Advertisement,
  Author,
  VideoNews,
  EPaperEdition,
  SeoSettings,
  SiteSettings,
  HomepageSection,
  NewsletterSubscriber,
  ContactMessage,
  ActivityLog,
  Comment,
  MediaItem,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_SUBCATEGORIES,
  INITIAL_AUTHORS,
  INITIAL_BREAKING_NEWS,
  INITIAL_ARTICLES,
  INITIAL_VIDEOS,
  INITIAL_ADVERTISEMENTS,
  INITIAL_SITE_SETTINGS,
  INITIAL_HOMEPAGE_SECTIONS,
} from '../data/initialData';

const INITIAL_EPAPER: EPaperEdition[] = [
  {
    id: 'ep-1',
    editionName: 'हरियाणा मुख्य संस्करण',
    date: new Date().toISOString().split('T')[0],
    thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80',
    totalPages: 8,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: [
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ep-2',
    editionName: 'पानीपत-करनाल विशेष संस्करण',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
    totalPages: 6,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: [
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const INITIAL_SEO_SETTINGS: SeoSettings = {
  metaTitle: 'Samachar First - आपकी खबर, सबसे पहले | Hindi News Portal',
  metaDescription: 'हरियाणा, दिल्ली-NCR, राष्ट्रीय राजनीति, अपराध, खेल, शिक्षा और व्यापार की सबसे तेज और सटीक हिंदी खबरें।',
  metaKeywords: 'हिंदी समाचार, ताजा खबर, Samachar First, हरियाणा न्यूज़, लाइव बुलेटिन, ब्रेकिंग न्यूज़',
  googleAnalyticsId: 'G-SAMACHAR1ST',
  googleSearchConsoleVerification: 'google-site-verification=sf-verified-news-portal-2026',
  googleNewsPublisherId: 'GNEWS-SAMACHAR-FIRST',
  robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://samacharfirst.com/sitemap.xml',
  canonicalUrl: 'https://samacharfirst.com',
};

// Helper to get or set local store
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`samachar_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Local store read error:', e);
  }
  return fallback;
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`samachar_${key}`, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('samachar_store_updated', { detail: { key } }));
  } catch (e) {
    console.error('Local store write error:', e);
  }
}

// Ensure initial seed in local storage if empty
export function initLocalStorageIfEmpty() {
  if (!localStorage.getItem('samachar_categories')) {
    setLocal('categories', INITIAL_CATEGORIES);
  }
  if (!localStorage.getItem('samachar_subcategories')) {
    setLocal('subcategories', INITIAL_SUBCATEGORIES);
  }
  if (!localStorage.getItem('samachar_authors')) {
    setLocal('authors', INITIAL_AUTHORS);
  }
  if (!localStorage.getItem('samachar_breakingNews')) {
    setLocal('breakingNews', INITIAL_BREAKING_NEWS);
  }
  if (!localStorage.getItem('samachar_articles')) {
    setLocal('articles', INITIAL_ARTICLES);
  }
  if (!localStorage.getItem('samachar_videos')) {
    setLocal('videos', INITIAL_VIDEOS);
  }
  if (!localStorage.getItem('samachar_advertisements')) {
    setLocal('advertisements', INITIAL_ADVERTISEMENTS);
  }
  if (!localStorage.getItem('samachar_siteSettings')) {
    setLocal('siteSettings', INITIAL_SITE_SETTINGS);
  }
  if (!localStorage.getItem('samachar_epaper')) {
    setLocal('epaper', INITIAL_EPAPER);
  }
  if (!localStorage.getItem('samachar_seoSettings')) {
    setLocal('seoSettings', INITIAL_SEO_SETTINGS);
  }
  if (!localStorage.getItem('samachar_homepageSections')) {
    setLocal('homepageSections', INITIAL_HOMEPAGE_SECTIONS);
  }
}

initLocalStorageIfEmpty();

export const dbService = {
  // ---------------- ARTICLES ----------------
  async getArticles(options?: {
    categoryId?: string;
    subcategoryId?: string;
    status?: string;
    limit?: number;
    limitCount?: number;
    onlyBreaking?: boolean;
    onlyFeatured?: boolean;
    onlyTrending?: boolean;
    authorId?: string;
    searchQuery?: string;
  }): Promise<Article[]> {
    const effectiveLimit = options?.limit || options?.limitCount;

    if (isLive && db) {
      try {
        const ref = collection(db, 'articles');
        let q = query(ref, orderBy('publishedAt', 'desc'));
        if (options?.status) {
          q = query(ref, where('status', '==', options.status), orderBy('publishedAt', 'desc'));
        }
        if (effectiveLimit) {
          q = query(q, limit(effectiveLimit));
        }
        const snap = await getDocs(q);
        let items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Article));
        if (options?.categoryId) items = items.filter((a) => a.categoryId === options.categoryId);
        if (options?.subcategoryId) items = items.filter((a) => a.subcategoryId === options.subcategoryId);
        if (options?.authorId) items = items.filter((a) => a.authorId === options.authorId);
        if (options?.onlyBreaking) items = items.filter((a) => a.isBreaking);
        if (options?.onlyFeatured) items = items.filter((a) => a.isFeatured);
        if (options?.onlyTrending) items = items.filter((a) => a.isTrending);
        if (options?.searchQuery) {
          const sq = options.searchQuery.toLowerCase();
          items = items.filter(
            (a) =>
              a.title.toLowerCase().includes(sq) ||
              a.content.toLowerCase().includes(sq) ||
              a.tags?.some((t) => t.toLowerCase().includes(sq))
          );
        }
        return items;
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'articles');
      }
    }

    // Local Fallback
    let list = getLocal<Article[]>('articles', INITIAL_ARTICLES);
    if (options?.status) {
      list = list.filter((a) => a.status === options.status);
    }
    if (options?.categoryId) {
      list = list.filter((a) => a.categoryId === options.categoryId);
    }
    if (options?.subcategoryId) {
      list = list.filter((a) => a.subcategoryId === options.subcategoryId);
    }
    if (options?.authorId) {
      list = list.filter((a) => a.authorId === options.authorId);
    }
    if (options?.onlyBreaking) {
      list = list.filter((a) => a.isBreaking);
    }
    if (options?.onlyFeatured) {
      list = list.filter((a) => a.isFeatured);
    }
    if (options?.onlyTrending) {
      list = list.filter((a) => a.isTrending);
    }
    if (options?.searchQuery) {
      const sq = options.searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(sq) ||
          a.content.toLowerCase().includes(sq) ||
          a.tags?.some((t) => t.toLowerCase().includes(sq))
      );
    }
    list.sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt || '').getTime() -
        new Date(a.publishedAt || a.createdAt || '').getTime()
    );
    if (effectiveLimit) {
      list = list.slice(0, effectiveLimit);
    }
    return list;
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (isLive && db) {
      try {
        const q = query(collection(db, 'articles'), where('slug', '==', slug), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0];
          return { id: docData.id, ...docData.data() } as Article;
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `articles/slug/${slug}`);
      }
    }

    const list = getLocal<Article[]>('articles', INITIAL_ARTICLES);
    return list.find((a) => a.slug === slug) || null;
  },

  async getArticleById(id: string): Promise<Article | null> {
    if (isLive && db) {
      try {
        const snap = await getDoc(doc(db, 'articles', id));
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as Article;
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `articles/${id}`);
      }
    }
    const list = getLocal<Article[]>('articles', INITIAL_ARTICLES);
    return list.find((a) => a.id === id) || null;
  },

  async createArticle(article: Omit<Article, 'id'>, performedBy = 'संपादक'): Promise<Article> {
    return this.saveArticle(article, performedBy);
  },

  async updateArticle(id: string, article: Partial<Article>, performedBy = 'संपादक'): Promise<Article> {
    return this.saveArticle({ ...article, id }, performedBy);
  },

  async saveArticle(article: Partial<Article>, performedBy = 'संपादक'): Promise<Article> {
    const isNew = !article.id;
    const id = article.id || `art-${Date.now()}`;
    const now = new Date().toISOString();
    const finalArticle: Article = {
      id,
      title: article.title || 'शीर्षक रहित समाचार',
      slug: article.slug || `article-${Date.now()}`,
      shortDescription: article.shortDescription || '',
      content: article.content || '',
      featuredImage:
        article.featuredImage ||
        'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
      imageCaption: article.imageCaption || '',
      imageCredit: article.imageCredit || '',
      imageAlt: article.imageAlt || article.title,
      gallery: article.gallery || [],
      categoryId: article.categoryId || 'cat-desh',
      categoryName: article.categoryName || 'देश',
      subcategoryId: article.subcategoryId || '',
      subcategoryName: article.subcategoryName || '',
      authorId: article.authorId || 'auth-1',
      authorName: article.authorName || 'समाचार फर्स्ट ब्यूरो',
      authorPhoto: article.authorPhoto || '',
      authorRole: article.authorRole || 'editor',
      tags: article.tags || [],
      location: article.location || '',
      language: article.language || 'hi',
      status: article.status || 'published',
      isBreaking: Boolean(article.isBreaking),
      isFeatured: Boolean(article.isFeatured),
      isTrending: Boolean(article.isTrending),
      isEditorsPick: Boolean(article.isEditorsPick),
      publishedAt: article.status === 'published' ? article.publishedAt || now : '',
      updatedAt: now,
      createdAt: article.createdAt || now,
      scheduledFor: article.scheduledFor || '',
      views: article.views || 0,
      likes: article.likes || 0,
      seoTitle: article.seoTitle || article.title,
      seoDescription: article.seoDescription || article.shortDescription,
      seoKeywords: article.seoKeywords || article.tags || [],
      canonicalUrl: article.canonicalUrl || '',
      socialImage: article.socialImage || article.featuredImage,
      videoUrl: article.videoUrl || '',
    };

    if (isLive && db) {
      try {
        await setDoc(doc(db, 'articles', id), finalArticle);
      } catch (err) {
        handleFirestoreError(err, isNew ? OperationType.CREATE : OperationType.UPDATE, `articles/${id}`);
      }
    }

    const list = getLocal<Article[]>('articles', INITIAL_ARTICLES);
    const idx = list.findIndex((a) => a.id === id);
    if (idx >= 0) {
      list[idx] = finalArticle;
    } else {
      list.unshift(finalArticle);
    }
    setLocal('articles', list);

    this.logActivity({
      userName: performedBy,
      action: isNew ? 'नया समाचार बनाया' : 'समाचार अपडेट किया',
      entityType: 'Article',
      entityId: id,
      details: finalArticle.title,
      timestamp: now,
    });

    return finalArticle;
  },

  async deleteArticle(id: string, performedBy = 'संपादक'): Promise<void> {
    if (isLive && db) {
      try {
        await deleteDoc(doc(db, 'articles', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `articles/${id}`);
      }
    }
    const list = getLocal<Article[]>('articles', INITIAL_ARTICLES).filter((a) => a.id !== id);
    setLocal('articles', list);

    this.logActivity({
      userName: performedBy,
      action: 'समाचार हटाया',
      entityType: 'Article',
      entityId: id,
      timestamp: new Date().toISOString(),
    });
  },

  async incrementArticleViews(id: string): Promise<void> {
    if (isLive && db) {
      try {
        await updateDoc(doc(db, 'articles', id), {
          views: increment(1),
        });
      } catch {
        // silent
      }
    }
    const list = getLocal<Article[]>('articles', INITIAL_ARTICLES);
    const item = list.find((a) => a.id === id);
    if (item) {
      item.views = (item.views || 0) + 1;
      setLocal('articles', list);
    }
  },

  async toggleLikeArticle(id: string): Promise<number> {
    const list = getLocal<Article[]>('articles', INITIAL_ARTICLES);
    const item = list.find((a) => a.id === id);
    if (item) {
      item.likes = (item.likes || 0) + 1;
      setLocal('articles', list);
      return item.likes;
    }
    return 0;
  },

  // ---------------- CATEGORIES & SUBCATEGORIES ----------------
  async getCategories(): Promise<Category[]> {
    if (isLive && db) {
      try {
        const snap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')));
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'categories');
      }
    }
    return getLocal<Category[]>('categories', INITIAL_CATEGORIES);
  },

  async addCategory(cat: Omit<Category, 'id'>, performedBy = 'संपादक'): Promise<Category> {
    return this.saveCategory(cat, performedBy);
  },

  async updateCategory(id: string, cat: Partial<Category>, performedBy = 'संपादक'): Promise<Category> {
    return this.saveCategory({ ...cat, id }, performedBy);
  },

  async saveCategory(cat: Partial<Category>, performedBy = 'संपादक'): Promise<Category> {
    const id = cat.id || `cat-${Date.now()}`;
    const finalCat: Category = {
      id,
      name: cat.name || 'New Category',
      nameHi: cat.nameHi || cat.name || 'नई श्रेणी',
      slug: cat.slug || `category-${Date.now()}`,
      description: cat.description || '',
      image: cat.image || '',
      order: cat.order || 99,
      isActive: cat.isActive !== undefined ? cat.isActive : true,
      seoTitle: cat.seoTitle || '',
      seoDescription: cat.seoDescription || '',
    };

    if (isLive && db) {
      try {
        await setDoc(doc(db, 'categories', id), finalCat);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `categories/${id}`);
      }
    }
    const list = getLocal<Category[]>('categories', INITIAL_CATEGORIES);
    const idx = list.findIndex((c) => c.id === id);
    if (idx >= 0) list[idx] = finalCat;
    else list.push(finalCat);
    setLocal('categories', list);

    this.logActivity({
      userName: performedBy,
      action: 'श्रेणी सहेजी गई',
      entityType: 'Category',
      entityId: id,
      details: finalCat.nameHi,
      timestamp: new Date().toISOString(),
    });

    return finalCat;
  },

  async deleteCategory(id: string, performedBy = 'संपादक'): Promise<void> {
    if (isLive && db) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
      }
    }
    const list = getLocal<Category[]>('categories', INITIAL_CATEGORIES).filter((c) => c.id !== id);
    setLocal('categories', list);

    this.logActivity({
      userName: performedBy,
      action: 'श्रेणी हटाई गई',
      entityType: 'Category',
      entityId: id,
      timestamp: new Date().toISOString(),
    });
  },

  async getSubcategories(parentCategoryId?: string): Promise<Subcategory[]> {
    if (isLive && db) {
      try {
        let q = query(collection(db, 'subcategories'), orderBy('order', 'asc'));
        if (parentCategoryId) {
          q = query(collection(db, 'subcategories'), where('parentCategoryId', '==', parentCategoryId));
        }
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subcategory));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'subcategories');
      }
    }
    let list = getLocal<Subcategory[]>('subcategories', INITIAL_SUBCATEGORIES);
    if (parentCategoryId) {
      list = list.filter((s) => s.parentCategoryId === parentCategoryId);
    }
    return list;
  },

  async addSubcategory(sub: Omit<Subcategory, 'id'>, performedBy = 'संपादक'): Promise<Subcategory> {
    return this.saveSubcategory(sub, performedBy);
  },

  async saveSubcategory(sub: Partial<Subcategory>, performedBy = 'संपादक'): Promise<Subcategory> {
    const id = sub.id || `sub-${Date.now()}`;
    const finalSub: Subcategory = {
      id,
      parentCategoryId: sub.parentCategoryId || 'cat-haryana',
      parentCategoryName: sub.parentCategoryName || 'हरियाणा',
      name: sub.name || 'New Subcategory',
      nameHi: sub.nameHi || sub.name || 'नया जिला',
      slug: sub.slug || `sub-${Date.now()}`,
      order: sub.order || 99,
      isActive: sub.isActive !== undefined ? sub.isActive : true,
    };

    if (isLive && db) {
      try {
        await setDoc(doc(db, 'subcategories', id), finalSub);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `subcategories/${id}`);
      }
    }
    const list = getLocal<Subcategory[]>('subcategories', INITIAL_SUBCATEGORIES);
    const idx = list.findIndex((s) => s.id === id);
    if (idx >= 0) list[idx] = finalSub;
    else list.push(finalSub);
    setLocal('subcategories', list);

    this.logActivity({
      userName: performedBy,
      action: 'उप-श्रेणी/जिला सहेजा गया',
      entityType: 'Subcategory',
      entityId: id,
      details: finalSub.nameHi,
      timestamp: new Date().toISOString(),
    });

    return finalSub;
  },

  async deleteSubcategory(id: string, performedBy = 'संपादक'): Promise<void> {
    if (isLive && db) {
      try {
        await deleteDoc(doc(db, 'subcategories', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `subcategories/${id}`);
      }
    }
    const list = getLocal<Subcategory[]>('subcategories', INITIAL_SUBCATEGORIES).filter((s) => s.id !== id);
    setLocal('subcategories', list);

    this.logActivity({
      userName: performedBy,
      action: 'उप-श्रेणी हटाई गई',
      entityType: 'Subcategory',
      entityId: id,
      timestamp: new Date().toISOString(),
    });
  },

  // ---------------- BREAKING NEWS ----------------
  async getBreakingNews(): Promise<BreakingNews[]> {
    if (isLive && db) {
      try {
        const snap = await getDocs(query(collection(db, 'breakingNews'), where('isActive', '==', true)));
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BreakingNews));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'breakingNews');
      }
    }
    return getLocal<BreakingNews[]>('breakingNews', INITIAL_BREAKING_NEWS);
  },

  async addBreakingNews(item: Omit<BreakingNews, 'id' | 'createdAt'>, performedBy = 'संपादक'): Promise<BreakingNews> {
    return this.saveBreakingNews(item, performedBy);
  },

  async updateBreakingNews(id: string, item: Partial<BreakingNews>, performedBy = 'संपादक'): Promise<BreakingNews> {
    return this.saveBreakingNews({ ...item, id }, performedBy);
  },

  async saveBreakingNews(item: Partial<BreakingNews>, performedBy = 'संपादक'): Promise<BreakingNews> {
    const id = item.id || `brk-${Date.now()}`;
    const finalItem: BreakingNews = {
      id,
      title: item.title || '',
      url: item.url || '',
      priority: item.priority || 'high',
      isActive: item.isActive !== undefined ? item.isActive : true,
      createdAt: item.createdAt || new Date().toISOString(),
      expiresAt: item.expiresAt || '',
    };

    if (isLive && db) {
      try {
        await setDoc(doc(db, 'breakingNews', id), finalItem);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `breakingNews/${id}`);
      }
    }
    const list = getLocal<BreakingNews[]>('breakingNews', INITIAL_BREAKING_NEWS);
    const idx = list.findIndex((b) => b.id === id);
    if (idx >= 0) list[idx] = finalItem;
    else list.unshift(finalItem);
    setLocal('breakingNews', list);

    this.logActivity({
      userName: performedBy,
      action: 'बड़ी खबर (Breaking) सहेजी गई',
      entityType: 'BreakingNews',
      entityId: id,
      details: finalItem.title,
      timestamp: new Date().toISOString(),
    });

    return finalItem;
  },

  async deleteBreakingNews(id: string, performedBy = 'संपादक'): Promise<void> {
    if (isLive && db) {
      try {
        await deleteDoc(doc(db, 'breakingNews', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `breakingNews/${id}`);
      }
    }
    const list = getLocal<BreakingNews[]>('breakingNews', INITIAL_BREAKING_NEWS).filter((b) => b.id !== id);
    setLocal('breakingNews', list);

    this.logActivity({
      userName: performedBy,
      action: 'बड़ी खबर हटाई गई',
      entityType: 'BreakingNews',
      entityId: id,
      timestamp: new Date().toISOString(),
    });
  },

  // ---------------- AUTHORS / REPORTERS ----------------
  async getAuthors(): Promise<Author[]> {
    if (isLive && db) {
      try {
        const snap = await getDocs(collection(db, 'authors'));
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Author));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'authors');
      }
    }
    return getLocal<Author[]>('authors', INITIAL_AUTHORS);
  },

  async getAuthorById(id: string): Promise<Author | null> {
    const authors = await dbService.getAuthors();
    return authors.find((a) => a.id === id || a.slug === id || a.email === id) || null;
  },

  async addAuthor(author: Omit<Author, 'id'>, performedBy = 'संपादक'): Promise<Author> {
    return this.saveAuthor(author, performedBy);
  },

  async updateAuthor(id: string, author: Partial<Author>, performedBy = 'संपादक'): Promise<Author> {
    return this.saveAuthor({ ...author, id }, performedBy);
  },

  async saveAuthor(author: Partial<Author>, performedBy = 'संपादक'): Promise<Author> {
    const id = author.id || `auth-${Date.now()}`;
    const photo = author.photo || author.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
    const finalAuthor: Author = {
      id,
      name: author.name || 'Reporter Name',
      slug: author.slug || `author-${Date.now()}`,
      email: author.email || `reporter-${Date.now()}@samacharfirst.com`,
      role: author.role || 'reporter',
      photoURL: photo,
      photo: photo,
      bio: author.bio || '',
      designation: author.designation || 'संवाददाता',
      location: author.location || '',
      socialLinks: author.socialLinks || {},
      isActive: author.isActive !== undefined ? author.isActive : true,
      articleCount: author.articleCount || 0,
    };

    if (isLive && db) {
      try {
        await setDoc(doc(db, 'authors', id), finalAuthor);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `authors/${id}`);
      }
    }
    const list = getLocal<Author[]>('authors', INITIAL_AUTHORS);
    const idx = list.findIndex((a) => a.id === id);
    if (idx >= 0) list[idx] = finalAuthor;
    else list.push(finalAuthor);
    setLocal('authors', list);

    this.logActivity({
      userName: performedBy,
      action: 'संवाददाता प्रोफाइल सहेजी गई',
      entityType: 'Author',
      entityId: id,
      details: finalAuthor.name,
      timestamp: new Date().toISOString(),
    });

    return finalAuthor;
  },

  async deleteAuthor(id: string, performedBy = 'संपादक'): Promise<void> {
    if (isLive && db) {
      try {
        await deleteDoc(doc(db, 'authors', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `authors/${id}`);
      }
    }
    const list = getLocal<Author[]>('authors', INITIAL_AUTHORS).filter((a) => a.id !== id);
    setLocal('authors', list);

    this.logActivity({
      userName: performedBy,
      action: 'संवाददाता प्रोफाइल हटाई गई',
      entityType: 'Author',
      entityId: id,
      timestamp: new Date().toISOString(),
    });
  },

  // ---------------- VIDEOS ----------------
  async getVideos(): Promise<VideoNews[]> {
    if (isLive && db) {
      try {
        const snap = await getDocs(query(collection(db, 'videos'), orderBy('publishedAt', 'desc')));
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as VideoNews));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'videos');
      }
    }
    return getLocal<VideoNews[]>('videos', INITIAL_VIDEOS);
  },

  async addVideo(video: Omit<VideoNews, 'id' | 'views'>, performedBy = 'संपादक'): Promise<VideoNews> {
    return this.saveVideo(video, performedBy);
  },

  async saveVideo(video: Partial<VideoNews>, performedBy = 'संपादक'): Promise<VideoNews> {
    const id = video.id || `vid-${Date.now()}`;
    const finalVideo: VideoNews = {
      id,
      title: video.title || 'Video Title',
      youtubeUrl: video.youtubeUrl || '',
      videoId: video.videoId || 'dQw4w9WgXcQ',
      thumbnail: video.thumbnail || 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&auto=format&fit=crop&q=80',
      description: video.description || '',
      categoryId: video.categoryId || 'cat-desh',
      categoryName: video.categoryName || 'देश',
      authorName: video.authorName || 'समाचार फर्स्ट वीडियो टीम',
      publishedAt: video.publishedAt || new Date().toISOString(),
      views: video.views || 100,
      duration: video.duration || '03:30',
      isFeatured: video.isFeatured || false,
    };

    if (isLive && db) {
      try {
        await setDoc(doc(db, 'videos', id), finalVideo);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `videos/${id}`);
      }
    }
    const list = getLocal<VideoNews[]>('videos', INITIAL_VIDEOS);
    const idx = list.findIndex((v) => v.id === id);
    if (idx >= 0) list[idx] = finalVideo;
    else list.unshift(finalVideo);
    setLocal('videos', list);

    this.logActivity({
      userName: performedBy,
      action: 'वीडियो बुलेटिन जोड़ा गया',
      entityType: 'Video',
      entityId: id,
      details: finalVideo.title,
      timestamp: new Date().toISOString(),
    });

    return finalVideo;
  },

  async deleteVideo(id: string, performedBy = 'संपादक'): Promise<void> {
    if (isLive && db) {
      try {
        await deleteDoc(doc(db, 'videos', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `videos/${id}`);
      }
    }
    const list = getLocal<VideoNews[]>('videos', INITIAL_VIDEOS).filter((v) => v.id !== id);
    setLocal('videos', list);

    this.logActivity({
      userName: performedBy,
      action: 'वीडियो हटाया गया',
      entityType: 'Video',
      entityId: id,
      timestamp: new Date().toISOString(),
    });
  },

  // ---------------- EPAPER EDITIONS ----------------
  async getEPaperEditions(): Promise<EPaperEdition[]> {
    if (isLive && db) {
      try {
        const snap = await getDocs(query(collection(db, 'epaper'), orderBy('date', 'desc')));
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EPaperEdition));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'epaper');
      }
    }
    return getLocal<EPaperEdition[]>('epaper', INITIAL_EPAPER);
  },

  async getEPapers(): Promise<EPaperEdition[]> {
    return this.getEPaperEditions();
  },

  async addEPaperEdition(edition: Omit<EPaperEdition, 'id'>, performedBy = 'संपादक'): Promise<EPaperEdition> {
    const id = `ep-${Date.now()}`;
    const finalEdition: EPaperEdition = {
      ...edition,
      id,
      createdAt: new Date().toISOString(),
    };
    if (isLive && db) {
      try {
        await setDoc(doc(db, 'epaper', id), finalEdition);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `epaper/${id}`);
      }
    }
    const list = getLocal<EPaperEdition[]>('epaper', INITIAL_EPAPER);
    list.unshift(finalEdition);
    setLocal('epaper', list);

    this.logActivity({
      userName: performedBy,
      action: 'ई-पेपर संस्करण प्रकाशित हुआ',
      entityType: 'EPaper',
      entityId: id,
      details: finalEdition.editionName,
      timestamp: new Date().toISOString(),
    });

    return finalEdition;
  },

  async deleteEPaperEdition(id: string, performedBy = 'संपादक'): Promise<void> {
    if (isLive && db) {
      try {
        await deleteDoc(doc(db, 'epaper', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `epaper/${id}`);
      }
    }
    const list = getLocal<EPaperEdition[]>('epaper', INITIAL_EPAPER).filter((e) => e.id !== id);
    setLocal('epaper', list);

    this.logActivity({
      userName: performedBy,
      action: 'ई-पेपर संस्करण हटाया गया',
      entityType: 'EPaper',
      entityId: id,
      timestamp: new Date().toISOString(),
    });
  },

  // ---------------- ADVERTISEMENTS ----------------
  async getAds(position?: string): Promise<Advertisement[]> {
    return this.getAdvertisements(position);
  },

  async getAdvertisements(position?: string): Promise<Advertisement[]> {
    if (isLive && db) {
      try {
        let q = query(collection(db, 'advertisements'), where('isActive', '==', true));
        if (position) {
          q = query(q, where('position', '==', position));
        }
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Advertisement));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'advertisements');
      }
    }
    let list = getLocal<Advertisement[]>('advertisements', INITIAL_ADVERTISEMENTS);
    if (position) {
      list = list.filter((a) => a.position === position);
    }
    return list;
  },

  async addAd(ad: Omit<Advertisement, 'id' | 'createdAt'>, performedBy = 'संपादक'): Promise<Advertisement> {
    return this.saveAdvertisement(ad, performedBy);
  },

  async updateAd(id: string, ad: Partial<Advertisement>, performedBy = 'संपादक'): Promise<Advertisement> {
    return this.saveAdvertisement({ ...ad, id }, performedBy);
  },

  async saveAdvertisement(ad: Partial<Advertisement>, performedBy = 'संपादक'): Promise<Advertisement> {
    const id = ad.id || `ad-${Date.now()}`;
    const finalAd: Advertisement = {
      id,
      title: ad.title || 'New Advertisement',
      position: ad.position || 'header',
      type: ad.type || 'image',
      imageUrl: ad.imageUrl || '',
      targetUrl: ad.targetUrl || '',
      htmlCode: ad.htmlCode || '',
      startDate: ad.startDate || new Date().toISOString(),
      endDate: ad.endDate || '',
      isActive: ad.isActive !== undefined ? ad.isActive : true,
      impressions: ad.impressions || 0,
      clicks: ad.clicks || 0,
      createdAt: ad.createdAt || new Date().toISOString(),
    };

    if (isLive && db) {
      try {
        await setDoc(doc(db, 'advertisements', id), finalAd);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `advertisements/${id}`);
      }
    }
    const list = getLocal<Advertisement[]>('advertisements', INITIAL_ADVERTISEMENTS);
    const idx = list.findIndex((a) => a.id === id);
    if (idx >= 0) list[idx] = finalAd;
    else list.push(finalAd);
    setLocal('advertisements', list);

    this.logActivity({
      userName: performedBy,
      action: 'विज्ञापन स्लॉट अपडेट किया गया',
      entityType: 'Ad',
      entityId: id,
      details: finalAd.title,
      timestamp: new Date().toISOString(),
    });

    return finalAd;
  },

  async deleteAd(id: string, performedBy = 'संपादक'): Promise<void> {
    if (isLive && db) {
      try {
        await deleteDoc(doc(db, 'advertisements', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `advertisements/${id}`);
      }
    }
    const list = getLocal<Advertisement[]>('advertisements', INITIAL_ADVERTISEMENTS).filter((a) => a.id !== id);
    setLocal('advertisements', list);

    this.logActivity({
      userName: performedBy,
      action: 'विज्ञापन हटाया गया',
      entityType: 'Ad',
      entityId: id,
      timestamp: new Date().toISOString(),
    });
  },

  // ---------------- SITE SETTINGS ----------------
  getSiteSettings(): SiteSettings {
    return getLocal<SiteSettings>('siteSettings', INITIAL_SITE_SETTINGS);
  },

  async updateSiteSettings(settings: Partial<SiteSettings>, performedBy = 'संपादक'): Promise<SiteSettings> {
    const current = this.getSiteSettings();
    const updated = { ...current, ...settings };
    if (isLive && db) {
      try {
        await setDoc(doc(db, 'siteSettings', 'main'), updated);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'siteSettings/main');
      }
    }
    setLocal('siteSettings', updated);

    this.logActivity({
      userName: performedBy,
      action: 'वेबसाइट सेटिंग्स अपडेट की गईं',
      entityType: 'Settings',
      timestamp: new Date().toISOString(),
    });

    return updated;
  },

  // ---------------- SEO SETTINGS ----------------
  getSeoSettings(): SeoSettings {
    return getLocal<SeoSettings>('seoSettings', INITIAL_SEO_SETTINGS);
  },

  async updateSeoSettings(settings: Partial<SeoSettings>, performedBy = 'संपादक'): Promise<SeoSettings> {
    const current = this.getSeoSettings();
    const updated = { ...current, ...settings };
    if (isLive && db) {
      try {
        await setDoc(doc(db, 'seoSettings', 'main'), updated);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'seoSettings/main');
      }
    }
    setLocal('seoSettings', updated);

    this.logActivity({
      userName: performedBy,
      action: 'SEO सेटिंग्स अपडेट की गईं',
      entityType: 'SEO',
      timestamp: new Date().toISOString(),
    });

    return updated;
  },

  // ---------------- HOMEPAGE SECTIONS ----------------
  async getHomepageSections(): Promise<HomepageSection[]> {
    if (isLive && db) {
      try {
        const snap = await getDocs(query(collection(db, 'homepageSections'), orderBy('order', 'asc')));
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as HomepageSection));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'homepageSections');
      }
    }
    return getLocal<HomepageSection[]>('homepageSections', INITIAL_HOMEPAGE_SECTIONS);
  },

  // ---------------- COMMENTS ----------------
  async getComments(articleId?: string): Promise<Comment[]> {
    if (isLive && db) {
      try {
        let q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
        if (articleId) {
          q = query(collection(db, 'comments'), where('articleId', '==', articleId), where('status', '==', 'approved'));
        }
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'comments');
      }
    }
    let list = getLocal<Comment[]>('comments', [
      {
        id: 'com-1',
        articleId: 'art-1',
        articleTitle: 'हरियाणा में मौसम का मिजाज बदला',
        userName: 'सुरेश कुमार',
        userEmail: 'suresh@example.com',
        comment: 'सटीक जानकारी! पानीपत में सचमुच बादल छाए हुए हैं। किसानों के लिए यह अलर्ट बहुत मददगार है।',
        status: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
    ]);
    if (articleId) {
      list = list.filter((c) => c.articleId === articleId && c.status === 'approved');
    }
    return list;
  },

  async addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'status'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: `com-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    if (isLive && db) {
      try {
        await setDoc(doc(db, 'comments', newComment.id), newComment);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `comments/${newComment.id}`);
      }
    }
    const list = getLocal<Comment[]>('comments', []);
    list.unshift(newComment);
    setLocal('comments', list);
    return newComment;
  },

  // ---------------- NEWSLETTER & CONTACT ----------------
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    const list = getLocal<NewsletterSubscriber[]>('newsletterSubscribers', []);
    if (list.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'यह ईमेल पहले से ही सब्सक्राइब है।' };
    }
    const item: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email,
      subscribedAt: new Date().toISOString(),
      isActive: true,
    };
    if (isLive && db) {
      try {
        await setDoc(doc(db, 'newsletterSubscribers', item.id), item);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `newsletterSubscribers/${item.id}`);
      }
    }
    list.push(item);
    setLocal('newsletterSubscribers', list);
    return { success: true, message: 'धन्यवाद! आप समाचार फर्स्ट ई-बुलेटिन से जुड़ गए हैं।' };
  },

  async sendContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; message: string }> {
    const item: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    if (isLive && db) {
      try {
        await setDoc(doc(db, 'contactMessages', item.id), item);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `contactMessages/${item.id}`);
      }
    }
    const list = getLocal<ContactMessage[]>('contactMessages', []);
    list.unshift(item);
    setLocal('contactMessages', list);
    return { success: true, message: 'आपका संदेश प्राप्त हो गया है। हमारी टीम जल्द आपसे संपर्क करेगी।' };
  },

  // ---------------- ACTIVITY LOGS ----------------
  logActivity(log: Omit<ActivityLog, 'id'>): void {
    const newLog: ActivityLog = {
      ...log,
      id: `act-${Date.now()}`,
    };
    const list = getLocal<ActivityLog[]>('activityLogs', []);
    list.unshift(newLog);
    if (list.length > 100) list.pop();
    setLocal('activityLogs', list);
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    return getLocal<ActivityLog[]>('activityLogs', [
      {
        id: 'act-1',
        userId: 'auth-1',
        userName: 'प्रदीप सैनी (Super Admin)',
        action: 'System Initialized',
        entityType: 'System',
        details: 'Samachar First News CMS पोर्टल सक्रिय हुआ',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ]);
  },
};
