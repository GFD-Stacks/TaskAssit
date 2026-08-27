import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  ShieldCheck,
  Calendar,
  Share2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Hash,
  Send,
  Sliders,
  Layers,
  Smartphone,
  Eye,
  RefreshCw,
  Tag
} from 'lucide-react';
import {
  BrandProfile,
  ContentFormatType,
  ScheduledPost,
  SocialPlatformType,
  BrandSafetyAudit
} from '../../types';

interface PostCreatorStudioProps {
  currentBrand: BrandProfile;
  onSchedulePost: (post: ScheduledPost) => void;
  onCrossPostNow: (post: Partial<ScheduledPost>) => void;
}

export const PostCreatorStudio: React.FC<PostCreatorStudioProps> = ({
  currentBrand,
  onSchedulePost,
  onCrossPostNow
}) => {
  // State
  const [platform, setPlatform] = useState<SocialPlatformType>('instagram');
  const [format, setFormat] = useState<ContentFormatType>('reel');
  const [topic, setTopic] = useState('Bespoke Hand-Woven Autumn Silk Jacquard limited to 40 pieces');
  const [targetAudience, setTargetAudience] = useState(currentBrand.primaryAudience);
  const [tonePreset, setTonePreset] = useState('Polished Luxury with Cultural Wit');
  const [includeCulturalSlang, setIncludeCulturalSlang] = useState(true);

  // Generated Post State
  const [generatedHook, setGeneratedHook] = useState(
    'When they said heritage tailoring couldn’t command London and Lagos at the same time...'
  );
  const [generatedCaption, setGeneratedCaption] = useState(
    `You thought we were playing with this Autumn drop? Hand-finished silk jacquard, structured lapels, and zero compromises on heritage.\n\nOnly 40 numbered pieces worldwide. Tap link in bio to join the VIP waitlist.`
  );
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([
    '#AfricanLuxury',
    '#LuxeAuraBespoke',
    '#SilkCapsule',
    '#LagosToLondon',
    '#HauteCouture'
  ]);
  const [generatedCTA, setGeneratedCTA] = useState('Tap link in bio to join VIP waitlist');
  const [optimalTime, setOptimalTime] = useState('6:30 PM WAT (Peak Diaspora Browsing)');
  const [timeReason, setTimeReason] = useState(
    'Midweek evening executive browsing in Lagos and London hubs generates +42% CTR lift.'
  );
  const [safetyScore, setSafetyScore] = useState(98);
  const [safetyAudit, setSafetyAudit] = useState<BrandSafetyAudit | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setScheduleSuccess(false);
    try {
      const res = await fetch('/api/gemini/adapt-omnichannel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: currentBrand,
          baseIdea: topic,
          targetAudience: `${targetAudience} (Tone: ${tonePreset}, Cultural Wit: ${includeCulturalSlang})`
        })
      });

      if (res.ok) {
        const data = await res.json();
        const platData = data[platform] || data['instagram'];
        if (platData) {
          setGeneratedHook(platData.hook || '');
          setGeneratedCaption(platData.caption || '');
          setGeneratedHashtags(platData.hashtags || []);
          setGeneratedCTA(platData.cta || '');
          setOptimalTime(platData.optimalTime || '7:00 PM WAT');
          setTimeReason(platData.strategicRationale || 'Optimal engagement velocity.');
        }
      }
    } catch (e) {
      console.error('Failed to generate post:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAuditSafety = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/gemini/audit-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: currentBrand,
          text: `${generatedHook}\n\n${generatedCaption}`
        })
      });

      if (res.ok) {
        const audit: BrandSafetyAudit = await res.json();
        setSafetyAudit(audit);
        setSafetyScore(audit.safetyScore ?? (audit as any).overallScore ?? 95);
      }
    } catch (e) {
      console.error('Safety audit failed:', e);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSaveToCalendar = () => {
    const newPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      brandId: currentBrand.id,
      title: topic.slice(0, 45),
      platform,
      format,
      hook: generatedHook,
      caption: generatedCaption,
      hashtags: generatedHashtags,
      cta: generatedCTA,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: optimalTime.split(' ')[0] || '18:30',
      isOptimalTime: true,
      timeRecommendationReason: timeReason,
      status: 'scheduled',
      safetyScore,
      safetyFlags: safetyAudit?.flags.map((f) => f.issue || f.reason || '') || []
    };

    onSchedulePost(newPost);
    setScheduleSuccess(true);
    setTimeout(() => setScheduleSuccess(false), 3000);
  };

  const handleCopyAll = () => {
    const fullText = `${generatedHook}\n\n${generatedCaption}\n\n${generatedCTA}\n\n${generatedHashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#171819] text-gray-200">
      {/* Left Config Controls */}
      <div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-[#2d2f31] bg-[#1e1f20] flex flex-col flex-shrink-0 p-4 sm:p-5 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2d2f31]">
          <PenTool className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-semibold text-gray-100">Post & Caption Studio</h2>
        </div>

        <div className="space-y-4 text-xs">
          {/* Target Platform */}
          <div>
            <label className="block text-gray-300 font-medium mb-1.5">Target Platform</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'instagram', label: 'Instagram' },
                { id: 'tiktok', label: 'TikTok' },
                { id: 'x', label: 'X (Twitter)' },
                { id: 'linkedin', label: 'LinkedIn' },
                { id: 'facebook', label: 'Facebook' },
                { id: 'youtube', label: 'YouTube' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id as SocialPlatformType)}
                  className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-all ${
                    platform === p.id
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-[#282a2c] border-[#3c4043] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format Selector */}
          <div>
            <label className="block text-gray-300 font-medium mb-1.5">Content Format</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'reel', label: '🎬 Short Video / Reel' },
                { id: 'carousel', label: '📑 Multi-Slide Carousel' },
                { id: 'thread', label: '🧵 Story Thread' },
                { id: 'single_image', label: '🖼️ Single High-Res Card' },
                { id: 'long_form_article', label: '📝 Long-Form Article' },
                { id: 'story', label: '⚡ 24h Interactive Story' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id as ContentFormatType)}
                  className={`py-2 px-2.5 rounded-lg border text-left text-[11px] font-medium transition-all ${
                    format === f.id
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-[#282a2c] border-[#3c4043] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic & Angle */}
          <div>
            <label className="block text-gray-300 font-medium mb-1.5">Topic / Concept / Angle</label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What is this specific post about?"
              className="w-full bg-[#282a2c] border border-[#3c4043] rounded-lg p-2.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Tone & Wit */}
          <div>
            <label className="block text-gray-300 font-medium mb-1.5">Tone & Voice Preset</label>
            <select
              value={tonePreset}
              onChange={(e) => setTonePreset(e.target.value)}
              className="w-full bg-[#282a2c] border border-[#3c4043] rounded-lg p-2 text-xs text-gray-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="Polished Luxury with Cultural Wit">Polished Luxury with Cultural Wit</option>
              <option value="Authoritative Industry Visionary">Authoritative Industry Visionary</option>
              <option value="Playful Viral & High Energy">Playful Viral & High Energy</option>
              <option value="Artisan Masterclass & Educational">Artisan Masterclass & Educational</option>
              <option value="Exclusive Scarcity & VIP Direct">Exclusive Scarcity & VIP Direct</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#282a2c] border border-[#3c4043]">
            <span className="text-[11px] text-gray-300">Infuse Cultural Signals & Slang</span>
            <input
              type="checkbox"
              checked={includeCulturalSlang}
              onChange={(e) => setIncludeCulturalSlang(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Writing Platform-Native Copy...' : 'Generate Platform Copy with AI'}</span>
          </button>
        </div>
      </div>

      {/* Right Generated Content & Realistic Platform Preview */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 max-w-4xl mx-auto w-full">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between bg-[#1e1f20] border border-[#2d2f31] rounded-xl p-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-200 capitalize">
              {platform} {format.replace('_', ' ')}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Safety Score: {safetyScore}/100
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAuditSafety}
              disabled={isAuditing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-200 text-xs font-medium transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAuditing ? 'Auditing...' : 'Brand Audit'}</span>
            </button>

            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-200 text-xs font-medium transition-colors"
            >
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleSaveToCalendar}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{scheduleSuccess ? 'Added to Calendar!' : 'Add to Calendar'}</span>
            </button>

            <button
              onClick={() =>
                onCrossPostNow({
                  platform,
                  format,
                  hook: generatedHook,
                  caption: generatedCaption,
                  hashtags: generatedHashtags,
                  cta: generatedCTA,
                  title: topic
                })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Cross-Post Now</span>
            </button>
          </div>
        </div>

        {/* Post Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left: Editable Components */}
          <div className="space-y-4">
            {/* Hook */}
            <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Viral Hook (First 3s)
                </span>
                <span className="text-[10px] text-gray-500">{generatedHook.length} chars</span>
              </div>
              <textarea
                rows={2}
                value={generatedHook}
                onChange={(e) => setGeneratedHook(e.target.value)}
                className="w-full bg-[#282a2c] border border-[#3c4043] rounded-lg p-2.5 text-xs text-gray-100 focus:outline-none focus:border-amber-500 resize-none font-medium"
              />
            </div>

            {/* Caption */}
            <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-300">
                  Full Platform-Native Caption
                </span>
                <span className="text-[10px] text-gray-500">{generatedCaption.length} chars</span>
              </div>
              <textarea
                rows={6}
                value={generatedCaption}
                onChange={(e) => setGeneratedCaption(e.target.value)}
                className="w-full bg-[#282a2c] border border-[#3c4043] rounded-lg p-2.5 text-xs text-gray-100 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed font-sans"
              />
            </div>

            {/* Hashtags & CTA */}
            <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-xl p-4 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-blue-400 block mb-1.5 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  Suggested Hashtags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {generatedHashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-emerald-400 block mb-1 flex items-center gap-1">
                  <Send className="w-3 h-3" />
                  Call to Action (CTA)
                </span>
                <input
                  type="text"
                  value={generatedCTA}
                  onChange={(e) => setGeneratedCTA(e.target.value)}
                  className="w-full bg-[#282a2c] border border-[#3c4043] rounded-lg px-2.5 py-1.5 text-xs text-gray-100"
                />
              </div>
            </div>

            {/* Smart Timing Rationale */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-800/40 text-xs">
              <div className="flex items-center gap-2 text-blue-300 font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>AI Optimal Timing: {optimalTime}</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">{timeReason}</p>
            </div>
          </div>

          {/* Right: Realistic Device Mockup Preview */}
          <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-xl p-5 flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-4 self-start">
              <Smartphone className="w-4 h-4 text-gray-400" />
              <span>Live Social Feed Simulation ({platform})</span>
            </div>

            {/* Simulated Smartphone Card */}
            <div className="w-full max-w-xs bg-black rounded-2xl border border-[#333538] overflow-hidden shadow-2xl">
              {/* Account header */}
              <div className="p-3 flex items-center justify-between border-b border-[#222]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5">
                    <img
                      src={currentBrand.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop'}
                      alt="avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white flex items-center gap-1">
                      {currentBrand.name}
                      <span className="text-[9px] text-blue-400">✓</span>
                    </div>
                    <div className="text-[9px] text-gray-400">Sponsored • Lagos & London</div>
                  </div>
                </div>
                <span className="text-gray-400 text-xs">•••</span>
              </div>

              {/* Media Preview Box */}
              <div className="relative aspect-square bg-[#1a1b1d] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white px-3 leading-snug line-clamp-3">
                  "{generatedHook}"
                </div>
                <div className="mt-3 text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                  LuxeAura Atelier 2026
                </div>
              </div>

              {/* Feed Content Body */}
              <div className="p-3 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-gray-300 pb-1">
                  <div className="flex items-center gap-3">
                    <span>❤️ 2.4k</span>
                    <span>💬 184</span>
                    <span>↗️ 390</span>
                  </div>
                  <span>🔖</span>
                </div>

                <p className="text-gray-200 line-clamp-4 text-[11px] leading-relaxed">
                  <span className="font-bold text-white mr-1.5">{currentBrand.name}</span>
                  {generatedCaption}
                </p>

                <p className="text-blue-400 font-mono text-[10px]">
                  {generatedHashtags.slice(0, 3).join(' ')}
                </p>

                <div className="mt-2 pt-2 border-t border-[#222] flex items-center justify-between text-[10px] text-emerald-400 font-medium">
                  <span>{generatedCTA}</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Audit Results (if run) */}
        {safetyAudit && (
          <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Brand Safety & Guardrail Report
              </h3>
              <span className="text-xs font-bold text-emerald-400">
                Score: {safetyAudit.safetyScore ?? (safetyAudit as any).overallScore ?? 95}/100
              </span>
            </div>

            <p className="text-xs text-gray-300 mb-3">{safetyAudit.summary}</p>

            {safetyAudit.flags.length > 0 ? (
              <div className="space-y-2">
                {safetyAudit.flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-300">{flag.issue}</div>
                      <div className="text-gray-300 text-[11px] mt-0.5">{flag.recommendation}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>100% Brand-Safe. Passed all cultural alignment, tone, and claim tests.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
