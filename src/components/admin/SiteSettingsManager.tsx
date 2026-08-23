import React, { useState } from 'react';
import { SiteSettings } from '../../types';
import { Settings, Save, CheckCircle, Mail, Phone, MapPin, Share2 } from 'lucide-react';

interface SiteSettingsManagerProps {
  siteSettings: SiteSettings;
  onSave: (settings: SiteSettings) => Promise<void>;
}

export const SiteSettingsManager: React.FC<SiteSettingsManagerProps> = ({ siteSettings, onSave }) => {
  const [websiteName, setWebsiteName] = useState(siteSettings.websiteName);
  const [tagline, setTagline] = useState(siteSettings.tagline);
  const [contactEmail, setContactEmail] = useState(siteSettings.contactEmail);
  const [phone, setPhone] = useState(siteSettings.phone);
  const [address, setAddress] = useState(siteSettings.address);
  const [copyrightText, setCopyrightText] = useState(siteSettings.copyrightText);

  // Socials
  const [facebook, setFacebook] = useState(siteSettings.socialLinks.facebook || '');
  const [twitter, setTwitter] = useState(siteSettings.socialLinks.twitter || '');
  const [youtube, setYoutube] = useState(siteSettings.socialLinks.youtube || '');
  const [instagram, setInstagram] = useState(siteSettings.socialLinks.instagram || '');
  const [telegram, setTelegram] = useState(siteSettings.socialLinks.telegram || '');
  const [whatsapp, setWhatsapp] = useState(siteSettings.socialLinks.whatsapp || '');

  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      websiteName: websiteName.trim(),
      tagline: tagline.trim(),
      contactEmail: contactEmail.trim(),
      phone: phone.trim(),
      address: address.trim(),
      copyrightText: copyrightText.trim(),
      socialLinks: {
        facebook: facebook.trim(),
        twitter: twitter.trim(),
        youtube: youtube.trim(),
        instagram: instagram.trim(),
        telegram: telegram.trim(),
        whatsapp: whatsapp.trim(),
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-xl text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-500" />
            वेबसाइट सेटिंग्स एवं ब्रांडिंग (Site Settings)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            वेबसाइट का नाम, टैगलाइन, संपर्क विवरण और सोशल मीडिया प्रोफाइल्स का प्रबंधन
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Contact */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-white border-b border-slate-800 pb-3">
            ब्रांड पहचान व पता (Brand Identity)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">वेबसाइट का नाम (Portal Name)*</label>
              <input
                type="text"
                required
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs font-serif font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">टैगलाइन (Tagline / Slogan)*</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs font-bold text-red-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">संपादकीय ईमेल (Contact Email)*</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">फोन नंबर (Phone Number)*</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">प्रधान कार्यालय का पता (Registered Address)*</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">कॉपीराइट पाठ (Copyright Text)</label>
            <input
              type="text"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-sky-400" />
            सोशल मीडिया प्रोफाइल्स (Social Media Channels)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Facebook Page URL</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Twitter / X Profile URL</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">YouTube Channel URL</label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Instagram Handle URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp Channel Link</label>
              <input
                type="url"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Telegram Channel Link</label>
              <input
                type="url"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          {saved && (
            <div className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              वेबसाइट सेटिंग्स सफलतापूर्वक सुरक्षित की गईं!
            </div>
          )}
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md ml-auto transition-colors"
          >
            <Save className="w-4 h-4" />
            सेटिंग्स सहेजें
          </button>
        </div>
      </form>
    </div>
  );
};
