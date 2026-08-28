import React, { useState } from 'react';
import {
  X,
  Plus,
  Building2,
  FileText,
  Radio,
  Swords,
  Upload,
  Link2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { BrandProfile } from '../types';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBrand: (brand: BrandProfile) => void;
  onAddStreamSource: (sourceName: string, category: string) => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
  onAddBrand,
  onAddStreamSource
}) => {
  const [sourceType, setSourceType] = useState<'brand' | 'stream' | 'guideline' | 'competitor'>('brand');

  // Brand form state
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [voice, setVoice] = useState('');
  const [tagline, setTagline] = useState('');
  const [audience, setAudience] = useState('');

  // Stream state
  const [streamUrl, setStreamUrl] = useState('');
  const [streamCategory, setStreamCategory] = useState('TikTok Audio Trends');

  if (!isOpen) return null;

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    const newBrand: BrandProfile = {
      id: `brand-${Date.now()}`,
      name: brandName,
      industry: industry || 'Lagos Luxury Fashion & Streetwear',
      tagline: tagline || 'Contemporary African heritage tailored for global tastemakers.',
      voice: voice || 'Poised, culturally vibrant, with authentic Lagos swagger.',
      toneKeywords: ['Lagos Luxury', 'Culturally Attuned', 'Engaging', 'Eko Swagger'],
      primaryAudience: audience || 'Ages 20-38 Lagos & Global Diaspora Tastemakers',
      secondaryAudience: 'West African & Diaspora Creative Executives',
      geographicMarket: 'Lagos (Victoria Island, Ikoyi, Lekki), Abuja, London Diaspora',
      prohibitedContent: [
        'Unverified sensationalist gossip',
        'Misleading promotional discounts',
        'Partisan political controversies'
      ],
      historicalPerformance: {
        totalCampaignsEvaluated: 16,
        topFormat: 'Short-Form Video (9:16) with Cultural Audio Sync',
        avgEngagement: '+38.4%',
        primaryObjection: 'Exclusivity verification & delivery timelines',
        modelCalibrationAccuracy: 92
      }
    };

    onAddBrand(newBrand);
    onClose();
  };

  const handleAddStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamUrl.trim()) return;
    onAddStreamSource(streamUrl, streamCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6">
      <div className="bg-[#1e1f20] border border-[#3c4043] rounded-3xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden text-gray-200 select-none">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-[#2d2f31] flex items-center justify-between bg-[#242527] transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Add Source to Social Brain</h2>
              <p className="text-[11px] text-gray-400">Expand TaskAssit’s knowledge, brand guidelines, or listening streams</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Type Selector */}
        <div className="grid grid-cols-3 border-b border-[#2d2f31] bg-[#171819] text-xs font-medium text-gray-400">
          <button
            onClick={() => setSourceType('brand')}
            className={`py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              sourceType === 'brand'
                ? 'text-blue-400 border-blue-500 bg-[#1e1f20]'
                : 'border-transparent hover:text-gray-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>New Brand</span>
          </button>

          <button
            onClick={() => setSourceType('guideline')}
            className={`py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              sourceType === 'guideline'
                ? 'text-blue-400 border-blue-500 bg-[#1e1f20]'
                : 'border-transparent hover:text-gray-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Guidelines</span>
          </button>

          <button
            onClick={() => setSourceType('stream')}
            className={`py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              sourceType === 'stream'
                ? 'text-blue-400 border-blue-500 bg-[#1e1f20]'
                : 'border-transparent hover:text-gray-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Stream Link</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-3.5 sm:p-5 md:p-6">
          {sourceType === 'brand' && (
            <form onSubmit={handleCreateBrand} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LuxeAura Lagos, Eko Artisan Collective, Alara Gourmet"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos Luxury Fashion, Fintech, Hospitality"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium">Tagline / Mission</label>
                  <input
                    type="text"
                    placeholder="e.g. African heritage tailored for global tastemakers"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">Brand Voice & Tone</label>
                <input
                  type="text"
                  placeholder="e.g. Poised, culturally attuned, with authentic Lagos swagger"
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full px-3 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">Primary Audience</label>
                <input
                  type="text"
                  placeholder="e.g. Ages 22-38 Lagos & Diaspora Tastemakers"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#282a2c] hover:bg-[#333538] text-xs text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Brand Profile</span>
                </button>
              </div>
            </form>
          )}

          {sourceType === 'guideline' && (
            <div className="space-y-4 text-center py-6">
              <div className="border-2 border-dashed border-[#3c4043] rounded-2xl p-8 bg-[#242527] space-y-3 hover:border-blue-500 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-200">
                    Upload Brand Guidelines Document (PDF, DOCX, TXT)
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Drag and drop your tone guide, forbidden word list, or catalog
                  </p>
                </div>
                <button className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white">
                  Browse Files
                </button>
              </div>
            </div>
          )}

          {sourceType === 'stream' && (
            <form onSubmit={handleAddStream} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">Social Stream / Audio Link</label>
                <input
                  type="text"
                  required
                  placeholder="https://tiktok.com/@trend/audio/..."
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">Signal Category</label>
                <select
                  value={streamCategory}
                  onChange={(e) => setStreamCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="TikTok Audio Trends">TikTok Audio Trends</option>
                  <option value="Instagram Aesthetic Movements">Instagram Aesthetic Movements</option>
                  <option value="X Pop Culture Discourse">X Pop Culture Discourse</option>
                  <option value="Competitor Account Watch">Competitor Account Watch</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#282a2c] hover:bg-[#333538] text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Connect Stream</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
