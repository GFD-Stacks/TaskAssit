import React from 'react';
import {
  PieChart,
  Flame,
  Activity,
  Globe2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { StudioInfographic } from '../../types';

interface InfographicsModuleProps {
  infographics: StudioInfographic[];
}

export const InfographicsModule: React.FC<InfographicsModuleProps> = ({ infographics }) => {
  return (
    <div className="space-y-4 text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-blue-400" />
            <span>Visual Social Telemetry & Infographics</span>
          </h3>
          <p className="text-[11px] text-gray-400">
            Real-time visual telemetry, signal heatmaps & model accuracy calibration
          </p>
        </div>
      </div>

      {/* Main Infographic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Metric 1: Heat Stream Velocity */}
        <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Cultural Velocity Heat</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Live
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-300">
                <span>“Omo no try me oo”</span>
                <span className="font-mono text-amber-400 font-bold">94 / 100</span>
              </div>
              <div className="w-full bg-[#1e1f20] h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-300">
                <span>Stealth Wealth Aesthetic</span>
                <span className="font-mono text-blue-400 font-bold">86 / 100</span>
              </div>
              <div className="w-full bg-[#1e1f20] h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: '86%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-300">
                <span>Late Night Thought Formats</span>
                <span className="font-mono text-purple-400 font-bold">78 / 100</span>
              </div>
              <div className="w-full bg-[#1e1f20] h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: Decision Simulator ROI Index */}
        <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Simulated ROI Multiplier</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ₦150k Budget
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-3 bg-[#1e1f20] rounded-xl border border-[#333538]">
              <span className="text-[10px] text-gray-400 uppercase">Paid Spark ROI</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">+4.2x</div>
              <span className="text-[9px] text-gray-400">780 Waitlist Leads</span>
            </div>

            <div className="p-3 bg-[#1e1f20] rounded-xl border border-[#333538]">
              <span className="text-[10px] text-gray-400 uppercase">Organic ROI</span>
              <div className="text-xl font-bold text-blue-400 mt-0.5">Infinite (₦0)</div>
              <span className="text-[9px] text-gray-400">240 Leads Generated</span>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 italic text-center">
            Paid amplification delivers 3.2x higher lead volume within the first 72 hours.
          </div>
        </div>

        {/* Metric 3: Audience Geography */}
        <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audience Geographic Spread</span>
            </span>
            <span className="text-[10px] font-mono text-gray-400">Diaspora & Local</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-300">Lagos & Abuja (Domestic)</span>
              <span className="font-bold text-emerald-400">55%</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-300">London & UK Diaspora</span>
              <span className="font-bold text-blue-400">28%</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-300">US East Coast (NY/ATL)</span>
              <span className="font-bold text-purple-400">17%</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Closed-Loop Model Calibration */}
        <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Model Accuracy Calibration</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              64 Cycles
            </span>
          </div>

          <div className="text-center py-1">
            <div className="text-3xl font-extrabold text-purple-300">89.4%</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Forecast-to-Actual Accuracy</div>
          </div>

          <p className="text-[11px] text-gray-400 text-center leading-relaxed">
            Variance between predicted engagement and actual campaign outcomes decreased by 4.2% in the last 30 days.
          </p>
        </div>
      </div>
    </div>
  );
};
