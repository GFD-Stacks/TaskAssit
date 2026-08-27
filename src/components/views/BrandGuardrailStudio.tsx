import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Copy,
  Sliders,
  FileCheck,
  Lock,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { BrandProfile, BrandSafetyAudit } from '../../types';

interface BrandGuardrailStudioProps {
  currentBrand: BrandProfile;
  onApplySafeRewrite?: (safeText: string) => void;
}

export const BrandGuardrailStudio: React.FC<BrandGuardrailStudioProps> = ({
  currentBrand,
  onApplySafeRewrite
}) => {
  const [testContent, setTestContent] = useState(
    `CHEAPEST SUITS IN TOWN! 50% DISCOUNT TODAY ONLY! Omo no try me oo, buy now or regret forever. 100% genuine Italian silk imported directly, guaranteed to make you look like a billionaire overnight!`
  );

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<BrandSafetyAudit | null>({
    safetyScore: 42,
    status: 'flagged',
    flags: [
      {
        severity: 'high',
        category: 'tone_violation',
        issue: 'Discount language ("CHEAPEST SUITS", "50% DISCOUNT") severely erodes LuxeAura ultra-luxury equity.',
        recommendation: 'Replace transactional discount phrasing with exclusivity and private atelier commission language.'
      },
      {
        severity: 'medium',
        category: 'misleading_claim',
        issue: 'Unsubstantiated promise ("make you look like a billionaire overnight") triggers regulatory risk.',
        recommendation: 'Focus on craftsmanship, bespoke lapel structure, and verified material provenance.'
      },
      {
        severity: 'low',
        category: 'cultural_misalignment',
        issue: 'Slang phrase "Omo no try me oo" used in an aggressive sales pitch rather than playful cultural wit.',
        recommendation: 'Position cultural phrases in celebratory styling context rather than high-pressure sales.'
      }
    ],
    summary: 'Content violates 3 core LuxeAura brand rules: anti-discounting, claim substantiation, and elevated cultural wit.',
    safeRewrite: `Handcrafted in limited numbered quantities of 40 pieces worldwide. When fast fashion floods the world with disposable garments, true luxury stands on artisan permanence and Nigerian silk jacquard heritage.\n\nPrivate bespoke commissions now open in Victoria Island and Mayfair.`
  });

  const [copiedRewrite, setCopiedRewrite] = useState(false);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/gemini/audit-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: currentBrand,
          text: testContent
        })
      });

      if (res.ok) {
        const result: BrandSafetyAudit = await res.json();
        setAuditResult(result);
      }
    } catch (e) {
      console.error('Audit failed:', e);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCopyRewrite = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRewrite(true);
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#171819] text-gray-200 p-3 sm:p-5 md:p-6 lg:p-8 xl:p-10">
      <div className="max-w-5xl mx-auto w-full space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-gray-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Brand Guardrails & Safety Auditor
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Automatic heuristic & semantic review to flag misleading claims, discount language, and off-brand tone.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-[#282a2c] text-gray-300 border border-[#3c4043] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Guardrails: Active & Enforced</span>
            </span>
          </div>
        </div>

        {/* Brand Rules Policy Reference Card */}
        <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#232427] border border-[#34373a]">
            <span className="font-bold text-amber-400 block mb-1">1. Anti-Discounting Rule</span>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Never use words like "cheap", "sale", "discount", "lowest price". LuxeAura is an ultra-premium atelier.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#232427] border border-[#34373a]">
            <span className="font-bold text-blue-400 block mb-1">2. Authentic Cultural Wit</span>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Slang must celebrate contemporary African diaspora swagger naturally, avoiding caricatures or aggressive spam.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#232427] border border-[#34373a]">
            <span className="font-bold text-emerald-400 block mb-1">3. Verifiable Provenance</span>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              All material claims (silk jacquard, 40 pieces, hand-woven) must strictly match true production counts.
            </p>
          </div>
        </div>

        {/* Live Content Test Editor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left: Input Text to Audit */}
          <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-200 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-400" />
                  Content Draft to Screen
                </label>
                <span className="text-[10px] text-gray-500">{testContent.length} chars</span>
              </div>
              <textarea
                rows={8}
                value={testContent}
                onChange={(e) => setTestContent(e.target.value)}
                placeholder="Paste any caption, influencer brief, or ad script to audit..."
                className="w-full bg-[#282a2c] border border-[#3c4043] rounded-xl p-3 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
              />
            </div>

            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'Auditing Against Brand Guardrails...' : 'Run Real-Time Safety Audit'}</span>
            </button>
          </div>

          {/* Right: Real-Time Audit Score & Flags */}
          <div className="bg-[#1e1f20] border border-[#2d2f31] rounded-2xl p-5 space-y-4">
            {auditResult ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-[#2d2f31]">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">
                      Brand Safety Compliance
                    </div>
                    <div
                      className={`text-lg font-bold capitalize ${
                        auditResult.safetyScore >= 80
                          ? 'text-emerald-400'
                          : auditResult.safetyScore >= 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {auditResult.status === 'approved'
                        ? 'Passed (Brand Safe)'
                        : auditResult.status === 'warning'
                        ? 'Minor Review Needed'
                        : 'Blocked (Critical Flags)'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black font-mono text-white">
                      {auditResult.safetyScore}/100
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">Compliance Index</div>
                  </div>
                </div>

                <div className="text-xs text-gray-300 leading-relaxed bg-[#232427] p-3 rounded-xl border border-[#34373a]">
                  {auditResult.summary}
                </div>

                {/* Flags Breakdown */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Detected Guardrail Flags ({auditResult.flags.length})
                  </span>

                  {auditResult.flags.length > 0 ? (
                    auditResult.flags.map((flag, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                          flag.severity === 'high'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                            : flag.severity === 'medium'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                        }`}
                      >
                        <AlertTriangle
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            flag.severity === 'high'
                              ? 'text-rose-400'
                              : flag.severity === 'medium'
                              ? 'text-amber-400'
                              : 'text-blue-400'
                          }`}
                        />
                        <div>
                          <div className="font-semibold">{flag.issue}</div>
                          <div className="text-[11px] opacity-80 mt-1">
                            💡 Recommendation: {flag.recommendation}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Zero guardrail violations detected. Content is 100% ready for publishing!</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <ShieldCheck className="w-10 h-10 mb-2 opacity-40" />
                <span className="text-xs">Click Run Audit to evaluate content against brand guardrails.</span>
              </div>
            )}
          </div>
        </div>

        {/* 1-Click AI Safe Rewrite Card */}
        {auditResult?.safeRewrite && (
          <div className="bg-[#1e1f20] border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2d2f31]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white">
                  AI Guardrail-Safe Re-alignment (100% Brand Compliant)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyRewrite(auditResult.safeRewrite!)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-gray-200 text-xs font-medium border border-[#3c4043] transition-colors"
                >
                  {copiedRewrite ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedRewrite ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => setTestContent(auditResult.safeRewrite!)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Adopt This Safe Version</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#282a2c] text-xs text-gray-200 whitespace-pre-wrap leading-relaxed border border-[#34373a]">
              {auditResult.safeRewrite}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
