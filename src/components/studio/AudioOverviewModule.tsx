import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Headphones,
  CheckCircle2,
  Clock,
  Mic,
  Sliders,
  Settings2,
  RefreshCw,
  Waves,
  UserCheck,
  Music,
  Share2,
  Check,
  ChevronDown
} from 'lucide-react';
import { StudioAudioOverview, BrandProfile, SocialTrend } from '../../types';

interface VoicePersona {
  id: string;
  name: string;
  gender: 'female' | 'male' | 'neutral';
  role: string;
  avatarColor: string;
  personality: string;
  pitch: number; // 0.5 - 2.0
  rateMultiplier: number;
}

const defaultPersonas: VoicePersona[] = [
  {
    id: 'maya',
    name: 'Maya',
    gender: 'female',
    role: 'Brand Storyteller',
    avatarColor: '#3b82f6',
    personality: 'Warm, mindful, and calming tone with empathetic delivery',
    pitch: 1.15,
    rateMultiplier: 0.95
  },
  {
    id: 'david',
    name: 'David',
    gender: 'male',
    role: 'Cultural Strategist',
    avatarColor: '#10b981',
    personality: 'Insightful, resonant, and calm articulate pacing',
    pitch: 0.86,
    rateMultiplier: 0.98
  },
  {
    id: 'elena',
    name: 'Elena',
    gender: 'female',
    role: 'Luxury Director',
    avatarColor: '#ec4899',
    personality: 'Poised, elegant, and sophisticated fashion house tone',
    pitch: 1.08,
    rateMultiplier: 0.92
  },
  {
    id: 'marcus',
    name: 'Marcus',
    gender: 'male',
    role: 'Trend Forecaster',
    avatarColor: '#f59e0b',
    personality: 'Dynamic, sharp, and trend-witty delivery',
    pitch: 0.92,
    rateMultiplier: 1.08
  },
  {
    id: 'amina',
    name: 'Amina',
    gender: 'female',
    role: 'Creative Visionary',
    avatarColor: '#8b5cf6',
    personality: 'Intuitive, fresh, and engaging cultural narrative',
    pitch: 1.12,
    rateMultiplier: 1.02
  }
];

export type TonePresetKey = 'relaxing' | 'executive' | 'luxury' | 'energetic' | 'storyteller';

interface TonePresetConfig {
  key: TonePresetKey;
  label: string;
  icon: string;
  description: string;
  baseRate: number;
  pauseMs: number;
  badgeClass: string;
}

const tonePresets: TonePresetConfig[] = [
  {
    key: 'relaxing',
    label: 'Relaxing & Mindful',
    icon: '🌿',
    description: 'Gentle, unhurried, warm cadence with soothing breath pauses and tranquil tone',
    baseRate: 0.92,
    pauseMs: 500,
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  {
    key: 'luxury',
    label: 'Luxury & Poised',
    icon: '💎',
    description: 'Elevated, articulate, confident delivery fit for premium luxury positioning',
    baseRate: 0.96,
    pauseMs: 400,
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  {
    key: 'executive',
    label: 'Executive Strategic',
    icon: '🧠',
    description: 'Crisp, data-first, concise intelligence debrief with high clarity',
    baseRate: 1.05,
    pauseMs: 300,
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  },
  {
    key: 'energetic',
    label: 'High-Velocity & Witty',
    icon: '⚡',
    description: 'Upbeat, punchy, trend-savvy dialogue with fast-paced banter',
    baseRate: 1.15,
    pauseMs: 250,
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  {
    key: 'storyteller',
    label: 'Narrative Deep Dive',
    icon: '🎙️',
    description: 'Immersive, emotional storytelling with captivating conversational rhythm',
    baseRate: 0.98,
    pauseMs: 420,
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  }
];

interface AudioOverviewModuleProps {
  audioData: StudioAudioOverview;
  currentBrand?: BrandProfile;
  selectedTrend?: SocialTrend | null;
  onUpdateAudioData?: (newData: StudioAudioOverview) => void;
}

export const AudioOverviewModule: React.FC<AudioOverviewModuleProps> = ({
  audioData: initialAudioData,
  currentBrand,
  selectedTrend,
  onUpdateAudioData
}) => {
  const [data, setData] = useState<StudioAudioOverview>(initialAudioData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedTone, setSelectedTone] = useState<TonePresetKey>(
    (initialAudioData.tonePreset as TonePresetKey) || 'relaxing'
  );
  
  // Voice Persona configuration
  const [speakerA, setSpeakerA] = useState<VoicePersona>(defaultPersonas[0]);
  const [speakerB, setSpeakerB] = useState<VoicePersona>(defaultPersonas[1]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [ambientSoundEnabled, setAmbientSoundEnabled] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(0.15);

  // Available system voices
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceMapA, setVoiceMapA] = useState<string>('');
  const [voiceMapB, setVoiceMapB] = useState<string>('');

  // Refs
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const currentLineRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientNodesRef = useRef<{ gainNode: GainNode; oscillators: OscillatorNode[] } | null>(null);

  // Sync prop changes
  useEffect(() => {
    setData(initialAudioData);
  }, [initialAudioData]);

  // Load available speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setSystemVoices(voices);

        // Auto-match female and male voices
        const femaleVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('victoria') ||
              v.name.toLowerCase().includes('zira') ||
              v.name.toLowerCase().includes('karen') ||
              v.name.toLowerCase().includes('natural') ||
              v.name.toLowerCase().includes('google us'))
        );

        const maleVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('male') ||
              v.name.toLowerCase().includes('daniel') ||
              v.name.toLowerCase().includes('david') ||
              v.name.toLowerCase().includes('george') ||
              v.name.toLowerCase().includes('google uk english male'))
        );

        if (femaleVoice && !voiceMapA) setVoiceMapA(femaleVoice.name);
        if (maleVoice && !voiceMapB) setVoiceMapB(maleVoice.name);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      stopAllSpeech();
      stopAmbientSound();
    };
  }, []);

  // Ambient sound synthesizer using Web Audio API (Soothing binaural soundscape)
  const startAmbientSound = () => {
    if (typeof window === 'undefined') return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(ambientVolume, ctx.currentTime);
      gainNode.connect(ctx.destination);

      // Create warm harmonic chord (Root 174Hz + Fifth 261Hz + Octave gentle sine)
      const freqs = [174, 261.63, 348];
      const oscillators: OscillatorNode[] = [];

      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        // Gentle filter for soothing warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gainNode);
        osc.start();
        oscillators.push(osc);
      });

      ambientNodesRef.current = { gainNode, oscillators };
    } catch (e) {
      console.warn('Web Audio ambient synthesizer not supported:', e);
    }
  };

  const stopAmbientSound = () => {
    if (ambientNodesRef.current) {
      try {
        ambientNodesRef.current.oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {}
        });
        ambientNodesRef.current.gainNode.disconnect();
      } catch (e) {}
      ambientNodesRef.current = null;
    }
  };

  const handleToggleAmbient = () => {
    const nextState = !ambientSoundEnabled;
    setAmbientSoundEnabled(nextState);
    if (nextState && isPlaying) {
      startAmbientSound();
    } else {
      stopAmbientSound();
    }
  };

  // Stop all speech and timers
  const stopAllSpeech = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    stopAmbientSound();
  };

  // Line-by-line speech engine with per-speaker voice, pitch, and natural pauses
  const speakLine = (lineIdx: number) => {
    if (!synthRef.current || !isPlayingRef.current || !data.transcript[lineIdx]) {
      stopAllSpeech();
      return;
    }

    const line = data.transcript[lineIdx];
    currentLineRef.current = lineIdx;
    setCurrentLineIndex(lineIdx);

    // Calculate approx second timestamp
    const [min, sec] = line.time.split(':').map(Number);
    const lineSecs = min * 60 + (sec || 0);
    setCurrentTime(lineSecs);

    const isSpeakerA =
      line.speaker.toLowerCase().includes(speakerA.name.toLowerCase()) ||
      lineIdx % 2 === 0;

    const persona = isSpeakerA ? speakerA : speakerB;
    const toneConfig = tonePresets.find((t) => t.key === selectedTone) || tonePresets[0];

    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.rate = playbackRate * toneConfig.baseRate * persona.rateMultiplier;
    utterance.pitch = persona.pitch;

    // Pick configured or matched voice
    const targetVoiceName = isSpeakerA ? voiceMapA : voiceMapB;
    if (targetVoiceName && systemVoices.length > 0) {
      const foundVoice = systemVoices.find((v) => v.name === targetVoiceName);
      if (foundVoice) utterance.voice = foundVoice;
    } else if (systemVoices.length > 0) {
      const matchGender = systemVoices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (persona.gender === 'female'
            ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha')
            : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('daniel'))
      );
      if (matchGender) utterance.voice = matchGender;
    }

    utterance.onend = () => {
      if (!isPlayingRef.current) return;

      const nextIdx = lineIdx + 1;
      if (nextIdx < data.transcript.length) {
        // Natural conversational pause between speaker turns
        setTimeout(() => {
          if (isPlayingRef.current) {
            speakLine(nextIdx);
          }
        }, toneConfig.pauseMs);
      } else {
        stopAllSpeech();
        setCurrentTime(data.durationSeconds || 195);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance note:', e);
      if (isPlayingRef.current) {
        const nextIdx = lineIdx + 1;
        if (nextIdx < data.transcript.length) {
          speakLine(nextIdx);
        } else {
          stopAllSpeech();
        }
      }
    };

    if (!isMuted) {
      synthRef.current.speak(utterance);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAllSpeech();
    } else {
      isPlayingRef.current = true;
      setIsPlaying(true);
      if (ambientSoundEnabled) {
        startAmbientSound();
      }

      // Start speaking from currentLineIndex
      speakLine(currentLineIndex);

      // Progress clock ticker
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= (data.durationSeconds || 195)) {
            stopAllSpeech();
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackRate);
    }
  };

  const handleJumpToLine = (idx: number) => {
    stopAllSpeech();
    setCurrentLineIndex(idx);
    const [min, sec] = data.transcript[idx].time.split(':').map(Number);
    setCurrentTime(min * 60 + (sec || 0));

    // Immediately start playing from this line
    isPlayingRef.current = true;
    setIsPlaying(true);
    if (ambientSoundEnabled) startAmbientSound();
    speakLine(idx);

    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= (data.durationSeconds || 195)) {
          stopAllSpeech();
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / playbackRate);
  };

  const handleJumpToChapter = (chapterTimeSeconds: number) => {
    // Find closest line
    const targetIdx = data.transcript.findIndex((line) => {
      const [m, s] = line.time.split(':').map(Number);
      return m * 60 + (s || 0) >= chapterTimeSeconds;
    });

    handleJumpToLine(targetIdx !== -1 ? targetIdx : 0);
  };

  // Live Gemini Regeneration with Custom Voice & Tone
  const handleGenerateLiveWithGemini = async (toneToUse = selectedTone) => {
    stopAllSpeech();
    setIsGeneratingAI(true);

    try {
      const res = await fetch('/api/gemini/generate-audio-overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: currentBrand,
          trend: selectedTrend,
          tonePreset: toneToUse,
          speakerA: {
            name: speakerA.name,
            gender: speakerA.gender,
            role: speakerA.role,
            personality: speakerA.personality,
            avatarColor: speakerA.avatarColor
          },
          speakerB: {
            name: speakerB.name,
            gender: speakerB.gender,
            role: speakerB.role,
            personality: speakerB.personality,
            avatarColor: speakerB.avatarColor
          }
        })
      });

      if (res.ok) {
        const newData: StudioAudioOverview = await res.json();
        setData(newData);
        setCurrentLineIndex(0);
        setCurrentTime(0);
        if (onUpdateAudioData) {
          onUpdateAudioData(newData);
        }
      }
    } catch (err) {
      console.error('Failed to generate live audio overview:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const activeToneConfig = tonePresets.find((t) => t.key === selectedTone) || tonePresets[0];
  const totalDuration = data.durationSeconds || 195;

  return (
    <div className="space-y-4 text-gray-200">
      {/* Top Banner with Host Controls & Tone Pill */}
      <div className="p-4 bg-gradient-to-r from-blue-950/50 via-[#242527] to-[#282a2c] rounded-2xl border border-blue-500/20 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border flex items-center gap-1 ${activeToneConfig.badgeClass}`}>
                <span>{activeToneConfig.icon}</span>
                <span>{activeToneConfig.label}</span>
              </span>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                {data.durationFormatted}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                Live Speech Engine
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-100">{data.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{data.subtitle}</p>
          </div>

          {/* Host Avatars */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="flex -space-x-2 hover:opacity-80 transition-opacity p-1 bg-[#1e1f20] rounded-xl border border-[#3c4043]"
              title="Configure Host AI Voices & Personalities"
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-[#1e1f20] flex items-center justify-center text-xs font-bold text-white shadow"
                style={{ backgroundColor: speakerA.avatarColor }}
                title={`${speakerA.name} (${speakerA.gender}, ${speakerA.role})`}
              >
                {speakerA.name[0]}
              </div>
              <div
                className="w-8 h-8 rounded-full border-2 border-[#1e1f20] flex items-center justify-center text-xs font-bold text-white shadow"
                style={{ backgroundColor: speakerB.avatarColor }}
                title={`${speakerB.name} (${speakerB.gender}, ${speakerB.role})`}
              >
                {speakerB.name[0]}
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Waveform Visualizer */}
        <div className="h-14 bg-[#171819] rounded-xl px-3 flex items-center justify-between gap-1 border border-[#333538] overflow-hidden relative">
          {Array.from({ length: 38 }).map((_, i) => {
            const height = isPlaying
              ? Math.max(16, Math.sin((currentTime * 4 + i) * 0.45) * 85 + Math.random() * 15)
              : Math.sin(i * 0.3) * 35 + 20;

            const isPassed = (i / 38) * totalDuration <= currentTime;

            return (
              <div
                key={i}
                onClick={() => {
                  const targetSec = Math.floor((i / 38) * totalDuration);
                  handleJumpToChapter(targetSec);
                }}
                className={`w-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                  isPassed ? 'bg-blue-400' : 'bg-[#3c4043] hover:bg-gray-400'
                }`}
                style={{ height: `${height}%` }}
                title={`Seek to ~${formatTime(Math.floor((i / 38) * totalDuration))}`}
              />
            );
          })}

          {isPlaying && (
            <div className="absolute top-1.5 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-mono border border-blue-500/30 animate-pulse">
              <Waves className="w-2.5 h-2.5 text-blue-400" />
              <span>Speaking: {data.transcript[currentLineIndex]?.speaker || speakerA.name}</span>
            </div>
          )}
        </div>

        {/* Audio Player Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 text-gray-950 flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause Audio Briefing' : 'Play Live Audio Overview'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => handleJumpToLine(0)}
              className="p-2 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-gray-400 hover:text-gray-200 border border-[#3c4043] transition-colors cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-gray-300 ml-1">
              {formatTime(currentTime)} / {data.durationFormatted}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Ambient Relaxing Bed Sound Toggle */}
            <button
              onClick={handleToggleAmbient}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all cursor-pointer ${
                ambientSoundEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-[#282a2c] text-gray-400 hover:text-gray-200 border-[#3c4043]'
              }`}
              title="Toggle 432Hz Soothing Ambient Background Bed (Real Sound Synthesizer)"
            >
              <Music className={`w-3.5 h-3.5 ${ambientSoundEnabled ? 'text-emerald-400 animate-pulse' : 'text-gray-400'}`} />
              <span className="text-[11px] hidden sm:inline">Zen Bed</span>
            </button>

            {/* Playback Speed */}
            <div className="flex bg-[#1e1f20] rounded-lg border border-[#3c4043] p-0.5 text-[11px]">
              {[0.8, 1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setPlaybackRate(rate);
                    if (isPlaying) {
                      stopAllSpeech();
                      setTimeout(() => handleJumpToLine(currentLineIndex), 100);
                    }
                  }}
                  className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                    playbackRate === rate
                      ? 'bg-blue-500/25 text-blue-300 font-semibold'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  title={`${rate}x playback speed`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Mute Toggle */}
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  if (!isMuted) window.speechSynthesis.cancel();
                  else if (isPlaying) speakLine(currentLineIndex);
                }
              }}
              className="p-2 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-gray-400 hover:text-gray-200 border border-[#3c4043] transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Voice & Tone Settings Button */}
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                showVoiceSettings
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                  : 'bg-[#282a2c] text-gray-400 hover:text-gray-200 border-[#3c4043]'
              }`}
              title="Voice & Tone Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Voice & Tone Personality Configurator Drawer */}
      {showVoiceSettings && (
        <div className="p-4 bg-[#242527] rounded-2xl border border-blue-500/30 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-[#333538] pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-200">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>AI Voice Personalities & Tone Engine</span>
            </div>
            <button
              onClick={() => setShowVoiceSettings(false)}
              className="text-[11px] text-gray-400 hover:text-gray-200"
            >
              Close
            </button>
          </div>

          {/* Tone Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
              Audio Delivery Tone & Atmosphere
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {tonePresets.map((t) => {
                const isSelected = selectedTone === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => {
                      setSelectedTone(t.key);
                      handleGenerateLiveWithGemini(t.key);
                    }}
                    disabled={isGeneratingAI}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500/60 text-blue-100 ring-1 ring-blue-500/40 shadow-sm'
                        : 'bg-[#1e1f20] border-[#333538] hover:border-gray-500 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-tight">
                      {t.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Host 1 (Speaker A) Voice Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-[#1e1f20] rounded-xl border border-[#333538] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-200">
                <span className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: speakerA.avatarColor }} />
                  Host 1: {speakerA.name} ({speakerA.gender})
                </span>
                <span className="text-[10px] text-blue-400 font-normal">{speakerA.role}</span>
              </div>

              <select
                value={speakerA.id}
                onChange={(e) => {
                  const p = defaultPersonas.find((x) => x.id === e.target.value) || defaultPersonas[0];
                  setSpeakerA(p);
                }}
                className="w-full bg-[#282a2c] text-xs text-gray-200 px-2.5 py-1.5 rounded-lg border border-[#3c4043] focus:outline-none focus:border-blue-500"
              >
                {defaultPersonas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.gender.toUpperCase()} — {p.personality.slice(0, 35)}...)
                  </option>
                ))}
              </select>

              {systemVoices.length > 0 && (
                <div className="space-y-1 pt-1">
                  <label className="text-[10px] text-gray-400">System Voice Match:</label>
                  <select
                    value={voiceMapA}
                    onChange={(e) => setVoiceMapA(e.target.value)}
                    className="w-full bg-[#282a2c] text-[11px] text-gray-300 px-2 py-1 rounded border border-[#3c4043] focus:outline-none"
                  >
                    <option value="">Auto-detected natural voice</option>
                    {systemVoices
                      .filter((v) => v.lang.startsWith('en'))
                      .map((v, i) => (
                        <option key={i} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            {/* Host 2 (Speaker B) Voice Picker */}
            <div className="p-3 bg-[#1e1f20] rounded-xl border border-[#333538] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-200">
                <span className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: speakerB.avatarColor }} />
                  Host 2: {speakerB.name} ({speakerB.gender})
                </span>
                <span className="text-[10px] text-emerald-400 font-normal">{speakerB.role}</span>
              </div>

              <select
                value={speakerB.id}
                onChange={(e) => {
                  const p = defaultPersonas.find((x) => x.id === e.target.value) || defaultPersonas[1];
                  setSpeakerB(p);
                }}
                className="w-full bg-[#282a2c] text-xs text-gray-200 px-2.5 py-1.5 rounded-lg border border-[#3c4043] focus:outline-none focus:border-blue-500"
              >
                {defaultPersonas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.gender.toUpperCase()} — {p.personality.slice(0, 35)}...)
                  </option>
                ))}
              </select>

              {systemVoices.length > 0 && (
                <div className="space-y-1 pt-1">
                  <label className="text-[10px] text-gray-400">System Voice Match:</label>
                  <select
                    value={voiceMapB}
                    onChange={(e) => setVoiceMapB(e.target.value)}
                    className="w-full bg-[#282a2c] text-[11px] text-gray-300 px-2 py-1 rounded border border-[#3c4043] focus:outline-none"
                  >
                    <option value="">Auto-detected natural voice</option>
                    {systemVoices
                      .filter((v) => v.lang.startsWith('en'))
                      .map((v, i) => (
                        <option key={i} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#333538]">
            <button
              onClick={() => handleGenerateLiveWithGemini(selectedTone)}
              disabled={isGeneratingAI}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAI ? 'Synthesizing with Gemini...' : 'Regenerate Script with New Voices'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Generation Button Pill if Settings Drawer is closed */}
      {!showVoiceSettings && (
        <div className="flex items-center justify-between p-2.5 bg-[#242527] rounded-xl border border-[#333538]">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tone: <strong className="text-gray-100">{activeToneConfig.label}</strong> • Hosts: <strong className="text-gray-100">{speakerA.name} & {speakerB.name}</strong></span>
          </div>
          <button
            onClick={() => handleGenerateLiveWithGemini(selectedTone)}
            disabled={isGeneratingAI}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-blue-400 hover:text-blue-300 text-xs border border-[#3c4043] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Generating...' : 'Live Regenerate'}</span>
          </button>
        </div>
      )}

      {/* Key Takeaways */}
      <div className="p-3.5 bg-[#242527] rounded-xl border border-[#333538] space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Executive Intelligence Highlights</span>
        </div>
        <ul className="space-y-1.5 text-xs text-gray-300">
          {data.keyTakeaways.map((takeaway, i) => (
            <li key={i} className="flex items-start gap-2 leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chapters */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider px-1">
          Briefing Chapters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {data.chapters.map((ch, i) => (
            <button
              key={i}
              onClick={() => handleJumpToChapter(ch.timeSeconds)}
              className="text-left p-2 rounded-lg bg-[#242527] hover:bg-[#282a2c] border border-[#333538] text-xs flex items-center justify-between group transition-colors cursor-pointer"
            >
              <span className="text-gray-300 group-hover:text-blue-300 truncate">{ch.title}</span>
              <span className="font-mono text-[10px] text-gray-400 ml-2">{ch.timeFormatted}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Transcript */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-300 uppercase tracking-wider px-1">
          <span>Interactive Spoken Transcript</span>
          <span className="text-[10px] text-gray-400 lowercase">click any line to speak</span>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {data.transcript.map((line, idx) => {
            const isActive = currentLineIndex === idx && isPlaying;
            const isSpeakerA =
              line.speaker.toLowerCase().includes(speakerA.name.toLowerCase()) ||
              idx % 2 === 0;
            const avatarBg = isSpeakerA ? speakerA.avatarColor : speakerB.avatarColor;

            return (
              <div
                key={idx}
                onClick={() => handleJumpToLine(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-blue-500/15 border-blue-500/60 text-blue-100 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30'
                    : 'bg-[#242527] border-[#333538] hover:border-[#44474a] text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: avatarBg }}
                    />
                    <span className="font-semibold text-gray-200 flex items-center gap-1">
                      {line.speaker}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-0.5 ml-1">
                        <span className="w-1 h-3 bg-blue-400 animate-pulse rounded-full" />
                        <span className="w-1 h-4 bg-blue-300 animate-pulse delay-75 rounded-full" />
                        <span className="w-1 h-2 bg-blue-400 animate-pulse delay-150 rounded-full" />
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-gray-400">{line.time}</span>
                </div>
                <p className="text-xs leading-relaxed text-gray-200">{line.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
