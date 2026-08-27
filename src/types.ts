export type StudioToolType =
  | 'decision_simulator'
  | 'audio_overview'
  | 'slide_deck'
  | 'video_overview'
  | 'mind_map'
  | 'reports'
  | 'flashcards'
  | 'quiz'
  | 'infographic'
  | 'data_table';

export interface BrandProfile {
  id: string;
  name: string;
  industry: string;
  tagline: string;
  voice: string;
  primaryAudience: string;
  secondaryAudience: string;
  geographicMarket: string;
  prohibitedContent: string[];
  toneKeywords: string[];
  historicalPerformance: {
    topFormat: string;
    avgEngagement?: string;
    primaryObjection: string;
    totalCampaignsEvaluated: number;
    modelCalibrationAccuracy: number;
  };
}

export type TrendLifecycle = 'emerging' | 'heating' | 'viral' | 'mainstream' | 'saturating' | 'dead';
export type RecommendationAction = 'act_now' | 'prepare' | 'monitor' | 'do_not_use';

export interface TrendDNA {
  phraseOrTopic: string;
  emotion: string;
  culturalContext: string;
  tone: string;
  formats: string[];
  targetAudienceEstimate: string;
  velocity: number; // 0-100
  platformSpread: string[];
  lifecycle: TrendLifecycle;
  brandSafetyScore: number;
  commercialAdaptability: number;
  recommendedLifespanDays: number;
  underlyingPattern: {
    patternName: string;
    linguisticStructure: string;
    rhythm: string;
    socialFunction: string;
    brandSafeAdaptations: string[];
  };
}

export interface TrendFitScore {
  audienceRelevance: number;
  brandRelevance: number;
  culturalRelevance: number;
  commercialPotential: number;
  timing: number;
  saturationRisk: number;
  brandSafety: number;
  overallScore: number;
}

export interface StrategicIdea {
  id: string;
  number: number;
  category: string;
  headline: string;
  hook: string;
  format: string;
  targetPlatform: string;
  commercialAngle: string;
  sampleCopy: string;
}

export interface SocialTrend {
  id: string;
  title: string;
  category: string;
  dna: TrendDNA;
  fitScores: Record<string, TrendFitScore>;
  recommendation: RecommendationAction;
  doNotUseReason?: string;
  ideas: StrategicIdea[];
  originPlatform: string;
  firstDetected: string;
  heatLevel: 'High' | 'Rising' | 'Explosive' | 'Moderate' | 'Cooling';
  quoteExample: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  name: string;
  strategyType: 'organic' | 'paid_amplification' | 'influencer_collab' | 'ignore_monitor';
  expectedReach: string;
  brandRisk: 'Low' | 'Medium' | 'High';
  estimatedLifespan: string;
  expectedEngagement: string;
  confidenceScore: number;
  estimatedCost: string;
  costNumeric: number;
  expectedLeads: string;
  trustImpact: string;
  roiScore: number;
  description: string;
}

export interface DecisionSimulation {
  id: string;
  decisionNumber: string;
  trendId?: string;
  trendName: string;
  brandId: string;
  timestamp?: string;
  parameters: {
    timeHorizon: string;
    budget: number;
    budgetCurrency: string;
    demographic: {
      age: string;
      location: string;
    };
    contentType: string;
    platform: string;
  };
  options: DecisionOption[];
  selectedOptionId?: string;
  dataClassification: {
    historicalData: string;
    forecast: string;
    scenarioAssumptions: string;
    aiConfidence: number;
    unknownFactors: string;
  };
  trajectories: {
    day: number;
    organicReach: number;
    paidReach: number;
    influencerReach: number;
    engagementRate: number;
  }[];
}

export interface DecisionRecord {
  id: string;
  decisionCode: string;
  date: string;
  brandId: string;
  question: string;
  selectedOption: string;
  budget: string;
  expectedReach?: string;
  actualReach?: string;
  variance?: string;
  learningSummary?: string;
}

export interface CompetitorShift {
  id: string;
  competitorName: string;
  brandId: string;
  previousStrategy: string;
  currentStrategy: string;
  whyItMatters: string;
  recommendedResponse: string;
  detectedDate: string;
  threatLevel: 'Low' | 'Moderate' | 'Critical';
}

export interface GeneratedContentAsset {
  id: string;
  trendTitle: string;
  platform: string;
  format: string;
  hook: string;
  bodyCopy: string;
  callToAction: string;
  visualBrief: string;
  audioRecommendation: string;
  hashtags: string[];
  safetyCheck: boolean;
  status: string;
  scheduledTime?: string;
}

export interface StudioAudioOverview {
  title: string;
  subtitle: string;
  durationSeconds: number;
  durationFormatted: string;
  tonePreset?: string;
  speakers: {
    name: string;
    role: string;
    avatarColor: string;
    gender?: 'female' | 'male' | 'neutral';
    personality?: string;
    tone?: string;
  }[];
  keyTakeaways: string[];
  chapters: { timeFormatted: string; timeSeconds: number; title: string }[];
  transcript: {
    time: string;
    speaker: string;
    text: string;
  }[];
}

export interface SlideItem {
  slideNumber: number;
  title: string;
  subtitle: string;
  bullets: string[];
  metricLabel?: string;
  metricValue?: string;
  strategicNote: string;
}

export interface StudioSlideDeck {
  title: string;
  subtitle: string;
  slides: SlideItem[];
}

export interface VideoScene {
  sceneNumber: number;
  title: string;
  startSecond: number;
  endSecond: number;
  narration: string;
  visualType: 'motion_chart' | 'split_bar' | 'radar_chart' | 'creative_mockup' | 'matrix';
}

export interface StudioVideoOverview {
  title: string;
  subtitle: string;
  durationSeconds: number;
  durationFormatted: string;
  scenes: VideoScene[];
}

export interface MindMapNode {
  id: string;
  label: string;
  type: 'root' | 'trend' | 'pattern' | 'brand_fit' | 'strategy' | 'campaign' | 'asset';
  description: string;
  x: number;
  y: number;
}

export interface StudioMindMap {
  title: string;
  nodes: MindMapNode[];
  connections: { from: string; to: string }[];
}

export interface StudioReport {
  title: string;
  generatedAt: string;
  executiveSummary: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  sections: {
    heading: string;
    content: string;
    metrics?: Record<string, string>;
  }[];
  recommendationMatrix: {
    priority: 'High' | 'Medium' | 'Low';
    action: string;
    timeline: string;
    expectedImpact: string;
    riskLevel: string;
  }[];
}

export interface StudioFlashcard {
  id: string;
  category: string;
  front: string;
  back: string;
  context?: string;
}

export interface StudioQuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface StudioInfographic {
  id: string;
  title: string;
  category: string;
  value: string;
  unit?: string;
  insight: string;
}

export interface StudioDataTable {
  title: string;
  subtitle: string;
  totalRecords: number;
  columns: { key: string; label: string; sortable?: boolean }[];
  rows: Record<string, any>[];
}

export interface StructuredSocialInsight {
  whatIsHappening: string;
  whyIsItHappening: string;
  whatItMeansForBrand: string;
  strategicRecommendation: string;
  outcomeForecast: string;
  confidenceScore: number;
  brandFitScore: number;
  actionTriggers?: {
    type: 'simulate' | 'explore_ideas' | 'generate_content' | 'view_dna' | 'publish';
    label: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  structuredInsight?: StructuredSocialInsight;
}

export type AppViewMode =
  | 'social_brain'
  | 'campaign_briefs'
  | 'post_creator'
  | 'omnichannel_crosspost'
  | 'content_calendar'
  | 'performance_analytics'
  | 'brand_guardrails';

export type SocialPlatformType =
  | 'instagram'
  | 'tiktok'
  | 'x'
  | 'linkedin'
  | 'facebook'
  | 'youtube'
  | 'pinterest';

export type ContentFormatType =
  | 'reel'
  | 'carousel'
  | 'single_image'
  | 'thread'
  | 'long_form_article'
  | 'short_video'
  | 'story'
  | 'text_post';

export interface CampaignBrief {
  id: string;
  brandId: string;
  title: string;
  campaignType: 'product_launch' | 'brand_awareness' | 'seasonal_event' | 'lead_gen' | 'community' | 'flash_sale';
  targetAudience: string;
  primaryProductOrEvent: string;
  keyMessage: string;
  corePillars: string[];
  budget: string;
  timeline: string;
  targetPlatforms: SocialPlatformType[];
  deliverablesCount: number;
  status: 'draft' | 'active' | 'completed' | 'archived';
  generatedAt: string;
  suggestedHooks: string[];
  suggestedHashtags: string[];
  suggestedCTAs: string[];
  strategicNotes: string;
}

export interface ScheduledPost {
  id: string;
  brandId: string;
  campaignId?: string;
  campaignTitle?: string;
  title: string;
  platform: SocialPlatformType;
  format: ContentFormatType;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  mediaUrl?: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM AM/PM
  isOptimalTime: boolean;
  timeRecommendationReason?: string;
  status: 'draft' | 'scheduled' | 'published' | 'needs_review';
  safetyScore: number;
  safetyFlags: string[];
  audienceSegment?: string;
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    reach: number;
    ctr: number;
  };
}

export interface AdaptedPlatformPost {
  platform: SocialPlatformType;
  format: ContentFormatType;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  characterCount: number;
  maxCharacters: number;
  optimalPostingTime: string;
  timeReason: string;
  tone: string;
  visualDirection: string;
  audioSuggestion?: string;
  safetyScore: number;
}

export interface OmnichannelAdaptation {
  id: string;
  sourceContent: string;
  coreTopic: string;
  targetAudience: string;
  posts: Record<SocialPlatformType, AdaptedPlatformPost>;
  createdAt: string;
}

export interface ConnectedPlatformAccount {
  id: string;
  platform: SocialPlatformType;
  name: string;
  handle: string;
  avatarUrl: string;
  isConnected: boolean;
  followerCount: string;
  lastSynced: string;
  status: 'active' | 'ready' | 'token_refresh_needed';
  apiRateLimitRemaining: number;
}

export interface CrossPostLog {
  id: string;
  timestamp: string;
  platform: SocialPlatformType;
  handle: string;
  status: 'dispatched' | 'success' | 'queued' | 'failed';
  responseTimeMs: number;
  postUrl?: string;
  postTitle: string;
  format: string;
  payloadSummary: string;
}

export interface PerformanceTheme {
  id: string;
  themeName: string;
  category: string;
  postCount: number;
  avgEngagementRate: number; // e.g. 8.4%
  conversionRate?: number; // e.g. 4.2%
  attributedRevenue?: number; // e.g. 3800000 in local currency or USD
  viralityIndex?: number; // 0 - 100
  growthScore?: number; // 0 - 100
  originatingSignal?: string; // Social signal that triggered this theme
  totalReach: number;
  avgLikes: number;
  avgShares: number;
  avgClicks: number;
  roiMultiplier: number; // e.g. 4.2x
  trendStatus: 'rising' | 'steady' | 'declining';
  recommendation: string;
  examplePostTitle: string;
  platformBreakdown?: Partial<Record<SocialPlatformType, {
    engagementRate: number;
    conversionRate: number;
    roi: number;
    reach: number;
    growthRating: 'exceptional' | 'high' | 'moderate' | 'low';
  }>>;
}

export interface TrendWatcherStatus {
  enabled: boolean;
  intervalMinutes: number; // e.g. 30
  lastPolledAt: string | null;
  nextPollAt: string | null;
  isPolling: boolean;
  totalPollsCount: number;
  highPotentialCount: number;
  lastOpportunityFound?: {
    id: string;
    title: string;
    score: number;
    platform: string;
    detectedAt: string;
    summary: string;
    suggestedHook: string;
    growthPotential: string;
  } | null;
}

export interface FutureContentRecommendation {
  id: string;
  title: string;
  pillar: string;
  reason: string;
  basedOnMetric: string;
  recommendedFormat: ContentFormatType;
  recommendedPlatform: SocialPlatformType;
  recommendedDayTime: string;
  projectedEngagementLift: string;
  suggestedHook: string;
  suggestedHashtags: string[];
  suggestedCTA: string;
}

export interface BrandSafetyAudit {
  id?: string;
  textAnalyzed?: string;
  safetyScore: number; // 0 - 100
  isApproved?: boolean;
  status?: 'approved' | 'warning' | 'flagged';
  flags: {
    category: string;
    severity: 'high' | 'medium' | 'low';
    textSnippet?: string;
    issue?: string;
    reason?: string;
    recommendation?: string;
    suggestedFix?: string;
  }[];
  summary?: string;
  safeRewrite?: string;
  safeRewrittenCopy?: string;
  checkedAt?: string;
}
