import React, { useState } from 'react';
import { Advertisement, AdPosition } from '../../types';
import { DollarSign, Plus, Trash2, Edit2, Link as LinkIcon, Image, Code, X, Save } from 'lucide-react';

interface AdManagerProps {
  ads: Advertisement[];
  onAddAd: (ad: Omit<Advertisement, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateAd: (id: string, ad: Partial<Advertisement>) => Promise<void>;
  onDeleteAd: (id: string) => Promise<void>;
}

export const AdManager: React.FC<AdManagerProps> = ({ ads, onAddAd, onUpdateAd, onDeleteAd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [position, setPosition] = useState<AdPosition>('header');
  const [type, setType] = useState<Advertisement['type']>('image');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (editingId) {
      await onUpdateAd(editingId, {
        title: title.trim(),
        position,
        type,
        imageUrl: imageUrl.trim() || undefined,
        targetUrl: targetUrl.trim() || undefined,
        htmlCode: htmlCode.trim() || undefined,
        isActive,
      });
      setEditingId(null);
    } else {
      await onAddAd({
        title: title.trim(),
        position,
        type,
        imageUrl: imageUrl.trim() || undefined,
        targetUrl: targetUrl.trim() || undefined,
        htmlCode: htmlCode.trim() || undefined,
        isActive,
      });
      setIsAdding(false);
    }

    setTitle('');
    setImageUrl('');
    setTargetUrl('');
    setHtmlCode('');
    setIsActive(true);
  };

  const startEdit = (ad: Advertisement) => {
    setEditingId(ad.id);
    setTitle(ad.title);
    setPosition(ad.position);
    setType(ad.type);
    setImageUrl(ad.imageUrl || '');
    setTargetUrl(ad.targetUrl || '');
    setHtmlCode(ad.htmlCode || '');
    setIsActive(ad.isActive);
    setIsAdding(true);
  };

  const positionsMap: Record<AdPosition, string> = {
    header: 'Header Top Banner (728x90 / Fluid)',
    homepage_top: 'Homepage Top Hero Ad (970x90)',
    homepage_middle: 'Homepage Middle Stream (970x90)',
    sidebar: 'Sidebar Square / Vertical Ad (300x250)',
    article_top: 'Article Top Banner (728x90)',
    article_middle: 'Article In-Content Banner (300x250)',
    article_bottom: 'Article End / Related Slot',
    footer: 'Footer Sticky / Bottom Ad',
    mobile_sticky: 'Mobile Sticky Bottom Bar',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-xl text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            विज्ञापन प्रबंधन (Ad Monetization Manager)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            वेबसाइट के शीर्ष, साइडबार और समाचार लेखों के भीतर विज्ञापन स्लॉट्स का नियंत्रण
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => {
              setEditingId(null);
              setIsAdding(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            नया विज्ञापन जोड़ें
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-bold text-sm text-white">{editingId ? 'विज्ञापन संपादित करें' : 'नया विज्ञापन स्लॉट जोड़ें'}</h2>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">विज्ञापन शीर्षक (Campaign Name)*</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा: हरियाणा सरकार जन-कल्याण योजना"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">विज्ञापन स्थान (Ad Position)*</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as AdPosition)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              >
                {Object.entries(positionsMap).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">विज्ञापन प्रकार (Format)</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              >
                <option value="image">इमेज बैनर + टारगेट लिंक (Image URL)</option>
                <option value="script">Google AdSense / HTML Script</option>
              </select>
            </div>
          </div>

          {type === 'image' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">बैनर छवि URL (Banner Image URL)*</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">टारगेट क्लिक लिंक (Target URL)</label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://client-website.com"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">AdSense / HTML Embed Code*</label>
              <textarea
                rows={4}
                required
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                placeholder="<script async src='https://pagead2.googlesyndication.com...'></script>"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs font-mono"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-red-600"
              />
              विज्ञापन सक्रिय रखें (Active Campaign)
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="px-3 py-1.5 rounded text-xs text-slate-400"
              >
                रद्द करें
              </button>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded text-xs">
                सहेजें
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Ads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-white">{ad.title}</h3>
                  <div className="text-[10px] text-amber-400 font-semibold uppercase mt-0.5">
                    {positionsMap[ad.position] || ad.position}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    ad.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ad.isActive ? 'सक्रिय (Live)' : 'निष्क्रिय'}
                </span>
              </div>

              {ad.imageUrl && (
                <div className="h-20 rounded bg-slate-950 overflow-hidden my-2 border border-slate-800">
                  <img src={ad.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500 font-mono">प्रकार: {ad.type}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(ad)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('क्या आप इस विज्ञापन को हटाना चाहते हैं?')) {
                      onDeleteAd(ad.id);
                    }
                  }}
                  className="p-1.5 rounded bg-slate-800 hover:bg-rose-950 text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
