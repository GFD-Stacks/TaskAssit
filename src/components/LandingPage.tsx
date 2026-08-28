import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  Sliders,
  Share2,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Play,
  Volume2,
  FileText,
  Video,
  BarChart3,
  Globe,
  Radio,
  Building2,
  Users,
  Award,
  ChevronRight,
  HelpCircle,
  Clock,
  Flame,
  Dna,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UserProfile } from '../types';

interface LandingPageProps {
  currentUser: UserProfile | null;
  onLaunchApp: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSelectBrandProfile?: (brandName: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentUser,
  onLaunchApp,
  onOpenAuth,
}) => {
  // Interactive Playground State
  const [activeDemoTab, setActiveDemoTab] = useState<'dna' | 'sandbox' | 'omnichannel'>('dna');
  const [selectedSignalIndex, setSelectedSignalIndex] = useState(0);
  const [simulationBudget, setSimulationBudget] = useState(1500000); // 1.5M Naira
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const lagosSignals = [
    {
      title: 'Lagos Fashion Week Silk Jacquard Wave',
      platform: 'Instagram & TikTok',
      heat: 'Explosive (98%)',
      culturalContext: 'Contemporary African heritage and bespoke hand-woven jacquards taking over Victoria Island & London diaspora feeds.',
      linguisticPattern: '“Eko elegance meets modern swagger — unapologetically bespoke”',
      recommendation: 'Act Now: Launch limited atelier release with 9:16 craftsmanship reel.',
      fitScore: 96,
      brandAction: 'Bespoke Atelier Reveal'
    },
    {
      title: '“Omo No Try Me Oo” Audio Sync Momentum',
      platform: 'TikTok & Reels',
      heat: 'Viral Surge (92%)',
      culturalContext: 'High-energy Afrobeats rhythm and witty confidence chant used across Lagos youth and creative executives.',
      linguisticPattern: 'Fast tempo 128 BPM sync with dramatic outfit change at drop',
      recommendation: 'Act Now: Pair high-contrast runway transition with authentic Lagos attitude.',
      fitScore: 92,
      brandAction: 'Rapid Audio Sync'
    },
    {
      title: 'Lekki Golden Hour Aesthetic & Sunday Brunch Culture',
      platform: 'Instagram & Pinterest',
      heat: 'High (88%)',
      culturalContext: 'Understated luxury, rooftop sunsets, and curated social dining across Lekki Phase 1 and Ikoyi.',
      linguisticPattern: 'Warm tone grading, relaxed poise, conversational luxury captions',
      recommendation: 'Prepare: Schedule Sunday carousel showcasing relaxed weekend luxury.',
      fitScore: 89,
      brandAction: 'Curated Carousel'
    }
  ];

  const faqs = [
    {
      q: 'How does TaskAssit differ from generic global AI models like ChatGPT?',
      a: 'Generic AI models lack contextual knowledge of West African cultural nuances, local slang (Nigerian Pidgin, Yoruba/Igbo cultural idioms), Lagos traffic peak posting hours (WAT timezone 6:30 PM – 10:30 PM), and Nigerian advertising regulations (ARCON). TaskAssit provides culturally calibrated intelligence that guarantees high resonance and compliance.'
    },
    {
      q: 'How does the Monte Carlo Decision Simulator work?',
      a: 'The Decision Sandbox models your marketing campaigns against historical Nigerian consumer behavior, audience saturation rates, budget allocations in Naira (₦) or USD ($), and platform algorithms. It provides expected reach, trust scores, and 7-day performance trajectories before you spend your budget.'
    },
    {
      q: 'Does TaskAssit ensure Nigerian ARCON advertising compliance?',
      a: 'Yes. Our Brand Guardrail Studio features an automated ARCON safety scanner that flags unverified superlatives, prohibited promotional claims, and deceptive phrasing, offering instant brand-safe rewrites.'
    },
    {
      q: 'Can I generate audio podcasts, slide decks, and video scripts?',
      a: 'TaskAssit includes 10 Multi-Modal Studios. With one click, you can generate 2-host audio briefings, executive slide decks, video scene breakdowns, mind maps, SWOT reports, flashcards, quizzes, and live data tables.'
    },
    {
      q: 'Can our team collaborate with live database synchronization?',
      a: 'Yes! TaskAssit connects directly to Google Cloud Firestore with real-time reactive updates, enabling synchronized multi-brand management, campaign workflows, and scheduled cross-posting.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#131415] text-gray-100 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/50 to-purple-900/40 border-b border-blue-500/20 px-4 py-2 text-center text-xs text-blue-200 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-white">Lagos Cultural Engine Active:</span>
        <span>Monitoring real-time social signals across Victoria Island, Lekki & Global Diaspora (WAT Timezone)</span>
        <button
          onClick={onLaunchApp}
          className="ml-2 font-bold underline hover:text-white inline-flex items-center gap-1 cursor-pointer"
        >
          Enter Studio <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* 2. NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#18191a]/90 border-b border-[#2d2f31] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-100 text-lg tracking-tight">TaskAssit</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Lagos & Diaspora
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-gray-300 font-medium">
          <a href="#features" className="hover:text-blue-400 transition-colors">Features & DNA</a>
          <a href="#interactive-demo" className="hover:text-blue-400 transition-colors">Live Simulation</a>
          <a href="#studios" className="hover:text-blue-400 transition-colors">10 Multi-Modal Studios</a>
          <a href="#why-lagos" className="hover:text-blue-400 transition-colors">Cultural Intelligence</a>
          <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing (₦ / $)</a>
          <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
        </nav>

        {/* Auth / Action CTA */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onLaunchApp}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-3.5 py-2 text-xs text-gray-300 hover:text-white font-medium hover:bg-[#282a2c] rounded-xl transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative px-4 sm:px-8 pt-12 sm:pt-20 pb-16 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Hero Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#242527] border border-[#3c4043] text-xs text-gray-300 mb-6 shadow-sm">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-white">Lagos & African Diaspora Cultural Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-emerald-400">94% Calibrated Accuracy</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15] mb-6">
          The AI Social Brain for{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            Lagos & African
          </span>{' '}
          Cultural Authority
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed mb-8">
          Deconstruct explosive cultural signals into calibrated brand campaigns, ARCON-compliant creative assets, and cross-platform revenue before spending a single Naira.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-12 w-full justify-center">
          <button
            onClick={onLaunchApp}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Launch Live Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onOpenAuth('signup')}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#242527] hover:bg-[#2e3033] border border-[#3c4043] text-gray-200 font-semibold text-sm rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Create Free Agency Account</span>
          </button>
        </div>

        {/* Trust Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl p-4 sm:p-6 bg-[#1a1b1c]/80 border border-[#2d2f31] rounded-2xl backdrop-blur-sm">
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">500+</div>
            <div className="text-xs text-gray-400 mt-0.5">Lagos Campaigns Tested</div>
          </div>
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">94.2%</div>
            <div className="text-xs text-gray-400 mt-0.5">Simulation Accuracy</div>
          </div>
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">₦380M+</div>
            <div className="text-xs text-gray-400 mt-0.5">Attributed Value</div>
          </div>
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">10</div>
            <div className="text-xs text-gray-400 mt-0.5">Multi-Modal Studios</div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE LIVE DEMO & PLAYGROUND */}
      <section id="interactive-demo" className="px-4 sm:px-8 py-16 bg-[#18191a] border-y border-[#2d2f31]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="text-xs uppercase font-bold tracking-wider text-blue-400">Interactive Studio Preview</div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">Test the Cultural Intelligence Engine</h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
              Experience real-time trend decomposition, budget simulations, and omnichannel adaptations directly in this interactive sandbox.
            </p>
          </div>

          {/* Interactive Playground Container */}
          <div className="bg-[#1e1f20] border border-[#3c4043] rounded-3xl shadow-2xl overflow-hidden">
            {/* Playground Tabs */}
            <div className="flex border-b border-[#2d2f31] bg-[#242527] overflow-x-auto">
              <button
                onClick={() => setActiveDemoTab('dna')}
                className={`px-5 py-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeDemoTab === 'dna'
                    ? 'border-blue-500 text-blue-400 bg-[#1e1f20]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Dna className="w-4 h-4 text-blue-400" />
                <span>1. Trend DNA Deconstruction</span>
              </button>

              <button
                onClick={() => setActiveDemoTab('sandbox')}
                className={`px-5 py-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeDemoTab === 'sandbox'
                    ? 'border-blue-500 text-blue-400 bg-[#1e1f20]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>2. Monte Carlo Budget Sandbox</span>
              </button>

              <button
                onClick={() => setActiveDemoTab('omnichannel')}
                className={`px-5 py-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeDemoTab === 'omnichannel'
                    ? 'border-blue-500 text-blue-400 bg-[#1e1f20]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>3. 1-Click Omnichannel Adaptation</span>
              </button>
            </div>

            {/* TAB 1: TREND DNA PLAYGROUND */}
            {activeDemoTab === 'dna' && (
              <div className="p-5 sm:p-8 space-y-6">
                <div className="flex flex-wrap gap-2">
                  {lagosSignals.map((sig, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSignalIndex(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        selectedSignalIndex === idx
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          : 'bg-[#282a2c] text-gray-300 hover:bg-[#333538]'
                      }`}
                    >
                      {sig.title}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left: Signal Context */}
                  <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Heat Level</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                        {lagosSignals[selectedSignalIndex].heat}
                      </span>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400">Cultural Context</div>
                      <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                        {lagosSignals[selectedSignalIndex].culturalContext}
                      </p>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400">Origin Channels</div>
                      <span className="text-xs font-semibold text-blue-300">
                        {lagosSignals[selectedSignalIndex].platform}
                      </span>
                    </div>
                  </div>

                  {/* Center: Linguistic DNA & Rhythm */}
                  <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-3">
                    <div className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Linguistic Pattern & Rhythm
                    </div>
                    <div className="p-3 bg-[#1e1f20] rounded-xl border border-[#3c4043] text-xs italic text-gray-300">
                      {lagosSignals[selectedSignalIndex].linguisticPattern}
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] text-gray-400">ARCON Brand Safety Score</div>
                      <div className="w-full bg-[#1e1f20] h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[96%]" />
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Strategic Fit & Action */}
                  <div className="p-4 bg-gradient-to-br from-blue-950/40 to-indigo-950/40 rounded-2xl border border-blue-500/30 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-blue-300 font-medium">Brand Fit Score</span>
                        <span className="text-lg font-bold text-white">
                          {lagosSignals[selectedSignalIndex].fitScore}/100
                        </span>
                      </div>
                      <div className="text-xs text-gray-200 mt-2">
                        {lagosSignals[selectedSignalIndex].recommendation}
                      </div>
                    </div>

                    <button
                      onClick={onLaunchApp}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Simulate in Full Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MONTE CARLO BUDGET SANDBOX */}
            {activeDemoTab === 'sandbox' && (
              <div className="p-5 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#242527] rounded-2xl border border-[#3c4043]">
                  <div>
                    <div className="text-xs font-semibold text-gray-200">Interactive Campaign Budget Slider</div>
                    <div className="text-[11px] text-gray-400">Simulate expected reach, engagement lift, and trust impact in Lagos</div>
                  </div>
                  <div className="text-xl font-bold text-emerald-400">
                    ₦{simulationBudget.toLocaleString()} <span className="text-xs text-gray-400 font-normal">(${(simulationBudget / 1500).toFixed(0)} USD)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min={250000}
                    max={10000000}
                    step={250000}
                    value={simulationBudget}
                    onChange={(e) => setSimulationBudget(Number(e.target.value))}
                    className="w-full h-2 bg-[#282a2c] rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>₦250k (Micro-Campaign)</span>
                    <span>₦5.0M (Mid-Tier Push)</span>
                    <span>₦10.0M (Full Lagos Takeover)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] text-center">
                    <div className="text-xs text-gray-400">Projected Reach</div>
                    <div className="text-xl font-extrabold text-blue-400 mt-1">
                      {((simulationBudget / 1500) * 120).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Victoria Island, Lekki & Diaspora</div>
                  </div>

                  <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] text-center">
                    <div className="text-xs text-gray-400">Confidence Calibration</div>
                    <div className="text-xl font-extrabold text-emerald-400 mt-1">94.8%</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Based on 64 evaluated campaigns</div>
                  </div>

                  <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] text-center">
                    <div className="text-xs text-gray-400">Expected ROI Multiplier</div>
                    <div className="text-xl font-extrabold text-purple-400 mt-1">
                      {(3.4 + (simulationBudget / 10000000)).toFixed(1)}x
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">High-intent conversions</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: OMNICHANNEL PLAYGROUND */}
            {activeDemoTab === 'omnichannel' && (
              <div className="p-5 sm:p-8 space-y-4">
                <div className="text-xs text-gray-300">
                  <span className="font-semibold text-white">Source Concept: </span>
                  “LuxeAura bespoke African silk jacquard runway collection reveal.”
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* IG Reel */}
                  <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
                      <span>Instagram Reel (9:16)</span>
                      <span className="text-[10px] text-gray-400">6:45 PM WAT</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      “When contemporary African heritage speaks, Victoria Island listens. Hand-woven silk jacquards, tailored for the few.”
                    </p>
                    <div className="text-[11px] text-blue-400 font-medium">#LagosLuxury #LuxeAuraMaison #EkoSwagger</div>
                  </div>

                  {/* X / Twitter Thread */}
                  <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-blue-400">
                      <span>X Thread (Cultural Angle)</span>
                      <span className="text-[10px] text-gray-400">8:15 PM WAT</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      “1/ Why luxury fashion in Lagos is outperforming global fast fashion: it comes down to genuine artisan provenance and bespoke exclusivity. 🧵👇”
                    </p>
                    <div className="text-[11px] text-blue-400 font-medium">#LagosFashionWeek #DiasporaLuxury</div>
                  </div>

                  {/* LinkedIn */}
                  <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-400">
                      <span>LinkedIn (Creative Leadership)</span>
                      <span className="text-[10px] text-gray-400">11:30 AM WAT</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      “Building high-margin African luxury requires more than aesthetics—it demands deep cultural resonance and zero brand-safety compromise.”
                    </p>
                    <div className="text-[11px] text-blue-400 font-medium">#CreativeEconomy #BrandStrategy</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. 6 CORE PILLARS / FEATURES */}
      <section id="features" className="px-4 sm:px-8 py-20 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <div className="text-xs uppercase font-bold tracking-wider text-blue-400">Full Architectural Capabilities</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Engineered for Creative Precision</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
            Everything your brand or creative agency needs to discover trends, simulate outcomes, generate content, and publish safely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 bg-[#1e1f20] border border-[#3c4043] rounded-3xl space-y-3 hover:border-blue-500/40 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Dna className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-100">Trend DNA Deconstructor</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Decompose viral Lagos moments down to their underlying psychological hooks, sound design rhythms, and commercial adaptabilities.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-[#1e1f20] border border-[#3c4043] rounded-3xl space-y-3 hover:border-purple-500/40 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-100">Monte Carlo Decision Sandbox</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Simulate budget allocations in Naira (₦) or USD ($), test audience pushback, and forecast 7-day trajectories before campaign launch.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-[#1e1f20] border border-[#3c4043] rounded-3xl space-y-3 hover:border-emerald-500/40 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-100">Omnichannel Cross-Post Studio</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              One core concept automatically adapted into native formats for Instagram, TikTok, X, LinkedIn, Facebook, and YouTube Shorts.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-[#1e1f20] border border-[#3c4043] rounded-3xl space-y-3 hover:border-amber-500/40 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-100">ARCON & Safety Guardrails</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Automated compliance auditing against Nigerian advertising regulations (ARCON), preventing PR blowback and reputation damage.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 bg-[#1e1f20] border border-[#3c4043] rounded-3xl space-y-3 hover:border-rose-500/40 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-100">Automated Lagos Trend Watcher</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Continuous background polling scanning digital platforms across Victoria Island, Lekki, Yaba, and Diaspora creative circles.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 bg-[#1e1f20] border border-[#3c4043] rounded-3xl space-y-3 hover:border-indigo-500/40 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-100">WAT Peak Content Calendar</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Scheduled post queue with intelligent timing optimization specifically configured for West Africa Time (WAT) traffic peaks.
            </p>
          </div>
        </div>
      </section>

      {/* 6. 10 MULTI-MODAL STUDIOS SHOWCASE */}
      <section id="studios" className="px-4 sm:px-8 py-20 bg-[#18191a] border-y border-[#2d2f31]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="text-xs uppercase font-bold tracking-wider text-purple-400">NotebookLM-Grade Synthesis</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">10 Multi-Modal Decision Studios</h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
              Transform raw social intelligence and campaign briefs into boardroom-ready deliverables with one click.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              { icon: Volume2, label: '2-Host Audio Brief', desc: 'Lagos cultural strategist podcast synthesis', color: 'text-purple-400' },
              { icon: FileText, label: 'Executive Slide Deck', desc: 'Boardroom-ready campaign presentation', color: 'text-blue-400' },
              { icon: Video, label: 'Video Scene Breakdown', desc: '9:16 Reel & TikTok scene-by-scene script', color: 'text-rose-400' },
              { icon: BarChart3, label: 'SWOT Intelligence Report', desc: 'Deep-dive strategic market dossier', color: 'text-emerald-400' },
              { icon: Layers, label: 'Mind Map Graph', desc: 'Visual connection of trends to campaigns', color: 'text-amber-400' },
              { icon: Sliders, label: 'Decision Simulator', desc: 'Monte Carlo trajectory & ROI calibration', color: 'text-indigo-400' },
              { icon: HelpCircle, label: 'Interactive Flashcards', desc: 'Quick team knowledge alignment cards', color: 'text-pink-400' },
              { icon: Award, label: 'Team Competency Quiz', desc: 'Interactive cultural knowledge test', color: 'text-yellow-400' },
              { icon: TrendingUp, label: 'Executive Infographics', desc: 'Key performance metric visualizers', color: 'text-cyan-400' },
              { icon: Clock, label: 'Live Data Table', desc: 'Sortable multi-variant benchmark records', color: 'text-teal-400' },
            ].map((tool, idx) => {
              const IconComp = tool.icon;
              return (
                <div
                  key={idx}
                  className="p-4 bg-[#1e1f20] border border-[#3c4043] rounded-2xl flex flex-col justify-between hover:border-gray-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#282a2c] flex items-center justify-center mb-3">
                    <IconComp className={`w-4 h-4 ${tool.color}`} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-100">{tool.label}</div>
                    <div className="text-[10px] text-gray-400 mt-1 leading-tight">{tool.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. WHY GENERIC AI FAILS IN LAGOS */}
      <section id="why-lagos" className="px-4 sm:px-8 py-20 max-w-6xl mx-auto w-full space-y-10">
        <div className="text-center space-y-3">
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-400">Cultural Grounding</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why Generic AI Fails in West Africa</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            Traditional AI outputs sound robotic, miss local cultural humor, and fail Nigerian regulatory compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Generic AI Box */}
          <div className="p-6 bg-rose-950/20 border border-rose-500/30 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <span>✕ Generic Global AI Tools</span>
            </div>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Generic tone that sounds disconnected from authentic Nigerian conversations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Ignores West Africa Time (WAT) traffic peak windows (6:30 PM - 10:30 PM).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Zero knowledge of Nigerian ARCON advertising standards, risking legal bans.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>No understanding of local currency dynamics (₦ Naira) or bespoke luxury positioning.</span>
              </li>
            </ul>
          </div>

          {/* TaskAssit Box */}
          <div className="p-6 bg-emerald-950/20 border border-emerald-500/30 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <span>✓ TaskAssit Cultural Engine</span>
            </div>
            <ul className="space-y-2.5 text-xs text-gray-200">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Calibrated for Lagos swagger, authentic nuance, and witty diaspora poise.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Optimized dispatch schedules synced with Lagos Island and Mainland peak attention.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Built-in ARCON safety auditing with 1-click safe rewrites.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Native multi-currency support in Naira (₦) and USD ($).</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. PRICING SECTION (NGN / USD) */}
      <section id="pricing" className="px-4 sm:px-8 py-20 bg-[#18191a] border-y border-[#2d2f31]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="text-xs uppercase font-bold tracking-wider text-blue-400">Transparent Plans</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Simple, Predictable Agency Pricing</h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
              Choose the tier that fits your creative agency or brand portfolio.
            </p>

            {/* Currency & Billing Toggles */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="inline-flex p-1 bg-[#242527] border border-[#3c4043] rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setCurrency('NGN')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currency === 'NGN' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  ₦ NGN (Naira)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currency === 'USD' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  $ USD
                </button>
              </div>

              <div className="inline-flex p-1 bg-[#242527] border border-[#3c4043] rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    billingCycle === 'annual' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Annual (20% Off)
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="p-6 bg-[#1e1f20] border border-[#3c4043] rounded-3xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase">Starter / Creator</div>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {currency === 'NGN' ? (billingCycle === 'annual' ? '₦28,000' : '₦35,000') : (billingCycle === 'annual' ? '$30' : '$39')}
                    <span className="text-xs text-gray-400 font-normal"> / month</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Ideal for individual brand creators and boutique consultants.</p>
                </div>
                <div className="border-t border-[#2d2f31] pt-4 space-y-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Up to 2 Brand Profiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Real-time Lagos Trend DNA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>50 AI Simulations / mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Audio & Slide Deck Studios</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full py-2.5 bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Get Started
              </button>
            </div>

            {/* Pro / Agency (Featured) */}
            <div className="p-6 bg-gradient-to-b from-[#24283b] to-[#1e1f20] border-2 border-blue-500 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-xl shadow-blue-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-[10px] uppercase font-bold rounded-full shadow">
                Most Popular for Lagos Agencies
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-blue-400 uppercase">Agency Pro</div>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {currency === 'NGN' ? (billingCycle === 'annual' ? '₦68,000' : '₦85,000') : (billingCycle === 'annual' ? '$79' : '$99')}
                    <span className="text-xs text-gray-400 font-normal"> / month</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">Full-featured intelligence suite for agencies and multi-brand teams.</p>
                </div>
                <div className="border-t border-[#2d2f31] pt-4 space-y-2 text-xs text-gray-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unlimited Brand Profiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>All 10 Multi-Modal Studios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Omnichannel Dispatch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ARCON Safety & Audit Shield</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Firestore Real-Time Sync</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                Start Free 14-Day Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-6 bg-[#1e1f20] border border-[#3c4043] rounded-3xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-purple-400 uppercase">Enterprise / Maison</div>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {currency === 'NGN' ? (billingCycle === 'annual' ? '₦200,000' : '₦250,000') : (billingCycle === 'annual' ? '$239' : '$299')}
                    <span className="text-xs text-gray-400 font-normal"> / month</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Dedicated cultural fine-tuning and enterprise API access.</p>
                </div>
                <div className="border-t border-[#2d2f31] pt-4 space-y-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Custom Brand Guardrail Fine-Tuning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Direct Webhook & Meta API Integrations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>24/7 Dedicated Cultural Strategist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>SLA & Custom Contract</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full py-2.5 bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section id="faq" className="px-4 sm:px-8 py-20 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs uppercase font-bold tracking-wider text-blue-400">Frequently Asked Questions</div>
          <h2 className="text-3xl font-bold text-white">Got Questions? We’ve Got Answers</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#1e1f20] border border-[#3c4043] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left text-xs sm:text-sm font-semibold text-gray-200 flex items-center justify-between gap-4 cursor-pointer hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-blue-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-gray-400 leading-relaxed border-t border-[#2d2f31] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. BOTTOM BANNER */}
      <section className="px-4 sm:px-8 py-16 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border-t border-[#2d2f31] text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Lead Cultural Conversations in Lagos & Beyond?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Join premier West African luxury fashion houses, fintechs, and creative agencies leveraging TaskAssit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
            >
              Launch Live Studio
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#242527] hover:bg-[#2e3033] border border-[#3c4043] text-gray-200 font-semibold text-xs sm:text-sm rounded-2xl transition-colors cursor-pointer"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="border-t border-[#2d2f31] bg-[#141516] px-4 sm:px-8 py-8 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-gray-300">TaskAssit</span>
          <span>— Lagos & Global Diaspora AI Social Intelligence</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400 text-[11px]">
          <span>© 2026 TaskAssit Inc.</span>
          <span>ARCON Advertising Certified</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            WAT Signals Operational
          </span>
        </div>
      </footer>
    </div>
  );
};
