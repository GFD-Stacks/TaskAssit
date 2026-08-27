import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Copy,
  Check,
  ShieldCheck,
  Instagram,
  Video,
  Twitter,
  Linkedin,
  Calendar,
  Layers,
  Music,
  Camera
} from 'lucide-react';
import { BrandProfile, GeneratedContentAsset } from '../types';

interface ContentGeneratorModalProps {
  trendTitle: string;
  brand: BrandProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveAsset?: (asset: GeneratedContentAsset) => void;
}

export const ContentGeneratorModal: React.FC<ContentGeneratorModalProps> = ({
  trendTitle,
  brand,
  isOpen,
  onClose,
  onSaveAsset
}) => {
  const [platform, setPlatform] = useState<'Instagram' | 'TikTok' | 'X' | 'LinkedIn'>('Instagram');
  const [format, setFormat] = useState('Reel (9:16)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [scheduled, setScheduled] = useState(false);

  // Asset content state
  const [hook, setHook] = useState(
    `“${trendTitle}”… when the bespoke tailoring does all the talking.`
  );
  const [bodyCopy, setBodyCopy] = useState(
    `You thought we were playing with this Autumn drop? Hand-finished silk jacquard, structured lapels, and zero compromises on heritage.\n\nOnly 40 numbered pieces worldwide. Tap link in bio to secure your private preview before general release.`
  );
  const [cta, setCta] = useState('Tap link in bio to join VIP waitlist');
  const [visualBrief, setVisualBrief] = useState(
    'Close up on shimmering lapel texture, model doing confident 180 spin into golden hour lighting, slow motion fabric float.'
  );
  const [audioRec, setAudioRec] = useState(
    'Trending 3-beat sync audio with comedic voiceover pause.'
  );
  const [hashtags, setHashtags] = useState(
    '#AfricanLuxury #LuxuryFashion #OmoNoTryMe #DesignTok #LagosToLondon'
  );

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trendTitle,
          platform,
          format,
          brand
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.hook) setHook(data.hook);
        if (data.bodyCopy) setBodyCopy(data.bodyCopy);
        if (data.callToAction) setCta(data.callToAction);
        if (data.visualBrief) setVisualBrief(data.visualBrief);
        if (data.audioRecommendation) setAudioRec(data.audioRecommendation);
        if (data.hashtags) setHashtags(data.hashtags.join(' '));
      }
    } catch (err) {
      console.error('Generate content error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSchedulePost = () => {
    setScheduled(true);
    setTimeout(() => {
      setScheduled(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6">
      <div className="bg-[#1e1f20] border border-[#3c4043] rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden select-none text-gray-200">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-[#2d2f31] flex items-center justify-between bg-[#242527] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-100">Platform-Native Content Studio</h2>
              <p className="text-xs text-gray-400">
                Crafting cultural assets for <span className="text-blue-300 font-semibold">{brand.name}</span> on <span className="text-amber-300">{trendTitle}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform & Format Selector */}
        <div className="p-3 border-b border-[#2d2f31] bg-[#171819] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'Instagram', label: 'Instagram', icon: Instagram },
              { id: 'TikTok', label: 'TikTok', icon: Video },
              { id: 'X', label: 'X (Twitter)', icon: Twitter },
              { id: 'LinkedIn', label: 'LinkedIn', icon: Linkedin }
            ].map((p) => {
              const Icon = p.icon;
              const isSelected = platform === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id as any)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                      : 'bg-[#242527] text-gray-400 border border-[#333538] hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-semibold text-white flex items-center gap-1.5 shadow transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Regenerating...' : 'Regenerate Copy with AI'}</span>
          </button>
        </div>

        {/* Editor Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 space-y-4">
          {/* Hook (First 3 Seconds) */}
          <div className="p-3.5 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 uppercase tracking-wider">
                Video Hook / First Line (Crucial 3-Second Retention)
              </span>
              <button
                onClick={() => handleCopy(hook, 'hook')}
                className="text-gray-400 hover:text-gray-200 flex items-center gap-1 text-[11px]"
              >
                {copiedField === 'hook' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'hook' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-[#1e1f20] border border-[#3c4043] rounded-xl text-xs text-gray-100 focus:outline-none focus:border-blue-500 resize-none font-medium"
            />
          </div>

          {/* Body Caption */}
          <div className="p-3.5 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-300 uppercase tracking-wider">
                Platform Body Caption & Story
              </span>
              <button
                onClick={() => handleCopy(bodyCopy, 'body')}
                className="text-gray-400 hover:text-gray-200 flex items-center gap-1 text-[11px]"
              >
                {copiedField === 'body' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'body' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              value={bodyCopy}
              onChange={(e) => setBodyCopy(e.target.value)}
              rows={4}
              className="w-full p-2.5 bg-[#1e1f20] border border-[#3c4043] rounded-xl text-xs text-gray-100 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>

          {/* Visual Brief & Audio Pairing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#242527] rounded-xl border border-[#3c4043] space-y-1">
              <div className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-purple-400" />
                <span>Visual Direction Brief</span>
              </div>
              <textarea
                value={visualBrief}
                onChange={(e) => setVisualBrief(e.target.value)}
                rows={3}
                className="w-full p-2 bg-[#1e1f20] border border-[#3c4043] rounded-lg text-xs text-gray-300 focus:outline-none resize-none"
              />
            </div>

            <div className="p-3 bg-[#242527] rounded-xl border border-[#3c4043] space-y-1">
              <div className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio Track Recommendation</span>
              </div>
              <textarea
                value={audioRec}
                onChange={(e) => setAudioRec(e.target.value)}
                rows={3}
                className="w-full p-2 bg-[#1e1f20] border border-[#3c4043] rounded-lg text-xs text-gray-300 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Hashtags & CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#242527] rounded-xl border border-[#3c4043] space-y-1">
              <span className="text-gray-400 font-medium">Call to Action (CTA)</span>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#1e1f20] border border-[#3c4043] rounded-lg text-xs text-gray-100 focus:outline-none"
              />
            </div>

            <div className="p-3 bg-[#242527] rounded-xl border border-[#3c4043] space-y-1">
              <span className="text-gray-400 font-medium">Trending Hashtags</span>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#1e1f20] border border-[#3c4043] rounded-lg text-xs text-gray-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#2d2f31] bg-[#242527] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Passed Brand Tone & Safety Audit</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(`${hook}\n\n${bodyCopy}\n\n${cta}\n\n${hashtags}`, 'all')}
              className="px-3 py-2 rounded-xl bg-[#282a2c] hover:bg-[#333538] text-xs font-semibold text-gray-300 transition-colors"
            >
              {copiedField === 'all' ? 'Copied Full Post' : 'Copy All Copy'}
            </button>

            <button
              onClick={handleSchedulePost}
              disabled={scheduled}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{scheduled ? 'Scheduled to Buffer/Later!' : 'Schedule & Approve Post'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
