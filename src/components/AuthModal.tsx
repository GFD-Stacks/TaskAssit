import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Building2,
  MapPin,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe,
  X,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { UserProfile } from '../types';
import { loginWithEmail, registerWithEmail, loginAsGuest } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [agencyOrBrand, setAgencyOrBrand] = useState('LuxeAura Maison Lagos');
  const [marketLocation, setMarketLocation] = useState('Lagos (Victoria Island, Ikoyi, Lekki)');
  const [role, setRole] = useState<UserProfile['role']>('Brand Executive');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginWithEmail(email, password);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await registerWithEmail(
        email,
        password,
        displayName,
        role,
        agencyOrBrand,
        marketLocation
      );
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Registration error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickLogin = async (
    name: string,
    roleTitle: UserProfile['role'],
    agency: string,
    market: string
  ) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginAsGuest(name, roleTitle);
      user.agencyOrBrand = agency;
      user.marketLocation = market;
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg('Demo sign in notice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-[#1e1f20] border border-[#3c4043] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-gray-200 my-auto animate-fade-in">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#2d2f31] bg-[#242527] flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-100 text-base">TaskAssit</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Lagos Studio
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {mode === 'signin' ? 'Sign in to access your social intelligence workspace' : 'Create your creative agency intelligence account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#333538] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#2d2f31] bg-[#1a1b1c] px-4 pt-2">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-all ${
              mode === 'signin'
                ? 'border-blue-500 text-blue-400 bg-[#242527]/50 rounded-t-xl'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Sign In to Workspace
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-all ${
              mode === 'signup'
                ? 'border-blue-500 text-blue-400 bg-[#242527]/50 rounded-t-xl'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Create Agency Account
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {forgotSent && (
            <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Password reset instructions sent to your email address.</span>
            </div>
          )}

          {/* Quick 1-Click Demo Profiles */}
          <div className="p-3.5 bg-[#282a2c]/80 border border-[#3c4043] rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-300">
              <span className="flex items-center gap-1.5 text-blue-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Quick 1-Click Lagos Demo Personas
              </span>
              <span className="text-[10px] text-gray-400">Instant Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleDemoQuickLogin(
                    'Adebayo K.',
                    'Brand Executive',
                    'LuxeAura Maison Lagos',
                    'Victoria Island & Ikoyi'
                  )
                }
                className="p-2 bg-[#1e1f20] hover:bg-[#333538] border border-[#3c4043] hover:border-blue-500/50 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-bold text-gray-100 group-hover:text-blue-300">Adebayo K.</div>
                <div className="text-[9px] text-blue-400">Brand Director</div>
                <div className="text-[9px] text-gray-400 truncate">LuxeAura Maison</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDemoQuickLogin(
                    'Chioma E.',
                    'Culture Strategist',
                    'Eko Pulse Media',
                    'Lagos Mainland & Diaspora'
                  )
                }
                className="p-2 bg-[#1e1f20] hover:bg-[#333538] border border-[#3c4043] hover:border-purple-500/50 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-bold text-gray-100 group-hover:text-purple-300">Chioma E.</div>
                <div className="text-[9px] text-purple-400">Culture Strategist</div>
                <div className="text-[9px] text-gray-400 truncate">Eko Pulse Media</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDemoQuickLogin(
                    'Tunde O.',
                    'Agency Creative Director',
                    'Lagos Ad Council',
                    'West Africa Regional'
                  )
                }
                className="p-2 bg-[#1e1f20] hover:bg-[#333538] border border-[#3c4043] hover:border-emerald-500/50 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-bold text-gray-100 group-hover:text-emerald-300">Tunde O.</div>
                <div className="text-[9px] text-emerald-400">ARCON Compliance</div>
                <div className="text-[9px] text-gray-400 truncate">Lagos Ad Council</div>
              </button>
            </div>
          </div>

          {/* Form */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="director@luxeaura.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-gray-300 font-medium flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotSent(true)}
                    className="text-blue-400 hover:text-blue-300 text-[11px]"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Enter TaskAssit Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oluwaseun Adeleke"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Brand Executive">Brand Executive / Director</option>
                    <option value="Culture Strategist">Culture & Trend Strategist</option>
                    <option value="Agency Creative Director">Agency Creative Director</option>
                    <option value="Social Media Lead">Social Media Lead</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    Agency or Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eko Artisan Collective"
                    value={agencyOrBrand}
                    onChange={(e) => setAgencyOrBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    Primary Market
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos (VI, Lekki) & London"
                    value={marketLocation}
                    onChange={(e) => setMarketLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  Create Password (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-[#282a2c] border border-[#3c4043] rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[11px] text-blue-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span>Includes free access to all 10 Multi-Modal Studios and ARCON Safety Audits.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Create Free Workspace Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social Proof & Guarantee */}
          <div className="pt-2 border-t border-[#2d2f31] flex items-center justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-400" />
              West Africa Time (WAT) Optimized
            </span>
            <span>ARCON Certified Safety</span>
          </div>
        </div>
      </div>
    </div>
  );
};
