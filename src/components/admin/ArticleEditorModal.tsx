import React, { useState, useEffect } from 'react';
import { Article, Category, Subcategory, Author } from '../../types';
import { generateSlug } from '../../utils/slugify';
import {
  X,
  Save,
  Sparkles,
  Image as ImageIcon,
  Flame,
  Star,
  Tag,
  MapPin,
  Calendar,
  Clock,
  Upload,
  Eye,
  Plus,
  Trash2,
  Layers,
} from 'lucide-react';
import { MediaEmbedToolbar } from './MediaEmbedToolbar';

interface ArticleEditorModalProps {
  article: Article | null;
  categories: Category[];
  subcategories: Subcategory[];
  authors: Author[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (articleData: Partial<Article>) => Promise<void>;
}

export const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  article,
  categories,
  subcategories,
  authors,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [location, setLocation] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft' | 'pending_review'>('published');
  const [saving, setSaving] = useState(false);
  const [viewTab, setViewTab] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSlug(article.slug);
      setShortDescription(article.shortDescription || '');
      setContent(article.content);
      setCategoryId(article.categoryId);
      setSubcategoryId(article.subcategoryId || '');
      setAuthorId(article.authorId);
      setFeaturedImage(article.featuredImage);
      setImageCaption(article.imageCaption || '');
      setImageCredit(article.imageCredit || '');
      setGallery(article.gallery || []);
      setTagsInput(article.tags?.join(', ') || '');
      setLocation(article.location || '');
      setIsBreaking(Boolean(article.isBreaking));
      setIsFeatured(Boolean(article.isFeatured));
      setStatus(article.status);
    } else {
      // Default new article state
      setTitle('');
      setSlug('');
      setShortDescription('');
      setContent('<p>विस्तृत समाचार सामग्री यहां दर्ज करें...</p>');
      setCategoryId(categories[0]?.id || 'cat-desh');
      setSubcategoryId('');
      setAuthorId(authors[0]?.id || 'auth-pradeep');
      setFeaturedImage('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80');
      setImageCaption('');
      setImageCredit('समाचार फर्स्ट ब्यूरो');
      setGallery([]);
      setTagsInput('ताजा खबर, समाचार फर्स्ट, राष्ट्रीय');
      setLocation('नई दिल्ली');
      setIsBreaking(false);
      setIsFeatured(false);
      setStatus('published');
    }
  }, [article, categories, authors, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!article) {
      setSlug(generateSlug(val));
    }
  };

  const handleRegenerateSlug = () => {
    setSlug(generateSlug(title));
  };

  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setFeaturedImage(base64);
        if (!imageCredit) setImageCredit('स्टाफ रिपोर्टर');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGallery([...gallery, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setGallery(gallery.filter((_, i) => i !== idx));
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setGallery([...gallery, base64]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertContentFromToolbar = (htmlToInsert: string) => {
    setContent((prev) => `${prev}\n${htmlToInsert}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    const selectedCategory = categories.find((c) => c.id === categoryId);
    const selectedSubcategory = subcategories.find((s) => s.id === subcategoryId);
    const selectedAuthor = authors.find((a) => a.id === authorId);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    await onSave({
      ...(article ? { id: article.id } : {}),
      title: title.trim(),
      slug: slug.trim() || generateSlug(title.trim()),
      shortDescription: shortDescription.trim(),
      content,
      categoryId,
      categoryName: selectedCategory?.nameHi || 'समाचार',
      subcategoryId: subcategoryId || undefined,
      subcategoryName: selectedSubcategory?.nameHi || undefined,
      authorId,
      authorName: selectedAuthor?.name || 'समाचार फर्स्ट ब्यूरो',
      authorPhoto: selectedAuthor?.photo || undefined,
      authorRole: selectedAuthor?.designation || undefined,
      featuredImage: featuredImage.trim(),
      imageCaption: imageCaption.trim() || undefined,
      imageCredit: imageCredit.trim() || undefined,
      gallery: gallery.length > 0 ? gallery : undefined,
      tags,
      location: location.trim() || undefined,
      isBreaking,
      isFeatured,
      status,
      publishedAt: status === 'published' ? (article?.publishedAt || new Date().toISOString()) : undefined,
    });
    setSaving(false);
    onClose();
  };

  const relevantSubcategories = subcategories.filter(
    (s) => s.parentCategoryId === categoryId || categoryId.includes('haryana') || categoryId.includes('rajya')
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-white">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-6 bg-red-600 rounded-xs"></span>
            <div>
              <h2 className="font-serif font-black text-lg sm:text-xl text-white">
                {article ? 'समाचार संपादित करें (Edit Article)' : 'नया समाचार प्रकाशित करें (New Article)'}
              </h2>
              <p className="text-[11px] text-slate-400">
                फोटो, YouTube वीडियो, Twitter/Facebook/Instagram एम्बेड और संपूर्ण विवरण जोड़ें
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setViewTab('write')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  viewTab === 'write' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                संपादक (Editor)
              </button>
              <button
                type="button"
                onClick={() => setViewTab('preview')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors flex items-center gap-1 ${
                  viewTab === 'preview' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>लाइव प्रीव्यू</span>
              </button>
            </div>

            <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {viewTab === 'preview' ? (
            /* Live Preview Screen */
            <div className="bg-white text-slate-900 rounded-xl p-5 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-inner">
              <div className="border-b pb-4">
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded">
                  {categories.find((c) => c.id === categoryId)?.nameHi || 'समाचार'}
                </span>
                <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 mt-3 leading-tight">
                  {title || 'समाचार का शीर्षक यहां दिखेगा...'}
                </h1>
                {shortDescription && (
                  <p className="text-slate-600 text-sm font-medium mt-2 italic border-l-2 border-red-500 pl-3">
                    {shortDescription}
                  </p>
                )}
              </div>

              {featuredImage && (
                <div className="rounded-xl overflow-hidden bg-slate-900">
                  <img src={featuredImage} alt="Featured" className="w-full max-h-[400px] object-cover" />
                  {(imageCaption || imageCredit) && (
                    <div className="bg-slate-950 text-slate-300 text-xs p-2.5 flex justify-between">
                      <span>{imageCaption}</span>
                      <span className="font-mono text-slate-400">साभार: {imageCredit}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Rich Content Preview with HTML & Embeds */}
              <div
                className="prose prose-slate max-w-none text-slate-800 space-y-4"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {gallery.length > 0 && (
                <div className="bg-slate-50 border rounded-xl p-4">
                  <h3 className="font-serif font-bold text-slate-900 mb-2">फोटो गैलरी ({gallery.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {gallery.map((img, i) => (
                      <div key={i} className="aspect-16/10 rounded overflow-hidden">
                        <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Main Form Editing Controls */
            <>
              {/* 1. Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  समाचार मुख्य शीर्षक (Headline)*
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="उदा: हरियाणा विधानसभा चुनाव को लेकर बड़ी घोषणा, नई योजनाओं की शुरुआत..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white font-serif font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              {/* 2. URL Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-9">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    URL स्लग (SEO Friendly Slug)*
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="haryana-assembly-election-announcement"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <button
                    type="button"
                    onClick={handleRegenerateSlug}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    स्लग ऑटो-जेनरेट
                  </button>
                </div>
              </div>

              {/* 3. Short Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  संक्षिप्त विवरण (Short Lead Intro)
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="खबर का 1-2 पंक्तियों में मुख्य सार लिखें जो मुख्य पृष्ठ और सोशल मीडिया शेयरिंग पर दिखेगा..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* 4. Category, Subcategory/District, Author */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">श्रेणी (Category)*</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameHi} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">उप-श्रेणी / जिला (District)</label>
                  <select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">-- कोई उप-श्रेणी नहीं --</option>
                    {relevantSubcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameHi} ({s.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">लेखक / संवाददाता (Author)*</label>
                  <select
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.designation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Featured Image & Caption & Upload */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <ImageIcon className="w-4 h-4 text-red-500" />
                    <span>मुख्य छवि (Featured Image)*</span>
                  </div>

                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded text-xs font-semibold border border-slate-700 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-red-400" />
                    <span>डिवाइस से फोटो अपलोड करें</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFeaturedImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8 space-y-2">
                    <input
                      type="url"
                      required
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                        placeholder="छवि कैप्शन (Image Caption)"
                        className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-[11px] text-white"
                      />
                      <input
                        type="text"
                        value={imageCredit}
                        onChange={(e) => setImageCredit(e.target.value)}
                        placeholder="फोटो क्रेडिट (उदा: पीटीआई/समाचार फर्स्ट)"
                        className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-[11px] text-white"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <div className="w-full h-28 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center">
                      {featuredImage ? (
                        <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-500">छवि पूर्वावलोकन</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Multi-Photo Gallery Section */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Layers className="w-4 h-4 text-amber-500" />
                    <span>अतिरिक्त फोटो गैलरी (Additional Photo Gallery - {gallery.length} फोटो)</span>
                  </div>

                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded text-xs font-semibold border border-slate-700 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>गैलरी फोटो अपलोड</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="फोटो वेब लिंक दर्ज करें (https://...)"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    गैलरी में जोड़ें
                  </button>
                </div>

                {gallery.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                    {gallery.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square border border-slate-700 bg-slate-900">
                        <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 7. Rich Media & Embed Toolbar (YouTube, Social Embeds, Inline Images, Presets) */}
              <MediaEmbedToolbar
                onInsertContent={handleInsertContentFromToolbar}
                onSelectFeaturedImage={(url, cap, cred) => {
                  setFeaturedImage(url);
                  if (cap) setImageCaption(cap);
                  if (cred) setImageCredit(cred);
                }}
              />

              {/* 8. Full Rich Content Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  समाचार विस्तृत विवरण (Full Content HTML / Rich Text)*
                </label>
                <textarea
                  rows={9}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<p>समाचार का पूरा विवरण यहां लिखें...</p>"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs font-sans text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              {/* 9. Tags, Location, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">स्थान (Location)</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="चंडीगढ़ / पानीपत / नई दिल्ली"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-2.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">टैग्स (Comma Separated)</label>
                  <div className="relative">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="हरियाणा, चुनाव, ब्रेकिंग, बजट"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-2.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">प्रकाशन स्थिति (Status)</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="published">लाइव प्रकाशित करें (Published)</option>
                    <option value="draft">ड्राफ्ट रखें (Draft)</option>
                    <option value="pending_review">समीक्षाधीन (Pending Review)</option>
                  </select>
                </div>
              </div>

              {/* 10. Flags Checkboxes */}
              <div className="flex flex-wrap gap-6 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 bg-slate-800 border-slate-700"
                  />
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    बड़ी खबर में शामिल करें (Breaking Ticker)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 bg-slate-800 border-slate-700"
                  />
                  <span className="text-xs font-bold text-sky-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-sky-400" />
                    होमपेज मुख्य लीड स्टोरी बनाएं (Featured Lead)
                  </span>
                </label>
              </div>
            </>
          )}

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'सहेजा जा रहा है...' : article ? 'समाचार अपडेट करें' : 'समाचार प्रकाशित करें'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

