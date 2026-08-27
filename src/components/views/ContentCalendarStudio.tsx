import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Send,
  Trash2,
  Sliders,
  ExternalLink,
  Tag,
  AlertCircle
} from 'lucide-react';
import { BrandProfile, ScheduledPost, SocialPlatformType } from '../../types';

interface ContentCalendarStudioProps {
  currentBrand: BrandProfile;
  scheduledPosts: ScheduledPost[];
  onAddPost: (post: ScheduledPost) => void;
  onUpdatePostStatus: (postId: string, status: ScheduledPost['status']) => void;
  onDeletePost: (postId: string) => void;
  onDirectPublish: (post: ScheduledPost) => void;
}

export const ContentCalendarStudio: React.FC<ContentCalendarStudioProps> = ({
  currentBrand,
  scheduledPosts,
  onAddPost,
  onUpdatePostStatus,
  onDeletePost,
  onDirectPublish
}) => {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter posts
  const filteredPosts = scheduledPosts.filter((p) => {
    if (selectedPlatform !== 'all' && p.platform !== selectedPlatform) return false;
    return true;
  });

  // Weekdays generator
  const daysOfWeek = [
    { day: 'Mon', date: '2026-08-24', label: 'Aug 24' },
    { day: 'Tue', date: '2026-08-25', label: 'Aug 25' },
    { day: 'Wed', date: '2026-08-26', label: 'Aug 26 (Today)' },
    { day: 'Thu', date: '2026-08-27', label: 'Aug 27' },
    { day: 'Fri', date: '2026-08-28', label: 'Aug 28' },
    { day: 'Sat', date: '2026-08-29', label: 'Aug 29' },
    { day: 'Sun', date: '2026-08-30', label: 'Aug 30' }
  ];

  const handleGenerateWeeklyCalendar = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: currentBrand,
          cadence: 'weekly',
          primaryCampaign: 'Autumn Silk Jacquard Capsule Launch'
        })
      });

      if (res.ok) {
        const newCalendarPosts: ScheduledPost[] = await res.json();
        newCalendarPosts.forEach((post) => onAddPost(post));
      }
    } catch (e) {
      console.error('Calendar generation failed:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const getPlatformColor = (plat: SocialPlatformType) => {
    switch (plat) {
      case 'instagram':
        return 'border-rose-500/30 bg-rose-500/10 text-rose-300';
      case 'tiktok':
        return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
      case 'x':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-300';
      case 'linkedin':
        return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300';
      case 'facebook':
        return 'border-sky-500/30 bg-sky-500/10 text-sky-300';
      case 'youtube':
        return 'border-red-500/30 bg-red-500/10 text-red-300';
      default:
        return 'border-gray-500/30 bg-gray-500/10 text-gray-300';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#171819] text-gray-200">
      {/* Top Controls Bar */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3.5 border-b border-[#2d2f31] bg-[#1e1f20] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-100 flex items-center gap-2">
              Social Media Content Calendar
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {scheduledPosts.length} Scheduled
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              AI-optimized posting schedule based on audience peak activity hours in Lagos & London.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-[#282a2c] rounded-lg p-0.5 border border-[#3c4043]">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                viewMode === 'week' ? 'bg-[#333538] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                viewMode === 'month' ? 'bg-[#333538] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Month View
            </button>
          </div>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-[#282a2c] border border-[#3c4043] rounded-lg px-2.5 py-1 text-xs text-gray-200 focus:outline-none"
          >
            <option value="all">All Channels</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="x">X (Twitter)</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
          </select>

          {/* AI Auto-Generate Calendar */}
          <button
            onClick={handleGenerateWeeklyCalendar}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-medium shadow-md shadow-amber-500/10 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'AI Auto-Fill Calendar'}</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Matrix */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 min-w-[900px]">
          {daysOfWeek.map((dayObj) => {
            const dayPosts = filteredPosts.filter((p) => {
              // match either specific date or index fallback
              return p.scheduledDate === dayObj.date || p.scheduledDate?.endsWith(dayObj.day.toLowerCase());
            });

            return (
              <div
                key={dayObj.day}
                className="bg-[#1e1f20] border border-[#2d2f31] rounded-xl flex flex-col min-h-[500px]"
              >
                {/* Day Header */}
                <div className="p-3 border-b border-[#2d2f31] flex items-center justify-between bg-[#232427] rounded-t-xl">
                  <div>
                    <span className="text-xs font-bold text-gray-200">{dayObj.day}</span>
                    <div className="text-[10px] text-gray-400">{dayObj.label}</div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 bg-[#2d2f31] px-1.5 py-0.5 rounded">
                    {dayPosts.length}
                  </span>
                </div>

                {/* Posts in this day */}
                <div className="p-2 flex-1 space-y-2 overflow-y-auto">
                  {dayPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer group hover:scale-[1.02] ${getPlatformColor(
                        post.platform
                      )}`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider capitalize">
                          {post.platform} • {post.format.replace('_', ' ')}
                        </span>
                        <span className="text-[9px] font-mono flex items-center gap-0.5 opacity-90">
                          <Clock className="w-2.5 h-2.5" />
                          {post.scheduledTime}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-gray-100 line-clamp-2 mb-1">
                        {post.hook || post.title}
                      </div>

                      <div className="text-[10px] text-gray-400 line-clamp-2 mb-1.5 leading-relaxed">
                        {post.caption}
                      </div>

                      {post.isOptimalTime && (
                        <div className="text-[9px] text-emerald-400 font-medium flex items-center gap-1 mt-1 pt-1 border-t border-white/10">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>AI Peak Velocity</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {dayPosts.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center p-4 text-center text-gray-600 text-xs">
                      <span>No posts</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Post Modal / Drawer */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d2f31]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold capitalize px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {selectedPost.platform} {selectedPost.format.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {selectedPost.scheduledDate} @ {selectedPost.scheduledTime}
                </span>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            {/* Post Detail */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                  Viral Hook
                </label>
                <div className="p-2.5 rounded-lg bg-[#282a2c] text-gray-100 font-medium">
                  {selectedPost.hook}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Full Caption
                </label>
                <div className="p-3 rounded-lg bg-[#282a2c] text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {selectedPost.caption}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-blue-400 block mb-1">
                  Hashtags & CTA
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedPost.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold">
                  CTA: {selectedPost.cta}
                </div>
              </div>

              {selectedPost.timeRecommendationReason && (
                <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-800/40 text-[11px] text-gray-300">
                  <span className="font-semibold text-blue-300">Timing Rationale: </span>
                  {selectedPost.timeRecommendationReason}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-[#2d2f31]">
              <button
                onClick={() => {
                  onDeletePost(selectedPost.id);
                  setSelectedPost(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Post</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onDirectPublish(selectedPost);
                    setSelectedPost(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Immediately</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
