import {
  Article,
  Category,
  Subcategory,
  BreakingNews,
  Advertisement,
  Author,
  VideoNews,
  SiteSettings,
  HomepageSection,
} from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-desh', name: 'National', nameHi: 'देश', slug: 'desh', description: 'देशभर की प्रमुख और राष्ट्रीय खबरें', order: 1, isActive: true },
  { id: 'cat-rajya', name: 'States', nameHi: 'राज्य', slug: 'rajya', description: 'राज्यों की ताजा खबरें और अपडेट्स', order: 2, isActive: true },
  { id: 'cat-haryana', name: 'Haryana', nameHi: 'हरियाणा', slug: 'haryana', description: 'हरियाणा के सभी जिलों की विशेष कवरेज', order: 3, isActive: true },
  { id: 'cat-punjab', name: 'Punjab', nameHi: 'पंजाब', slug: 'punjab', description: 'पंजाब और चंडीगढ़ की मुख्य हलचल', order: 4, isActive: true },
  { id: 'cat-delhi', name: 'Delhi NCR', nameHi: 'दिल्ली', slug: 'delhi', description: 'राजधानी दिल्ली और एनसीआर समाचार', order: 5, isActive: true },
  { id: 'cat-up', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश', slug: 'uttar-pradesh', description: 'उत्तर प्रदेश की प्रशासनिक व सियासी खबरें', order: 6, isActive: true },
  { id: 'cat-raj', name: 'Rajasthan', nameHi: 'राजस्थान', slug: 'rajasthan', description: 'राजस्थान की ताजा खबरें', order: 7, isActive: true },
  { id: 'cat-hp', name: 'Himachal Pradesh', nameHi: 'हिमाचल प्रदेश', slug: 'himachal-pradesh', description: 'पहाड़ों और पर्यटन राज्य की खबरें', order: 8, isActive: true },
  { id: 'cat-rajneeti', name: 'Politics', nameHi: 'राजनीति', slug: 'rajneeti', description: 'चुनावी समीकरण और राजनीतिक बहस', order: 9, isActive: true },
  { id: 'cat-apradh', name: 'Crime', nameHi: 'अपराध', slug: 'apradh', description: 'क्राइम रिपोर्ट और कानूनी खुलासे', order: 10, isActive: true },
  { id: 'cat-shiksha', name: 'Education', nameHi: 'शिक्षा', slug: 'shiksha', description: 'करियर, बोर्ड एग्जाम और परिणाम', order: 11, isActive: true },
  { id: 'cat-swasthya', name: 'Health', nameHi: 'स्वास्थ्य', slug: 'swasthya', description: 'हेल्थ टिप्स और मेडिकल रिसर्च', order: 12, isActive: true },
  { id: 'cat-vyapar', name: 'Business', nameHi: 'व्यापार', slug: 'vyapar', description: 'शेयर बाजार, बजट और व्यापारिक खबरें', order: 13, isActive: true },
  { id: 'cat-manoranjan', name: 'Entertainment', nameHi: 'मनोरंजन', slug: 'manoranjan', description: 'बॉलीवुड, ओटीटी और सिनेमा समीक्षा', order: 14, isActive: true },
  { id: 'cat-khel', name: 'Sports', nameHi: 'खेल', slug: 'khel', description: 'क्रिकेट, कुश्ती, हॉकी और ओलंपिक अपडेट', order: 15, isActive: true },
  { id: 'cat-tech', name: 'Technology', nameHi: 'टेक्नोलॉजी', slug: 'tech', description: 'स्मार्टफोन, एआई और टेक गैजेट्स', order: 16, isActive: true },
  { id: 'cat-dharm', name: 'Spirituality', nameHi: 'धर्म', slug: 'dharm', description: 'त्योहार, राशिफल और ज्योतिष', order: 17, isActive: true },
  { id: 'cat-mausam', name: 'Weather', nameHi: 'मौसम', slug: 'mausam', description: 'मौसम विभाग का पूर्वानुमान और बारिश अलर्ट', order: 18, isActive: true },
  { id: 'cat-viral', name: 'Viral', nameHi: 'वायरल', slug: 'viral', description: 'सोशल मीडिया पर ट्रेंडिंग और रोचक किस्से', order: 19, isActive: true },
  { id: 'cat-auto', name: 'Auto', nameHi: 'ऑटो', slug: 'auto', description: 'नई गाड़ियां, इलेक्ट्रिक व्हीकल और रिव्यू', order: 20, isActive: true },
  { id: 'cat-lifestyle', name: 'Lifestyle', nameHi: 'लाइफस्टाइल', slug: 'lifestyle', description: 'फैशन, खानपान और जीवनशैली', order: 21, isActive: true },
];

export const INITIAL_SUBCATEGORIES: Subcategory[] = [
  { id: 'sub-panipat', parentCategoryId: 'cat-haryana', name: 'Panipat', nameHi: 'पानीपत', slug: 'panipat', order: 1, isActive: true },
  { id: 'sub-karnal', parentCategoryId: 'cat-haryana', name: 'Karnal', nameHi: 'करनाल', slug: 'karnal', order: 2, isActive: true },
  { id: 'sub-sonipat', parentCategoryId: 'cat-haryana', name: 'Sonipat', nameHi: 'सोनीपत', slug: 'sonipat', order: 3, isActive: true },
  { id: 'sub-rohtak', parentCategoryId: 'cat-haryana', name: 'Rohtak', nameHi: 'रोहतक', slug: 'rohtak', order: 4, isActive: true },
  { id: 'sub-hisar', parentCategoryId: 'cat-haryana', name: 'Hisar', nameHi: 'हिसार', slug: 'hisar', order: 5, isActive: true },
  { id: 'sub-gurugram', parentCategoryId: 'cat-haryana', name: 'Gurugram', nameHi: 'गुरुग्राम', slug: 'gurugram', order: 6, isActive: true },
  { id: 'sub-faridabad', parentCategoryId: 'cat-haryana', name: 'Faridabad', nameHi: 'फरीदाबाद', slug: 'faridabad', order: 7, isActive: true },
  { id: 'sub-ambala', parentCategoryId: 'cat-haryana', name: 'Ambala', nameHi: 'अंबाला', slug: 'ambala', order: 8, isActive: true },
  { id: 'sub-kurukshetra', parentCategoryId: 'cat-haryana', name: 'Kurukshetra', nameHi: 'कुरुक्षेत्र', slug: 'kurukshetra', order: 9, isActive: true },
  { id: 'sub-bhiwani', parentCategoryId: 'cat-haryana', name: 'Bhiwani', nameHi: 'भिवानी', slug: 'bhiwani', order: 10, isActive: true },
];

export const INITIAL_AUTHORS: Author[] = [
  {
    id: 'auth-1',
    name: 'प्रदीप सैनी',
    email: 'saini.pardeep45@gmail.com',
    role: 'super_admin',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    designation: 'प्रधान संपादक (Editor-in-Chief)',
    bio: 'समाचार फर्स्ट के संस्थापक और वरिष्ठ पत्रकार। 15 वर्षों से राष्ट्रीय राजनीति और हरियाणा विशेष मामलों के विशेषज्ञ।',
    location: 'चंडीगढ़ / दिल्ली',
    socialLinks: { twitter: 'https://twitter.com', facebook: 'https://facebook.com' },
    isActive: true,
    articleCount: 42,
  },
  {
    id: 'auth-2',
    name: 'अमित भारद्वाज',
    email: 'amit.bhardwaj@samacharfirst.com',
    role: 'editor',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    designation: 'वरिष्ठ उप-संपादक',
    bio: 'राजनीतिक विश्लेषण, कानूनी मामलों और अपराध रिपोर्टिंग में 10 साल का अनुभव।',
    location: 'गुरुग्राम',
    socialLinks: { twitter: 'https://twitter.com' },
    isActive: true,
    articleCount: 28,
  },
  {
    id: 'auth-3',
    name: 'पूजा शर्मा',
    email: 'pooja.sharma@samacharfirst.com',
    role: 'reporter',
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    designation: 'विशेष संवाददाता (हरियाणा ब्यूरो)',
    bio: 'पानीपत और करनाल से ग्राउंड जीरो रिपोर्टिंग, सामाजिक मुद्दों और शिक्षा पर विशेष दृष्टि।',
    location: 'पानीपत, हरियाणा',
    socialLinks: { twitter: 'https://twitter.com', instagram: 'https://instagram.com' },
    isActive: true,
    articleCount: 35,
  },
];

export const INITIAL_BREAKING_NEWS: BreakingNews[] = [
  {
    id: 'brk-1',
    title: 'हरियाणा के 12 जिलों में मौसम विभाग का भारी बारिश का येलो अलर्ट जारी, किसानों को सतर्क रहने के निर्देश',
    url: '/news/haryana-mein-aaj-bhari-barish-ka-alert',
    priority: 'high',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'brk-2',
    title: 'संसद सत्र: बजट पर लोकसभा में गरमा-गरम बहस, वित्त मंत्री ने पेश किए विकास के नए आंकड़े',
    url: '/news/budget-par-lok-sabha-mein-charcha',
    priority: 'high',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'brk-3',
    title: 'भारतीय क्रिकेट टीम ने टी20 मुकाबले में रोमांचक जीत दर्ज की, आखिरी ओवर में पलटा मैच',
    url: '/news/bharat-ne-t20-mein-jeet-darj-ki',
    priority: 'medium',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'हरियाणा में मौसम का मिजाज बदला: पानीपत, करनाल और रोहतक सहित 12 जिलों में तेज बारिश का अलर्ट',
    slug: 'haryana-mein-aaj-bhari-barish-ka-alert',
    shortDescription: 'भारतीय मौसम विज्ञान विभाग (IMD) ने हरियाणा के उत्तरी और मध्य जिलों में अगले 48 घंटों के दौरान आंधी के साथ भारी वर्षा की चेतावनी जारी की है।',
    content: `<h2>उत्तर भारत में मानसून की सक्रियता बढ़ी</h2>
<p>हरियाणा और पंजाब में पश्चिमी विक्षोभ और मानसूनी हवाओं के संगम के चलते मौसम में अचानक बदलाव दर्ज किया गया है। मौसम विभाग (IMD) के चंडीगढ़ केंद्र ने ताजा बुलेटिन जारी कर बताया है कि पानीपत, करनाल, सोनीपत, कुरुक्षेत्र, अंबाला और रोहतक में तेज हवाओं (40-50 किमी/घंटा) के साथ भारी बारिश हो सकती है।</p>

<!-- YouTube Video Embed in Article -->
<div class="video-embed-container" data-embed-type="youtube" data-video-id="9Auq9mYxFEE">
  <div class="video-embed-wrapper">
    <iframe
      src="https://www.youtube-nocookie.com/embed/9Auq9mYxFEE?rel=0"
      title="मौसम विभाग की विशेष ग्राउंड रिपोर्ट"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
  <div class="embed-caption">🎥 <span>ग्राउंड रिपोर्ट: उत्तर भारत में भारी बारिश का अलर्ट व प्रशासनिक तैयारियां</span></div>
</div>

<blockquote>"किसानों को सलाह दी गई है कि वे कटी हुई फसलों और मंडियों में रखे अनाज को सुरक्षित स्थानों पर ढक कर रखें।" - मौसम विज्ञानी</blockquote>

<!-- Social Media Embed (X / Twitter) -->
<div class="social-embed-card twitter-embed" data-embed-type="twitter" data-url="https://x.com/Indiametdept">
  <div class="embed-header bg-slate-900 text-white flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="text-sky-400 font-bold">𝕏 / IMD Weather Alert</span>
      <span class="text-xs text-slate-400">@Indiametdept</span>
    </div>
    <a href="https://x.com" target="_blank" rel="noreferrer" class="text-[11px] text-sky-400 hover:underline">मूल पोस्ट देखें ↗</a>
  </div>
  <div class="embed-body p-4 bg-slate-50 text-slate-800 text-sm italic">
    "हरियाणा, पंजाब, दिल्ली-एनसीआर में अगले 48 घंटों में मध्यम से भारी बारिश का पूर्वानुमान जारी किया गया है। नागरिकों से सतर्क रहने का अनुरोध।"
  </div>
</div>

<h3>प्रमुख जिलों की स्थिति:</h3>
<ul>
  <li><strong>पानीपत:</strong> सुबह से बादल छाए हुए हैं, दोपहर बाद मूसलाधार बारिश का पूर्वानुमान।</li>
  <li><strong>करनाल:</strong> जीटी रोड बेल्ट पर जलभराव की आशंका को देखते हुए नगर निगम की टीमें अलर्ट मोड पर हैं।</li>
  <li><strong>गुरुग्राम व फरीदाबाद:</strong> शाम तक हल्की से मध्यम बारिश और तापमान में 4 डिग्री की गिरावट संभावित है।</li>
</ul>

<figure class="w-full my-4">
  <img src="https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&auto=format&fit=crop&q=80" alt="बारिश का दृश्य" class="rounded-lg shadow-sm w-full object-cover" />
  <figcaption class="text-xs text-slate-500 text-center mt-1.5">सड़कों पर जलभराव से यातायात प्रभावित (फोटो: विशेष संवाददाता)</figcaption>
</figure>

<p>प्रशासन ने नागरिकों से अपील की है कि वे आकाशीय बिजली चमकने के दौरान खुले मैदानों और पेड़ों के नीचे जाने से बचें। बिजली निगम ने हेल्पलाइन नंबर जारी कर दिए हैं ताकि फॉल्ट की सूचना तुरंत दर्ज कराई जा सके।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'हरियाणा में बादलों का डेरा, बारिश से मौसम हुआ सुहावना (फाइल फोटो)',
    imageCredit: 'समाचार फर्स्ट / विशेष फोटो',
    imageAlt: 'हरियाणा मौसम बारिश अलर्ट',
    gallery: [
      'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&auto=format&fit=crop&q=80'
    ],
    categoryId: 'cat-haryana',
    categoryName: 'हरियाणा',
    subcategoryId: 'sub-panipat',
    subcategoryName: 'पानीपत',
    authorId: 'auth-3',
    authorName: 'पूजा शर्मा',
    authorPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    authorRole: 'reporter',
    tags: ['हरियाणा', 'मौसम', 'बारिश अलर्ट', 'पानीपत', 'IMD'],
    location: 'पानीपत',
    language: 'hi',
    status: 'published',
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    isEditorsPick: true,
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    views: 4820,
    likes: 312,
    seoTitle: 'हरियाणा मौसम: 12 जिलों में भारी बारिश का अलर्ट | Samachar First',
    seoDescription: 'हरियाणा के पानीपत, करनाल, रोहतक में भारी बारिश का अलर्ट जारी। मौसम विभाग की ताजा चेतावनी और किसानों के लिए दिशा-निर्देश।',
    seoKeywords: ['Haryana Weather', 'Haryana rain alert', 'Panipat news', 'Samachar First'],
  },
  {
    id: 'art-2',
    title: 'संसद में राष्ट्रीय राजमार्ग और एक्सप्रेसवे नेटवर्क के विस्तार पर बड़ा ऐलान: दिल्ली-अमृतसर-कटरा एक्सप्रेसवे जल्द होगा तैयार',
    slug: 'delhi-amritsar-katra-expressway-update',
    shortDescription: 'केंद्रीय सड़क परिवहन मंत्रालय ने संसद में घोषणा की कि दिल्ली-अमृतसर-कटरा एक्सप्रेसवे का निर्माण कार्य अंतिम चरण में है और इस वर्ष के अंत तक इसे जनता के लिए खोल दिया जाएगा।',
    content: `<p>देश के राजमार्ग इंफ्रास्ट्रक्चर में एक और मील का पत्थर जुड़ने जा रहा है। संसद में पेश की गई रिपोर्ट के अनुसार, दिल्ली-अमृतसर-कटरा एक्सप्रेसवे परियोजना हरियाणा, पंजाब और जम्मू-कश्मीर के बीच यात्रा के समय को आधा कर देगी।</p>
<h3>परियोजना की प्रमुख विशेषताएं:</h3>
<ul>
  <li>दिल्ली से अमृतसर की दूरी मात्र 4 घंटे में पूरी होगी।</li>
  <li>दिल्ली से कटरा (माता वैष्णो देवी) केवल 6 घंटे में पहुंचा जा सकेगा।</li>
  <li>हरियाणा के सोनीपत, जींद और कैथल जिलों को सीधा औद्योगिक लाभ मिलेगा।</li>
</ul>
<p>सड़क परिवहन मंत्री ने कहा कि ग्रीनफील्ड अलाइनमेंट से प्रदूषण कम होगा और लॉजिस्टिक्स लागत में भारी कमी आएगी। इसके साथ ही एक्सप्रेसवे के दोनों ओर फूड प्लाजा, ईवी चार्जिंग स्टेशन और ट्रॉमा सेंटर बनाए जा रहे हैं।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'एक्सप्रेसवे निर्माण कार्य तीव्र गति से जारी (प्रतीकात्मक चित्र)',
    imageCredit: 'NHAI / PIB',
    categoryId: 'cat-desh',
    categoryName: 'देश',
    authorId: 'auth-1',
    authorName: 'प्रदीप सैनी',
    tags: ['एक्सप्रेसवे', 'दिल्ली', 'कटरा', 'इंफ्रास्ट्रक्चर', 'संसद'],
    location: 'नई दिल्ली',
    language: 'hi',
    status: 'published',
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    isEditorsPick: true,
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    views: 3450,
    likes: 195,
  },
  {
    id: 'art-3',
    title: 'हरियाणा सरकार का युवाओं के लिए बड़ा फैसला: कौशल विकास और आईटी सेक्टर में 50,000 नई नौकरियों की योजना',
    slug: 'haryana-govt-50k-jobs-announcement',
    shortDescription: 'हरियाणा मंत्रिमंडल की बैठक में युवाओं के रोजगार सृजन के लिए नई नीति को मंजूरी दी गई है। गुरुग्राम, फरीदाबाद और पंचकूला में नए टेक हब बनेंगे।',
    content: `<p>चंडीगढ़ में आयोजित प्रेस वार्ता में मुख्यमंत्री ने घोषणा की कि राज्य के शिक्षित युवाओं को रोजगार और स्वरोजगार से जोड़ने के लिए मिशन मोड में कार्य शुरू किया जा रहा है।</p>
<p>कौशल विकास मिशन के तहत स्थानीय आईटीआई और पॉलिटेक्निक संस्थानों को आधुनिक तकनीक जैसे आर्टिफिशियल इंटेलिजेंस, रोबोटिक्स और डेटा साइंस से लैस किया जाएगा।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'युवाओं के लिए रोजगार अवसरों में बढ़ोतरी होगी',
    categoryId: 'cat-rajneeti',
    categoryName: 'राजनीति',
    authorId: 'auth-2',
    authorName: 'अमित भारद्वाज',
    tags: ['हरियाणा सरकार', 'रोजगार', 'युवा', 'कौशल विकास'],
    location: 'चंडीगढ़',
    language: 'hi',
    status: 'published',
    isBreaking: false,
    isFeatured: true,
    isTrending: false,
    isEditorsPick: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    views: 2900,
    likes: 142,
  },
  {
    id: 'art-4',
    title: 'साइबर ठगी से सावधान: करनाल पुलिस ने अंतरराज्यीय गिरोह का पर्दाफाश किया, 5 शातिर गिरफ्तार',
    slug: 'karnal-police-cyber-crime-gang-busted',
    shortDescription: 'करनाल पुलिस की साइबर सेल ने ऑनलाइन लॉटरी और बैंक केवाईसी के नाम पर करोड़ों रुपये की ठगी करने वाले गिरोह को धर दबोचा।',
    content: `<p>करनाल पुलिस अधीक्षक ने बताया कि आरोपियों के पास से 25 स्मार्टफोन, 100 से अधिक फर्जी सिम कार्ड और कई बैंक पासबुक बरामद किए गए हैं। जनता से अपील की गई है कि किसी भी अज्ञात लिंक पर क्लिक न करें और ओटीपी साझा न करें।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'साइबर क्राइम सेल की त्वरित कार्रवाई',
    categoryId: 'cat-apradh',
    categoryName: 'अपराध',
    subcategoryId: 'sub-karnal',
    subcategoryName: 'करनाल',
    authorId: 'auth-3',
    authorName: 'पूजा शर्मा',
    tags: ['क्राइम', 'साइबर अपराध', 'करनाल पुलिस', 'अलर्ट'],
    location: 'करनाल',
    language: 'hi',
    status: 'published',
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    isEditorsPick: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    views: 2150,
    likes: 88,
  },
  {
    id: 'art-5',
    title: 'शेयर बाजार में नया रिकॉर्ड: सेंसेक्स 82,000 के पार, ऑटो और बैंकिंग शेयरों में जबरदस्त उछाल',
    slug: 'share-bazaar-sensex-record-high',
    shortDescription: 'भारतीय शेयर बाजार में विदेशी संस्थागत निवेशकों की भारी लिवाली के चलते दोनों प्रमुख सूचकांक रिकॉर्ड ऊंचाई पर बंद हुए।',
    content: `<p>बॉम्बे स्टॉक एक्सचेंज (BSE) का सेंसेक्स 650 अंक चढ़कर नए सर्वकालिक उच्च स्तर पर बंद हुआ। नेशनल स्टॉक एक्सचेंज (NSE) का निफ्टी भी 25,000 के मनोवैज्ञानिक स्तर को पार कर गया। विश्लेषकों का मानना है कि मजबूत आर्थिक वृद्धि और तिमाही नतीजों के दम पर रैली जारी रह सकती है।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'दलाल स्ट्रीट में तेजी का माहौल',
    categoryId: 'cat-vyapar',
    categoryName: 'व्यापार',
    authorId: 'auth-1',
    authorName: 'प्रदीप सैनी',
    tags: ['शेयर बाजार', 'सेंसेक्स', 'निफ्टी', 'व्यापार'],
    location: 'मुंबई',
    language: 'hi',
    status: 'published',
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    isEditorsPick: true,
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    views: 1890,
    likes: 96,
  },
  {
    id: 'art-6',
    title: 'क्रिकेट: एशिया कप और टी20 विश्वकप के लिए भारतीय टीम का ऐलान, युवा खिलाड़ियों को मिला बड़ा मौका',
    slug: 'indian-cricket-team-selection-announcement',
    shortDescription: 'बीसीसीआई की चयन समिति ने आगामी अंतरराष्ट्रीय श्रृंखला के लिए 15 सदस्यीय भारतीय दल की घोषणा की।',
    content: `<p>चयन समिति ने घरेलू टूर्नामेंट और आईपीएल में लगातार शानदार प्रदर्शन करने वाले युवा प्रतिभाओं को टीम में शामिल किया है। मुख्य कोच ने कहा कि टीम संतुलन और फील्डिंग मानकों पर विशेष जोर दिया गया है।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1531415074868-036b1c5f53ec?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'मैदान पर प्रैक्टिस करते भारतीय खिलाड़ी',
    categoryId: 'cat-khel',
    categoryName: 'खेल',
    authorId: 'auth-2',
    authorName: 'अमित भारद्वाज',
    tags: ['क्रिकेट', 'टीम इंडिया', 'BCCI', 'खेल'],
    location: 'मुंबई',
    language: 'hi',
    status: 'published',
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    isEditorsPick: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    views: 4120,
    likes: 380,
  },
  {
    id: 'art-7',
    title: 'बॉलीवुड की नई एक्शन थ्रिलर का टीजर रिलीज: सोशल मीडिया पर फैंस का जबरदस्त रिस्पॉन्स',
    slug: 'bollywood-new-action-thriller-teaser',
    shortDescription: 'हाई ऑक्टेन एक्शन और सस्पेंस से भरपूर इस फिल्म का निर्देशन मशहूर निर्देशक ने किया है।',
    content: `<p>सिनेमा प्रेमियों के लिए बड़ी खबर! आगामी ब्लॉकबस्टर का 2 मिनट लंबा टीजर जारी किया गया, जिसमें इंटरनेशनल लेवल के स्टंट्स और दमदार डायलॉग्स हैं। फिल्म इसी साल दिवाली के मौके पर सिनेमाघरों में रिलीज होगी।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'सिनेमाघरों में दर्शकों की भारी भीड़ की उम्मीद',
    categoryId: 'cat-manoranjan',
    categoryName: 'मनोरंजन',
    authorId: 'auth-3',
    authorName: 'पूजा शर्मा',
    tags: ['बॉलीवुड', 'सिनेमा', 'टीजर', 'मनोरंजन'],
    location: 'मुंबई',
    language: 'hi',
    status: 'published',
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    isEditorsPick: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    views: 3100,
    likes: 240,
  },
  {
    id: 'art-8',
    title: 'आर्टिफिशियल इंटेलिजेंस (AI) का नया क्रांतिकारी टूल लॉन्च: अब हिंदी और भारतीय भाषाओं में चुटकियों में होंगे जटिल काम',
    slug: 'new-ai-tool-launched-indian-languages',
    shortDescription: 'भारतीय प्रौद्योगिकी संस्थानों और टेक विशेषज्ञों द्वारा विकसित नया एआई मॉडल स्थानीय भाषाओं में सटीक अनुवाद और कंटेंट निर्माण में सक्षम।',
    content: `<p>टेक्नोलॉजी की दुनिया में भारत ने एक और बड़ी छलांग लगाई है। नया भाषा मॉडल विशेष रूप से हिंदी, हरियाणवी, पंजाबी और अन्य क्षेत्रीय बोलियों की बारीकियों को समझने के लिए डिजाइन किया गया है।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'एआई और डिजिटल क्रांति का नया युग',
    categoryId: 'cat-tech',
    categoryName: 'टेक्नोलॉजी',
    authorId: 'auth-1',
    authorName: 'प्रदीप सैनी',
    tags: ['एआई', 'टेक्नोलॉजी', 'डिजिटल इंडिया', 'स्मार्टफोन'],
    location: 'बेंगलुरु',
    language: 'hi',
    status: 'published',
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    isEditorsPick: true,
    publishedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    views: 2200,
    likes: 165,
  }
];

export const INITIAL_VIDEOS: VideoNews[] = [
  {
    id: 'vid-1',
    title: 'ग्राउंड रिपोर्ट: पानीपत में भारी बारिश के बाद जीटी रोड पर हालात का जायजा',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&auto=format&fit=crop&q=80',
    description: 'पानीपत से समाचार फर्स्ट की ग्राउंड जीरो रिपोर्ट। देखिए प्रशासन की क्या हैं तैयारियां।',
    categoryId: 'cat-haryana',
    categoryName: 'हरियाणा',
    authorName: 'पूजा शर्मा',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    views: 6400,
    duration: '04:15',
  },
  {
    id: 'vid-2',
    title: 'विशेष चर्चा: दिल्ली-अमृतसर-कटरा एक्सप्रेसवे से कितना बदलेगा उत्तर भारत का कारोबार?',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
    description: 'अर्थशास्त्रियों और उद्योगपतियों के साथ समाचार फर्स्ट का विशेष विश्लेषण।',
    categoryId: 'cat-desh',
    categoryName: 'देश',
    authorName: 'प्रदीप सैनी',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    views: 4200,
    duration: '08:30',
  },
  {
    id: 'vid-3',
    title: 'साइबर ठगी के नए तरीकों से कैसे बचें: एसपी करनाल का जनता को सीधा संदेश',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    description: 'जानिए साइबर फ्रॉड से बचने के 5 सबसे जरूरी उपाय।',
    categoryId: 'cat-apradh',
    categoryName: 'अपराध',
    authorName: 'अमित भारद्वाज',
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    views: 3150,
    duration: '05:45',
  },
];

export const INITIAL_ADVERTISEMENTS: Advertisement[] = [
  {
    id: 'ad-header',
    title: 'शीर्ष हेडर विज्ञापन (728x90 Banner)',
    position: 'header',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'https://samacharfirst.com',
    isActive: true,
    impressions: 12500,
    clicks: 430,
  },
  {
    id: 'ad-sidebar',
    title: 'साइडबार विशेष विज्ञापन (300x250 Medium Rectangle)',
    position: 'sidebar',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    targetUrl: 'https://samacharfirst.com',
    isActive: true,
    impressions: 8900,
    clicks: 215,
  },
  {
    id: 'ad-homepage-middle',
    title: 'होमपेज मध्य विज्ञापन (Leaderboard)',
    position: 'homepage_middle',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'https://samacharfirst.com',
    isActive: true,
    impressions: 6400,
    clicks: 180,
  },
  {
    id: 'ad-article-bottom',
    title: 'आर्टिकल अंत विज्ञापन',
    position: 'article_bottom',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    targetUrl: 'https://samacharfirst.com',
    isActive: true,
    impressions: 5100,
    clicks: 140,
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  websiteName: 'Samachar First',
  tagline: 'आपकी खबर, सबसे पहले',
  logo: '/logo.svg',
  contactEmail: 'contact@samacharfirst.com',
  phone: '+91 98765 43210',
  address: 'प्रेस एवेन्यू, सेक्टर 17, चंडीगढ़ / नई दिल्ली, भारत - 160017',
  socialLinks: {
    facebook: 'https://facebook.com/samacharfirst',
    twitter: 'https://twitter.com/samacharfirst',
    youtube: 'https://youtube.com/@samacharfirst',
    instagram: 'https://instagram.com/samacharfirst',
    whatsapp: 'https://whatsapp.com/channel/samacharfirst',
    telegram: 'https://t.me/samacharfirst',
  },
  googleAnalyticsId: 'G-SAMACHAR1ST',
  facebookPixelId: 'FB-987654321',
  defaultSeoTitle: 'Samachar First - आपकी खबर, सबसे पहले | Hindi News Portal',
  defaultSeoDesc: 'समाचार फर्स्ट पर पढ़ें देश, दुनिया, हरियाणा, पंजाब, राजनीति, अपराध, खेल, मनोरंजन और व्यापार की सबसे तेज और निष्पक्ष खबरें।',
  defaultSeoImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
  copyrightText: '© 2026 Samachar First. सर्वाधिकार सुरक्षित (All Rights Reserved).',
  breakingNewsSpeed: 6,
  commentsEnabled: true,
  maintenanceMode: false,
  language: 'hi',
};

export const INITIAL_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { id: 'sec-hero', title: 'Top Headlines', titleHi: 'प्रमुख समाचार', type: 'hero', limit: 5, order: 1, isEnabled: true },
  { id: 'sec-haryana', title: 'Haryana District Special', titleHi: 'हरियाणा हलचल (जिला विशेष)', type: 'haryana_district', categoryId: 'cat-haryana', limit: 6, order: 2, isEnabled: true },
  { id: 'sec-politics', title: 'Politics & Crime', titleHi: 'सियासत और अपराध', type: 'politics_crime', limit: 4, order: 3, isEnabled: true },
  { id: 'sec-videos', title: 'Video News', titleHi: 'वीडियो बुलेटिन', type: 'videos', limit: 3, order: 4, isEnabled: true },
  { id: 'sec-states', title: 'States News', titleHi: 'राज्यों की खबरें', type: 'state_tabs', limit: 4, order: 5, isEnabled: true },
  { id: 'sec-business-sports', title: 'Business & Sports', titleHi: 'कारोबार और खेल जगत', type: 'business_sports', limit: 4, order: 6, isEnabled: true },
  { id: 'sec-trending', title: 'Trending Top 10', titleHi: 'वायरल और ट्रेंडिंग', type: 'trending', limit: 6, order: 7, isEnabled: true },
  { id: 'sec-newsletter', title: 'Newsletter', titleHi: 'समाचार फर्स्ट ई-बुलेटिन', type: 'newsletter', limit: 1, order: 8, isEnabled: true },
];
