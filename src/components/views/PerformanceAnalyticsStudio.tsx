import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  MousePointerClick,
  Users,
  Layers,
  ArrowUpRight,
  Lightbulb,
  Calendar,
  Clock,
  Send,
  Plus,
  Flame,
  Grid3X3,
  Filter,
  DollarSign,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  X,
  Target,
  ExternalLink,
  Award,
  BarChart2
} from 'lucide-react';
import {
  BrandProfile,
  FutureContentRecommendation,
  PerformanceTheme,
  SocialPlatformType
} from '../../types';

interface PerformanceAnalyticsStudioProps {
  currentBrand: BrandProfile;
  themes: PerformanceTheme[];
  recommendations: FutureContentRecommendation[];
  onApplyRecommendationAsDraft: (rec: FutureContentRecommendation) => void;
}

// Rich default themes if Firestore/API is populating
const defaultInitialThemes: PerformanceTheme[] = [
  {
    id: 'theme-craft',
    themeName: 'Artisan Craftsmanship & Material Macro',
    category: 'Behind The Scenes',
    postCount: 18,
    avgEngagementRate: 9.8,
    conversionRate: 4.6,
    attributedRevenue: 4200000,
    viralityIndex: 94,
    growthScore: 96,
    originatingSignal: 'Tactile Silk Weaving & Macro Stitching Visuals',
    totalReach: 142000,
    avgLikes: 2150,
    avgShares: 580,
    avgClicks: 820,
    roiMultiplier: 5.2,
    trendStatus: 'rising',
    recommendation: 'Scale to 3x weekly. Macro tactile video drives 4.1x higher waitlist registrations than static photos.',
    examplePostTitle: 'The 18-Day Weaving of Nigerian Silk Jacquard',
    platformBreakdown: {
      instagram: { engagementRate: 10.4, conversionRate: 5.2, roi: 5.8, reach: 68000, growthRating: 'exceptional' },
      tiktok: { engagementRate: 11.2, conversionRate: 4.8, roi: 5.4, reach: 52000, growthRating: 'exceptional' },
      x: { engagementRate: 6.8, conversionRate: 3.2, roi: 4.1, reach: 12000, growthRating: 'high' },
      linkedin: { engagementRate: 7.4, conversionRate: 4.1, roi: 4.8, reach: 6000, growthRating: 'high' },
      youtube: { engagementRate: 8.9, conversionRate: 3.9, roi: 4.6, reach: 4000, growthRating: 'high' }
    }
  },
  {
    id: 'theme-swagger',
    themeName: 'Cultural Swagger & Wit (Audio Sync)',
    category: 'Entertainment & Culture',
    postCount: 14,
    avgEngagementRate: 9.2,
    conversionRate: 3.8,
    attributedRevenue: 3100000,
    viralityIndex: 98,
    growthScore: 92,
    originatingSignal: '“Omo no try me oo” & Cultural Catchphrase Drops',
    totalReach: 118000,
    avgLikes: 2480,
    avgShares: 890,
    avgClicks: 540,
    roiMultiplier: 4.4,
    trendStatus: 'rising',
    recommendation: 'Maintain 2x weekly during peak cultural velocity moments (first 72 hours of signal detection).',
    examplePostTitle: '“Omo no try me oo” — The Fitting Room Swagger Reel',
    platformBreakdown: {
      instagram: { engagementRate: 9.6, conversionRate: 4.1, roi: 4.6, reach: 45000, growthRating: 'exceptional' },
      tiktok: { engagementRate: 12.8, conversionRate: 4.5, roi: 5.1, reach: 62000, growthRating: 'exceptional' },
      x: { engagementRate: 7.2, conversionRate: 2.4, roi: 3.2, reach: 8000, growthRating: 'high' },
      linkedin: { engagementRate: 3.1, conversionRate: 1.1, roi: 1.8, reach: 2000, growthRating: 'moderate' },
      youtube: { engagementRate: 7.6, conversionRate: 2.8, roi: 3.5, reach: 1000, growthRating: 'moderate' }
    }
  },
  {
    id: 'theme-scarcity',
    themeName: 'VIP Micro-Capsule Scarcity (Max 50 Pieces)',
    category: 'Exclusive Drops',
    postCount: 8,
    avgEngagementRate: 8.8,
    conversionRate: 5.8,
    attributedRevenue: 4800000,
    viralityIndex: 88,
    growthScore: 95,
    originatingSignal: 'Numbered Runs & Direct Atelier Allocation Waitlists',
    totalReach: 86000,
    avgLikes: 1650,
    avgShares: 410,
    avgClicks: 940,
    roiMultiplier: 6.2,
    trendStatus: 'rising',
    recommendation: 'Deploy for all new garment releases. Limited-run scarcity accelerates purchase velocity from 7 days to 48 hours.',
    examplePostTitle: 'Only 40 Numbered Bespoke Capes Handcrafted Worldwide',
    platformBreakdown: {
      instagram: { engagementRate: 9.4, conversionRate: 6.4, roi: 6.8, reach: 38000, growthRating: 'exceptional' },
      tiktok: { engagementRate: 8.2, conversionRate: 5.1, roi: 5.6, reach: 32000, growthRating: 'exceptional' },
      x: { engagementRate: 8.9, conversionRate: 5.9, roi: 6.4, reach: 11000, growthRating: 'exceptional' },
      linkedin: { engagementRate: 7.8, conversionRate: 5.4, roi: 5.9, reach: 4000, growthRating: 'high' },
      youtube: { engagementRate: 6.2, conversionRate: 3.8, roi: 4.2, reach: 1000, growthRating: 'high' }
    }
  },
  {
    id: 'theme-founder',
    themeName: 'Founder Vision & Industry Contrarianism',
    category: 'Thought Leadership',
    postCount: 10,
    avgEngagementRate: 7.6,
    conversionRate: 2.8,
    attributedRevenue: 1900000,
    viralityIndex: 82,
    growthScore: 84,
    originatingSignal: 'Contrarian Essays: Why Fast Fashion Is Destroying Craft',
    totalReach: 52000,
    avgLikes: 940,
    avgShares: 260,
    avgClicks: 480,
    roiMultiplier: 3.8,
    trendStatus: 'steady',
    recommendation: 'Keep to Tuesday/Thursday mornings on LinkedIn and X for B2B investor and executive brand trust.',
    examplePostTitle: 'Why Scale Is The Enemy of True Luxury',
    platformBreakdown: {
      instagram: { engagementRate: 5.8, conversionRate: 1.9, roi: 2.6, reach: 14000, growthRating: 'moderate' },
      tiktok: { engagementRate: 6.1, conversionRate: 1.8, roi: 2.4, reach: 12000, growthRating: 'moderate' },
      x: { engagementRate: 10.4, conversionRate: 4.2, roi: 4.9, reach: 16000, growthRating: 'exceptional' },
      linkedin: { engagementRate: 11.2, conversionRate: 5.6, roi: 5.8, reach: 9000, growthRating: 'exceptional' },
      youtube: { engagementRate: 4.8, conversionRate: 1.4, roi: 2.1, reach: 1000, growthRating: 'low' }
    }
  },
  {
    id: 'theme-static-lookbook',
    themeName: 'Standard Product Lookbook Photos',
    category: 'Promotional',
    postCount: 12,
    avgEngagementRate: 4.8,
    conversionRate: 1.2,
    attributedRevenue: 650000,
    viralityIndex: 42,
    growthScore: 48,
    originatingSignal: 'Static E-Commerce Lookbook Catalogues',
    totalReach: 36200,
    avgLikes: 680,
    avgShares: 95,
    avgClicks: 210,
    roiMultiplier: 1.8,
    trendStatus: 'declining',
    recommendation: 'Reduce static single photos in favor of dynamic carousels with storytelling annotations.',
    examplePostTitle: 'Autumn Capsule Lookbook Slide 4',
    platformBreakdown: {
      instagram: { engagementRate: 5.2, conversionRate: 1.4, roi: 2.0, reach: 18000, growthRating: 'moderate' },
      tiktok: { engagementRate: 2.8, conversionRate: 0.6, roi: 1.1, reach: 8000, growthRating: 'low' },
      x: { engagementRate: 3.4, conversionRate: 0.9, roi: 1.4, reach: 5000, growthRating: 'low' },
      linkedin: { engagementRate: 2.6, conversionRate: 0.8, roi: 1.2, reach: 3000, growthRating: 'low' },
      youtube: { engagementRate: 2.1, conversionRate: 0.5, roi: 0.9, reach: 2200, growthRating: 'low' }
    }
  }
];

export const PerformanceAnalyticsStudio: React.FC<PerformanceAnalyticsStudioProps> = ({
  currentBrand,
  themes: propsThemes,
  recommendations,
  onApplyRecommendationAsDraft
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'themes' | 'recommendations'>('heatmap');
  
  // Heatmap Controls State
  const [heatmapMetric, setHeatmapMetric] = useState<'composite' | 'engagement' | 'conversion' | 'roi'>('composite');
  const [selectedThemeDetail, setSelectedThemeDetail] = useState<PerformanceTheme | null>(null);
  const [filterGrowthThreshold, setFilterGrowthThreshold] = useState<'all' | 'high_growth' | 'rising'>('all');

  const themes = propsThemes && propsThemes.length > 0 ? propsThemes : defaultInitialThemes;

  const handleRefreshAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/analyze-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: currentBrand,
          recentMetrics: {
            totalReach: 348200,
            avgEngagementRate: 8.4,
            topFormat: 'Short Video / Reel',
            topPlatform: 'TikTok & Instagram'
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Analyzed performance:', data);
      }
    } catch (e) {
      console.error('Failed to run performance analysis:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredThemes = themes.filter((t) => {
    if (filterGrowthThreshold === 'high_growth') return (t.roiMultiplier || 0) >= 4.0;
    if (filterGrowthThreshold === 'rising') return t.trendStatus === 'rising';
    return true;
  });

  // Calculate heatmap cell styling and metrics
  const getCellColorAndRating = (
    platformData?: { engagementRate: number; conversionRate: number; roi: number; growthRating?: string }
  ) => {
    if (!platformData) {
      return {
        bgColor: 'bg-[#212326]',
        textColor: 'text-gray-500',
        borderColor: 'border-[#2d2f31]',
        rating: 'N/A',
        badge: 'bg-gray-800 text-gray-400'
      };
    }

    const { engagementRate, conversionRate, roi } = platformData;

    if (roi >= 5.0 || engagementRate >= 10.0 || conversionRate >= 5.0) {
      return {
        bgColor: 'bg-gradient-to-br from-emerald-950/70 to-cyan-950/80',
        textColor: 'text-emerald-300',
        borderColor: 'border-emerald-500/40 hover:border-emerald-400',
        rating: 'Super Growth',
        badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
      };
    } else if (roi >= 3.5 || engagementRate >= 7.0 || conversionRate >= 3.0) {
      return {
        bgColor: 'bg-gradient-to-br from-blue-950/60 to-indigo-950/70',
        textColor: 'text-cyan-300',
        borderColor: 'border-blue-500/30 hover:border-blue-400',
        rating: 'Strong Lift',
        badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
      };
    } else if (roi >= 2.0 || engagementRate >= 4.5 || conversionRate >= 1.5) {
      return {
        bgColor: 'bg-[#26282b]',
        textColor: 'text-amber-300',
        borderColor: 'border-[#3d4145] hover:border-amber-500/30',
        rating: 'Moderate',
        badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
      };
    } else {
      return {
        bgColor: 'bg-[#1f2022]',
        textColor: 'text-gray-400',
        borderColor: 'border-[#2d2f31]',
        rating: 'Low / Saturated',
        badge: 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
      };
    }
  };

  const platformsList: { key: SocialPlatformType; label: string; icon: string }[] = [
    { key: 'instagram', label: 'Instagram', icon: '📸' },
    { key: 'tiktok', label: 'TikTok', icon: '🎵' },
    { key: 'x', label: 'X (Twitter)', icon: '⚡' },
    { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { key: 'youtube', label: 'YouTube Shorts', icon: '▶️' }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#171819] text-gray-200 p-3 sm:p-5 md:p-6 lg:p-8 xl:p-10">
      <div className="max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
        {/* Header with Diagnostics Trigger */}
        <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold tracking-wide uppercase">
                Live Conversion & Heatmap Engine
              </span>
              <span className="text-gray-400 text-xs font-mono">Calibrated on 64 Campaigns</span>
            </div>
            <h1 className="text-base font-bold text-gray-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Social Performance & Signal Growth Heatmap
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Mapping engagement, conversion pipelines, and ROI across content themes for{' '}
              <span className="text-cyan-300 font-semibold">{currentBrand.name}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing 30-Day Streams...' : 'Run Heat Diagnostics'}</span>
            </button>
          </div>
        </div>

        {/* Top Growth & Conversion KPI Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-[#1e1f20] border border-[#2d2f31] relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Total Audience Reach</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight">348,200</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+42.6% vs last 30d</span>
            </div>
            <div className="absolute right-0 bottom-0 w-24 h-1 bg-gradient-to-r from-transparent to-blue-500 opacity-50" />
          </div>

          <div className="p-4 rounded-xl bg-[#1e1f20] border border-[#2d2f31] relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Avg Engagement Rate</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight">8.92%</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>2.6x luxury industry benchmark</span>
            </div>
            <div className="absolute right-0 bottom-0 w-24 h-1 bg-gradient-to-r from-transparent to-rose-500 opacity-50" />
          </div>

          <div className="p-4 rounded-xl bg-[#1e1f20] border border-[#2d2f31] relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Attributed Pipeline (ROI)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-300 tracking-tight">₦14,650,000</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Avg 4.88x ROI Multiplier</span>
            </div>
            <div className="absolute right-0 bottom-0 w-24 h-1 bg-gradient-to-r from-transparent to-emerald-500 opacity-50" />
          </div>

          <div className="p-4 rounded-xl bg-[#1e1f20] border border-[#2d2f31] relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Signal Conversion Rate</span>
              <MousePointerClick className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-cyan-300 tracking-tight">4.24%</div>
            <div className="text-[10px] text-cyan-400 flex items-center gap-1 mt-1">
              <Zap className="w-3 h-3" />
              <span>2,450 Waitlist Actions</span>
            </div>
            <div className="absolute right-0 bottom-0 w-24 h-1 bg-gradient-to-r from-transparent to-cyan-500 opacity-50" />
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="flex items-center justify-between border-b border-[#2d2f31] pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'heatmap'
                  ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#282a2c]'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Visual Performance Heatmap</span>
            </button>

            <button
              onClick={() => setActiveTab('themes')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'themes'
                  ? 'bg-[#282a2c] text-white border border-[#444]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#282a2c]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Theme Diagnostics ({themes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'recommendations'
                  ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-cyan-300 border border-cyan-500/50'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#282a2c]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Future Content Directives ({recommendations.length || 3})</span>
            </button>
          </div>

          {activeTab === 'heatmap' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#232427] p-1 rounded-lg border border-[#34373a] text-[11px]">
                <span className="text-gray-400 px-2 text-[10px] uppercase font-bold">Metric:</span>
                <button
                  onClick={() => setHeatmapMetric('composite')}
                  className={`px-2 py-0.5 rounded ${heatmapMetric === 'composite' ? 'bg-cyan-600 text-white font-medium' : 'text-gray-300 hover:text-white'}`}
                >
                  Growth Matrix
                </button>
                <button
                  onClick={() => setHeatmapMetric('engagement')}
                  className={`px-2 py-0.5 rounded ${heatmapMetric === 'engagement' ? 'bg-cyan-600 text-white font-medium' : 'text-gray-300 hover:text-white'}`}
                >
                  Engagement %
                </button>
                <button
                  onClick={() => setHeatmapMetric('conversion')}
                  className={`px-2 py-0.5 rounded ${heatmapMetric === 'conversion' ? 'bg-cyan-600 text-white font-medium' : 'text-gray-300 hover:text-white'}`}
                >
                  Conversion %
                </button>
                <button
                  onClick={() => setHeatmapMetric('roi')}
                  className={`px-2 py-0.5 rounded ${heatmapMetric === 'roi' ? 'bg-cyan-600 text-white font-medium' : 'text-gray-300 hover:text-white'}`}
                >
                  ROI (x)
                </button>
              </div>

              <div className="flex items-center bg-[#232427] p-1 rounded-lg border border-[#34373a] text-[11px]">
                <Filter className="w-3 h-3 text-gray-400 ml-1.5 mr-1" />
                <select
                  value={filterGrowthThreshold}
                  onChange={(e) => setFilterGrowthThreshold(e.target.value as any)}
                  className="bg-transparent text-gray-200 text-xs focus:outline-none pr-2 cursor-pointer"
                >
                  <option value="all" className="bg-[#1e1f20]">All Signals</option>
                  <option value="high_growth" className="bg-[#1e1f20]">High ROI (≥4.0x)</option>
                  <option value="rising" className="bg-[#1e1f20]">Rising Velocity</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: VISUAL PERFORMANCE HEATMAP */}
        {activeTab === 'heatmap' && (
          <div className="space-y-5">
            {/* Heatmap Matrix Header Info & Color Ramp Legend */}
            <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  Social Signal to Brand Growth Translation Matrix
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Click any cell to inspect the psychological trigger, conversion funnel, and campaign performance breakdown.
                </p>
              </div>

              {/* Color Ramp Legend */}
              <div className="flex items-center gap-3 text-[10px] font-medium bg-[#171819] px-3 py-1.5 rounded-xl border border-[#2d2f31]">
                <span className="text-gray-400 font-semibold">Growth Legend:</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-emerald-500 to-cyan-500" />
                  <span className="text-emerald-300">Exceptional (&gt;5x ROI / &gt;10% ER)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                  <span className="text-cyan-300">Strong Lift (3.5–5x)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                  <span className="text-amber-300">Moderate (2–3.5x)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-gray-600" />
                  <span className="text-gray-400">Low / Baseline</span>
                </div>
              </div>
            </div>

            {/* Interactive Heatmap Table */}
            <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-[#171819] border-b border-[#2d2f31] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-72">Content Theme & Social Signal</th>
                      {platformsList.map((p) => (
                        <th key={p.key} className="py-3.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1">
                            <span>{p.icon}</span>
                            <span>{p.label}</span>
                          </span>
                        </th>
                      ))}
                      <th className="py-3.5 px-3 text-right">Avg Conversion</th>
                      <th className="py-3.5 px-3 text-right">Revenue Lift</th>
                      <th className="py-3.5 px-4 text-center">ROI Multiplier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#282a2c] text-xs">
                    {filteredThemes.map((theme) => {
                      return (
                        <tr
                          key={theme.id}
                          onClick={() => setSelectedThemeDetail(theme)}
                          className="hover:bg-[#232427] transition-colors cursor-pointer group"
                        >
                          {/* Theme name & signal description */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-start gap-2">
                              <span
                                className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                                  theme.trendStatus === 'rising'
                                    ? 'bg-emerald-400 animate-pulse'
                                    : theme.trendStatus === 'steady'
                                    ? 'bg-blue-400'
                                    : 'bg-rose-400'
                                }`}
                              />
                              <div>
                                <div className="font-bold text-gray-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                                  <span>{theme.themeName}</span>
                                  <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                                </div>
                                <div className="text-[11px] text-cyan-400/80 mt-0.5 flex items-center gap-1 font-mono">
                                  <Zap className="w-2.5 h-2.5" />
                                  <span>Signal: {theme.originatingSignal || 'Cultural Moment Audio'}</span>
                                </div>
                                <div className="text-[10px] text-gray-400 mt-0.5">
                                  {theme.postCount} posts evaluated • {theme.totalReach.toLocaleString()} reach
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Platform Breakdown Heatmap Cells */}
                          {platformsList.map((platform) => {
                            const pData = theme.platformBreakdown?.[platform.key];
                            const { bgColor, textColor, borderColor } = getCellColorAndRating(pData);

                            return (
                              <td key={platform.key} className="py-3 px-2 text-center">
                                <div
                                  className={`p-2 rounded-xl border ${bgColor} ${borderColor} transition-all transform group-hover:scale-[1.02] flex flex-col items-center justify-center min-h-[58px] shadow-sm`}
                                >
                                  {pData ? (
                                    <>
                                      {heatmapMetric === 'composite' && (
                                        <>
                                          <div className={`font-mono font-bold ${textColor} text-xs`}>
                                            {pData.roi}x ROI
                                          </div>
                                          <div className="text-[10px] text-gray-300 font-mono mt-0.5">
                                            {pData.engagementRate}% ER • {pData.conversionRate}% Conv
                                          </div>
                                        </>
                                      )}
                                      {heatmapMetric === 'engagement' && (
                                        <>
                                          <div className={`font-mono font-bold ${textColor} text-xs`}>
                                            {pData.engagementRate}%
                                          </div>
                                          <div className="text-[9px] text-gray-400 font-mono mt-0.5">
                                            {(pData.reach / 1000).toFixed(0)}k Reach
                                          </div>
                                        </>
                                      )}
                                      {heatmapMetric === 'conversion' && (
                                        <>
                                          <div className={`font-mono font-bold ${textColor} text-xs`}>
                                            {pData.conversionRate}%
                                          </div>
                                          <div className="text-[9px] text-gray-400 font-mono mt-0.5">
                                            Lead Clicks
                                          </div>
                                        </>
                                      )}
                                      {heatmapMetric === 'roi' && (
                                        <>
                                          <div className={`font-mono font-bold ${textColor} text-xs`}>
                                            {pData.roi}x
                                          </div>
                                          <div className="text-[9px] text-gray-400 font-mono mt-0.5">
                                            Growth Multiplier
                                          </div>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-gray-600 font-mono text-[10px]">—</span>
                                  )}
                                </div>
                              </td>
                            );
                          })}

                          {/* Conversion % Column */}
                          <td className="py-3.5 px-3 text-right">
                            <div className="font-mono font-bold text-emerald-400 text-xs">
                              {theme.conversionRate || (theme.avgClicks / theme.totalReach * 100).toFixed(1)}%
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono">
                              {theme.avgClicks} actions/post
                            </div>
                          </td>

                          {/* Attributed Revenue */}
                          <td className="py-3.5 px-3 text-right">
                            <div className="font-mono font-bold text-white text-xs">
                              ₦{(theme.attributedRevenue || 1800000).toLocaleString()}
                            </div>
                            <div className="text-[10px] text-cyan-400 font-mono">
                              Growth Index: {theme.growthScore || 88}/100
                            </div>
                          </td>

                          {/* ROI Multiplier */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-block font-mono font-bold text-xs px-2.5 py-1 rounded-lg border ${
                                theme.roiMultiplier >= 5.0
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                                  : theme.roiMultiplier >= 3.5
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                  : 'bg-gray-800 text-gray-300 border-gray-700'
                              }`}
                            >
                              {theme.roiMultiplier}x
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signal-to-Growth Translation Insights Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#1e1f20] border border-[#2d2f31] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-100">Top Growth Driver</h3>
                  <div className="text-xs text-emerald-300 font-semibold mt-0.5">
                    VIP Scarcity & Numbered Runs (6.2x ROI)
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Announcing limited 40-piece garment allocations triggered a 5.8% conversion rate and generated ₦4.8M in direct waitlist demand.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1e1f20] border border-[#2d2f31] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex-shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-100">Highest Virality Signal</h3>
                  <div className="text-xs text-cyan-300 font-semibold mt-0.5">
                    TikTok Cultural Wit Audio (12.8% ER)
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Syncing bespoke tailoring reveals to trending cultural audio snippets generated 890 avg shares and +142% follower growth.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1e1f20] border border-[#2d2f31] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-100">Optimal Publishing Channel</h3>
                  <div className="text-xs text-amber-300 font-semibold mt-0.5">
                    Instagram 9:16 Reels & X Threads
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Instagram captured 48% of total conversion volume, while X threads drove executive diaspora bookmark retention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED THEMES DIAGNOSTICS */}
        {activeTab === 'themes' && (
          <div className="space-y-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl p-5 hover:border-cyan-500/30 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {theme.category}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                          theme.trendStatus === 'rising'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : theme.trendStatus === 'steady'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        Trend: {theme.trendStatus.toUpperCase()}
                      </span>
                      {theme.originatingSignal && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                          Signal: {theme.originatingSignal}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-gray-100">{theme.themeName}</h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <div className="text-gray-400 text-[10px]">Engagement Rate</div>
                      <div className="text-emerald-400 font-bold">{theme.avgEngagementRate}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-[10px]">Conversion Rate</div>
                      <div className="text-cyan-300 font-bold">{theme.conversionRate || 4.2}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-[10px]">ROI Multiplier</div>
                      <div className="text-emerald-300 font-bold">{theme.roiMultiplier}x</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 mb-3 bg-[#232427] rounded-xl p-3 text-center text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] block">Total Reach</span>
                    <span className="font-semibold text-white">
                      {theme.totalReach.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Avg Likes</span>
                    <span className="font-semibold text-white">
                      {theme.avgLikes.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Avg Shares</span>
                    <span className="font-semibold text-white">
                      {theme.avgShares.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Attributed Revenue</span>
                    <span className="font-semibold text-emerald-400">
                      ₦{(theme.attributedRevenue || 2100000).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-gray-300 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-cyan-300">Actionable Directive: </span>
                    {theme.recommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: FUTURE RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl p-5 hover:border-blue-500/40 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 capitalize">
                        {rec.recommendedPlatform} • {rec.recommendedFormat.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">
                        Projected Lift: {rec.projectedEngagementLift}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-100">{rec.title}</h3>
                  </div>

                  <button
                    onClick={() => onApplyRecommendationAsDraft(rec)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Post from This</span>
                  </button>
                </div>

                <p className="text-xs text-gray-300 mb-3">{rec.reason}</p>

                {/* Meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#282a2c] text-gray-300">
                    <span className="font-semibold text-gray-400 block text-[10px] uppercase">
                      Recommended Day & Time
                    </span>
                    <div className="flex items-center gap-1.5 text-cyan-300 font-medium mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{rec.recommendedDayTime}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#282a2c] text-gray-300">
                    <span className="font-semibold text-gray-400 block text-[10px] uppercase">
                      Data-Backed Rationale
                    </span>
                    <div className="text-gray-300 mt-0.5 text-[11px]">{rec.basedOnMetric}</div>
                  </div>
                </div>

                {/* Suggested Hook */}
                <div className="p-3 rounded-xl bg-[#232427] border border-[#34373a] text-xs">
                  <span className="text-[10px] font-bold text-amber-400 block mb-1">
                    AI Suggested Opening Hook:
                  </span>
                  <div className="text-gray-200 font-medium">"{rec.suggestedHook}"</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Signal-to-Growth Theme Drilldown Inspector */}
        {selectedThemeDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1e1f20] border border-[#3c4043] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4">
              <button
                onClick={() => setSelectedThemeDetail(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#282a2c] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase">
                  Signal Diagnostic Breakdown
                </span>
                <span className="text-gray-400 text-xs font-mono">Theme ID: {selectedThemeDetail.id}</span>
              </div>

              <div>
                <h2 className="text-base font-bold text-white">{selectedThemeDetail.themeName}</h2>
                <p className="text-xs text-gray-300 mt-1">
                  Originating Signal:{' '}
                  <span className="text-cyan-300 font-semibold">
                    {selectedThemeDetail.originatingSignal || 'Live Cultural Moment'}
                  </span>
                </p>
              </div>

              {/* Funnel Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-[#282a2c] rounded-xl border border-[#3c4043] text-center text-xs">
                <div>
                  <div className="text-gray-400 text-[10px] uppercase font-bold">Total Reach</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {selectedThemeDetail.totalReach.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-[10px] uppercase font-bold">Conversion Rate</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {selectedThemeDetail.conversionRate || 4.2}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-[10px] uppercase font-bold">Attributed Revenue</div>
                  <div className="text-sm font-bold text-cyan-300 mt-0.5">
                    ₦{(selectedThemeDetail.attributedRevenue || 2400000).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Platform breakdown list */}
              <div>
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                  Cross-Platform Growth Performance
                </h4>
                <div className="space-y-2">
                  {platformsList.map((p) => {
                    const data = selectedThemeDetail.platformBreakdown?.[p.key];
                    if (!data) return null;
                    return (
                      <div
                        key={p.key}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#232427] border border-[#34373a] text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span>{p.icon}</span>
                          <span className="font-semibold text-gray-200">{p.label}</span>
                        </div>
                        <div className="flex items-center gap-4 font-mono text-[11px]">
                          <span className="text-gray-400">{data.reach.toLocaleString()} Reach</span>
                          <span className="text-emerald-400 font-semibold">{data.engagementRate}% ER</span>
                          <span className="text-cyan-300 font-semibold">{data.conversionRate}% Conv</span>
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {data.roi}x ROI
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strategic recommendation */}
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-gray-200">
                <span className="font-bold text-cyan-300 block mb-1">Growth Acceleration Directive:</span>
                {selectedThemeDetail.recommendation}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedThemeDetail(null)}
                  className="px-4 py-2 rounded-xl bg-[#282a2c] hover:bg-[#333538] text-gray-200 text-xs font-semibold transition-colors"
                >
                  Close Diagnostic
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
