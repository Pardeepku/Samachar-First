import React, { useState } from 'react';
import { BreakingNews } from '../../types';
import { Flame, Plus, Trash2, Edit2, CheckCircle, Clock, Link as LinkIcon, Save, X } from 'lucide-react';

interface BreakingNewsManagerProps {
  breakingNews: BreakingNews[];
  onAdd: (item: Omit<BreakingNews, 'id' | 'createdAt'>) => Promise<void>;
  onUpdate: (id: string, item: Partial<BreakingNews>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const BreakingNewsManager: React.FC<BreakingNewsManagerProps> = ({
  breakingNews,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [priority, setPriority] = useState<BreakingNews['priority']>('high');
  const [isActive, setIsActive] = useState(true);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      await onUpdate(editingId, {
        title: title.trim(),
        url: url.trim() || undefined,
        priority,
        isActive,
      });
      setEditingId(null);
    } else {
      await onAdd({
        title: title.trim(),
        url: url.trim() || undefined,
        priority,
        isActive,
      });
      setIsAdding(false);
    }

    setTitle('');
    setUrl('');
    setPriority('high');
    setIsActive(true);
  };

  const startEdit = (item: BreakingNews) => {
    setEditingId(item.id);
    setTitle(item.title);
    setUrl(item.url || '');
    setPriority(item.priority || 'high');
    setIsActive(item.isActive);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-xl text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            बड़ी खबर प्रबंधन (Breaking News Ticker)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            मुख्य पृष्ठ के शीर्ष पर स्क्रॉल होने वाले लाइव ब्रेकिंग टिकर संदेश
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => {
              setEditingId(null);
              setTitle('');
              setUrl('');
              setIsAdding(true);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            नई ब्रेकिंग न्यूज जोड़ें
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              {editingId ? 'ब्रेकिंग न्यूज संपादित करें' : 'नई बड़ी खबर दर्ज करें'}
            </h2>
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

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              ब्रेकिंग न्यूज हेडलाइन (Headline)*
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा: हरियाणा बजट में किसानों के लिए बड़े पैकेज की घोषणा, फसलों के MSP में बढ़ोतरी..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                क्लिक लिंक URL (Optional Article Link)
              </label>
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="/news/haryana-budget-announcement"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-8 pr-2.5 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">प्राथमिकता (Priority)</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 text-xs"
              >
                <option value="critical">अत्यंत महत्वपूर्ण (Critical / Red Alert)</option>
                <option value="high">उच्च प्राथमिकता (High Priority)</option>
                <option value="normal">सामान्य (Normal)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-red-600"
              />
              टिकर में सक्रिय रखें (Active in Live Ticker)
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                सहेजें
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Breaking Items List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase">
          सक्रिय एवं संग्रहीत बड़ी खबरें ({breakingNews.length})
        </div>

        <div className="divide-y divide-slate-800">
          {breakingNews.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                    item.priority === 'critical'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {item.priority || 'high'}
                </span>
                <div>
                  <div className="font-semibold text-white text-xs sm:text-sm">{item.title}</div>
                  {item.url && (
                    <div className="text-[10px] text-sky-400 font-mono flex items-center gap-1 mt-0.5">
                      <LinkIcon className="w-3 h-3" />
                      {item.url}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => onUpdate(item.id, { isActive: !item.isActive })}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold ${
                    item.isActive
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.isActive ? 'सक्रिय (Live)' : 'निष्क्रिय'}
                </button>

                <button
                  onClick={() => startEdit(item)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm('क्या आप इस ब्रेकिंग न्यूज को हटाना चाहते हैं?')) {
                      onDelete(item.id);
                    }
                  }}
                  className="p-1.5 rounded bg-slate-800 hover:bg-rose-950 text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
