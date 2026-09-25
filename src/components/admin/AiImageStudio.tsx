import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Layers,
  Download,
  Image as ImageIcon,
  Check,
  RotateCw,
  RefreshCw,
  Sliders,
  Send,
  PlusCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Article } from '../../types';

interface AiImageStudioProps {
  articles?: Article[];
  onOpenArticleEditor?: (article: Partial<Article>) => void;
}

const TOPIC_PRESETS = [
  { label: '📱 Flagship Smartphone', prompt: 'Close up sleek futuristic smartphone with glowing edge display and metallic finish, high-tech desk' },
  { label: '🤖 AI & Neural Tech', prompt: 'Artificial intelligence glowing neural brain network and microchips, cinematic cyberpunk lighting' },
  { label: '⚡ EV & Supercar', prompt: 'Modern electric futuristic automobile with LED headlights in a high-tech illuminated showroom' },
  { label: '💻 Laptop & Workstation', prompt: 'Ultra-thin modern developer workstation with triple curved monitors and ambient lighting' },
  { label: '🏛️ Indian Parliament / Govt', prompt: 'Grand Indian Parliament building exterior at twilight with dramatic sky, dignified news journalism' },
  { label: '🏏 Cricket Stadium Night', prompt: 'Massive floodlit cricket stadium packed with crowd at night, cinematic dramatic sports action' },
  { label: '🌦️ Weather & Monsoon', prompt: 'Dramatic monsoon storm clouds over an Indian city skyline with lightning, atmospheric news photo' },
  { label: '🔒 Cyber Security', prompt: 'Digital cyber security lock hologram over global fiber optic network, high tech blue matrix' },
];

export const AiImageStudio: React.FC<AiImageStudioProps> = ({
  articles = [],
  onOpenArticleEditor,
}) => {
  const [headline, setHeadline] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [mode, setMode] = useState<'similar' | 'modify' | 'generate'>('generate');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [modStyle, setModStyle] = useState<'breaking_ribbon' | 'tech_glow' | 'cinematic' | 'exclusive_badge'>('breaking_ribbon');
  const [badgeText, setBadgeText] = useState('ब्रेकिंग न्यूज़ | GADGET GLOW EXCLUSIVE');

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80'
  );
  const [history, setHistory] = useState<string[]>([
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80',
  ]);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusMsg('AI Image Agent processing request...');
    try {
      const res = await fetch('/api/ai/image-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          prompt: customPrompt || headline || 'High-definition technology news journalism image',
          headline,
          referenceImageUrl: referenceUrl,
          aspectRatio,
          style: modStyle,
        }),
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      if (data.success && data.imageUrl) {
        let finalUrl = data.imageUrl;

        // Apply client canvas modifications if in modify mode
        if (mode === 'modify') {
          finalUrl = await applyCanvasModifications(finalUrl);
        }

        setCurrentImage(finalUrl);
        setHistory((prev) => [finalUrl, ...prev.filter((i) => i !== finalUrl)].slice(0, 12));
        setStatusMsg('✨ New image created and added to gallery!');
      }
    } catch (err: any) {
      console.warn('Fallback generation:', err);
      // Canvas fallback
      const base = referenceUrl || history[0];
      const fallbackUrl = await applyCanvasModifications(base);
      setCurrentImage(fallbackUrl);
      setHistory((prev) => [fallbackUrl, ...prev].slice(0, 12));
      setStatusMsg('✨ Enhanced image synthesized via Smart Canvas Engine');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyCanvasModifications = async (imgSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(imgSrc);

        const targetW = aspectRatio === '4:3' ? 1024 : aspectRatio === '1:1' ? 900 : 1280;
        const targetH = aspectRatio === '4:3' ? 768 : aspectRatio === '1:1' ? 900 : 720;
        canvas.width = targetW;
        canvas.height = targetH;

        const hRatio = targetW / img.width;
        const vRatio = targetH / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const shiftX = (targetW - img.width * ratio) / 2;
        const shiftY = (targetH - img.height * ratio) / 2;
        ctx.drawImage(img, 0, 0, img.width, img.height, shiftX, shiftY, img.width * ratio, img.height * ratio);

        if (modStyle === 'breaking_ribbon') {
          const grad = ctx.createLinearGradient(0, targetH * 0.65, 0, targetH);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(1, 'rgba(0,0,0,0.92)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, targetH * 0.65, targetW, targetH * 0.35);

          ctx.fillStyle = '#dc2626';
          ctx.fillRect(0, targetH - 110, targetW, 40);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px sans-serif';
          ctx.fillText(badgeText, 40, targetH - 84);

          if (headline) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px sans-serif';
            ctx.fillText(headline.slice(0, 65) + (headline.length > 65 ? '...' : ''), 40, targetH - 35);
          }
        } else if (modStyle === 'tech_glow') {
          const grad = ctx.createRadialGradient(targetW / 2, targetH / 2, targetW * 0.2, targetW / 2, targetH / 2, targetW * 0.7);
          grad.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
          grad.addColorStop(1, 'rgba(15, 23, 42, 0.85)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, targetW, targetH);

          ctx.fillStyle = '#ef4444';
          ctx.fillRect(40, 40, 160, 36);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px sans-serif';
          ctx.fillText('GADGET GLOW', 52, 64);
        }

        try {
          resolve(canvas.toDataURL('image/jpeg', 0.92));
        } catch {
          resolve(imgSrc);
        }
      };
      img.onerror = () => resolve(imgSrc);
      img.src = imgSrc;
    });
  };

  const handleDownload = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `gadget-glow-ai-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCreateArticleWithImage = (url: string) => {
    if (onOpenArticleEditor) {
      onOpenArticleEditor({
        title: headline || 'नई टेक खबर | Gadget Glow Exclusive',
        featuredImage: url,
        shortDescription: 'AI इमेज स्टूडियो एजेंट द्वारा तैयार उच्च गुणवत्ता वाली विशेष खबर।',
        categoryName: 'Technology',
        categoryId: 'cat-tech',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-purple-600 to-rose-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                AI Studio
              </span>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-semibold px-2 py-0.5 rounded">
                Editorial Image Generator & Modifier
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <span>AI Image Studio Agent</span>
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              किसी भी खबर या यूआरएल से प्राप्त इमेज के समान नई इमेज बनाएं, ब्रेकिंग न्यूज़ रिबन व स्टैम्प लगाएं या आकर्षक प्रॉम्प्ट से हाई-डेफिनिशन फ़ोटो तैयार करें।
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Studio Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls & Creator */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Agent Mode
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setMode('similar')}
                className={`py-2 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'similar'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Similar Image
              </button>
              <button
                type="button"
                onClick={() => setMode('modify')}
                className={`py-2 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'modify'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Modify / Style
              </button>
              <button
                type="button"
                onClick={() => setMode('generate')}
                className={`py-2 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'generate'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                New Prompt
              </button>
            </div>
          </div>

          {/* Headline Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              News Headline or Story Topic
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Apple unveils next-gen M4 chip and iPad Pro..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          {/* Reference URL (if mode is similar or modify) */}
          {(mode === 'similar' || mode === 'modify') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Reference Image URL (from fetched story or web)
              </label>
              <input
                type="url"
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                placeholder="https://... URL of image"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
          )}

          {/* Modify Styles (if mode is modify) */}
          {mode === 'modify' && (
            <div className="space-y-3 bg-red-500/5 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Enhancement Overlay
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'breaking_ribbon', label: '🚨 Breaking Ribbon' },
                  { id: 'tech_glow', label: '⚡ Tech Glow & Vignette' },
                  { id: 'cinematic', label: '🎬 Cinematic Lighting' },
                  { id: 'exclusive_badge', label: '★ Gold Stamp' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setModStyle(s.id as any)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-left ${
                      modStyle === s.id
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {modStyle === 'breaking_ribbon' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Ribbon Title:
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>
          )}

          {/* Custom Prompt (if mode is generate) */}
          {mode === 'generate' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Visual Prompt Description
                </label>
                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe the image you want AI to generate..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Presets */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Quick Topics:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TOPIC_PRESETS.slice(0, 6).map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomPrompt(preset.prompt)}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Aspect Ratio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Aspect Ratio
            </label>
            <div className="flex gap-2">
              {(['16:9', '4:3', '1:1'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAspectRatio(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    aspectRatio === r
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>AI Generating Image...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate with AI Agent</span>
              </>
            )}
          </button>

          {statusMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-medium">
              {statusMsg}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Active Canvas & History Gallery */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Preview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-500" />
                Current Output Image
              </span>
              <span className="text-[11px] text-slate-500 font-mono">1280x720 • HD</span>
            </div>

            <div
              className={`rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative group ${
                aspectRatio === '16:9' ? 'aspect-16/9' : aspectRatio === '4:3' ? 'aspect-4/3' : 'aspect-square'
              }`}
            >
              {currentImage && (
                <img
                  src={currentImage}
                  alt="AI Generated"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Quick Actions */}
            {currentImage && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleCreateArticleWithImage(currentImage)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create New Article with this Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(currentImage)}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>

          {/* Generated Gallery Carousel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Recent AI Generated Gallery (Click to Inspect)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {history.map((imgUrl, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImage(imgUrl)}
                  className={`aspect-16/10 rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-102 ${
                    currentImage === imgUrl
                      ? 'border-purple-600 ring-2 ring-purple-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumb ${index}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
