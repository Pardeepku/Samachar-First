import React, { useState, useEffect } from 'react';
import { Article, Category, Subcategory, Author, ArticleStatus } from '../../types';
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
import { uploadMediaFile } from '../../services/storageService';
import { storage } from '../../firebase/config';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import { AiImageAgentModal } from './AiImageAgentModal';

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
  const [status, setStatus] = useState<ArticleStatus>('published');
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
      setContent('<p>Enter full detailed news report here...</p>');
      setCategoryId(categories[0]?.id || 'cat-desh');
      setSubcategoryId('');
      setAuthorId(authors[0]?.id || 'auth-1');
      setFeaturedImage('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80');
      setImageCaption('');
      setImageCredit('News Bureau');
      setGallery([]);
      setTagsInput('News, Latest, Special');
      setLocation('New Delhi');
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

  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAiImageModalOpen, setIsAiImageModalOpen] = useState(false);

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const optimized = await optimizeImageFile(file, { maxWidth: 1280, quality: 0.82 });

      if (storage) {
        try {
          const customName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          const url = await uploadMediaFile(optimized.blob, 'articles', customName);
          setFeaturedImage(url);
          if (!imageCredit) setImageCredit('Staff Photojournalist');
          setUploadingImage(false);
          return;
        } catch (err) {
          console.warn('Firebase storage upload fallback:', err);
        }
      }

      setFeaturedImage(optimized.dataUrl);
      if (!imageCredit) setImageCredit('Staff Photojournalist');
    } catch (err) {
      console.error('Image compression error:', err);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setFeaturedImage(base64);
        if (!imageCredit) setImageCredit('Staff Photojournalist');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
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

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimized = await optimizeImageFile(file, { maxWidth: 1280, quality: 0.82 });
      if (storage) {
        try {
          const customName = `${Date.now()}_gallery_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          const url = await uploadMediaFile(optimized.blob, 'articles', customName);
          setGallery((prev) => [...prev, url]);
          return;
        } catch (err) {
          console.warn('Firebase storage gallery upload error:', err);
        }
      }

      setGallery((prev) => [...prev, optimized.dataUrl]);
    } catch (err) {
      console.error('Gallery image error:', err);
    }
  };

  const handleInsertContentFromToolbar = (htmlToInsert: string) => {
    setContent((prev) => `${prev}\n${htmlToInsert}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an article headline.');
      return;
    }
    if (!content.trim()) {
      alert('Please enter the full article content.');
      return;
    }

    setSaving(true);
    try {
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const selectedSubcategory = subcategories.find((s) => s.id === subcategoryId);
      const selectedAuthor = authors.find((a) => a.id === authorId);

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Partial<Article> = {
        ...(article ? { id: article.id } : {}),
        title: title.trim(),
        slug: slug.trim() || generateSlug(title.trim()),
        shortDescription: shortDescription.trim() || title.trim().slice(0, 140),
        content: content.trim(),
        categoryId: categoryId || 'cat-desh',
        categoryName: selectedCategory?.name || selectedCategory?.nameHi || 'Latest News',
        featuredImage: featuredImage.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
        tags: tags.length > 0 ? tags : ['News', 'Latest'],
        isBreaking,
        isFeatured,
        status,
        authorId: authorId || 'auth-1',
        authorName: selectedAuthor?.name || 'News Bureau',
      };

      if (subcategoryId) payload.subcategoryId = subcategoryId;
      if (selectedSubcategory?.name) payload.subcategoryName = selectedSubcategory.name;
      if (selectedAuthor?.photo) payload.authorPhoto = selectedAuthor.photo;
      if (selectedAuthor?.designation) payload.authorRole = selectedAuthor.designation;
      if (imageCaption.trim()) payload.imageCaption = imageCaption.trim();
      if (imageCredit.trim()) payload.imageCredit = imageCredit.trim();
      if (gallery.length > 0) payload.gallery = gallery;
      if (location.trim()) payload.location = location.trim();
      if (status === 'published') {
        payload.publishedAt = article?.publishedAt || new Date().toISOString();
      }

      await onSave(payload);
      setSaving(false);
      onClose();
    } catch (err: any) {
      console.error('Error saving article:', err);
      setSaving(false);
      alert(`Error saving article: ${err?.message || 'Please try again'}`);
    }
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
              <h2 className="font-bold text-lg sm:text-xl text-white">
                {article ? 'Edit News Article' : 'Create & Publish New Article'}
              </h2>
              <p className="text-xs text-slate-400">
                Add rich media, YouTube embeds, social media posts, photo galleries, and SEO parameters
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
                Editor
              </button>
              <button
                type="button"
                onClick={() => setViewTab('preview')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors flex items-center gap-1 ${
                  viewTab === 'preview' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Live Preview</span>
              </button>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
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
                  {categories.find((c) => c.id === categoryId)?.name || 'News'}
                </span>
                <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 mt-3 leading-tight">
                  {title || 'Article headline will appear here...'}
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
                      <span className="font-mono text-slate-400">Credit: {imageCredit}</span>
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
                  <h3 className="font-serif font-bold text-slate-900 mb-2">Photo Gallery ({gallery.length})</h3>
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
                  Article Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Major Policy Announcement on Infrastructure Development..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              {/* 2. URL Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-9">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    URL Slug (SEO Friendly Link) *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="major-policy-announcement-infrastructure"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <button
                    type="button"
                    onClick={handleRegenerateSlug}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Auto-Generate
                  </button>
                </div>
              </div>

              {/* 3. Short Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Short Lead Summary (Introductory Paragraph)
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Key summary of the news story for homepage cards, search engines, and social media previews..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* 4. Category, Subcategory/District, Author */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.nameHi})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subcategory / District</label>
                  <select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">-- None / General --</option>
                    {relevantSubcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.nameHi})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Author / Reporter *</label>
                  <select
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-red-500"
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
                    <span>Featured Image *</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAiImageModalOpen(true)}
                      className="cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>AI Image Agent</span>
                    </button>

                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5">
                      <Upload className={`w-3.5 h-3.5 text-red-400 ${uploadingImage ? 'animate-spin' : ''}`} />
                      <span>{uploadingImage ? 'Processing photo...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={handleFeaturedImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8 space-y-2">
                    <input
                      type="url"
                      required
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                        placeholder="Image Caption"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={imageCredit}
                        onChange={(e) => setImageCredit(e.target.value)}
                        placeholder="Photo Credit (e.g., Staff / Reuters)"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center">
                      {featuredImage ? (
                        <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-500">Image Preview</span>
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
                    <span>Additional Photo Gallery ({gallery.length} photos)</span>
                  </div>

                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload to Gallery</span>
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
                    placeholder="Enter image URL (https://...)"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Photo
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

              {/* 7. Rich Media & Embed Toolbar (YouTube, Social Embeds, Inline Images) */}
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
                  Full Article Content (HTML / Rich Text) *
                </label>
                <textarea
                  rows={9}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<p>Full article body and paragraphs...</p>"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              {/* 9. Tags, Location, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Chandigarh / New Delhi / Panipat"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-2.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tags (Comma Separated)</label>
                  <div className="relative">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Politics, Economy, Breaking, Special"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-2.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value="published">Publish Live</option>
                    <option value="draft">Save as Draft</option>
                    <option value="pending_review">Pending Review</option>
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
                    Include in Breaking News Ticker
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
                    Featured Lead Story
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
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Article...' : article ? 'Update Article' : 'Publish Article'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* AI Image Agent Modal (Requirement 2) */}
      <AiImageAgentModal
        isOpen={isAiImageModalOpen}
        onClose={() => setIsAiImageModalOpen(false)}
        initialImageUrl={featuredImage}
        initialHeadline={title}
        category={categories.find((c) => c.id === categoryId)?.name || 'News'}
        onApplyImage={(url) => {
          setFeaturedImage(url);
          if (!imageCaption && title) setImageCaption(title);
          if (!imageCredit) setImageCredit('साभार: Gadget Glow AI Visual Studio');
        }}
      />
    </div>
  );
};
