import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  Info,
  DollarSign
} from 'lucide-react';
import {
  BrandProfile,
  SocialTrend,
  DecisionSimulation,
  DecisionOption,
  DecisionRecord
} from '../../types';

interface DecisionSandboxModuleProps {
  currentBrand: BrandProfile;
  trends: SocialTrend[];
  initialSimulation: DecisionSimulation;
  onCommitDecision: (record: DecisionRecord) => void;
}

export const DecisionSandboxModule: React.FC<DecisionSandboxModuleProps> = ({
  currentBrand,
  trends,
  initialSimulation,
  onCommitDecision
}) => {
  const [selectedTrendTitle, setSelectedTrendTitle] = useState(
    initialSimulation.trendName || trends[0]?.title || '“Omo no try me oo”'
  );
  const [timeHorizon, setTimeHorizon] = useState('7 days');
  const [budget, setBudget] = useState(150000);
  const [targetLocation, setTargetLocation] = useState('Lagos & London Diaspora');
  const [targetAge, setTargetAge] = useState('Ages 22-38 (Tastemakers)');
  const [contentFormat, setContentFormat] = useState('Instagram Reel (9:16)');
  const [platform, setPlatform] = useState('Instagram');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<DecisionSimulation>(initialSimulation);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('opt-b');
  const [committedSuccess, setCommittedSuccess] = useState(false);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/gemini/simulate-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trendName: selectedTrendTitle,
          brand: currentBrand,
          parameters: {
            budget,
            timeHorizon,
            demographic: { age: targetAge, location: targetLocation },
            contentType: contentFormat,
            platform
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult({
          ...data,
          trendName: selectedTrendTitle,
          brandId: currentBrand.id,
          parameters: {
            timeHorizon,
            budget,
            budgetCurrency: '₦',
            demographic: { age: targetAge, location: targetLocation },
            contentType: contentFormat,
            platform
          }
        });
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCommit = () => {
    const chosen = simulationResult.options.find((o) => o.id === selectedOptionId) || simulationResult.options[1];
    const newRecord: DecisionRecord = {
      id: `dec-${Date.now()}`,
      decisionCode: `#0018${Math.floor(3 + Math.random() * 9)}`,
      brandId: currentBrand.id,
      date: 'Today',
      question: `Should ${currentBrand.name} deploy on "${selectedTrendTitle}"?`,
      selectedOption: chosen.name,
      budget: `₦${chosen.costNumeric.toLocaleString()}`,
      expectedReach: chosen.expectedReach,
      actualReach: 'Live Campaign Tracking...',
      variance: 'In Progress (Active)',
      learningSummary: `Committed ${chosen.label} with ${timeHorizon} horizon. AI Social Brain actively monitoring reach velocity.`
    };

    onCommitDecision(newRecord);
    setCommittedSuccess(true);
    setTimeout(() => setCommittedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>Decision Simulator & What-If Studio</span>
          </h3>
          <p className="text-[11px] text-gray-400">
            Simulate strategic scenarios, compare risk vs. ROI, and model probabilistic outcomes
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            {simulationResult.decisionNumber}
          </span>
        </div>
      </div>

      {/* Parametric Sandbox Control Panel */}
      <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-3.5 shadow-xl">
        <div className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center justify-between">
          <span>Simulation Parameters</span>
          <span className="text-[11px] text-gray-400 font-normal">Brand: {currentBrand.name}</span>
        </div>

        {/* Row 1: Trend Selector & Time Horizon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-gray-400 font-medium">Target Cultural Signal</label>
            <select
              value={selectedTrendTitle}
              onChange={(e) => setSelectedTrendTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#1e1f20] border border-[#3c4043] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            >
              {trends.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title} ({t.category})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-gray-400 font-medium">Time Horizon</label>
            <div className="grid grid-cols-4 gap-1">
              {['24 hours', '3 days', '7 days', '14 days'].map((h) => (
                <button
                  key={h}
                  onClick={() => setTimeHorizon(h)}
                  className={`py-1.5 text-[11px] rounded-lg border transition-colors ${
                    timeHorizon === h
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-semibold'
                      : 'bg-[#1e1f20] text-gray-400 border-[#3c4043] hover:text-gray-200'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Budget Slider */}
        <div className="space-y-1.5 p-3 bg-[#1e1f20] rounded-xl border border-[#333538]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">Allocated Budget:</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              ₦{budget.toLocaleString()}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={1000000}
            step={25000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-[#282a2c] rounded-lg"
          />

          <div className="flex justify-between text-[10px] text-gray-400">
            <button onClick={() => setBudget(0)} className="hover:text-blue-400">₦0 (Organic)</button>
            <button onClick={() => setBudget(150000)} className="hover:text-blue-400">₦150,000</button>
            <button onClick={() => setBudget(350000)} className="hover:text-blue-400">₦350,000</button>
            <button onClick={() => setBudget(750000)} className="hover:text-blue-400">₦750,000</button>
            <button onClick={() => setBudget(1000000)} className="hover:text-blue-400">₦1,000,000</button>
          </div>
        </div>

        {/* Row 3: Platform & Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-gray-400 font-medium">Primary Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#1e1f20] border border-[#3c4043] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Instagram">Instagram (Reels & Stories)</option>
              <option value="TikTok">TikTok (Sound Sync)</option>
              <option value="X">X / Twitter (Thread + Cards)</option>
              <option value="LinkedIn">LinkedIn (Thought Leadership)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-gray-400 font-medium">Content Format</label>
            <select
              value={contentFormat}
              onChange={(e) => setContentFormat(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#1e1f20] border border-[#3c4043] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Instagram Reel (9:16)">Instagram Reel (9:16)</option>
              <option value="5-Slide Carousel">5-Slide Carousel</option>
              <option value="3-Creator Sound Seeding">3-Creator Sound Seeding</option>
              <option value="X Viral Thread">X Viral Thread</option>
            </select>
          </div>
        </div>

        {/* Simulate Action Button */}
        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          {isSimulating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Simulating Probabilistic Scenarios...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Live Decision Simulation</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Comparative Strategy Options */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-gray-200 uppercase tracking-wider px-1 flex items-center justify-between">
          <span>Comparative Strategic Options</span>
          <span className="text-[11px] text-gray-400 font-normal">Select an option to commit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {simulationResult.options.map((option) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <div
                key={option.id}
                onClick={() => setSelectedOptionId(option.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'bg-[#282a2c] border-blue-500/80 ring-1 ring-blue-500/50 shadow-xl shadow-blue-500/5'
                    : 'bg-[#242527] border-[#333538] hover:border-[#44474a]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1e1f20] text-blue-400 font-bold border border-[#333538]">
                      {option.label}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border uppercase ${
                        option.brandRisk === 'Low'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : option.brandRisk === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}
                    >
                      {option.brandRisk} Risk
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-100">{option.name}</h4>
                  <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {option.description}
                  </p>
                </div>

                {/* Key Metric Blocks */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#333538]">
                  <div className="p-2 bg-[#1e1f20] rounded-lg border border-[#333538]">
                    <div className="text-[10px] text-gray-400">Projected Reach</div>
                    <div className="font-bold text-gray-200">{option.expectedReach}</div>
                  </div>
                  <div className="p-2 bg-[#1e1f20] rounded-lg border border-[#333538]">
                    <div className="text-[10px] text-gray-400">Expected Leads</div>
                    <div className="font-bold text-emerald-400">{option.expectedLeads}</div>
                  </div>
                  <div className="p-2 bg-[#1e1f20] rounded-lg border border-[#333538]">
                    <div className="text-[10px] text-gray-400">Estimated Cost</div>
                    <div className="font-bold text-blue-400">{option.estimatedCost}</div>
                  </div>
                  <div className="p-2 bg-[#1e1f20] rounded-lg border border-[#333538]">
                    <div className="text-[10px] text-gray-400">AI Confidence</div>
                    <div className="font-bold text-purple-400">{option.confidenceScore}%</div>
                  </div>
                </div>

                {/* Selection Footer */}
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">
                    ROI Score: <span className="text-emerald-400 font-bold">{option.roiScore}/100</span>
                  </span>
                  <div className="flex items-center gap-1 text-blue-400 font-medium">
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Selected for Execution</span>
                      </>
                    ) : (
                      <span className="text-gray-400 hover:text-gray-200">Click to Select</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Trajectory Curve Breakdown */}
      <div className="p-4 bg-[#242527] rounded-2xl border border-[#3c4043] space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>7-Day Projected Reach Curves</span>
          </span>
          <span className="text-[10px] font-mono text-gray-400">Daily Trajectory</span>
        </div>

        <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2">
          {simulationResult.trajectories.map((traj) => (
            <div key={traj.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center gap-1 h-20">
                {/* Organic Bar */}
                <div
                  className="w-1/3 bg-emerald-500/80 rounded-t transition-all duration-300"
                  style={{ height: `${Math.min(100, (traj.organicReach / 240000) * 100)}%` }}
                  title={`Day ${traj.day} Organic: ${traj.organicReach.toLocaleString()}`}
                />
                {/* Paid Bar */}
                <div
                  className="w-1/3 bg-blue-500 rounded-t transition-all duration-300"
                  style={{ height: `${Math.min(100, (traj.paidReach / 240000) * 100)}%` }}
                  title={`Day ${traj.day} Paid: ${traj.paidReach.toLocaleString()}`}
                />
              </div>
              <span className="text-[10px] text-gray-400 font-mono">D{traj.day}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Option A (Organic)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Option B (Paid Amplification)</span>
          </div>
        </div>
      </div>

      {/* Data Classification Disclosure Box */}
      <div className="p-3.5 bg-[#171819] rounded-xl border border-[#333538] space-y-2 text-xs">
        <div className="font-semibold text-gray-300 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Decision Data Classification & Integrity</span>
        </div>

        <div className="space-y-1 text-[11px] text-gray-300">
          <div>
            <span className="text-emerald-400 font-semibold">• Historical Data: </span>
            {simulationResult.dataClassification.historicalData}
          </div>
          <div>
            <span className="text-blue-400 font-semibold">• Forecast Engine: </span>
            {simulationResult.dataClassification.forecast}
          </div>
          <div>
            <span className="text-purple-400 font-semibold">• Scenario Assumptions: </span>
            {simulationResult.dataClassification.scenarioAssumptions}
          </div>
          <div>
            <span className="text-amber-400 font-semibold">• Unknown Factors: </span>
            {simulationResult.dataClassification.unknownFactors}
          </div>
        </div>
      </div>

      {/* Commit Decision to Brand Memory Button */}
      <div className="p-3 bg-[#242527] rounded-xl border border-[#3c4043] flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-gray-100">
            Commit to Brand Memory Log
          </div>
          <div className="text-[11px] text-gray-400">
            Saves this decision to permanent memory and begins tracking actual performance variance.
          </div>
        </div>

        <button
          onClick={handleCommit}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow flex items-center gap-1.5 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Commit Decision</span>
        </button>
      </div>

      {committedSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Decision successfully committed to Brand Memory (#00183)! Visible in Sources & Decision Log.
          </span>
        </div>
      )}
    </div>
  );
};
