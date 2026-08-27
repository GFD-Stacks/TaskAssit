import React from 'react';
import {
  BrainCircuit,
  FileSpreadsheet,
  PenTool,
  Share2,
  Calendar,
  BarChart3,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { AppViewMode } from '../types';

interface NavigationTabsProps {
  activeView: AppViewMode;
  onSelectView: (view: AppViewMode) => void;
  scheduledCount?: number;
  briefsCount?: number;
  safetyAlertsCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeView,
  onSelectView,
  scheduledCount = 7,
  briefsCount = 2,
  safetyAlertsCount = 0
}) => {
  const tabs = [
    {
      id: 'social_brain' as AppViewMode,
      label: 'Social Brain & Signals',
      icon: BrainCircuit,
      badge: 'Live',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      id: 'campaign_briefs' as AppViewMode,
      label: 'Campaign Briefs',
      icon: FileSpreadsheet,
      badge: `${briefsCount} Active`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'post_creator' as AppViewMode,
      label: 'Post & Caption Studio',
      icon: PenTool,
      badge: 'AI Native',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'omnichannel_crosspost' as AppViewMode,
      label: '1-to-All Cross-Poster',
      icon: Share2,
      badge: '6 Channels',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'content_calendar' as AppViewMode,
      label: 'Content Calendar',
      icon: Calendar,
      badge: `${scheduledCount} Scheduled`,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      id: 'performance_analytics' as AppViewMode,
      label: 'Performance & Themes',
      icon: BarChart3,
      badge: '+42% Lift',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'brand_guardrails' as AppViewMode,
      label: 'Brand Guardrails',
      icon: ShieldCheck,
      badge: safetyAlertsCount > 0 ? `${safetyAlertsCount} Alerts` : 'Protected',
      badgeColor: safetyAlertsCount > 0 ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    }
  ];

  return (
    <nav className="border-b border-[#2d2f31] bg-[#1a1b1d] px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none z-10 transition-all">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectView(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              isActive
                ? 'bg-[#2a2b2e] text-white shadow-sm border border-[#44474a]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#232427] border border-transparent'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md border font-mono font-medium ${
                  isActive ? tab.badgeColor : 'bg-[#282a2c] text-gray-400 border-[#3c4043]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
