import React, { useState } from 'react';
import { EPaperEdition } from '../../types';
import { Newspaper, Plus, Trash2, Calendar, FileText, X, Save } from 'lucide-react';

interface EPaperManagerProps {
  editions: EPaperEdition[];
  onAddEdition: (edition: Omit<EPaperEdition, 'id'>) => Promise<void>;
  onDeleteEdition: (id: string) => Promise<void>;
}

export const EPaperManager: React.FC<EPaperManagerProps> = ({ editions, onAddEdition, onDeleteEdition }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editionName, setEditionName] = useState('हरियाणा-चंडीगढ़ मुख्य संस्करण');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalPages, setTotalPages] = useState(8);
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80'
  );
  const [pdfUrl, setPdfUrl] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editionName || !date) return;

    await onAddEdition({
      editionName: editionName.trim(),
      date,
      totalPages: Number(totalPages),
      thumbnailUrl: thumbnailUrl.trim(),
      pdfUrl: pdfUrl.trim() || undefined,
      pages: [
        thumbnailUrl.trim(),
        'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
      ],
      createdAt: new Date().toISOString(),
    });

    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-xl text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-amber-500" />
            दैनिक ई-पेपर प्रबंधन (E-Paper Manager)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            डिजिटल समाचार पत्र के दैनिक संस्करणों व PDF प्रतियों का अपलोड और प्रबंधन
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            नया संस्करण जोड़ें
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-bold text-sm text-white">नया ई-पेपर संस्करण अपलोड करें</h2>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">संस्करण का नाम (Edition)*</label>
              <input
                type="text"
                required
                value={editionName}
                onChange={(e) => setEditionName(e.target.value)}
                placeholder="हरियाणा-पानीपत संस्करण"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">दिनांक (Date)*</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">कुल पृष्ठ संख्या (Pages)</label>
              <input
                type="number"
                value={totalPages}
                onChange={(e) => setTotalPages(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">कवर पेज छवि (Cover Image URL)*</label>
              <input
                type="url"
                required
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">PDF फ़ाइल लिंक (Download PDF URL)</label>
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://example.com/epaper-today.pdf"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded text-xs text-slate-400"
            >
              रद्द करें
            </button>
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded text-xs">
              ई-पेपर प्रकाशित करें
            </button>
          </div>
        </form>
      )}

      {/* Editions List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {editions.map((ed) => (
          <div
            key={ed.id}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="aspect-4/3 bg-slate-950 relative overflow-hidden">
              <img src={ed.thumbnailUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-slate-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                {ed.totalPages} पृष्ठ (Pages)
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-white mb-1">{ed.editionName}</h3>
                <div className="text-xs text-slate-400 font-mono">📅 {ed.date}</div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800 text-xs">
                <span className="text-[11px] text-emerald-400">सक्रिय संस्करण</span>
                <button
                  onClick={() => {
                    if (confirm('क्या आप इस संस्करण को हटाना चाहते हैं?')) {
                      onDeleteEdition(ed.id);
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
