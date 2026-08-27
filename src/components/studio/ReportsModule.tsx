import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Target,
  BarChart3,
  Calendar
} from 'lucide-react';
import { StudioReport } from '../../types';

interface ReportsModuleProps {
  report: StudioReport;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({ report }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    const fullMarkdown = `# ${report.title}\n\n**Generated:** ${report.generatedAt}\n\n## Executive Summary\n${report.executiveSummary}\n\n## SWOT Matrix\n- **Strengths:** ${report.swot.strengths.join(', ')}\n- **Weaknesses:** ${report.swot.weaknesses.join(', ')}\n- **Opportunities:** ${report.swot.opportunities.join(', ')}\n- **Threats:** ${report.swot.threats.join(', ')}\n\n` +
      report.sections.map((s) => `## ${s.heading}\n${s.content}\n${s.metrics ? `Metrics: ${JSON.stringify(s.metrics)}` : ''}\n`).join('\n') +
      `\n## Strategic Recommendations Matrix\n` +
      report.recommendationMatrix.map((r) => `- [${r.priority}] **${r.action}** | Timeline: ${r.timeline} | Projected Lift: ${r.expectedImpact} | Risk: ${r.riskLevel}`).join('\n');

    navigator.clipboard.writeText(fullMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullMarkdown = `# ${report.title}\n\n**Generated:** ${report.generatedAt}\n\n## Executive Summary\n${report.executiveSummary}\n\n## SWOT Matrix\n- **Strengths:** ${report.swot.strengths.join(', ')}\n- **Weaknesses:** ${report.swot.weaknesses.join(', ')}\n- **Opportunities:** ${report.swot.opportunities.join(', ')}\n- **Threats:** ${report.swot.threats.join(', ')}\n\n` +
      report.sections.map((s) => `## ${s.heading}\n${s.content}\n\n`).join('\n');

    const blob = new Blob([fullMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TaskAssit_Intelligence_Dossier_${Date.now()}.md`;
    a.click();
  };

  return (
    <div className="space-y-4 text-gray-200">
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Executive Social Intelligence Dossier</span>
          </h3>
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span>Generated {report.generatedAt}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyMarkdown}
            className="p-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-300 text-xs flex items-center gap-1 transition-colors"
            title="Copy Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-300 text-xs flex items-center gap-1 transition-colors"
            title="Download Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="p-4 bg-gradient-to-r from-blue-950/30 via-[#242527] to-[#282a2c] rounded-2xl border border-blue-500/20 space-y-2">
        <div className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Executive Summary</span>
        </div>
        <p className="text-xs text-gray-200 leading-relaxed">{report.executiveSummary}</p>
      </div>

      {/* SWOT Analysis Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Strengths */}
        <div className="p-3 bg-[#242527] rounded-xl border border-emerald-500/30 space-y-1.5">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            Strengths
          </div>
          <ul className="space-y-1 text-xs text-gray-300">
            {report.swot.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-3 bg-[#242527] rounded-xl border border-amber-500/30 space-y-1.5">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            Weaknesses
          </div>
          <ul className="space-y-1 text-xs text-gray-300">
            {report.swot.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="p-3 bg-[#242527] rounded-xl border border-blue-500/30 space-y-1.5">
          <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
            Opportunities
          </div>
          <ul className="space-y-1 text-xs text-gray-300">
            {report.swot.opportunities.map((o, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-blue-400 font-bold">•</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats */}
        <div className="p-3 bg-[#242527] rounded-xl border border-red-500/30 space-y-1.5">
          <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
            Threats
          </div>
          <ul className="space-y-1 text-xs text-gray-300">
            {report.swot.threats.map((t, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-3">
        {report.sections.map((section, idx) => (
          <div key={idx} className="p-3.5 bg-[#242527] rounded-xl border border-[#333538] space-y-2">
            <h4 className="text-xs font-bold text-gray-100 flex items-center justify-between">
              <span>{section.heading}</span>
              <span className="text-[10px] text-gray-400 font-mono">0{idx + 1}</span>
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>

            {section.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#333538]">
                {Object.entries(section.metrics).map(([key, val]) => (
                  <div key={key} className="p-2 bg-[#1e1f20] rounded-lg border border-[#333538] text-center">
                    <div className="text-[10px] text-gray-400 capitalize">{key}</div>
                    <div className="text-xs font-bold text-blue-400 mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Recommendation Matrix */}
      <div className="p-3.5 bg-[#242527] rounded-xl border border-[#333538] space-y-2.5">
        <div className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          <span>Prioritized Execution Matrix</span>
        </div>

        <div className="space-y-2">
          {report.recommendationMatrix.map((rec, i) => (
            <div
              key={i}
              className="p-2.5 bg-[#1e1f20] rounded-xl border border-[#333538] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                      rec.priority === 'High'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {rec.priority} Priority
                  </span>
                  <span className="font-semibold text-gray-100">{rec.action}</span>
                </div>
                <div className="text-[11px] text-gray-400">
                  Timeline: <span className="text-gray-300">{rec.timeline}</span> • Impact:{' '}
                  <span className="text-emerald-400 font-medium">{rec.expectedImpact}</span>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 flex items-center gap-1 sm:self-center">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span>Risk: {rec.riskLevel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
