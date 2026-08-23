import React, { useState } from 'react';
import {
  Youtube,
  Twitter,
  Facebook,
  Instagram,
  Image as ImageIcon,
  Code,
  Upload,
  Sparkles,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  X,
} from 'lucide-react';

export interface MediaEmbedToolbarProps {
  onInsertContent: (htmlToInsert: string) => void;
  onSelectFeaturedImage?: (url: string, caption?: string, credit?: string) => void;
}

export const STOCK_NEWS_IMAGES = [
  {
    category: 'राजनीति (Politics)',
    images: [
      {
        title: 'संसद भवन / Parliament House',
        url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
        caption: 'संसद भवन, नई दिल्ली',
        credit: 'पीटीआई / समाचार फर्स्ट',
      },
      {
        title: 'प्रेस वार्ता / Press Conference',
        url: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=1200&auto=format&fit=crop&q=80',
        caption: 'विशेष प्रेस कॉन्फ्रेंस का आयोजन',
        credit: 'समाचार फर्स्ट ब्यूरो',
      },
      {
        title: 'मतदान / Election Voting',
        url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&auto=format&fit=crop&q=80',
        caption: 'लोकतांत्रिक मतदान प्रक्रिया',
        credit: 'चुनाव आयोग / समाचार फर्स्ट',
      },
    ],
  },
  {
    category: 'हरियाणा एवं क्षेत्रीय (Haryana News)',
    images: [
      {
        title: 'हरियाणा सचिवालय चंडीगढ़',
        url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
        caption: 'हरियाणा सिविल सचिवालय, चंडीगढ़',
        credit: 'डीपीआर हरियाणा',
      },
      {
        title: 'किसान एवं कृषि / Farming',
        url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
        caption: 'हरियाणा में रबी फसल की तैयारी व कृषि विकास',
        credit: 'कृषि विभाग',
      },
      {
        title: 'हाईवे एवं एक्सप्रेसवे / GT Road Infrastructure',
        url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&auto=format&fit=crop&q=80',
        caption: 'राष्ट्रीय राजमार्ग एवं एक्सप्रेसवे निर्माण',
        credit: 'एनएचएआई',
      },
    ],
  },
  {
    category: 'अपराध एवं कानून (Crime & Law)',
    images: [
      {
        title: 'पुलिस एवं सुरक्षा दल',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
        caption: 'पुलिस विभाग द्वारा सुरक्षा व्यवस्था चाक-चौबंद',
        credit: 'पुलिस ब्यूरो',
      },
      {
        title: 'न्यायालय / High Court & Justice',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
        caption: 'उच्च न्यायालय में अहम मामले पर सुनवाई',
        credit: 'लीगल सेल',
      },
    ],
  },
  {
    category: 'व्यापार एवं अर्थव्यवस्था (Business & Market)',
    images: [
      {
        title: 'शेयर बाजार / Stock Market & Sensex',
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
        caption: 'सेंसेक्स व निफ्टी में नया रिकॉर्ड स्तर',
        credit: 'मार्केट डेस्क',
      },
      {
        title: 'भारतीय रुपया व बजट',
        url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80',
        caption: 'वार्षिक बजट एवं वित्तीय नीतियां',
        credit: 'वित्त मंत्रालय',
      },
    ],
  },
  {
    category: 'खेल (Sports & Cricket)',
    images: [
      {
        title: 'क्रिकेट मैदान / Cricket Match',
        url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        caption: 'भारत बनाम प्रतिद्वंद्वी रोमांचक मुकाबला',
        credit: 'बीसीसीआई / खेल ब्यूरो',
      },
      {
        title: 'स्वर्ण पदक एवं एथलेटिक्स',
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80',
        caption: 'हरियाणवी खिलाड़ियों ने लहराया तिरंगा',
        credit: 'स्पोर्ट्स डेस्क',
      },
    ],
  },
  {
    category: 'मौसम एवं पर्यावरण (Weather & Climate)',
    images: [
      {
        title: 'मानसून एवं भारी बारिश',
        url: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1200&auto=format&fit=crop&q=80',
        caption: 'मौसम विभाग द्वारा भारी बारिश का अलर्ट जारी',
        credit: 'मौसम केंद्र',
      },
      {
        title: 'धुंध एवं शीत लहर',
        url: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=1200&auto=format&fit=crop&q=80',
        caption: 'घने कोहरे और कड़ाके की ठंड से जनजीवन प्रभावित',
        credit: 'समाचार फर्स्ट ब्यूरो',
      },
    ],
  },
];

export const MediaEmbedToolbar: React.FC<MediaEmbedToolbarProps> = ({
  onInsertContent,
  onSelectFeaturedImage,
}) => {
  const [activeModal, setActiveModal] = useState<
    'none' | 'youtube' | 'social' | 'image' | 'presets' | 'custom_html'
  >('none');

  // YouTube State
  const [ytUrl, setYtUrl] = useState('');
  const [ytCaption, setYtCaption] = useState('');

  // Social State
  const [socialPlatform, setSocialPlatform] = useState<'twitter' | 'facebook' | 'instagram'>(
    'twitter'
  );
  const [socialUrl, setSocialUrl] = useState('');
  const [socialAuthor, setSocialAuthor] = useState('');
  const [socialText, setSocialText] = useState('');

  // Inline Image State
  const [imgUrl, setImgUrl] = useState('');
  const [imgCaption, setImgCaption] = useState('');
  const [imgCredit, setImgCredit] = useState('');
  const [imgAlign, setImgAlign] = useState<'center' | 'left' | 'right' | 'full'>('center');

  // Custom HTML / Iframe State
  const [rawHtml, setRawHtml] = useState('');

  // Helpers to extract YouTube ID
  const extractYouTubeId = (url: string): string => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url.trim();
  };

  // Helper for Local File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isFeatured = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        if (isFeatured && onSelectFeaturedImage) {
          onSelectFeaturedImage(base64, file.name, 'स्थानीय अपलोड');
        } else {
          setImgUrl(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Insert YouTube Embed
  const handleInsertYouTube = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractYouTubeId(ytUrl);
    if (!videoId) return;

    const embedHtml = `
<div class="video-embed-container" data-embed-type="youtube" data-video-id="${videoId}">
  <div class="video-embed-wrapper">
    <iframe
      src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0"
      title="${ytCaption || 'YouTube Video'}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
  ${ytCaption ? `<div class="embed-caption">🎥 <span>${ytCaption}</span></div>` : ''}
</div>
`;
    onInsertContent(embedHtml);
    setYtUrl('');
    setYtCaption('');
    setActiveModal('none');
  };

  // Insert Social Embed (Twitter/X, Facebook, Instagram)
  const handleInsertSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialUrl) return;

    let embedHtml = '';

    if (socialPlatform === 'twitter') {
      embedHtml = `
<div class="social-embed-card twitter-embed" data-embed-type="twitter" data-url="${socialUrl}">
  <div class="embed-header bg-slate-900 text-white flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="text-sky-400 font-bold">𝕏 / Twitter</span>
      <span class="text-xs text-slate-400">${socialAuthor || 'आधिकारिक पोस्ट'}</span>
    </div>
    <a href="${socialUrl}" target="_blank" rel="noreferrer" class="text-[11px] text-sky-400 hover:underline">मूल पोस्ट देखें ↗</a>
  </div>
  <div class="embed-body p-4 bg-slate-50 text-slate-800 text-sm italic">
    ${socialText ? `"${socialText}"` : 'ट्विटर पर यह पोस्ट देखने के लिए नीचे दिए लिंक पर क्लिक करें।'}
  </div>
  <div class="px-4 py-2 bg-slate-100 border-t border-slate-200 text-right">
    <a href="${socialUrl}" target="_blank" rel="noreferrer" class="inline-block bg-slate-900 text-white text-xs px-3 py-1 rounded font-bold">𝕏 पर खोलें</a>
  </div>
</div>
`;
    } else if (socialPlatform === 'facebook') {
      const fbEncoded = encodeURIComponent(socialUrl);
      embedHtml = `
<div class="social-embed-card facebook-embed" data-embed-type="facebook" data-url="${socialUrl}">
  <div class="embed-header bg-blue-700 text-white flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="font-bold">Facebook Post</span>
      <span class="text-xs text-blue-200">${socialAuthor || 'फेसबुक'}</span>
    </div>
    <a href="${socialUrl}" target="_blank" rel="noreferrer" class="text-[11px] text-blue-200 hover:underline">फेसबुक पर देखें ↗</a>
  </div>
  <div class="embed-body p-4 bg-slate-50 text-slate-800 text-sm">
    <div class="video-embed-wrapper">
      <iframe
        src="https://www.facebook.com/plugins/post.php?href=${fbEncoded}&show_text=true&width=500"
        width="100%"
        height="350"
        style="border:none;overflow:hidden"
        scrolling="no"
        frameborder="0"
        allowfullscreen="true"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      ></iframe>
    </div>
  </div>
</div>
`;
    } else if (socialPlatform === 'instagram') {
      const cleanIg = socialUrl.replace(/\/$/, '');
      const embedUrl = cleanIg.includes('/embed') ? cleanIg : `${cleanIg}/embed`;
      embedHtml = `
<div class="social-embed-card instagram-embed" data-embed-type="instagram" data-url="${socialUrl}">
  <div class="embed-header bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 text-white flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="font-bold">Instagram Reel / Post</span>
      <span class="text-xs text-pink-100">${socialAuthor || '@samacharfirst'}</span>
    </div>
    <a href="${socialUrl}" target="_blank" rel="noreferrer" class="text-[11px] text-pink-100 hover:underline">इंस्टाग्राम पर देखें ↗</a>
  </div>
  <div class="embed-body p-2 bg-slate-50 flex justify-center">
    <iframe
      src="${embedUrl}"
      width="100%"
      height="450"
      frameborder="0"
      scrolling="no"
      allowtransparency="true"
      style="max-width:450px;border-radius:8px;"
    ></iframe>
  </div>
</div>
`;
    }

    onInsertContent(embedHtml);
    setSocialUrl('');
    setSocialAuthor('');
    setSocialText('');
    setActiveModal('none');
  };

  // Insert Inline Image
  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgUrl) return;

    let alignClasses = 'w-full my-4';
    if (imgAlign === 'left') alignClasses = 'sm:w-1/2 sm:float-left sm:mr-4 my-3';
    else if (imgAlign === 'right') alignClasses = 'sm:w-1/2 sm:float-right sm:ml-4 my-3';

    const figureHtml = `
<figure class="${alignClasses}">
  <img src="${imgUrl}" alt="${imgCaption || 'समाचार फर्स्ट विशेष तस्वीर'}" class="rounded-lg shadow-sm w-full object-cover" />
  ${imgCaption || imgCredit ? `<figcaption class="text-xs text-slate-500 text-center mt-1.5">${imgCaption} ${imgCredit ? `(फोटो: ${imgCredit})` : ''}</figcaption>` : ''}
</figure>
`;
    onInsertContent(figureHtml);
    setImgUrl('');
    setImgCaption('');
    setImgCredit('');
    setActiveModal('none');
  };

  // Insert Custom HTML
  const handleInsertCustomHtml = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawHtml.trim()) return;
    onInsertContent(rawHtml.trim());
    setRawHtml('');
    setActiveModal('none');
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-y-2 text-slate-200">
      {/* Action Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          मीडिया और सोशल एम्बेड टूलबार (Rich Media Tools)
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* YouTube Insert Button */}
          <button
            type="button"
            onClick={() => setActiveModal(activeModal === 'youtube' ? 'none' : 'youtube')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeModal === 'youtube'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-red-400'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube वीडियो</span>
          </button>

          {/* Social Media Embed Button */}
          <button
            type="button"
            onClick={() => setActiveModal(activeModal === 'social' ? 'none' : 'social')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeModal === 'social'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-sky-400'
            }`}
          >
            <Twitter className="w-3 h-3" />
            <span>सोशल एम्बेड (X/FB/IG)</span>
          </button>

          {/* Inline Image Insert Button */}
          <button
            type="button"
            onClick={() => setActiveModal(activeModal === 'image' ? 'none' : 'image')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeModal === 'image'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>इनलाइन फोटो जोड़ें</span>
          </button>

          {/* Stock News Image Library */}
          <button
            type="button"
            onClick={() => setActiveModal(activeModal === 'presets' ? 'none' : 'presets')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeModal === 'presets'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>स्टॉक फोटो गैलरी</span>
          </button>

          {/* Custom HTML Code Insert */}
          <button
            type="button"
            onClick={() => setActiveModal(activeModal === 'custom_html' ? 'none' : 'custom_html')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeModal === 'custom_html'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-purple-300'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>कस्टम HTML/Iframe</span>
          </button>
        </div>
      </div>

      {/* 1. YouTube Video Modal */}
      {activeModal === 'youtube' && (
        <form onSubmit={handleInsertYouTube} className="bg-slate-900 border border-slate-700 rounded-lg p-3 space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-red-400">
            <span className="flex items-center gap-1.5">
              <Youtube className="w-4 h-4" /> YouTube वीडियो टेक्स्ट एडिटर में जोड़ें
            </span>
            <button type="button" onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">YouTube URL या Video ID*</label>
              <input
                type="text"
                required
                value={ytUrl}
                onChange={(e) => setYtUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... या dQw4w9WgXcQ"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">वीडियो कैप्शन / शीर्षक (वैकल्पिक)</label>
              <input
                type="text"
                value={ytCaption}
                onChange={(e) => setYtCaption(e.target.value)}
                placeholder="उदा: ग्राउंड रिपोर्ट: विधानसभा चुनाव पर जनता की राय"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Live Preview if valid ID */}
          {ytUrl && (
            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center gap-3">
              <span className="text-[10px] text-slate-400">वीडियो आईडी:</span>
              <span className="text-xs font-mono text-emerald-400">{extractYouTubeId(ytUrl)}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="px-3 py-1.5 rounded text-xs bg-slate-800 text-slate-300"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
            >
              <Youtube className="w-3.5 h-3.5" />
              एडिटर में वीडियो डालें (Insert Video)
            </button>
          </div>
        </form>
      )}

      {/* 2. Social Media Embed Modal (Twitter, FB, IG) */}
      {activeModal === 'social' && (
        <form onSubmit={handleInsertSocial} className="bg-slate-900 border border-slate-700 rounded-lg p-3 space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-sky-400">
            <span className="flex items-center gap-1.5">
              <Twitter className="w-4 h-4" /> सोशल मीडिया एम्बेड (YouTube / X / Facebook / Instagram)
            </span>
            <button type="button" onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Platform Selector Tabs */}
          <div className="flex gap-2 border-b border-slate-800 pb-2">
            <button
              type="button"
              onClick={() => setSocialPlatform('twitter')}
              className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 ${
                socialPlatform === 'twitter' ? 'bg-slate-950 text-white border border-slate-700' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Twitter className="w-3.5 h-3.5 text-sky-400" />
              <span>𝕏 (Twitter)</span>
            </button>
            <button
              type="button"
              onClick={() => setSocialPlatform('facebook')}
              className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 ${
                socialPlatform === 'facebook' ? 'bg-blue-900 text-white border border-blue-700' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Facebook className="w-3.5 h-3.5 text-blue-400" />
              <span>Facebook</span>
            </button>
            <button
              type="button"
              onClick={() => setSocialPlatform('instagram')}
              className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 ${
                socialPlatform === 'instagram' ? 'bg-pink-950 text-white border border-pink-700' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>Instagram (Reel/Post)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">
                {socialPlatform === 'twitter' && 'Tweet URL (उदा: https://x.com/PMOIndia/status/...)'}
                {socialPlatform === 'facebook' && 'Facebook Post या Video URL'}
                {socialPlatform === 'instagram' && 'Instagram Post / Reel URL (उदा: https://www.instagram.com/p/...)'}
                *
              </label>
              <input
                type="text"
                required
                value={socialUrl}
                onChange={(e) => setSocialUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">अकाउंट नाम / हैंडल (उदा: @cmohry)</label>
              <input
                type="text"
                value={socialAuthor}
                onChange={(e) => setSocialAuthor(e.target.value)}
                placeholder="@username"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white"
              />
            </div>
          </div>

          {socialPlatform === 'twitter' && (
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">ट्वीट का मुख्य सारांश / टेक्स्ट (वैकल्पिक)</label>
              <textarea
                rows={2}
                value={socialText}
                onChange={(e) => setSocialText(e.target.value)}
                placeholder="ट्वीट का मुख्य अंश लिखें..."
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="px-3 py-1.5 rounded text-xs bg-slate-800 text-slate-300"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-1"
            >
              एम्बेड कार्ड जोड़ें (Insert Embed)
            </button>
          </div>
        </form>
      )}

      {/* 3. Inline Image Insert Modal */}
      {activeModal === 'image' && (
        <form onSubmit={handleInsertImage} className="bg-slate-900 border border-slate-700 rounded-lg p-3 space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" /> इनलाइन फोटो / विवरण चित्र जोड़ें
            </span>
            <button type="button" onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
            <div className="sm:col-span-8 space-y-2">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">फोटो वेब लिंक (URL)*</label>
                <input
                  type="url"
                  required
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Local File Upload Option */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded text-[11px] font-semibold border border-slate-700 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>कंप्यूटर / मोबाइल से फोटो अपलोड करें</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, false)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={imgCaption}
                  onChange={(e) => setImgCaption(e.target.value)}
                  placeholder="छवि विवरण (Caption)"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  value={imgCredit}
                  onChange={(e) => setImgCredit(e.target.value)}
                  placeholder="फोटो साभार / क्रेडिट (उदा: विशेष संवाददाता)"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white"
                />
              </div>

              {/* Alignment Selector */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">फोटो अलाइनमेंट:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setImgAlign('center')}
                    className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${
                      imgAlign === 'center' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <AlignCenter className="w-3 h-3" />
                    <span>मध्य (Center)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgAlign('left')}
                    className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${
                      imgAlign === 'left' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <AlignLeft className="w-3 h-3" />
                    <span>बाएं (Left Wrap)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgAlign('right')}
                    className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${
                      imgAlign === 'right' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <AlignRight className="w-3 h-3" />
                    <span>दाएं (Right Wrap)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div className="sm:col-span-4">
              <div className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
                {imgUrl ? (
                  <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-slate-500">फोटो पूर्वावलोकन</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="px-3 py-1.5 rounded text-xs bg-slate-800 text-slate-300"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              समाचार में फोटो जोड़ें (Insert Photo)
            </button>
          </div>
        </form>
      )}

      {/* 4. Stock News Image Library Presets */}
      {activeModal === 'presets' && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> मानक समाचार फोटो गैलरी (1-Click Presets)
            </span>
            <button type="button" onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            {STOCK_NEWS_IMAGES.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-300 border-b border-slate-800 pb-1">
                  {group.category}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {group.images.map((img, iIdx) => (
                    <div
                      key={iIdx}
                      className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden group hover:border-amber-500 transition-colors"
                    >
                      <div className="aspect-16/10 overflow-hidden relative">
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-1.5 text-[10px]">
                        <p className="font-bold text-white truncate">{img.title}</p>
                        <div className="flex gap-1 mt-1">
                          {onSelectFeaturedImage && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectFeaturedImage(img.url, img.caption, img.credit);
                                setActiveModal('none');
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-1.5 py-0.5 rounded text-[9px] font-bold flex-1"
                            >
                              मुख्य छवि बनाएं
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const figureHtml = `
<figure class="w-full my-4">
  <img src="${img.url}" alt="${img.title}" class="rounded-lg shadow-sm w-full object-cover" />
  <figcaption class="text-xs text-slate-500 text-center mt-1.5">${img.caption} (फोटो: ${img.credit})</figcaption>
</figure>
`;
                              onInsertContent(figureHtml);
                              setActiveModal('none');
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-bold flex-1"
                          >
                            लेख में डालें
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Custom HTML / Iframe Modal */}
      {activeModal === 'custom_html' && (
        <form onSubmit={handleInsertCustomHtml} className="bg-slate-900 border border-slate-700 rounded-lg p-3 space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-purple-400">
            <span className="flex items-center gap-1.5">
              <Code className="w-4 h-4" /> कस्टम HTML, Iframe या लाइव विजेट कोड
            </span>
            <button type="button" onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <textarea
              rows={4}
              required
              value={rawHtml}
              onChange={(e) => setRawHtml(e.target.value)}
              placeholder="<iframe src='...' width='100%' height='400'></iframe>"
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="px-3 py-1.5 rounded text-xs bg-slate-800 text-slate-300"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
            >
              HTML कोड डालें (Insert HTML)
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
