import React, { useState } from 'react';
import { SeoSettings, Article, Category } from '../../types';
import { generateXmlSitemap } from '../../utils/seo';
import { Search, Globe, CheckCircle, Save, Download, Copy, FileCode, Check, ShieldCheck } from 'lucide-react';

interface SeoSettingsManagerProps {
  seoSettings: SeoSettings;
  articles: Article[];
  categories: Category[];
  onSaveSeo: (settings: SeoSettings) => Promise<void>;
}

export const SeoSettingsManager: React.FC<SeoSettingsManagerProps> = ({
  seoSettings,
  articles,
  categories,
  onSaveSeo,
}) => {
  const [metaTitle, setMetaTitle] = useState(seoSettings.metaTitle);
  const [metaDescription, setMetaDescription] = useState(seoSettings.metaDescription);
  const [metaKeywords, setMetaKeywords] = useState(seoSettings.metaKeywords);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(seoSettings.googleAnalyticsId || '');
  const [googleSearchConsoleVerification, setGoogleSearchConsoleVerification] = useState(
    seoSettings.googleSearchConsoleVerification || ''
  );
  const [googleNewsPublisherId, setGoogleNewsPublisherId] = useState(seoSettings.googleNewsPublisherId || '');
  const [robotsTxt, setRobotsTxt] = useState(
    seoSettings.robotsTxt ||
      'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://samacharfirst.com/sitemap.xml'
  );
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const xmlSitemap = generateXmlSitemap(articles, categories, window.location.origin);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSeo({
      metaTitle,
      metaDescription,
      metaKeywords,
      googleAnalyticsId,
      googleSearchConsoleVerification,
      googleNewsPublisherId,
      robotsTxt,
      canonicalUrl: window.location.origin,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-xl text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-red-500" />
            SEO एवं साइटमैप प्रबंधन (Google News & Search Console)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            News Schema Markup, Google Search Console, Google News Publisher ID और लाइव XML Sitemap
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Global Meta Tags */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-red-500" />
            ग्लोबल मेटा डेटा (Global Meta Tags)
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              डिफ़ॉल्ट मेटा शीर्षक (Meta Title)*
            </label>
            <input
              type="text"
              required
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              डिफ़ॉल्ट मेटा विवरण (Meta Description)*
            </label>
            <textarea
              rows={2}
              required
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              कीवर्ड्स (Meta Keywords)
            </label>
            <input
              type="text"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
            />
          </div>
        </div>

        {/* 2. Google Verification & Analytics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Google News & Analytics एकीकरण (Integrations)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Google Analytics 4 ID (GA4)
              </label>
              <input
                type="text"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Google Search Console Verification Tag
              </label>
              <input
                type="text"
                value={googleSearchConsoleVerification}
                onChange={(e) => setGoogleSearchConsoleVerification(e.target.value)}
                placeholder="google-site-verification=..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Google News Publisher Center ID
              </label>
              <input
                type="text"
                value={googleNewsPublisherId}
                onChange={(e) => setGoogleNewsPublisherId(e.target.value)}
                placeholder="उदा: GNEWS-987456"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Robots.txt कॉन्फ़िगरेशन (Robots Directive)
            </label>
            <textarea
              rows={3}
              value={robotsTxt}
              onChange={(e) => setRobotsTxt(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-emerald-400 rounded p-2 text-xs font-mono"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          {saved && (
            <div className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              SEO सेटिंग्स सफलतापूर्वक सहेज ली गईं!
            </div>
          )}
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md ml-auto transition-colors"
          >
            <Save className="w-4 h-4" />
            SEO सेटिंग्स सुरक्षित करें
          </button>
        </div>
      </form>

      {/* 3. Live XML Sitemap Preview & Test */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              लाइव XML साइटमैप (Live Google XML Sitemap Feed)
            </h2>
            <p className="text-[11px] text-slate-400">
              प्रत्येक समाचार और श्रेणी के अपडेट होने पर यह स्वचालित रूप से अपडेट होता है
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(xmlSitemap);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded flex items-center gap-1 border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'कॉपी हुआ!' : 'XML कॉपी करें'}
            </button>
          </div>
        </div>

        <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto max-h-56">
          {xmlSitemap}
        </pre>
      </div>
    </div>
  );
};
