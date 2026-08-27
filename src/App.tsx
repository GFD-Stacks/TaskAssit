import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { SourcesPanel } from './components/SourcesPanel';
import { CenterCanvas } from './components/CenterCanvas';
import { InteractionStudio } from './components/InteractionStudio';
import { TrendDNAInspectorModal } from './components/TrendDNAInspectorModal';
import { AddSourceModal } from './components/AddSourceModal';
import { ContentGeneratorModal } from './components/ContentGeneratorModal';

// Studios
import { CampaignBriefStudio } from './components/views/CampaignBriefStudio';
import { PostCreatorStudio } from './components/views/PostCreatorStudio';
import { OmnichannelCrossPostStudio } from './components/views/OmnichannelCrossPostStudio';
import { ContentCalendarStudio } from './components/views/ContentCalendarStudio';
import { PerformanceAnalyticsStudio } from './components/views/PerformanceAnalyticsStudio';
import { BrandGuardrailStudio } from './components/views/BrandGuardrailStudio';

// Firebase Firestore Live Synchronization
import {
  saveBrandToFirestore,
  deleteBrandFromFirestore,
  saveTrendToFirestore,
  deleteTrendFromFirestore,
  saveCampaignToFirestore,
  deleteCampaignFromFirestore,
  saveScheduledPostToFirestore,
  deleteScheduledPostFromFirestore,
  saveDecisionToFirestore,
  savePerformanceDataToFirestore,
  subscribeToBrands,
  subscribeToTrends,
  subscribeToCampaigns,
  subscribeToScheduledPosts,
  subscribeToDecisions,
  subscribeToPerformanceData,
  clearAllFirestoreCollections
} from './lib/firebase';

import {
  BrandProfile,
  SocialTrend,
  CompetitorShift,
  DecisionRecord,
  ChatMessage,
  StudioToolType,
  AppViewMode,
  CampaignBrief,
  ScheduledPost,
  ConnectedPlatformAccount,
  CrossPostLog,
  PerformanceTheme,
  FutureContentRecommendation,
  DecisionSimulation,
  TrendWatcherStatus,
  StudioAudioOverview,
  StudioSlideDeck,
  StudioVideoOverview,
  StudioMindMap,
  StudioReport,
  StudioFlashcard,
  StudioQuizQuestion,
  StudioInfographic,
  StudioDataTable
} from './types';

// Default clean initial brand if Firestore is completely empty
const defaultCleanBrand: BrandProfile = {
  id: 'brand-luxeaura-live',
  name: 'LuxeAura Fashion',
  industry: 'Luxury Fashion & Artisan Streetwear',
  tagline: 'Modern African heritage tailored for global tastemakers',
  voice: 'Sophisticated, witty, culturally rooted, unapologetically elevated',
  primaryAudience: 'Urban Tastemakers, Fashion Connoisseurs & Creatives (22–38)',
  secondaryAudience: 'Global Luxury Diaspora in London, NYC, Paris & Atlanta',
  geographicMarket: 'Lagos, London, New York, Johannesburg',
  prohibitedContent: [
    'Discount / clearance aggressive language',
    'Cheap meme mimicry without luxury craft angle',
    'Unsubstantiated overnight promises',
    'Low-resolution or grainy filters'
  ],
  toneKeywords: ['Poised', 'Bespoke', 'Cultural Wit', 'Permanent Luxury', 'Artisan Jacquard'],
  historicalPerformance: {
    topFormat: 'Short-Form Reel (9:16) with Sound Sync',
    avgEngagement: '+38% above industry benchmark',
    primaryObjection: 'Perceived pricing opacity vs bespoke exclusivity',
    totalCampaignsEvaluated: 64,
    modelCalibrationAccuracy: 95
  }
};

export function App() {
  // Navigation View State
  const [appViewMode, setAppViewMode] = useState<AppViewMode>('social_brain');

  // Brand & Social Brain Firestore-backed state
  const [brands, setBrands] = useState<BrandProfile[]>([]);
  const [currentBrand, setCurrentBrand] = useState<BrandProfile>(defaultCleanBrand);
  const [trends, setTrends] = useState<SocialTrend[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorShift[]>([]);
  const [decisionHistory, setDecisionHistory] = useState<DecisionRecord[]>([]);

  // Campaign Briefs state
  const [campaignBriefs, setCampaignBriefs] = useState<CampaignBrief[]>([]);

  // Content Calendar & Posts state
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  // Omnichannel & Cross-Posting state
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedPlatformAccount[]>([
    {
      id: 'acc-ig',
      platform: 'instagram',
      accountName: '@luxeaura.official',
      avatarUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&auto=format&fit=crop&q=80',
      connected: true,
      followerCount: '148.5K',
      lastSynced: 'Just now'
    },
    {
      id: 'acc-tiktok',
      platform: 'tiktok',
      accountName: '@luxeauralagos',
      avatarUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=100&auto=format&fit=crop&q=80',
      connected: true,
      followerCount: '280.2K',
      lastSynced: 'Just now'
    },
    {
      id: 'acc-x',
      platform: 'x',
      accountName: '@LuxeAuraBespoke',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      connected: true,
      followerCount: '62.1K',
      lastSynced: 'Just now'
    },
    {
      id: 'acc-linkedin',
      platform: 'linkedin',
      accountName: 'LuxeAura Luxury Maison',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      connected: true,
      followerCount: '19.4K',
      lastSynced: '1 hr ago'
    }
  ]);
  const [crossPostLogs, setCrossPostLogs] = useState<CrossPostLog[]>([]);

  // Performance & Themes state
  const [performanceThemes, setPerformanceThemes] = useState<PerformanceTheme[]>([]);
  const [futureRecommendations, setFutureRecommendations] = useState<FutureContentRecommendation[]>([]);

  // Selected state for Social Brain
  const [selectedTrend, setSelectedTrend] = useState<SocialTrend | null>(null);
  const [activeStudioTab, setActiveStudioTab] = useState<StudioToolType>('decision_simulator');
  const [isSearchingLive, setIsSearchingLive] = useState<boolean>(false);

  // Automated Trend Watcher 30-Minute Polling State
  const [trendWatcherStatus, setTrendWatcherStatus] = useState<TrendWatcherStatus>({
    enabled: true,
    intervalMinutes: 30,
    lastPolledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    nextPollAt: new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isPolling: false,
    totalPollsCount: 1,
    highPotentialCount: 0,
    lastOpportunityFound: null
  });

  // High-Potential Opportunity Notification Alert State
  const [highPotentialAlert, setHighPotentialAlert] = useState<{
    trend: SocialTrend;
    reason: string;
    growthPotential: string;
  } | null>(null);

  // Studio datasets
  const [simulation, setSimulation] = useState<DecisionSimulation>({
    trendName: 'Live Cultural Signal',
    brandName: defaultCleanBrand.name,
    budget: 150000,
    timeHorizon: '7 days',
    options: [
      {
        id: 'opt-a',
        label: 'OPTION A',
        name: 'Organic Cultural Storytelling',
        strategyType: 'organic',
        expectedReach: '45k–68k impressions',
        brandRisk: 'Low',
        estimatedLifespan: '5–7 days',
        expectedEngagement: '+28% to +42%',
        confidenceScore: 78,
        estimatedCost: '₦0',
        costNumeric: 0,
        expectedLeads: '180–260 waitlist signups',
        trustImpact: 'High',
        roiScore: 92,
        description: 'Deploy 3 high-aesthetic short-form Reels with cultural sound synchronization and craftsmanship storytelling.'
      },
      {
        id: 'opt-b',
        label: 'OPTION B',
        name: 'Paid Spark & Sound Amplification',
        strategyType: 'paid_amplification',
        expectedReach: '180k–240k targeted impressions',
        brandRisk: 'Low',
        estimatedLifespan: '7–10 days',
        expectedEngagement: '+35% to +50%',
        confidenceScore: 71,
        estimatedCost: '₦150,000',
        costNumeric: 150000,
        expectedLeads: '520–780 leads',
        trustImpact: 'High',
        roiScore: 88,
        description: 'Run targeted spark ads boosting the highest-converting organic creative to urban tastemakers.'
      },
      {
        id: 'opt-c',
        label: 'OPTION C',
        name: '3-Creator Trend Seeding',
        strategyType: 'influencer_collab',
        expectedReach: '120k–160k trusted impressions',
        brandRisk: 'Medium',
        estimatedLifespan: '8–12 days',
        expectedEngagement: '+40% to +65%',
        confidenceScore: 65,
        estimatedCost: '₦300,000',
        costNumeric: 300000,
        expectedLeads: '400–620 leads',
        trustImpact: 'High',
        roiScore: 79,
        description: 'Partner with 3 verified cultural creators to co-create native skits using product statement pieces.'
      },
      {
        id: 'opt-d',
        label: 'OPTION D',
        name: 'Strategic Abstention',
        strategyType: 'ignore_monitor',
        expectedReach: 'Baseline (0 lift)',
        brandRisk: 'Low',
        estimatedLifespan: 'N/A',
        expectedEngagement: '0% change',
        confidenceScore: 95,
        estimatedCost: '₦0',
        costNumeric: 0,
        expectedLeads: '0 extra',
        trustImpact: 'Neutral',
        roiScore: 10,
        description: 'Maintain standard lookbook calendar without trend piggybacking.'
      }
    ],
    dataClassification: {
      historicalData: 'Calibrated from past campaigns: Short-form Reels produced +32% avg engagement lift.',
      forecast: 'Projecting 180k–240k impressions and 780 leads over 7 days with ₦150,000 spend.',
      scenarioAssumptions: 'Assumes CPM of ₦620; trend velocity remains >80 for 5+ days across target demographic pools.',
      aiConfidence: 78,
      unknownFactors: 'Algorithmic sound promotion variance (12% margin) and competitor counter-ad spend.'
    },
    trajectories: [
      { day: 1, organicReach: 8000, paidReach: 22000, influencerReach: 15000, engagementRate: 7.2 },
      { day: 2, organicReach: 24000, paidReach: 58000, influencerReach: 42000, engagementRate: 8.8 },
      { day: 3, organicReach: 46000, paidReach: 110000, influencerReach: 85000, engagementRate: 9.4 },
      { day: 4, organicReach: 58000, paidReach: 165000, influencerReach: 118000, engagementRate: 8.9 },
      { day: 5, organicReach: 64000, paidReach: 195000, influencerReach: 138000, engagementRate: 7.8 },
      { day: 6, organicReach: 67000, paidReach: 218000, influencerReach: 148000, engagementRate: 6.9 },
      { day: 7, organicReach: 68000, paidReach: 235000, influencerReach: 154000, engagementRate: 6.2 }
    ]
  });

  const [audioData, setAudioData] = useState<any>({
    title: 'LuxeAura Fashion: Strategic Audio Deep Dive',
    subtitle: 'AI 2-host cultural intelligence brief',
    durationSeconds: 195,
    durationFormatted: '3:15',
    tonePreset: 'relaxing',
    speakers: [
      { name: 'Maya', gender: 'female', role: 'Brand Storyteller', avatarColor: '#3b82f6' },
      { name: 'David', gender: 'male', role: 'Cultural Strategist', avatarColor: '#10b981' }
    ],
    keyTakeaways: [
      'Audience demand is shifting toward authentic, numbered-run craftsmanship over mass-produced volume.',
      'Cultural wit in short-form video increases brand affinity by +45% when paired with high-end visual aesthetics.',
      'Optimal engagement window is Thursdays at 7:00 PM WAT across Instagram and TikTok.'
    ],
    chapters: [
      { timeFormatted: '0:00', timeSeconds: 0, title: 'Cultural Signal Overview' },
      { timeFormatted: '0:55', timeSeconds: 55, title: 'Psychographic Audience Fit' },
      { timeFormatted: '1:50', timeSeconds: 110, title: 'Bespoke Content Strategy' },
      { timeFormatted: '2:40', timeSeconds: 160, title: 'Execution Plan & Guardrails' }
    ],
    transcript: [
      {
        time: '0:00',
        speaker: 'Maya',
        text: "Welcome into today's TaskAssit audio briefing. I'm Maya, and today we're analyzing what the latest cultural shifts mean for our brand."
      },
      {
        time: '0:30',
        speaker: 'David',
        text: 'Good to be here, Maya. The velocity on this trend has been remarkable. What stands out is how seamlessly it aligns with our bespoke craftsmanship positioning.'
      }
    ]
  });

  const [slideDeck, setSlideDeck] = useState<StudioSlideDeck>({
    title: '“Omo no try me oo” — Executive Strategy Brief',
    subtitle: 'Strategic Calibration & Omni-Channel Execution Plan',
    slides: [
      {
        slideNumber: 1,
        title: 'Executive Summary & Cultural Velocity',
        subtitle: 'Signal Identification & Psychographic Relevance',
        bullets: [
          'High velocity cultural signal identified across urban tastemaker and diaspora communities',
          'Brand fit index 92/100 with zero compromise on luxury heritage positioning',
          'Artisan craftsmanship angle transforms colloquial humor into high-value equity'
        ],
        metricLabel: 'Cultural Resonance',
        metricValue: '94 / 100',
        strategicNote: 'Act within 48-72 hours to lead the cultural conversation before saturation sets in.'
      },
      {
        slideNumber: 2,
        title: 'Creative Angle & Native Execution',
        subtitle: 'Platform-Tailored Formats & Visual Direction',
        bullets: [
          '9:16 vertical video emphasizing tactile macro fabrics & confident transitions',
          'Thought leadership thread framing scarcity vs fast-fashion mass waste',
          'TikTok audio sync focusing on humorous aspirational swagger'
        ],
        metricLabel: 'Projected Reach',
        metricValue: '280K - 450K',
        strategicNote: 'Ground humor strictly in bespoke tailoring details to elevate commercial appeal.'
      },
      {
        slideNumber: 3,
        title: 'Commercial ROI & Deployment',
        subtitle: 'Funnel Optimization & Direct Conversion',
        bullets: [
          'VIP preview waitlist driving exclusivity and early customer acquisition',
          'Omnichannel rollout across Instagram, TikTok, X, and LinkedIn',
          'Real-time sentiment monitoring via automated Trend Watcher'
        ],
        metricLabel: 'Conversion Lift',
        metricValue: '+38%',
        strategicNote: 'Direct publishing scheduled for peak evening luxury browsing hours.'
      }
    ]
  });

  const [videoData, setVideoData] = useState<StudioVideoOverview>({
    title: 'Social Intelligence Video Brief',
    subtitle: '180s Dynamic Visual Pacing & Narration Script',
    durationSeconds: 180,
    durationFormatted: '3:00',
    scenes: [
      {
        sceneNumber: 1,
        title: 'Hook & Cultural Signal',
        startSecond: 0,
        endSecond: 30,
        narration: 'A new cultural moment is taking over social feeds. Here is how LuxeAura captures the energy without losing its bespoke luxury DNA.',
        visualType: 'motion_chart'
      },
      {
        sceneNumber: 2,
        title: 'Brand DNA Calibration',
        startSecond: 31,
        endSecond: 90,
        narration: 'By aligning our artisan heritage with contemporary swagger, we turn viral attention into lasting customer equity.',
        visualType: 'split_bar'
      },
      {
        sceneNumber: 3,
        title: 'Omnichannel Execution',
        startSecond: 91,
        endSecond: 150,
        narration: 'Deploying across TikTok, Instagram Reels, and LinkedIn with tailored messaging for each audience segment.',
        visualType: 'creative_mockup'
      },
      {
        sceneNumber: 4,
        title: 'Call to Action & ROI',
        startSecond: 151,
        endSecond: 180,
        narration: 'Exclusive capsule drop goes live tonight. Tap link in bio to secure VIP preview access.',
        visualType: 'matrix'
      }
    ]
  });

  const [mindMap, setMindMap] = useState<StudioMindMap>({
    title: 'Cultural Resonance Matrix — “Omo no try me oo”',
    nodes: [
      {
        id: 'n-root',
        label: '“Omo no try me oo”',
        type: 'root',
        description: 'Core viral cultural phrase capturing confidence, humor, and playful boundary-setting.',
        x: 50,
        y: 50
      },
      {
        id: 'n-artisan',
        label: 'Artisan Craftsmanship',
        type: 'brand_fit',
        description: 'Transforming slang into an assertion of uncompromised luxury bespoke quality.',
        x: 20,
        y: 25
      },
      {
        id: 'n-formats',
        label: 'Omnichannel Formats',
        type: 'pattern',
        description: 'Multi-platform distribution strategy tailored to distinct audience behaviors.',
        x: 80,
        y: 25
      },
      {
        id: 'n-reel',
        label: '9:16 Runway Reel',
        type: 'campaign',
        description: 'Fast-paced visual showcase with sound sync and confident 180 spin.',
        x: 80,
        y: 75
      },
      {
        id: 'n-vip',
        label: 'VIP Drop Waitlist',
        type: 'strategy',
        description: 'Direct conversion engine with private lookbook access.',
        x: 20,
        y: 75
      }
    ],
    connections: [
      { from: 'n-root', to: 'n-artisan' },
      { from: 'n-root', to: 'n-formats' },
      { from: 'n-formats', to: 'n-reel' },
      { from: 'n-artisan', to: 'n-vip' }
    ]
  });

  const [report, setReport] = useState<StudioReport>({
    title: 'Executive Social Intelligence Dossier: “Omo no try me oo”',
    generatedAt: 'Today at 6:00 PM',
    executiveSummary: 'Real-time analysis reveals high cultural resonance (+94%) for Nigerian diaspora swagger themes. Immediate brand-safe commercialization is recommended through limited batch drops and artisanal storytelling.',
    swot: {
      strengths: ['Authentic African heritage positioning', 'Uncompromising artisan craftsmanship', 'Agile omni-channel publishing engine'],
      weaknesses: ['Limited inventory capacity (40 pieces per capsule)', 'Requires tight timeline execution'],
      opportunities: ['High diaspora purchasing power in London & New York', 'Viral short-form audio momentum on TikTok'],
      threats: ['Fast-fashion copycats', 'Signal saturation within 10-14 days']
    },
    sections: [
      {
        heading: 'Cultural Signal Analysis',
        content: 'The phrase "Omo no try me oo" represents a collective assertion of self-worth and unapologetic excellence. For LuxeAura, this translates directly to uncompromised textile quality and bespoke tailoring.',
        metrics: { 'Velocity Score': '94 / 100', 'Audience Growth': '+140%', 'Platform Spread': 'TikTok, IG, X' }
      },
      {
        heading: 'Brand Safety & Tone Alignment',
        content: 'Tone calibration ensures 100% adherence to luxury guardrails. Avoid low-effort meme formats; ground all content in bespoke craftsmanship, hand-finished seams, and exclusive VIP access.',
        metrics: { 'Brand Safety Index': '98 / 100', 'Alignment Score': '92 / 100' }
      }
    ],
    recommendationMatrix: [
      {
        priority: 'High',
        action: 'Launch 9:16 Atelier Silhouette Reel with viral audio sync',
        timeline: 'Next 24 Hours',
        expectedImpact: '+42% Engagement Lift',
        riskLevel: 'Low'
      },
      {
        priority: 'High',
        action: 'Publish LinkedIn & X thought leadership on supply chain craft',
        timeline: 'Next 48 Hours',
        expectedImpact: 'Executive Authority & B2B Leads',
        riskLevel: 'Very Low'
      },
      {
        priority: 'Medium',
        action: 'Open VIP private preview waitlist for Autumn Silk Capsule',
        timeline: 'Day 3',
        expectedImpact: '100% Pre-order Sell-out',
        riskLevel: 'Low'
      }
    ]
  });

  const [flashcards, setFlashcards] = useState<StudioFlashcard[]>([
    { id: 'fc-1', category: 'Brand DNA', front: 'Core Brand Philosophy', back: 'African luxury crafted with zero compromises on heritage or tailoring.', context: 'Voice & Mission' },
    { id: 'fc-2', category: 'Cultural Speed', front: 'Optimal Trend Response Window', back: '48 to 72 hours before mass saturation sets in.', context: 'Timing Calibration' },
    { id: 'fc-3', category: 'Distribution', front: 'Highest Converting Visual Format', back: '9:16 macro tactile video with beat-drop audio sync.', context: 'Format Rule' },
    { id: 'fc-4', category: 'Brand Safety', front: 'Prohibited Terminology', back: 'Never use discount, cheap, promo codes, or clearance terms.', context: 'Guardrails' }
  ]);

  const [quizQuestions, setQuizQuestions] = useState<StudioQuizQuestion[]>([
    {
      id: 'q-1',
      category: 'Cultural Strategy',
      question: 'What is the primary risk of adopting a viral cultural signal too late in its lifecycle?',
      options: [
        'Increased ad production costs',
        'Audience saturation, cringe perception, and loss of brand authenticity',
        'Lower video resolution on social feeds',
        'Algorithm shadowbanning'
      ],
      correctAnswerIndex: 1,
      explanation: 'Entering a trend during the decay phase causes audience fatigue and diminishes brand authority.'
    },
    {
      id: 'q-2',
      category: 'Brand Safety',
      question: 'How should a luxury brand adapt colloquial cultural humor without diluting prestige?',
      options: [
        'Copy the exact meme format without modifications',
        'Ground the witty cultural concept in artisan craftsmanship and tactile product excellence',
        'Avoid all cultural trends entirely',
        'Post exclusively text-only updates'
      ],
      correctAnswerIndex: 1,
      explanation: 'Reframing cultural slang as a testament to uncompromising craft elevates both the trend and the brand.'
    },
    {
      id: 'q-3',
      category: 'Omnichannel Distribution',
      question: 'Which content format drives the highest save and share velocity on Instagram for luxury launches?',
      options: [
        'Static square stock photography',
        'Macro tactile video reels with sound sync and storytelling carousel breakdowns',
        'Plain text tweets copied to feed',
        'Single-sentence broadcast announcements'
      ],
      correctAnswerIndex: 1,
      explanation: 'Tactile macro visuals and educational carousel breakdowns achieve 3.8x higher bookmark and share rates.'
    }
  ]);

  const [infographics, setInfographics] = useState<StudioInfographic[]>([
    { id: 'info-1', title: 'Audience Penetration', category: 'Reach', value: '78%', unit: '%', insight: 'High organic engagement across key diaspora hubs' },
    { id: 'info-2', title: 'Sentiment Index', category: 'Affinity', value: '94/100', unit: 'pts', insight: 'Unanimous positive feedback on bespoke craftsmanship angle' }
  ]);

  const [dataTable, setDataTable] = useState<StudioDataTable>({
    title: 'Omnichannel Telemetry & Distribution Matrix',
    subtitle: 'Cross-platform performance projections for “Omo no try me oo”',
    totalRecords: 6,
    columns: [
      { key: 'platform', label: 'Platform' },
      { key: 'format', label: 'Format' },
      { key: 'estReach', label: 'Est. Reach' },
      { key: 'safetyScore', label: 'Safety Score' },
      { key: 'optimalTime', label: 'Optimal Window' },
      { key: 'status', label: 'Deployment' }
    ],
    rows: [
      { platform: 'Instagram', format: '9:16 Reel', estReach: '245,000', safetyScore: '98%', optimalTime: '6:30 PM WAT', status: 'Ready to Post' },
      { platform: 'TikTok', format: 'Short Video', estReach: '380,000', safetyScore: '94%', optimalTime: '8:15 PM WAT', status: 'Drafted' },
      { platform: 'X / Twitter', format: 'Thread (4 Posts)', estReach: '92,000', safetyScore: '99%', optimalTime: '12:45 PM WAT', status: 'Scheduled' },
      { platform: 'LinkedIn', format: 'Article & Story', estReach: '48,000', safetyScore: '100%', optimalTime: '8:30 AM WAT', status: 'Scheduled' },
      { platform: 'Facebook', format: 'Photo Carousel', estReach: '64,000', safetyScore: '97%', optimalTime: '2:00 PM WAT', status: 'Drafted' },
      { platform: 'Pinterest', format: 'Moodboard Pin', estReach: '35,000', safetyScore: '100%', optimalTime: '9:00 PM WAT', status: 'Ready to Post' }
    ]
  });

  // 1. Initialize Real-Time Firebase Firestore Subscriptions
  useEffect(() => {
    // Brands Subscription
    const unsubBrands = subscribeToBrands((fetchedBrands) => {
      if (fetchedBrands.length > 0) {
        setBrands(fetchedBrands);
        setCurrentBrand((prev) => {
          const match = fetchedBrands.find((b) => b.id === prev.id);
          return match || fetchedBrands[0];
        });
      } else {
        // First run on a clean slate: seed default brand to Firestore
        saveBrandToFirestore(defaultCleanBrand).catch((err) => {
          console.warn('Initial brand seed note:', err);
        });
      }
    });

    // Trends Subscription
    const unsubTrends = subscribeToTrends((fetchedTrends) => {
      if (fetchedTrends.length > 0) {
        setTrends(fetchedTrends);
        setSelectedTrend((prev) => {
          if (!prev) return fetchedTrends[0];
          const match = fetchedTrends.find((t) => t.id === prev.id);
          return match || fetchedTrends[0];
        });
      }
    });

    // Campaigns Subscription
    const unsubCampaigns = subscribeToCampaigns((fetchedCampaigns) => {
      setCampaignBriefs(fetchedCampaigns);
    });

    // Scheduled Posts Subscription
    const unsubPosts = subscribeToScheduledPosts((fetchedPosts) => {
      setScheduledPosts(fetchedPosts);
    });

    // Decisions Subscription
    const unsubDecisions = subscribeToDecisions((fetchedDecisions) => {
      setDecisionHistory(fetchedDecisions);
    });

    // Performance Data Subscription
    const unsubPerformance = subscribeToPerformanceData((fetchedPerf) => {
      if (fetchedPerf.length > 0) {
        setPerformanceThemes(
          fetchedPerf.filter((p) => p.themeName).map((p) => ({
            id: p.id,
            themeName: p.themeName,
            performanceScore: p.performanceScore || 88,
            engagementRate: p.engagementRate || '7.4%',
            reachTotal: p.reachTotal || '240K',
            topFormat: p.topFormat || 'Reel',
            sentimentScore: p.sentimentScore || 92,
            keyTakeaway: p.keyTakeaway || 'Cultural wit resonates highest with urban tastemakers.'
          }))
        );
      }
    });

    return () => {
      unsubBrands();
      unsubTrends();
      unsubCampaigns();
      unsubPosts();
      unsubDecisions();
      unsubPerformance();
    };
  }, []);

  // 2. Real-Time Google & Gemini Search for Social Media, Blogs, and Open Platforms (Trend Watcher Engine)
  const fetchLiveRealtimeTrends = async (customQuery?: string, isAutomatedWatcher: boolean = false) => {
    setIsSearchingLive(true);
    setTrendWatcherStatus((prev) => ({ ...prev, isPolling: true }));

    try {
      const res = await fetch('/api/gemini/search-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: customQuery || `trending ${currentBrand.industry} pop culture social media viral audio memes 2026`,
          brand: currentBrand,
          isAutomatedWatcher
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.trends && Array.isArray(data.trends) && data.trends.length > 0) {
          let foundHighPotentialOpportunity: any = null;

          // Save each discovered live trend directly to Firebase Firestore!
          for (const [idx, t] of data.trends.entries()) {
            const overallFit = Math.round(((t.relevanceScore || 90) + (t.brandFitScore || 90)) / 2);
            const isHighPotential = overallFit >= 90 || (t.growthRate && parseInt(t.growthRate) > 100);

            const liveTrend: SocialTrend = {
              id: t.id || `live-trend-${Date.now()}-${idx}`,
              title: t.title || 'Live Cultural Signal',
              category: t.category || 'Cultural Wit / Audio',
              originPlatform: (t.platform || 'TikTok') as any,
              firstDetected: 'Google Search Intelligence (Live Scan)',
              heatLevel: isHighPotential ? 'Explosive' : 'Rising',
              quoteExample: t.suggestedHook || t.summary || 'Live audience discussion wave.',
              dna: {
                phraseOrTopic: t.title,
                emotion: 'Confidence, Cultural Swagger, Aspiration',
                culturalContext: t.summary || 'Real-time social media conversation wave across TikTok, Instagram & X.',
                tone: 'Fresh, confident, boundary-pushing',
                formats: ['Reel', 'TikTok', 'Carousel', 'X Post'],
                targetAudienceEstimate: '18-35 Cultural Tastemakers',
                velocity: t.relevanceScore || 94,
                platformSpread: ['TikTok', 'Instagram', 'X', 'YouTube'],
                lifecycle: 'heating',
                brandSafetyScore: t.brandFitScore || 95,
                commercialAdaptability: 92,
                recommendedLifespanDays: 7,
                underlyingPattern: {
                  patternName: 'Cultural Status Signal',
                  linguisticStructure: 'Punchy memorable hook',
                  rhythm: 'Dynamic upbeat pacing',
                  socialFunction: 'Aspirational brand identity',
                  brandSafeAdaptations: [t.suggestedAngle || 'Elevate with bespoke artisan craftsmanship']
                }
              },
              fitScores: {
                [currentBrand.id]: {
                  audienceRelevance: t.relevanceScore || 92,
                  brandRelevance: t.brandFitScore || 90,
                  culturalRelevance: 95,
                  commercialPotential: 92,
                  timing: 94,
                  saturationRisk: 18,
                  brandSafety: 95,
                  overallScore: overallFit
                }
              },
              recommendation: isHighPotential ? 'act_now' : 'monitor',
              ideas: [
                {
                  id: `idea-live-${idx}`,
                  number: 1,
                  category: 'High-Converting Reel',
                  headline: t.suggestedAngle || 'Authentic Cultural Showcase',
                  hook: t.suggestedHook || 'Wait until you see how this was crafted...',
                  format: 'Short-Form Video (9:16)',
                  targetPlatform: 'Instagram & TikTok',
                  commercialAngle: t.suggestedAngle || 'Highlight luxury silk craftsmanship with playful swagger.',
                  sampleCopy: `${t.suggestedHook || ''} Real luxury is never rushed. Link in bio to discover the private drop.`
                }
              ]
            };

            await saveTrendToFirestore(liveTrend);

            if (isHighPotential && !foundHighPotentialOpportunity) {
              foundHighPotentialOpportunity = {
                trend: liveTrend,
                reason: t.summary || 'Strong viral momentum and high cultural fit detected.',
                growthPotential: `${t.growthRate || '+140%'} Velocity • Reach ~${t.reachEstimate || '2.5M'}`
              };
            }
          }

          // If high-potential opportunity detected, trigger real-time alert and notify user!
          if (foundHighPotentialOpportunity) {
            setHighPotentialAlert(foundHighPotentialOpportunity);

            setTrendWatcherStatus((prev) => ({
              ...prev,
              highPotentialCount: prev.highPotentialCount + 1,
              lastOpportunityFound: {
                id: foundHighPotentialOpportunity.trend.id,
                title: foundHighPotentialOpportunity.trend.title,
                score: foundHighPotentialOpportunity.trend.fitScores[currentBrand.id]?.overallScore || 95,
                platform: foundHighPotentialOpportunity.trend.originPlatform,
                detectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                summary: foundHighPotentialOpportunity.trend.dna.culturalContext,
                suggestedHook: foundHighPotentialOpportunity.trend.quoteExample,
                growthPotential: foundHighPotentialOpportunity.growthPotential
              }
            }));

            // Notify user in chat stream
            setMessages((prev) => [
              ...prev,
              {
                id: `msg-alert-${Date.now()}`,
                role: 'assistant',
                content: `### 🚨 Automated Trend Watcher Alert: High-Potential Opportunity Detected!\n\n**Cultural Signal:** **"${foundHighPotentialOpportunity.trend.title}"**\n- **Platform Origin:** ${foundHighPotentialOpportunity.trend.originPlatform}\n- **Growth Potential:** ${foundHighPotentialOpportunity.growthPotential}\n- **Brand Fit Index:** ${foundHighPotentialOpportunity.trend.fitScores[currentBrand.id]?.overallScore || 95}/100\n- **Cultural Context:** ${foundHighPotentialOpportunity.trend.dna.culturalContext}\n\n*The Social Heat Dashboard has been refreshed with this live pattern.* Would you like to run a decision simulation or draft omnichannel content?`,
                timestamp: 'Just now',
                structuredInsight: {
                  whatIsHappening: `Automated 30-minute scan caught rapid emergence of "${foundHighPotentialOpportunity.trend.title}".`,
                  whyIsItHappening: 'High velocity spread across open social feeds and cultural discourse.',
                  whatItMeansForBrand: `High authenticity match (${foundHighPotentialOpportunity.trend.fitScores[currentBrand.id]?.overallScore}%) with ${currentBrand.name}.`,
                  strategicRecommendation: 'Act within 48-72 hours before saturation sets in.',
                  outcomeForecast: 'Estimated 2.4M targeted reach across TikTok and Instagram Reels.',
                  confidenceScore: 92,
                  brandFitScore: 95,
                  actionTriggers: [
                    { type: 'simulate', label: `Simulate "${foundHighPotentialOpportunity.trend.title}"` },
                    { type: 'generate_content', label: 'Draft Cross-Platform Copy' },
                    { type: 'explore_ideas', label: 'View Trend DNA' }
                  ]
                }
              }
            ]);
          }
        }
      }
    } catch (err) {
      console.warn('Real-time trends search note:', err);
    } finally {
      setIsSearchingLive(false);
      setTrendWatcherStatus((prev) => {
        const nextTime = new Date(Date.now() + (prev.intervalMinutes || 30) * 60 * 1000);
        return {
          ...prev,
          lastPolledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          nextPollAt: nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isPolling: false,
          totalPollsCount: prev.totalPollsCount + 1
        };
      });
    }
  };

  // 3. Automated 30-Minute Polling Timer Hook for Trend Watcher
  useEffect(() => {
    if (!trendWatcherStatus.enabled) return;

    const intervalMinutes = trendWatcherStatus.intervalMinutes || 30;
    const intervalMs = intervalMinutes * 60 * 1000;

    console.log(`[Trend Watcher Engine] Automated polling active every ${intervalMinutes} minutes for brand "${currentBrand.name}".`);

    const timer = setInterval(() => {
      console.log(`[Trend Watcher Engine] Polling Google Search Intelligence API for emerging cultural patterns (${new Date().toLocaleTimeString()})...`);
      fetchLiveRealtimeTrends(undefined, true);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [trendWatcherStatus.enabled, trendWatcherStatus.intervalMinutes, currentBrand.name]);

  // Initial scan if trends collection is sparse (with hydration grace period)
  const initialScanAttemptedRef = useRef(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (trends.length === 0 && !isSearchingLive && !initialScanAttemptedRef.current) {
        initialScanAttemptedRef.current = true;
        fetchLiveRealtimeTrends();
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [trends.length, isSearchingLive]);

  // Clean Slate Handler: Wipes Firestore to test clean scenarios
  const handleCleanSlate = async () => {
    if (window.confirm('Reset database to a clean slate? This will clear Firestore collections for testing.')) {
      await clearAllFirestoreCollections();
      setBrands([]);
      setTrends([]);
      setCampaignBriefs([]);
      setScheduledPosts([]);
      setDecisionHistory([]);
      setSelectedTrend(null);
      // Re-seed one clean initial brand
      await saveBrandToFirestore(defaultCleanBrand);
    }
  };

  // Modals state
  const [isTrendDNAModalOpen, setIsTrendDNAModalOpen] = useState(false);
  const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [activeContentTrendTitle, setActiveContentTrendTitle] = useState('“Omo no try me oo”');

  // Chat stream messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `### 👋 Welcome to TaskAssit — Real-Time AI Social Media Decision Studio\n\nConnected to live **Firebase Firestore** and **Google Search Intelligence** for **${currentBrand.name}**.\n\nI continuously monitor real-time cultural signals across TikTok, Instagram, X, YouTube, and blogs, calibrate brand fit with our memory knowledge base, simulate probabilistic campaign outcomes, draft omnichannel content, and execute cross-posting.\n\n#### 🔥 Live Signal Intelligence\n- **Database Status:** **Firestore Live & Synchronized**\n- **Grounding Engine:** **Google Search & Gemini Pro Intelligence**\n\nAsk me anything below, click an AI suggestion chip, or explore our studio tabs!`,
      timestamp: 'Just now',
      structuredInsight: {
        whatIsHappening: 'Real-time social intelligence stream active and synchronized with Firebase Firestore.',
        whyIsItHappening: 'Monitoring emerging cultural moments and audience psychology shifts.',
        whatItMeansForBrand: `High-resonance alignment with ${currentBrand.name} positioning.`,
        strategicRecommendation: 'Run a decision simulation or explore creative applications for peak reach.',
        outcomeForecast: 'Projected 180k–240k targeted impressions over a 7-day window.',
        confidenceScore: 82,
        brandFitScore: 92,
        actionTriggers: [
          { type: 'simulate', label: 'Run Decision Simulation' },
          { type: 'explore_ideas', label: 'Explore Creative Applications' },
          { type: 'generate_content', label: 'Draft Platform Content Assets' }
        ]
      }
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Chat Handler with Real-Time Gemini & Google Search
  const handleSendMessage = async (query: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          brand: currentBrand,
          activeTrends: trends,
          history: messages.slice(-4)
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          structuredInsight: data.structuredInsight,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `asst-fallback-${Date.now()}`,
        role: 'assistant',
        content: `### 📊 Social Intelligence Analysis for ${currentBrand.name}\n\nEvaluated query: **"${query}"** against current brand profile and active listening streams.\n\n- **Recommendation:** Prioritize high-safety cultural swagger formats.\n- **Forecast:** Estimated reach lift of +32% across target demographic.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTrend = (trend: SocialTrend) => {
    setSelectedTrend(trend);
    setIsTrendDNAModalOpen(true);
  };

  const handleOpenWhatIfForTrend = (trend: SocialTrend) => {
    setSelectedTrend(trend);
    setSimulation((prev) => ({
      ...prev,
      trendName: trend.title
    }));
    setActiveStudioTab('decision_simulator');
  };

  // Firestore-backed Brand actions
  const handleAddBrand = async (newBrand: BrandProfile) => {
    await saveBrandToFirestore(newBrand);
    setCurrentBrand(newBrand);
  };

  // Firestore-backed Decision actions
  const handleCommitDecision = async (record: DecisionRecord) => {
    await saveDecisionToFirestore(record);
  };

  // Firestore-backed Trend stream addition
  const handleAddStreamSource = async (sourceName: string, category: string) => {
    const newTrend: SocialTrend = {
      id: `trend-${Date.now()}`,
      title: sourceName.split('/').pop()?.replace(/[-_]/g, ' ') || 'New Social Signal',
      category,
      originPlatform: 'TikTok',
      firstDetected: 'Real-time Signal',
      heatLevel: 'High',
      quoteExample: 'Emerging audio pattern detected by stream.',
      dna: {
        phraseOrTopic: sourceName,
        emotion: 'Curiosity & intrigue',
        culturalContext: 'Direct audio stream from social feeds.',
        tone: 'Fresh & energetic',
        formats: ['Reel', 'TikTok'],
        targetAudienceEstimate: '18-34',
        velocity: 86,
        platformSpread: ['TikTok', 'Instagram'],
        lifecycle: 'heating',
        brandSafetyScore: 90,
        commercialAdaptability: 88,
        recommendedLifespanDays: 7,
        underlyingPattern: {
          patternName: 'Audio Sync Trend',
          linguisticStructure: 'Punchy cadence',
          rhythm: 'Upbeat beat drop',
          socialFunction: 'Viral mimicry',
          brandSafeAdaptations: ['Showcase product reveal on beat drop.']
        }
      },
      fitScores: {
        [currentBrand.id]: {
          audienceRelevance: 88,
          brandRelevance: 84,
          culturalRelevance: 90,
          commercialPotential: 85,
          timing: 92,
          saturationRisk: 20,
          brandSafety: 90,
          overallScore: 87
        }
      },
      recommendation: 'act_now',
      ideas: [
        {
          id: 'idea-stream-1',
          number: 1,
          category: 'Promotional',
          headline: 'Stream Beat Drop Product Reveal',
          hook: 'Wait for the beat drop...',
          format: 'Reel (9:16)',
          targetPlatform: 'Instagram',
          commercialAngle: 'Showcase product quality during peak audio tempo',
          sampleCopy: 'The reveal you did not know you needed. Tap link in bio.'
        }
      ]
    };
    await saveTrendToFirestore(newTrend);
  };

  // Firestore-backed Campaign Briefs actions
  const handleSaveBrief = async (brief: CampaignBrief) => {
    await saveCampaignToFirestore(brief);
  };

  const handleDeleteBrief = async (briefId: string) => {
    await deleteCampaignFromFirestore(briefId);
  };

  // Firestore-backed Scheduled Posts actions
  const handleAddScheduledPost = async (post: ScheduledPost) => {
    await saveScheduledPostToFirestore(post);
  };

  const handleUpdatePostStatus = async (postId: string, status: ScheduledPost['status']) => {
    const post = scheduledPosts.find((p) => p.id === postId);
    if (post) {
      await saveScheduledPostToFirestore({ ...post, status });
    }
  };

  const handleDeletePost = async (postId: string) => {
    await deleteScheduledPostFromFirestore(postId);
  };

  // Cross-post logs handler
  const handleAddCrossPostLogs = (newLogs: CrossPostLog[]) => {
    setCrossPostLogs((prev) => [...newLogs, ...prev]);
  };

  // Direct publish from Calendar or Creator
  const handleDirectPublish = async (post: Partial<ScheduledPost>) => {
    try {
      const res = await fetch('/api/social/cross-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: currentBrand.id,
          postTitle: post.title || 'Live Social Post',
          platforms: [
            {
              platform: post.platform || 'instagram',
              content: `${post.hook || ''}\n\n${post.caption || ''}\n\n${(post.hashtags || []).join(' ')}`,
              format: post.format || 'single_image',
              mediaUrl: currentBrand.logoUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80'
            }
          ]
        })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.results) {
          handleAddCrossPostLogs(result.results);
          if (post.id) {
            await handleUpdatePostStatus(post.id, 'published');
          }
          setAppViewMode('omnichannel_crosspost');
        }
      }
    } catch (e) {
      console.error('Direct publish error:', e);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#111213] text-gray-200 font-sans antialiased flex flex-col justify-start items-center overflow-x-hidden">
      <div className="w-full max-w-[1920px] h-screen flex flex-col bg-[#171819] border-x border-[#25272a] shadow-2xl overflow-hidden relative">
        {/* Top Header */}
        <Header
          currentBrand={currentBrand}
          brands={brands.length > 0 ? brands : [defaultCleanBrand]}
          trendWatcherStatus={trendWatcherStatus}
          onSelectBrand={setCurrentBrand}
          onOpenWhatIfSandbox={() => {
            setAppViewMode('social_brain');
            setActiveStudioTab('decision_simulator');
          }}
          onOpenAddSource={() => setIsAddSourceModalOpen(true)}
          onExportReport={() => {
            setAppViewMode('social_brain');
            setActiveStudioTab('reports');
          }}
          onCleanSlate={handleCleanSlate}
          onTriggerLiveSearch={() => fetchLiveRealtimeTrends()}
          isSearchingLive={isSearchingLive}
        />

        {/* Main Studio Navigation Tabs */}
        <NavigationTabs
          activeView={appViewMode}
          onSelectView={setAppViewMode}
          scheduledCount={scheduledPosts.length}
          briefsCount={campaignBriefs.length}
          safetyAlertsCount={0}
        />

        {/* High-Potential Opportunity Notification Alert Banner */}
        {highPotentialAlert && (
          <div className="bg-gradient-to-r from-emerald-950 via-cyan-950 to-blue-950 border-b border-emerald-500/40 px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 duration-300 select-none z-10">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-300">🔥 Trend Watcher High-Potential Opportunity: </span>
              <span className="text-white font-semibold">"{highPotentialAlert.trend.title}"</span>
              <span className="text-gray-300 ml-2 hidden sm:inline font-mono">
                ({highPotentialAlert.growthPotential} • Fit Score: {highPotentialAlert.trend.fitScores[currentBrand.id]?.overallScore || 95}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedTrend(highPotentialAlert.trend);
                setIsTrendDNAModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-[11px] font-medium transition-colors cursor-pointer"
            >
              Inspect DNA
            </button>
            <button
              onClick={() => {
                handleOpenWhatIfForTrend(highPotentialAlert.trend);
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Simulate ROI
            </button>
            <button
              onClick={() => {
                setActiveContentTrendTitle(highPotentialAlert.trend.title);
                setIsContentModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors cursor-pointer hidden md:inline-flex"
            >
              Auto-Draft Copy
            </button>
            <button
              onClick={() => setHighPotentialAlert(null)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title="Dismiss Alert"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Main Workspace View Switcher */}
      {appViewMode === 'social_brain' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Sources & Brains Sidebar */}
          <SourcesPanel
            currentBrand={currentBrand}
            trends={trends}
            competitors={competitors}
            decisionHistory={decisionHistory}
            selectedTrend={selectedTrend}
            trendWatcherStatus={trendWatcherStatus}
            onToggleTrendWatcher={() => {
              setTrendWatcherStatus((prev) => ({ ...prev, enabled: !prev.enabled }));
            }}
            onChangeTrendWatcherInterval={(intervalMinutes) => {
              const nextTime = new Date(Date.now() + intervalMinutes * 60 * 1000);
              setTrendWatcherStatus((prev) => ({
                ...prev,
                intervalMinutes,
                nextPollAt: nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }));
            }}
            onTriggerTrendWatcherPoll={() => {
              fetchLiveRealtimeTrends(undefined, true);
            }}
            onSelectTrend={handleSelectTrend}
            onOpenWhatIfForTrend={handleOpenWhatIfForTrend}
            onOpenAddSource={() => setIsAddSourceModalOpen(true)}
            onQuickQuery={handleSendMessage}
          />

          {/* Center: Social Intelligence Canvas */}
          <CenterCanvas
            currentBrand={currentBrand}
            activeTrends={trends}
            selectedTrend={selectedTrend}
            messages={messages}
            campaigns={campaignBriefs}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onOpenStudioTab={setActiveStudioTab}
            onOpenTrendDNA={(t) => {
              setSelectedTrend(t);
              setIsTrendDNAModalOpen(true);
            }}
            onOpenContentModal={(title) => {
              setActiveContentTrendTitle(title);
              setIsContentModalOpen(true);
            }}
          />

          {/* Right: Interaction Studio Drawer */}
          <InteractionStudio
            currentBrand={currentBrand}
            trends={trends}
            selectedTrend={selectedTrend}
            activeStudioTab={activeStudioTab}
            onSelectStudioTab={setActiveStudioTab}
            audioData={audioData}
            onUpdateAudioData={(newData) => {
              setAudioData(newData);
            }}
            slideDeck={slideDeck}
            videoData={videoData}
            mindMap={mindMap}
            report={report}
            flashcards={flashcards}
            quizQuestions={quizQuestions}
            infographics={infographics}
            dataTable={dataTable}
            simulation={simulation}
            onCommitDecision={handleCommitDecision}
          />
        </div>
      )}

      {appViewMode === 'campaign_briefs' && (
        <CampaignBriefStudio
          currentBrand={currentBrand}
          briefs={campaignBriefs}
          onSaveBrief={handleSaveBrief}
          onDeleteBrief={handleDeleteBrief}
          onDraftPostsFromBrief={(_brief) => {
            setAppViewMode('post_creator');
          }}
          onGenerateCalendarFromBrief={(_brief) => {
            setAppViewMode('content_calendar');
          }}
        />
      )}

      {appViewMode === 'post_creator' && (
        <PostCreatorStudio
          currentBrand={currentBrand}
          onSchedulePost={(post) => {
            handleAddScheduledPost(post);
            setAppViewMode('content_calendar');
          }}
          onCrossPostNow={(post) => {
            handleDirectPublish(post);
          }}
        />
      )}

      {appViewMode === 'omnichannel_crosspost' && (
        <OmnichannelCrossPostStudio
          currentBrand={currentBrand}
          connectedAccounts={connectedAccounts}
          crossPostLogs={crossPostLogs}
          onAddLogs={handleAddCrossPostLogs}
        />
      )}

      {appViewMode === 'content_calendar' && (
        <ContentCalendarStudio
          currentBrand={currentBrand}
          scheduledPosts={scheduledPosts}
          onAddPost={handleAddScheduledPost}
          onUpdatePostStatus={handleUpdatePostStatus}
          onDeletePost={handleDeletePost}
          onDirectPublish={handleDirectPublish}
        />
      )}

      {appViewMode === 'performance_analytics' && (
        <PerformanceAnalyticsStudio
          currentBrand={currentBrand}
          themes={performanceThemes}
          recommendations={futureRecommendations}
          onApplyRecommendationAsDraft={(_rec) => {
            setAppViewMode('post_creator');
          }}
        />
      )}

      {appViewMode === 'brand_guardrails' && (
        <BrandGuardrailStudio currentBrand={currentBrand} />
      )}

      {/* Trend DNA Inspector Modal */}
      {selectedTrend && (
        <TrendDNAInspectorModal
          trend={selectedTrend}
          brand={currentBrand}
          isOpen={isTrendDNAModalOpen}
          onClose={() => setIsTrendDNAModalOpen(false)}
          onSimulateTrend={handleOpenWhatIfForTrend}
          onDraftContent={(title) => {
            setActiveContentTrendTitle(title);
            setIsContentModalOpen(true);
          }}
        />
      )}

      {/* Add Source Modal */}
      <AddSourceModal
        isOpen={isAddSourceModalOpen}
        onClose={() => setIsAddSourceModalOpen(false)}
        onAddBrand={handleAddBrand}
        onAddStreamSource={handleAddStreamSource}
      />

      {/* Platform Content Studio Modal */}
      <ContentGeneratorModal
        trendTitle={activeContentTrendTitle}
        brand={currentBrand}
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
      />
      </div>
    </div>
  );
}

export default App;
