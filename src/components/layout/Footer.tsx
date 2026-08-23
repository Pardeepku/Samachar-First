import React, { useState } from 'react';
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Send,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Rss,
  Radio,
} from 'lucide-react';
import { Category, SiteSettings } from '../../types';
import { dbService } from '../../services/db';

export interface FooterProps {
  onNavigate?: (path: string) => void;
  categories?: Category[];
  siteSettings?: SiteSettings;
  onSelectCategory?: (slug: string) => void;
  onSelectStaticPage?: (type: any) => void;
  onSelectSitemap?: () => void;
  onNavigateEPaper?: () => void;
  onNavigateVideos?: () => void;
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  categories = [],
  siteSettings: initialSiteSettings,
  onSelectCategory,
  onSelectStaticPage,
  onSelectSitemap,
  onNavigateEPaper,
  onNavigateVideos,
  onNavigateAdmin,
}) => {
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const siteSettings = initialSiteSettings || dbService.getSiteSettings();

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (path.startsWith('/category/') && onSelectCategory) {
      onSelectCategory(path.replace('/category/', ''));
    } else if (path === '/sitemap' && onSelectSitemap) {
      onSelectSitemap();
    } else if ((path === '/e-paper' || path === '/epaper') && onNavigateEPaper) {
      onNavigateEPaper();
    } else if (path === '/videos' && onNavigateVideos) {
      onNavigateVideos();
    } else if (path.startsWith('/admin') && onNavigateAdmin) {
      onNavigateAdmin();
    } else if (onSelectStaticPage) {
      if (path === '/about') onSelectStaticPage('about');
      else if (path === '/contact') onSelectStaticPage('contact');
      else if (path === '/privacy-policy' || path === '/privacy') onSelectStaticPage('privacy');
      else if (path === '/terms') onSelectStaticPage('terms');
      else if (path === '/disclaimer') onSelectStaticPage('disclaimer');
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubStatus({ success: false, message: 'कृपया मान्य ईमेल पता दर्ज करें।' });
      return;
    }
    setSubmitting(true);
    const res = await dbService.subscribeNewsletter(email);
    setSubmitting(false);
    setSubStatus(res);
    if (res.success) setEmail('');
  };

  const displayCategories = categories || [];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-red-600 mt-12">
      {/* Upper Newsletter & Social Section */}
      <div className="border-b border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-red-600 text-white font-black text-xl px-2 py-0.5 rounded font-serif">SAMACHAR</span>
              <span className="text-white font-black text-xl font-serif">FIRST</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              दैनिक ई-बुलेटिन और बड़ी खबरों के तुरंत अलर्ट के लिए हमारा फ्री न्यूज़लेटर सब्सक्राइब करें।
            </p>
          </div>

          <div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md md:ml-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="अपना ईमेल पता दर्ज करें..."
                className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded text-sm flex-1 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded text-sm font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? '...' : 'सब्सक्राइब'}
              </button>
            </form>
            {subStatus && (
              <p
                className={`text-xs mt-2 flex items-center gap-1 ${
                  subStatus.success ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {subStatus.success ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {subStatus.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: About & Contact */}
        <div>
          <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <span className="w-2 h-4 bg-red-600 rounded-xs inline-block"></span>
            हमारे बारे में
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            <strong className="text-white">समाचार फर्स्ट (Samachar First)</strong> उत्तर भारत और देश का अग्रणी डिजिटल समाचार नेटवर्क है, जो निष्पक्ष, सटीक और सबसे तेज खबरें आप तक पहुंचाता है।
          </p>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{siteSettings?.address || 'पानीपत / चंडीगढ़, हरियाणा'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-500 shrink-0" />
              <span>{siteSettings?.phone || '+91 98765 43210'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-500 shrink-0" />
              <span>{siteSettings?.contactEmail || 'editor@samacharfirst.com'}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Top News Categories */}
        <div>
          <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <span className="w-2 h-4 bg-red-600 rounded-xs inline-block"></span>
            प्रमुख श्रेणियां
          </h3>
          <ul className="grid grid-cols-2 gap-2 text-xs">
            {displayCategories.slice(0, 12).map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  className="text-slate-400 hover:text-white hover:underline transition-colors text-left"
                >
                  {cat.nameHi} ({cat.name})
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Important & Legal Links */}
        <div>
          <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <span className="w-2 h-4 bg-red-600 rounded-xs inline-block"></span>
            महत्वपूर्ण लिंक
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => navigate('/about')} className="text-slate-400 hover:text-white hover:underline">
                समाचार फर्स्ट के बारे में (About Us)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/contact')} className="text-slate-400 hover:text-white hover:underline">
                संपर्क एवं संपादकीय टीम (Contact Us)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/privacy-policy')} className="text-slate-400 hover:text-white hover:underline">
                गोपनीयता नीति (Privacy Policy)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/terms')} className="text-slate-400 hover:text-white hover:underline">
                नियम और शर्तें (Terms & Conditions)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/disclaimer')} className="text-slate-400 hover:text-white hover:underline">
                अस्वीकरण (Disclaimer)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/sitemap')} className="text-amber-400 hover:text-amber-300 font-semibold hover:underline">
                HTML साइटमैप (Sitemap Page)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/admin/seo')} className="text-sky-400 hover:text-sky-300 font-semibold hover:underline">
                XML साइटमैप व SEO टूल्स
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Social, E-Paper & Editorial Apps */}
        <div>
          <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <span className="w-2 h-4 bg-red-600 rounded-xs inline-block"></span>
            सोशल मीडिया व कनेक्ट
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            ताजा समाचारों के लाइव वीडियो और अपडेट्स के लिए सोशल मीडिया पर फॉलो करें:
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <a
              href={siteSettings?.socialLinks?.facebook || 'https://facebook.com'}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded bg-slate-900 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={siteSettings?.socialLinks?.twitter || 'https://twitter.com'}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded bg-slate-900 hover:bg-sky-500 text-white flex items-center justify-center transition-colors"
              title="Twitter / X"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={siteSettings?.socialLinks?.youtube || 'https://youtube.com'}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded bg-slate-900 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
              title="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={siteSettings?.socialLinks?.instagram || 'https://instagram.com'}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded bg-slate-900 hover:bg-pink-600 text-white flex items-center justify-center transition-colors"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-slate-900 p-3 rounded border border-slate-800">
            <div className="text-xs font-semibold text-white mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              समाचार फर्स्ट ई-पेपर
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              दैनिक डिजिटल अखबार का पूरा संस्करण ऑनलाइन पढ़ें।
            </p>
            <button
              onClick={() => (onNavigateEPaper ? onNavigateEPaper() : navigate('/e-paper'))}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1.5 px-3 rounded text-xs transition-colors"
            >
              ई-पेपर अभी पढ़ें
            </button>
          </div>
        </div>
      </div>

      {/* Copyright & Disclaimer Bar */}
      <div className="bg-black/80 py-4 px-4 border-t border-slate-900 text-xs text-slate-400 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>{siteSettings?.copyrightText || '© 2026 Samachar First. सर्वाधिकार सुरक्षित।'}</div>
          <div className="text-slate-400 text-[11px]">
            Google News Ready & SEO Optimized Architecture
          </div>
        </div>
      </div>
    </footer>
  );
};
