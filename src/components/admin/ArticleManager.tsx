import React, { useState } from 'react';
import { Article, Category, Subcategory, Author } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Flame,
  Star,
  ExternalLink,
} from 'lucide-react';

interface ArticleManagerProps {
  articles: Article[];
  categories: Category[];
  subcategories: Subcategory[];
  authors: Author[];
  onCreateArticle: () => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => Promise<void>;
  onToggleStatus: (id: string, currentStatus: 'published' | 'draft') => Promise<void>;
  onViewLiveArticle: (slug: string) => void;
}

export const ArticleManager: React.FC<ArticleManagerProps> = ({
  articles,
  categories,
  subcategories,
  authors,
  onCreateArticle,
  onEditArticle,
  onDeleteArticle,
  onToggleStatus,
  onViewLiveArticle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || a.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-xl text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            समाचार प्रबंधन (News Articles Manager)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            सभी श्रेणियों के प्रकाशित व ड्राफ्ट समाचारों का संपूर्ण नियंत्रण
          </p>
        </div>

        <button
          onClick={onCreateArticle}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          नया समाचार लिखें
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="शीर्षक, लेखक या कीवर्ड से खोजें..."
            className="w-full bg-slate-800 border border-slate-700 text-white pl-9 pr-3 py-2 rounded-lg text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-xs focus:outline-none"
          >
            <option value="all">सभी श्रेणियां (All Categories)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameHi}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-xs focus:outline-none"
          >
            <option value="all">सभी स्थितियां</option>
            <option value="published">केवल प्रकाशित (Published)</option>
            <option value="draft">केवल ड्राफ्ट (Draft)</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">समाचार शीर्षक</th>
                <th className="py-3 px-3">श्रेणी</th>
                <th className="py-3 px-3">संवाददाता</th>
                <th className="py-3 px-3">फ्लैग्स</th>
                <th className="py-3 px-3">स्थिति</th>
                <th className="py-3 px-3">व्यूज</th>
                <th className="py-3 px-4 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((art) => (
                <tr key={art.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={art.featuredImage}
                        alt=""
                        className="w-12 h-9 rounded object-cover shrink-0 bg-slate-950"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate max-w-xs">{art.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          /{art.slug} • {new Date(art.publishedAt || art.createdAt).toLocaleDateString('hi-IN')}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                      {art.categoryName}
                    </span>
                    {art.subcategoryName && (
                      <span className="block text-[9px] text-slate-400 mt-0.5">📍 {art.subcategoryName}</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-slate-400 font-medium">{art.authorName}</td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {art.isBreaking && (
                        <span title="Breaking News" className="p-1 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[9px]">
                          <Flame className="w-3 h-3" />
                        </span>
                      )}
                      {art.isFeatured && (
                        <span title="Featured Story" className="p-1 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[9px]">
                          <Star className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => onToggleStatus(art.id, art.status === 'published' ? 'draft' : 'published')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        art.status === 'published'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                          : 'bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900'
                      }`}
                    >
                      {art.status === 'published' ? '✓ प्रकाशित' : 'ड्राफ्ट'}
                    </button>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-400">{art.views.toLocaleString()}</td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewLiveArticle(art.slug)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="लाइव देखें"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditArticle(art)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-indigo-900 text-indigo-300"
                        title="संपादित करें"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`क्या आप "${art.title}" को हटाना चाहते हैं?`)) {
                            onDeleteArticle(art.id);
                          }
                        }}
                        className="p-1.5 rounded bg-slate-800 hover:bg-rose-900 text-rose-400"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
