import React, { useState } from 'react';
import { VideoNews } from '../../types';
import { Video, Plus, Trash2, Edit2, Play, X, Eye, Clock } from 'lucide-react';

interface VideoManagerProps {
  videos: VideoNews[];
  onAddVideo: (vid: Omit<VideoNews, 'id' | 'views'>) => Promise<void>;
  onDeleteVideo: (id: string) => Promise<void>;
}

export const VideoManager: React.FC<VideoManagerProps> = ({ videos, onAddVideo, onDeleteVideo }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [categoryName, setCategoryName] = useState('हरियाणा बुलेटिन');
  const [duration, setDuration] = useState('04:15');
  const [description, setDescription] = useState('');

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeUrl) return;

    const videoId = extractVideoId(youtubeUrl);
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    await onAddVideo({
      title: title.trim(),
      videoId,
      youtubeUrl: youtubeUrl.trim(),
      thumbnail,
      duration: duration.trim() || '03:30',
      categoryName: categoryName.trim(),
      description: description.trim() || undefined,
      publishedAt: new Date().toISOString(),
      isFeatured: false,
    });

    setIsAdding(false);
    setTitle('');
    setYoutubeUrl('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-xl text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-sky-500" />
            वीडियो बुलेटिन प्रबंधन (Video News Hub)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            यूट्यूब लाइव स्ट्रीम्स, ग्राउंड वीडियो रिपोर्ट और बुलेटिन्स का प्रबंधन
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            नया वीडियो जोड़ें
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-bold text-sm text-white">नया वीडियो समाचार जोड़ें</h2>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">वीडियो शीर्षक (Title)*</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा: पानीपत टेक्सटाइल पार्क में हुआ बड़ा हादसा, लाइव ग्राउंड रिपोर्ट..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">YouTube URL या Video ID*</label>
              <input
                type="text"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">श्रेणी (Category)</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="हरियाणा / राष्ट्रीय / राजनीति"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">अवधि (Duration)</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="05:20"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">विवरण (Description)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="वीडियो के मुख्य बिंदु..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded text-xs text-slate-400"
            >
              रद्द करें
            </button>
            <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-1.5 rounded text-xs">
              वीडियो प्रकाशित करें
            </button>
          </div>
        </form>
      )}

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="aspect-16/9 bg-black relative">
              <img src={vid.thumbnail} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
              {vid.duration && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] text-white px-2 py-0.5 rounded font-mono">
                  {vid.duration}
                </div>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase mb-1 block">
                  {vid.categoryName}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-2 mb-2">{vid.title}</h3>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                <span>{vid.views.toLocaleString()} दृश्य</span>
                <button
                  onClick={() => {
                    if (confirm('क्या आप इस वीडियो को हटाना चाहते हैं?')) {
                      onDeleteVideo(vid.id);
                    }
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-rose-400"
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
