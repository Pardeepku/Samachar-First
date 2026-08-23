import React, { useState } from 'react';
import { Author } from '../../types';
import { Users, Plus, Edit2, Trash2, MapPin, Mail, UserCheck, X, Save } from 'lucide-react';
import { generateSlug } from '../../utils/slugify';

interface AuthorManagerProps {
  authors: Author[];
  onAddAuthor: (author: Omit<Author, 'id'>) => Promise<void>;
  onUpdateAuthor: (id: string, author: Partial<Author>) => Promise<void>;
  onDeleteAuthor: (id: string) => Promise<void>;
}

export const AuthorManager: React.FC<AuthorManagerProps> = ({
  authors,
  onAddAuthor,
  onUpdateAuthor,
  onDeleteAuthor,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      await onUpdateAuthor(editingId, {
        name: name.trim(),
        designation: designation.trim(),
        email: email.trim() || undefined,
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        photo: photo.trim() || undefined,
      });
      setEditingId(null);
    } else {
      await onAddAuthor({
        name: name.trim(),
        slug: generateSlug(name.trim()),
        designation: designation.trim() || 'संवाददाता',
        email: email.trim() || undefined,
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        photo: photo.trim() || undefined,
        isActive: true,
      });
      setIsAdding(false);
    }

    setName('');
    setDesignation('');
    setEmail('');
    setBio('');
    setLocation('');
    setPhoto('');
  };

  const startEdit = (author: Author) => {
    setEditingId(author.id);
    setName(author.name);
    setDesignation(author.designation || '');
    setEmail(author.email || '');
    setBio(author.bio || '');
    setLocation(author.location || '');
    setPhoto(author.photo || author.photoURL || '');
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-xl text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            संपादकीय टीम एवं रिपोर्टर प्रबंधन (Authors & Reporters)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            ब्यूरो चीफ, वरिष्ठ संपादक और जिला संवाददाताओं की प्रोफाइल डायरेक्टरी
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => {
              setEditingId(null);
              setIsAdding(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            नया रिपोर्टर जोड़ें
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-bold text-sm text-white">
              {editingId ? 'रिपोर्टर प्रोफाइल संपादित करें' : 'नया संवाददाता दर्ज करें'}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">नाम (Full Name)*</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा: प्रदीप सैनी"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">पद / दायित्व (Designation)*</label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="प्रधान संपादक / जिला संवाददाता"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">स्थान / जिला (Location)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="चंडीगढ़ / पानीपत / नई दिल्ली"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">ईमेल (Email)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reporter@samacharfirst.com"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">फोटो URL (Photo URL)</label>
              <input
                type="url"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">जीवनी / परिचय (Bio)</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="पत्रकारिता का अनुभव और विशेषज्ञता..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-3 py-1.5 rounded text-xs text-slate-400"
            >
              रद्द करें
            </button>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded text-xs">
              प्रोफाइल सहेजें
            </button>
          </div>
        </form>
      )}

      {/* Authors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {authors.map((auth) => (
          <div
            key={auth.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={auth.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={auth.name}
                  className="w-14 h-14 rounded-full object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm truncate">{auth.name}</h3>
                  <div className="text-[11px] text-emerald-400 font-medium">{auth.designation}</div>
                  {auth.location && (
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-500" />
                      {auth.location}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{auth.bio}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500">{auth.email}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(auth)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`क्या आप ${auth.name} को हटाना चाहते हैं?`)) {
                      onDeleteAuthor(auth.id);
                    }
                  }}
                  className="p-1.5 rounded bg-slate-800 hover:bg-rose-950 text-rose-400"
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
