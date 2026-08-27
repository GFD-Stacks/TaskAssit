import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Sliders,
  Flame,
  ShieldAlert,
  Swords,
  TrendingUp,
  Brain,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Compass,
  ArrowRight,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import {
  BrandProfile,
  SocialTrend,
  ChatMessage,
  StructuredSocialInsight,
  StudioToolType,
  CampaignBrief
} from '../types';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface DynamicSuggestion {
  id: string;
  badge?: string;
  label: string;
  query: string;
}

interface CenterCanvasProps {
  currentBrand: BrandProfile;
  activeTrends: SocialTrend[];
  selectedTrend: SocialTrend | null;
  messages: ChatMessage[];
  campaigns?: CampaignBrief[];
  onSendMessage: (query: string) => Promise<void>;
  isLoading: boolean;
  onOpenStudioTab: (tab: StudioToolType) => void;
  onOpenTrendDNA: (trend: SocialTrend) => void;
  onOpenContentModal: (trendTitle: string) => void;
}

export const CenterCanvas: React.FC<CenterCanvasProps> = ({
  currentBrand,
  activeTrends,
  selectedTrend,
  messages,
  campaigns = [],
  onSendMessage,
  isLoading,
  onOpenStudioTab,
  onOpenTrendDNA,
  onOpenContentModal
}) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Dynamic AI Suggestions State based on Brand, Content, & Heat Trends
  const [dynamicSuggestions, setDynamicSuggestions] = useState<DynamicSuggestion[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  // Fetch contextual suggestions whenever Brand, Trends, or Campaigns update
  useEffect(() => {
    let isMounted = true;

    const fetchSuggestions = async () => {
      setIsSuggestionsLoading(true);
      try {
        const res = await fetch('/api/gemini/chat-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brand: currentBrand,
            trends: activeTrends,
            campaigns: campaigns,
            contentContext: selectedTrend ? `Selected Trend: ${selectedTrend.title}` : ''
          })
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.suggestions && Array.isArray(data.suggestions)) {
            setDynamicSuggestions(data.suggestions);
          }
        }
      } catch (err) {
        console.warn('Suggestions fetch note:', err);
      } finally {
        if (isMounted) setIsSuggestionsLoading(false);
      }
    };

    fetchSuggestions();

    return () => {
      isMounted = false;
    };
  }, [currentBrand?.id, activeTrends.length, selectedTrend?.id, campaigns.length]);

  // Voice to text SpeechRecognition State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');

  useEffect(() => {
    const SpeechRecognitionAPI =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    if (!SpeechRecognitionAPI) {
      setIsSpeechSupported(false);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup abort error
        }
      }
    };
  }, []);

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore stop error
      }
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isLoading) return;

    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognitionAPI =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognitionAPI) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setIsSpeechSupported(false);
      return;
    }

    setSpeechError(null);

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // Capture base text before voice starts so voice appends cleanly
      baseTextRef.current = inputValue.trim() ? `${inputValue.trim()} ` : '';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript + ' ';
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const combinedSpoken = (finalTranscript + interimTranscript).trim();
        if (combinedSpoken) {
          setInputValue(`${baseTextRef.current}${combinedSpoken}`);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          // Passive event; keep listening or ignore
        } else if (event.error === 'network') {
          setSpeechError('Speech service network error. Please verify your connection.');
        } else {
          setSpeechError(`Voice input notice: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setSpeechError('Could not access microphone or initiate voice recognition.');
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (isListening) {
      stopListening();
    }

    const q = inputValue;
    setInputValue('');
    onSendMessage(q);
  };

  const handleQuickPrompt = (promptText: string) => {
    if (isLoading) return;
    onSendMessage(promptText);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-[#171819] overflow-hidden relative select-none">
      {/* Top Signal Ribbon */}
      <div className="h-11 border-b border-[#2d2f31] bg-[#1e1f20] px-3 sm:px-4 md:px-6 flex items-center justify-between overflow-x-auto scrollbar-none gap-2 z-10 transition-all">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium whitespace-nowrap">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Active Signals:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {activeTrends.slice(0, 4).map((trend) => (
            <button
              key={trend.id}
              onClick={() => onOpenTrendDNA(trend)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-xs text-gray-200 whitespace-nowrap transition-colors"
            >
              <span className="font-medium">{trend.title}</span>
              <span className="text-[10px] text-amber-400 font-mono">({trend.dna.velocity})</span>
            </button>
          ))}

          <button
            onClick={() => onOpenStudioTab('decision_simulator')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-xs text-blue-300 whitespace-nowrap font-medium transition-colors"
          >
            <Sliders className="w-3 h-3 text-blue-400" />
            <span>What-If Sandbox</span>
          </button>
        </div>
      </div>

      {/* Main Intelligence Stream Viewport */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div key={msg.id || idx} className="flex justify-end">
                <div className="max-w-xl bg-[#2b2d30] border border-[#3c4043] rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs sm:text-sm text-gray-100 shadow-md">
                  {msg.content}
                </div>
              </div>
            );
          }

          // Assistant Social Brain Intelligence Card
          return (
            <div key={msg.id || idx} className="max-w-3xl mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <span className="font-semibold text-gray-200">TaskAssit Social Brain</span>
                  <span className="text-[10px] text-gray-400 font-mono">{msg.timestamp}</span>
                </div>

                <button
                  onClick={() => handleCopy(msg.content, idx)}
                  className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Insight</span>
                    </>
                  )}
                </button>
              </div>

              {/* Main Response Content Card */}
              <div className="p-5 bg-[#242527] rounded-2xl border border-[#3c4043] shadow-xl space-y-4 text-gray-200">
                {/* Render Markdown Content */}
                <div className="text-xs sm:text-sm leading-relaxed space-y-3 text-gray-300">
                  {msg.content.split('\n\n').map((paragraph, pIdx) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={pIdx} className="text-sm sm:text-base font-bold text-gray-100 mt-2 mb-1">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('#### ')) {
                      return (
                        <h4 key={pIdx} className="text-xs sm:text-sm font-semibold text-blue-300 mt-2">
                          {paragraph.replace('#### ', '')}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith('- ')) {
                      const bullets = paragraph.split('\n');
                      return (
                        <ul key={pIdx} className="space-y-1 my-1">
                          {bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2 text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                              <span>{b.replace(/^- /, '')}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={pIdx} className="leading-relaxed">{paragraph}</p>;
                  })}
                </div>

                {/* 6-Question Framework Structured Breakdown */}
                {msg.structuredInsight && (
                  <div className="mt-4 pt-4 border-t border-[#333538] space-y-3">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-blue-400" />
                        <span>Cognitive Decision Framework</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                          Fit Score: {msg.structuredInsight.brandFitScore}/100
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-mono">
                          Confidence: {msg.structuredInsight.confidenceScore}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                      {/* What is happening */}
                      <div className="p-3 bg-[#1e1f20] rounded-xl border border-[#333538] space-y-1">
                        <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          <span>1. What is Happening?</span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-relaxed">
                          {msg.structuredInsight.whatIsHappening}
                        </p>
                      </div>

                      {/* Why is it happening */}
                      <div className="p-3 bg-[#1e1f20] rounded-xl border border-[#333538] space-y-1">
                        <div className="text-[11px] font-semibold text-purple-400 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          <span>2. Why is it Happening?</span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-relaxed">
                          {msg.structuredInsight.whyIsItHappening}
                        </p>
                      </div>

                      {/* What it means for brand */}
                      <div className="p-3 bg-[#1e1f20] rounded-xl border border-[#333538] space-y-1">
                        <div className="text-[11px] font-semibold text-blue-400 flex items-center gap-1">
                          <Compass className="w-3 h-3" />
                          <span>3. What it Means for Brand?</span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-relaxed">
                          {msg.structuredInsight.whatItMeansForBrand}
                        </p>
                      </div>

                      {/* Strategic Recommendation */}
                      <div className="p-3 bg-[#1e1f20] rounded-xl border border-emerald-500/30 space-y-1">
                        <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>4. Strategic Recommendation</span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-relaxed">
                          {msg.structuredInsight.strategicRecommendation}
                        </p>
                      </div>
                    </div>

                    {/* Forecast Banner */}
                    <div className="p-3 bg-gradient-to-r from-blue-950/30 to-[#1e1f20] rounded-xl border border-blue-500/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-400">
                          5. Outcome Forecast & Trajectory:
                        </span>
                        <div className="text-gray-200 font-medium mt-0.5">
                          {msg.structuredInsight.outcomeForecast}
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenStudioTab('decision_simulator')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow transition-colors flex items-center gap-1 flex-shrink-0"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Simulate What-If</span>
                      </button>
                    </div>

                    {/* Action Triggers Grid */}
                    {msg.structuredInsight.actionTriggers && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {msg.structuredInsight.actionTriggers.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => {
                              if (act.type === 'simulate') onOpenStudioTab('decision_simulator');
                              else if (act.type === 'explore_ideas' && selectedTrend) onOpenTrendDNA(selectedTrend);
                              else if (act.type === 'generate_content') onOpenContentModal(selectedTrend?.title || '“Omo no try me oo”');
                              else onOpenStudioTab('audio_overview');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-xs text-gray-200 hover:text-white font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            <span>{act.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="max-w-3xl mx-auto p-4 bg-[#242527] rounded-2xl border border-[#3c4043] flex items-center gap-3 text-xs text-gray-300 animate-pulse">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
            </div>
            <div>
              <div className="font-semibold text-gray-100">Social Brain Deconstructing Signals...</div>
              <div className="text-[11px] text-gray-400">
                Checking brand safety, analyzing velocity patterns, calculating simulated ROI
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Bottom Query Command Bar (NotebookLM Replica) */}
      <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 border-t border-[#2d2f31] bg-[#1e1f20] space-y-2 transition-all">
        {/* Active Voice Listening Banner */}
        {isListening && (
          <div className="flex items-center justify-between px-3 py-2 bg-red-950/40 border border-red-500/50 rounded-xl text-xs text-red-200 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="font-semibold text-red-300">Voice Mode Active:</span>
              <span className="text-[11px] text-gray-300">
                Listening... Speak your question to the Social Brain
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 px-2 py-0.5 bg-red-900/40 rounded-full">
                <div className="w-1 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-4 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <button
                type="button"
                id="stop-voice-button"
                onClick={stopListening}
                className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-[11px] text-red-200 font-medium transition-colors"
              >
                Stop
              </button>
            </div>
          </div>
        )}

        {/* Speech Error Banner */}
        {speechError && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-300">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{speechError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSpeechError(null)}
              className="text-[10px] text-gray-400 hover:text-white underline ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Context-Aware Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium whitespace-nowrap pl-1 pr-0.5">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>AI Prompts:</span>
          </div>
          {(dynamicSuggestions.length > 0
            ? dynamicSuggestions
            : [
                { id: '1', badge: '🔥 Heat', label: `🔥 What is heating up for ${currentBrand?.name || 'our brand'}?`, query: `What live social media and cultural trends are heating up right now for ${currentBrand?.name || 'our brand'}?` },
                { id: '2', badge: '🔮 Simulator', label: '🔮 Simulate Q3 ROI & Reach', query: 'Simulate our campaign budget options, reach trajectory, and probabilistic ROI.' },
                { id: '3', badge: '🧬 Trend DNA', label: `🧬 Deconstruct "${activeTrends[0]?.title || 'Viral Audio Moment'}"`, query: `Deconstruct the Trend DNA for "${activeTrends[0]?.title || 'Viral Audio Moment'}" and give me 10 content ideas.` },
                { id: '4', badge: '🛡️ Safety', label: '🛡️ Trends to Avoid', query: 'What viral trends should we strictly avoid due to brand safety, dilution, or saturation?' },
                { id: '5', badge: '⚔️ Rivals', label: '⚔️ Competitor Market Shifts', query: 'Analyze recent competitor pivot moves and suggest counter-strategies for our brand.' }
              ]
          ).map((chip, idx) => (
            <button
              key={chip.id || idx}
              onClick={() => handleQuickPrompt(chip.query)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] hover:border-blue-500/50 text-gray-300 hover:text-white whitespace-nowrap transition-all flex-shrink-0 cursor-pointer text-xs"
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-1.5 bg-[#282a2c] rounded-2xl border border-[#3c4043] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-lg"
        >
          {/* Active Sources Indicator Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#1e1f20] text-gray-300 text-[11px] border border-[#3c4043] flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>4 Sources Active</span>
          </div>

          <input
            type="text"
            id="center-canvas-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isListening
                ? '🎙️ Listening... (Speak now to dictate query)'
                : 'Ask TaskAssit about cultural trends, simulate decisions, or request strategies...'
            }
            disabled={isLoading}
            className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-gray-100 placeholder-gray-400 focus:outline-none"
          />

          {/* Voice to Text Microphone Button with Active Pulse Feedback */}
          <button
            type="button"
            id="voice-input-button"
            onClick={toggleListening}
            disabled={isLoading || !isSpeechSupported}
            title={
              !isSpeechSupported
                ? 'Speech recognition is not supported in this browser'
                : isListening
                ? 'Stop listening (Voice input active)'
                : 'Voice-to-text input (Click to speak)'
            }
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
              isListening
                ? 'bg-red-500/25 text-red-400 border border-red-500/70 shadow-lg shadow-red-500/25 ring-2 ring-red-500/40 animate-pulse'
                : 'bg-[#1e1f20] hover:bg-[#333538] text-gray-300 hover:text-white border border-[#3c4043]'
            } disabled:opacity-40 cursor-pointer`}
          >
            {isListening ? (
              <>
                <span className="absolute -inset-0.5 rounded-xl bg-red-500/20 animate-ping opacity-60 pointer-events-none" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500" />
                <MicOff className="w-4 h-4 text-red-400 relative z-10 animate-pulse" />
              </>
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Submit / Send Button */}
          <button
            type="submit"
            id="send-message-button"
            disabled={!inputValue.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-colors flex-shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </main>
  );
};
