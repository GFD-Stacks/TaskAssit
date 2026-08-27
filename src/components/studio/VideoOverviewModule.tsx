import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Sparkles,
  TrendingUp,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { StudioVideoOverview } from '../../types';

interface VideoOverviewModuleProps {
  videoData: StudioVideoOverview;
}

export const VideoOverviewModule: React.FC<VideoOverviewModuleProps> = ({ videoData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalDuration = videoData.durationSeconds || 180;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Sync scene with time
  useEffect(() => {
    const sceneIndex = videoData.scenes.findIndex((scene) => {
      return currentTime >= scene.startSecond && currentTime <= scene.endSecond;
    });
    if (sceneIndex !== -1 && sceneIndex !== currentSceneIndex) {
      setCurrentSceneIndex(sceneIndex);
    }
  }, [currentTime, videoData.scenes]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleSeek = (secs: number) => {
    setCurrentTime(secs);
  };

  const currentScene = videoData.scenes[currentSceneIndex] || videoData.scenes[0];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="space-y-4 text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-blue-400" />
            <span>Executive Video Overview ({videoData.durationFormatted})</span>
          </h3>
          <p className="text-[11px] text-gray-400">{videoData.subtitle}</p>
        </div>
      </div>

      {/* Video Simulated Stage */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-[#0e0f10] via-[#171819] to-[#222426] rounded-2xl border border-[#3c4043] overflow-hidden shadow-2xl flex flex-col justify-between p-5 select-none">
        {/* Dynamic Scene Visualizer Overlay */}
        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />

        {/* Top Video Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-mono font-semibold text-gray-300">
              SCENE 0{currentScene.sceneNumber}: {currentScene.title}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#282a2c]/80 border border-[#3c4043] text-[10px] text-blue-400 font-mono">
            {formatTime(currentTime)} / {videoData.durationFormatted}
          </span>
        </div>

        {/* Center Animated Visual Frame */}
        <div className="relative z-10 my-auto text-center space-y-3">
          {currentScene.visualType === 'motion_chart' && (
            <div className="max-w-md mx-auto p-4 bg-[#1e1f20]/90 border border-blue-500/30 rounded-2xl shadow-xl backdrop-blur">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-300 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Live Signal Velocity Trajectory</span>
              </div>
              <div className="h-16 flex items-end justify-center gap-3 pt-2">
                {[35, 50, 72, 94, 88].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-6 bg-gradient-to-t from-blue-600 to-emerald-400 rounded-t transition-all duration-300"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] text-gray-400 font-mono">D{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentScene.visualType === 'split_bar' && (
            <div className="max-w-md mx-auto p-4 bg-[#1e1f20]/90 border border-purple-500/30 rounded-2xl shadow-xl backdrop-blur">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-purple-300 mb-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Simulated Options Comparison</span>
              </div>
              <div className="space-y-1.5 text-left text-[11px]">
                <div className="flex justify-between text-gray-300">
                  <span>Option A (Organic)</span>
                  <span className="font-mono text-emerald-400">45k Reach • ₦0</span>
                </div>
                <div className="w-full bg-[#282a2c] rounded-full h-2">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Option B (Paid Spark)</span>
                  <span className="font-mono text-blue-400">220k Reach • ₦150k</span>
                </div>
                <div className="w-full bg-[#282a2c] rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          )}

          {currentScene.visualType === 'radar_chart' && (
            <div className="max-w-md mx-auto p-4 bg-[#1e1f20]/90 border border-amber-500/30 rounded-2xl shadow-xl backdrop-blur text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-300 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Brand Safety & Cultural Fit Radar</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="p-2 bg-[#282a2c] rounded-lg">
                  <div className="text-gray-400">Audience Fit</div>
                  <div className="text-sm font-bold text-emerald-400">92%</div>
                </div>
                <div className="p-2 bg-[#282a2c] rounded-lg">
                  <div className="text-gray-400">Brand Safety</div>
                  <div className="text-sm font-bold text-blue-400">88%</div>
                </div>
                <div className="p-2 bg-[#282a2c] rounded-lg">
                  <div className="text-gray-400">Timing</div>
                  <div className="text-sm font-bold text-amber-400">95%</div>
                </div>
              </div>
            </div>
          )}

          {currentScene.visualType === 'creative_mockup' && (
            <div className="max-w-md mx-auto p-4 bg-[#1e1f20]/90 border border-emerald-500/30 rounded-2xl shadow-xl backdrop-blur">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-300 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Creative Execution Brief</span>
              </div>
              <p className="text-xs text-gray-200 italic font-medium">
                “Omo no try me oo… when the bespoke tailoring does all the talking.”
              </p>
              <div className="mt-2 text-[10px] text-gray-400">
                Short-form 9:16 Video • Audio Sync • VIP Waitlist CTA
              </div>
            </div>
          )}

          {currentScene.visualType === 'matrix' && (
            <div className="max-w-md mx-auto p-4 bg-[#1e1f20]/90 border border-blue-500/30 rounded-2xl shadow-xl backdrop-blur">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-300 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Executive Decision Summary</span>
              </div>
              <p className="text-xs text-gray-300">
                Decision #00183: Execute Option B (Paid Amplification) with ₦150k spend.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Narration Box */}
        <div className="relative z-10 p-2.5 bg-[#171819]/90 backdrop-blur rounded-xl border border-[#333538]">
          <div className="text-[10px] uppercase font-semibold text-blue-400 mb-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>AI Voiceover Narration:</span>
          </div>
          <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">
            {currentScene.narration}
          </p>
        </div>
      </div>

      {/* Video Controls & Progress Bar */}
      <div className="p-3 bg-[#242527] rounded-xl border border-[#333538] space-y-2">
        {/* Scrubber */}
        <div className="relative w-full h-2 bg-[#1e1f20] rounded-full cursor-pointer overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-150"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-400 text-gray-950 flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => handleSeek(0)}
              className="p-2 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-gray-400 hover:text-gray-200 border border-[#3c4043] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-mono text-gray-300">
              {formatTime(currentTime)} / {videoData.durationFormatted}
            </span>
          </div>

          <div className="text-xs text-gray-400">
            Scene {currentSceneIndex + 1} of {videoData.scenes.length}
          </div>
        </div>
      </div>

      {/* Scene Timeline Selector */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1">
          Scene Timeline
        </div>
        <div className="space-y-1.5">
          {videoData.scenes.map((sc, i) => (
            <button
              key={i}
              onClick={() => handleSeek(sc.startSecond)}
              className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                currentSceneIndex === i
                  ? 'bg-[#282a2c] border-blue-500/60 text-blue-200 shadow-sm'
                  : 'bg-[#242527] border-[#333538] hover:border-[#44474a] text-gray-300'
              }`}
            >
              <div>
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <span className="font-mono text-blue-400 text-[11px]">0{sc.sceneNumber}</span>
                  <span>{sc.title}</span>
                </div>
                <p className="text-[11px] text-gray-400 truncate max-w-sm mt-0.5">{sc.narration}</p>
              </div>

              <span className="font-mono text-[10px] text-gray-400 px-2 py-0.5 bg-[#1e1f20] rounded border border-[#333538]">
                {formatTime(sc.startSecond)} - {formatTime(sc.endSecond)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
