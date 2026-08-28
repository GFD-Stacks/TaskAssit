import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Sliders,
  Download,
  Share2,
  ChevronDown,
  Building2,
  Activity,
  CheckCircle2,
  Plus,
  Database,
  RefreshCw,
  Trash2,
  User,
  LogOut,
  Globe,
  LogIn
} from 'lucide-react';
import { BrandProfile, TrendWatcherStatus, UserProfile } from '../types';

interface HeaderProps {
  currentBrand: BrandProfile;
  brands: BrandProfile[];
  trendWatcherStatus?: TrendWatcherStatus;
  currentUser?: UserProfile | null;
  onSelectBrand: (brand: BrandProfile) => void;
  onOpenWhatIfSandbox: () => void;
  onOpenAddSource: () => void;
  onExportReport: () => void;
  onCleanSlate?: () => void;
  onTriggerLiveSearch?: () => void;
  onOpenLandingPage?: () => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onLogout?: () => void;
  isSearchingLive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentBrand,
  brands,
  trendWatcherStatus,
  currentUser,
  onSelectBrand,
  onOpenWhatIfSandbox,
  onOpenAddSource,
  onExportReport,
  onCleanSlate,
  onTriggerLiveSearch,
  onOpenLandingPage,
  onOpenAuth,
  onLogout,
  isSearchingLive = false
}) => {
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);

  const handleShare = () => {
    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 2500);
  };

  return (
    <header className="h-14 border-b border-[#2d2f31] bg-[#1e1f20] px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between select-none z-20 transition-all">
      {/* Left: Brand Identity & Active Notebook */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-sm shadow-blue-500/20 text-white font-bold text-sm tracking-tighter">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-100 text-base tracking-tight flex items-center gap-1.5">
            TaskAssit
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              SOCIAL BRAIN
            </span>
          </span>
        </div>

        {onOpenLandingPage && (
          <button
            onClick={onOpenLandingPage}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="View Homepage & Product Overview"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Overview Page</span>
          </button>
        )}

        <div className="h-4 w-px bg-[#333538] mx-1" />

        {/* Brand Selector */}
        <div className="relative">
          <button
            onClick={() => setShowBrandDropdown(!showBrandDropdown)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-xs text-gray-200 transition-colors"
            title="Switch Brand Context"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium max-w-[140px] truncate">{currentBrand?.name || 'Select Brand'}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showBrandDropdown && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-[#282a2c] border border-[#3c4043] rounded-xl shadow-2xl py-1.5 z-50">
              <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                Active Brand Profiles
              </div>
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    onSelectBrand(b);
                    setShowBrandDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    b.id === currentBrand?.id
                      ? 'bg-blue-500/15 text-blue-300 font-medium'
                      : 'text-gray-200 hover:bg-[#333538]'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-medium">{b.name}</div>
                    <div className="text-[10px] text-gray-400 truncate">{b.industry}</div>
                  </div>
                  {b.id === currentBrand?.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  )}
                </button>
              ))}
              <div className="border-t border-[#3c4043] my-1" />
              <button
                onClick={() => {
                  setShowBrandDropdown(false);
                  onOpenAddSource();
                }}
                className="w-full text-left px-3 py-2 text-xs text-blue-400 hover:bg-[#333538] flex items-center gap-2 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Brand Profile...</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center: Real-time Telemetry Pills */}
      <div className="hidden lg:flex items-center gap-2 text-[11px]">
        {/* Firestore Live Connected Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1e293b] border border-blue-500/30 text-blue-300" title="Firestore Database Connected & Live">
          <Database className="w-3 h-3 text-blue-400 animate-pulse" />
          <span className="font-medium">Firestore Live</span>
        </div>

        {/* Automated Trend Watcher Telemetry */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors ${
            trendWatcherStatus?.enabled
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-[#282a2c] border-[#3c4043] text-gray-400'
          }`}
          title={`Automated Trend Watcher polling Google Search every ${trendWatcherStatus?.intervalMinutes || 30} minutes`}
        >
          <span className={`w-2 h-2 rounded-full ${trendWatcherStatus?.enabled ? 'bg-emerald-400 animate-ping' : 'bg-gray-500'}`} />
          <span>Trend Watcher: {trendWatcherStatus?.enabled ? `Active (${trendWatcherStatus.intervalMinutes}m)` : 'Paused'}</span>
        </div>

        {onTriggerLiveSearch && (
          <button
            onClick={onTriggerLiveSearch}
            disabled={isSearchingLive}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Scan Open Social Platforms & Google Search for real-time signals"
          >
            <RefreshCw className={`w-3 h-3 text-emerald-400 ${isSearchingLive ? 'animate-spin' : ''}`} />
            <span>{isSearchingLive ? 'Scanning Open Platforms...' : 'Google & Gemini Scan'}</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#282a2c] border border-[#3c4043] text-gray-300">
          <Activity className="w-3 h-3 text-blue-400" />
          <span>Model Calibration: {currentBrand?.historicalPerformance?.modelCalibrationAccuracy || 94}%</span>
        </div>
      </div>

      {/* Right: Quick Action Controls & User Profile */}
      <div className="flex items-center gap-2">
        {onCleanSlate && (
          <button
            onClick={onCleanSlate}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#282a2c] hover:bg-rose-950/40 border border-[#3c4043] hover:border-rose-500/40 text-gray-400 hover:text-rose-300 text-xs transition-colors"
            title="Clean Slate: Reset Firestore Collections for fresh testing"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xl:inline">Clean Slate</span>
          </button>
        )}

        <button
          onClick={onOpenWhatIfSandbox}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition-colors"
          title="Open Decision Simulator Sandbox"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">What-If Studio</span>
        </button>

        <button
          onClick={onExportReport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-300 text-xs transition-colors"
          title="Export Social Dossier"
        >
          <Download className="w-3.5 h-3.5 text-gray-400" />
          <span className="hidden md:inline">Export</span>
        </button>

        <button
          onClick={handleShare}
          className="p-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-300 transition-colors relative"
          title="Share Intelligence Workspace"
        >
          <Share2 className="w-3.5 h-3.5" />
          {showShareNotification && (
            <div className="absolute right-0 top-full mt-1.5 px-2 py-1 bg-blue-600 text-white text-[11px] rounded shadow-lg whitespace-nowrap z-50 animate-fade-in">
              Workspace Link Copied!
            </div>
          )}
        </button>

        <div className="h-4 w-px bg-[#333538] mx-0.5" />

        {/* Safety Indicator Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium" title="Brand Safety Filter: Active">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Protected</span>
        </div>

        {/* User Account / Profile Dropdown */}
        <div className="relative">
          {currentUser ? (
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                {currentUser.displayName?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-medium text-gray-200 leading-none">{currentUser.displayName}</div>
                <div className="text-[9px] text-blue-400 leading-tight mt-0.5">{currentUser.role}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth?.('signin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {showUserDropdown && currentUser && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#282a2c] border border-[#3c4043] rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <div className="p-2.5 bg-[#1e1f20] rounded-xl border border-[#3c4043] space-y-1">
                <div className="font-bold text-xs text-gray-100">{currentUser.displayName}</div>
                <div className="text-[10px] text-blue-400">{currentUser.role}</div>
                <div className="text-[10px] text-gray-400">{currentUser.agencyOrBrand}</div>
                <div className="text-[10px] text-gray-400">{currentUser.email}</div>
              </div>

              {onOpenLandingPage && (
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenLandingPage();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-[#333538] rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>View Product Landing Page</span>
                </button>
              )}

              {onOpenAuth && (
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenAuth('signup');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-[#333538] rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Switch Account / Personas</span>
                </button>
              )}

              <div className="border-t border-[#3c4043] my-1" />

              {onLogout && (
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

