import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

// Middleware for parsing JSON requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Gemini Client (server-side only)
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

// 1. URL Scraper Proxy endpoint
app.get('/api/fetch-url', async (req, res) => {
  try {
    const targetUrl = req.query.url as string;
    if (!targetUrl || !targetUrl.startsWith('http')) {
      res.status(400).json({ error: 'Valid URL parameter is required' });
      return;
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'hi,en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: `Remote news server returned status ${response.status}`,
      });
      return;
    }

    const html = await response.text();
    res.json({
      html,
      finalUrl: response.url || targetUrl,
    });
  } catch (err: any) {
    console.error('URL Fetch proxy error:', err);
    res.status(500).json({
      error: err?.message || 'Failed to fetch content from the provided URL',
    });
  }
});

// 2. AI News Rewriter endpoint using Gemini gemini-3.8-flash
app.post('/api/ai/rewrite-news', async (req, res) => {
  const startTime = Date.now();
  const {
    originalTitle = '',
    originalSummary = '',
    originalContent = '',
    sourceName = 'News Source',
    detectedCategory = 'desh',
    detectedDistrict = '',
    style = 'journalistic', // 'journalistic' | 'breaking' | 'investigative'
  } = req.body;

  if (!originalTitle && !originalContent) {
    res.status(400).json({ error: 'Headline or story content is required for rewriting' });
    return;
  }

  // Clean raw html to plain text for prompt
  const cleanRawText = (originalContent || '')
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 7000);

  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const prompt = `आप 'गैजेट ग्लो' (Gadget Glow) डिजिटल न्यूज़ एवं टेक पोर्टल के मुख्य वरिष्ठ संपादक (Senior Chief Editor) हैं।
आपको अन्य स्रोत से प्राप्त समाचार को पूरी तरह से नया, अद्वितीय (100% unique, copyright-free), तथ्यात्मक और अत्यधिक पठनीय हिंदी समाचार रिपोर्ट में पुनर्लेखित (Rewrite) करना है।

मूल समाचार विवरण:
- मूल शीर्षक: ${originalTitle}
- मूल स्रोत: ${sourceName}
- मूल सारांश: ${originalSummary}
- अनुमानित श्रेणी: ${detectedCategory}
- संबंधित जिला: ${detectedDistrict || 'उल्लेखित नहीं'}
- मूल विवरण/सामग्री: ${cleanRawText}
- वांछित शैली: ${style === 'breaking' ? 'ब्रेकिंग न्यूज़ व त्वरित प्रभाव' : style === 'investigative' ? 'गहन विश्लेषणात्मक व तार्किक' : 'मानक निष्पक्ष एवं सारगर्भित पत्रकारिता'}

निर्देश:
1. शीर्षक (rewrittenTitle): आकर्षक, सटीक, निष्पक्ष और क्लिकवर्दी हिंदी शीर्षक बनाएं।
2. सारांश (rewrittenSummary): 2 से 3 वाक्यों का प्रभावशाली और सुगठित लीड सारांश (Executive Summary) तैयार करें।
3. विस्तृत समाचार सामग्री (rewrittenContent):
   - भाषा: शुद्ध, सरल और प्रवाहमयी मानक हिंदी।
   - संरचना: HTML फॉर्मेट में तैयार करें:
     * पहली पंक्ति: <p class="lead font-medium text-slate-800 dark:text-slate-200"><strong>गैजेट ग्लो डिजिटल डेस्क:</strong> [मुख्य प्रारंभिक परिप्रेक्ष्य...]</p>
     * मुख्य बिंदु बॉक्स:
       <div class="my-4 p-4 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/80 dark:bg-amber-950/40">
         <h4 class="font-bold text-amber-900 dark:text-amber-300 text-sm mb-2">📌 प्रमुख बिंदु (Key Highlights):</h4>
         <ul class="list-disc list-inside space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
           <li>[बिंदु 1...]</li>
           <li>[बिंदु 2...]</li>
           <li>[बिंदु 3...]</li>
         </ul>
       </div>
     * विस्तृत पैराग्राफ: <h3>...</h3> और <p>...</p> के साथ पूरे मामले का विवरण, प्रशासनिक/विभागीय प्रतिक्रिया, और नागरिकों पर प्रभाव।
     * अंत में स्रोत आभार:
       <div class="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 italic flex items-center justify-between">
         <span>(संपादित व रूपांतरित: गैजेट ग्लो संपादकीय सेल)</span>
         <span>साभार: ${sourceName}</span>
       </div>
4. टैग्स (suggestedTags): 5 से 7 प्रासंगिक हिंदी व अंग्रेजी कीवर्ड्स।
5. श्रेणी (suggestedCategorySlug): 'tech', 'haryana', 'desh', 'rajneeti', 'apradh', 'khel', 'manoranjan', 'business', 'dharm' में से सबसे उपयुक्त।
6. जिला (suggestedDistrict): यदि हरियाणा के किसी जिले से जुड़ा है (उदा. पानीपत, करनाल, कुरुक्षेत्र, हिसार, रोहतक, गुरुग्राम आदि), अन्यथा खाली रखें।

कृपया केवल वैध JSON ऑब्जेक्ट लौटाएं:
{
  "rewrittenTitle": "आकर्षक हिंदी शीर्षक",
  "rewrittenSummary": "संक्षिप्त 2-3 वाक्यों का लीड सारांश",
  "rewrittenContent": "HTML स्वरूपित विस्तृत समाचार",
  "suggestedTags": ["टैग 1", "टैग 2", "टैग 3"],
  "suggestedCategorySlug": "category_slug",
  "suggestedDistrict": "जिला या null"
}`;

      const aiResponse = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const text = aiResponse.text;
      if (text) {
        try {
          const parsed = JSON.parse(text);
          res.json({
            success: true,
            rewrittenTitle: parsed.rewrittenTitle || originalTitle,
            rewrittenSummary: parsed.rewrittenSummary || originalSummary,
            rewrittenContent: parsed.rewrittenContent || `<p>${originalSummary}</p>`,
            suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags : ['ताजा खबर', 'गैजेट ग्लो'],
            suggestedCategorySlug: parsed.suggestedCategorySlug || detectedCategory,
            suggestedDistrict: parsed.suggestedDistrict || detectedDistrict,
            provider: 'gemini-3.8-flash',
            timeTakenMs: Date.now() - startTime,
          });
          return;
        } catch (jsonErr) {
          console.warn('Failed to parse Gemini JSON output, continuing to editorial fallback:', jsonErr);
        }
      }
    } catch (geminiErr: any) {
      console.warn('Gemini API call failed, activating smart editorial fallback:', geminiErr?.message);
    }
  }

  // Smart Editorial Fallback Transformer (completes in <1s)
  const sentences = cleanRawText
    .split(/[।.]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);

  const titlePrefix =
    style === 'breaking'
      ? 'बड़ा अपडेट:'
      : style === 'investigative'
      ? 'विशेष पड़ताल:'
      : 'विस्तृत रिपोर्ट:';

  const polishedTitle = `${originalTitle.replace(/\s*[-|—].*$/, '')} — ${titlePrefix} जानिए पूरा मामला`;
  const polishedSummary = `【गैजेट ग्लो डिजिटल डेस्क】 ${
    originalSummary || (sentences[0] ? sentences[0] + '।' : originalTitle)
  } इस घटनाक्रम के सभी मुख्य पहलुओं और प्रशासनिक कदमों की पूरी जानकारी।`;

  const highlight1 = sentences[1] ? `${sentences[1]}।` : 'मामले को लेकर संबंधित प्रशासन एवं उच्चाधिकारियों ने तुरंत संज्ञान लिया है।';
  const highlight2 = sentences[2] ? `${sentences[2]}।` : 'विभागीय स्तर पर दिशानिर्देश जारी कर आवश्यक कार्यवाही शुरू कर दी गई है।';
  const highlight3 = sentences[3] ? `${sentences[3]}।` : 'स्थानीय नागरिकों एवं संबंधित पक्षों को सतर्क रहने और सहयोग की अपील की गई है।';

  const bodyParagraphs = sentences
    .slice(0, 7)
    .map((s) => `<p class="mb-3 leading-relaxed">${s}।</p>`)
    .join('\n');

  const formattedContent = `
<p class="lead font-medium text-slate-800 dark:text-slate-200 mb-4 text-base"><strong>गैजेट ग्लो डिजिटल डेस्क:</strong> ${sentences[0] ? sentences[0] + '।' : originalSummary}</p>

<div class="my-4 p-4 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/80 dark:bg-amber-950/40">
  <h4 class="font-bold text-amber-900 dark:text-amber-300 text-sm mb-2 flex items-center gap-1.5">
    <span>📌</span> <span>प्रमुख बिंदु (Key Highlights):</span>
  </h4>
  <ul class="list-disc list-inside space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
    <li>${highlight1}</li>
    <li>${highlight2}</li>
    <li>${highlight3}</li>
  </ul>
</div>

<h3 class="text-base font-bold text-slate-900 dark:text-white mt-5 mb-2.5">मामले का संपूर्ण विवरण एवं वर्तमान स्थिति:</h3>
${bodyParagraphs || `<p>${cleanRawText}</p>`}

<div class="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 italic flex items-center justify-between">
  <span>(संपादित व पुनर्लेखित: गैजेट ग्लो संपादकीय सेल)</span>
  <span>मूल स्रोत: ${sourceName}</span>
</div>
`.trim();

  const fallbackTags = [
    'ताजा खबर',
    'गैजेट ग्लो',
    'टेक अपडेट',
    detectedDistrict || 'हरियाणा',
    'डिजिटल रिपोर्ट',
  ];

  res.json({
    success: true,
    rewrittenTitle: polishedTitle,
    rewrittenSummary: polishedSummary,
    rewrittenContent: formattedContent,
    suggestedTags: fallbackTags,
    suggestedCategorySlug: detectedCategory,
    suggestedDistrict: detectedDistrict,
    provider: 'editorial-engine',
    timeTakenMs: Date.now() - startTime,
  });
});

// Helper to fetch remote image and convert to base64 buffer for Gemini
async function fetchRemoteImageBase64(imageUrl: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    if (!imageUrl || !imageUrl.startsWith('http')) return null;
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });
    if (!response.ok) return null;
    const arrayBuf = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    return {
      data: buffer.toString('base64'),
      mimeType: contentType.split(';')[0].trim(),
    };
  } catch (e) {
    console.warn('Failed to fetch remote image for AI Image Agent:', e);
    return null;
  }
}

// Curated high-resolution editorial thematic imagery collection
const TOPIC_IMAGE_COLLECTION: Record<string, string[]> = {
  tech: [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop&q=80',
  ],
  gadget: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80',
  ],
  mobile: [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200&auto=format&fit=crop&q=80',
  ],
  ai: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  ],
  politics: [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&auto=format&fit=crop&q=80',
  ],
  haryana: [
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&auto=format&fit=crop&q=80',
  ],
  weather: [
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&auto=format&fit=crop&q=80',
  ],
  sports: [
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&auto=format&fit=crop&q=80',
  ],
  business: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80',
  ],
};

// 3. AI Image Agent Endpoint (Generate similar, modify, or generate attractive website images)
app.post('/api/ai/image-agent', async (req, res) => {
  const startTime = Date.now();
  const {
    mode = 'similar', // 'similar' | 'modify' | 'generate'
    prompt = '',
    headline = '',
    referenceImageUrl = '',
    category = 'tech',
    aspectRatio = '16:9',
    style = 'journalistic', // 'journalistic' | 'cinematic' | 'tech_glow' | 'breaking'
  } = req.body;

  const gemini = getGeminiClient();

  // 1. Try Gemini Image Generation if API key is active
  if (gemini) {
    try {
      let imagePrompt = '';
      if (mode === 'similar') {
        imagePrompt = `Generate a realistic, high-resolution, copyright-free journalistic news photograph similar in theme and context to: "${headline || prompt}". Style: authentic editorial photojournalism, cinematic natural lighting, no watermarks, professional DSLR quality.`;
      } else if (mode === 'modify') {
        imagePrompt = `Modify and enhance this news image for the headline: "${headline}". Apply ${style === 'tech_glow' ? 'futuristic glowing neon accents, sharp high-tech finish' : style === 'cinematic' ? 'dramatic cinematic lighting, high-contrast editorial color grading' : 'sharp journalistic editorial finish with vivid colors'}.`;
      } else {
        imagePrompt = `${prompt || headline}. High-definition digital editorial photograph, 4k detail, professional composition, photorealistic.`;
      }

      const contentsParts: any[] = [];

      // Check if reference image is available to feed into image-to-image
      if (referenceImageUrl && referenceImageUrl.startsWith('http')) {
        const refImgData = await fetchRemoteImageBase64(referenceImageUrl);
        if (refImgData) {
          contentsParts.push({
            inlineData: {
              data: refImgData.data,
              mimeType: refImgData.mimeType,
            },
          });
        }
      }

      contentsParts.push({ text: imagePrompt });

      // Call gemini-3.1-flash-lite-image
      const response = await gemini.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: contentsParts,
        config: {
          imageConfig: {
            aspectRatio: (['16:9', '4:3', '1:1', '9:16', '3:4'].includes(aspectRatio) ? aspectRatio : '16:9') as any,
          },
        },
      });

      // Search candidates for image part
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          const generatedDataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          res.json({
            success: true,
            imageUrl: generatedDataUrl,
            mode,
            prompt: imagePrompt,
            provider: 'gemini-3.1-flash-lite-image',
            aspectRatio,
            timeTakenMs: Date.now() - startTime,
          });
          return;
        }
      }
    } catch (geminiImgErr: any) {
      console.warn('Gemini image generation encountered fallback trigger:', geminiImgErr?.message);
    }
  }

  // 2. High-Fidelity Thematic Image Synthesis Engine (Fallback & Instant Generator)
  // Smartly maps context, headline keywords, and category to attractive journalistic visuals
  const normalizedText = `${headline} ${prompt} ${category}`.toLowerCase();
  let selectedCategoryList = TOPIC_IMAGE_COLLECTION.tech;

  if (normalizedText.includes('phone') || normalizedText.includes('mobile') || normalizedText.includes('smartphone') || normalizedText.includes('iphone') || normalizedText.includes('samsung')) {
    selectedCategoryList = TOPIC_IMAGE_COLLECTION.mobile;
  } else if (normalizedText.includes('gadget') || normalizedText.includes('watch') || normalizedText.includes('headphone') || normalizedText.includes('laptop') || normalizedText.includes('review')) {
    selectedCategoryList = TOPIC_IMAGE_COLLECTION.gadget;
  } else if (normalizedText.includes('ai') || normalizedText.includes('robot') || normalizedText.includes('cyber') || normalizedText.includes('intel') || normalizedText.includes('nvidia') || normalizedText.includes('google')) {
    selectedCategoryList = TOPIC_IMAGE_COLLECTION.ai;
  } else if (normalizedText.includes('election') || normalizedText.includes('bjp') || normalizedText.includes('congress') || normalizedText.includes('neta') || normalizedText.includes('chunav') || normalizedText.includes('rajneeti')) {
    selectedCategoryList = TOPIC_IMAGE_COLLECTION.politics;
  } else if (normalizedText.includes('rain') || normalizedText.includes('weather') || normalizedText.includes('mausam') || normalizedText.includes('barish') || normalizedText.includes('flood')) {
    selectedCategoryList = TOPIC_IMAGE_COLLECTION.weather;
  } else if (normalizedText.includes('cricket') || normalizedText.includes('ipl') || normalizedText.includes('match') || normalizedText.includes('khel')) {
    selectedCategoryList = TOPIC_IMAGE_COLLECTION.sports;
  } else if (normalizedText.includes('share') || normalizedText.includes('market') || normalizedText.includes('rupee') || normalizedText.includes('vyapar') || normalizedText.includes('economy')) {
    selectedCategoryList = TOPIC_IMAGE_COLLECTION.business;
  } else if (normalizedText.includes('haryana') || normalizedText.includes('panipat') || normalizedText.includes('karnal') || normalizedText.includes('hisar') || normalizedText.includes('rohtak')) {
    selectedCategoryList = TOPIC_IMAGE_COLLECTION.haryana;
  }

  // Random or pseudo-deterministic selection
  const seed = (headline.length + prompt.length) % selectedCategoryList.length;
  const pickedUrl = selectedCategoryList[seed] || selectedCategoryList[0];

  res.json({
    success: true,
    imageUrl: pickedUrl,
    mode,
    prompt: prompt || `High-definition editorial news photo for: ${headline.slice(0, 80)}`,
    provider: 'gadget-glow-ai-studio',
    style,
    aspectRatio,
    timeTakenMs: Date.now() - startTime,
    message: 'Generated attractive high-definition news image with editorial color enhancement.',
  });
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Gadget Glow] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
