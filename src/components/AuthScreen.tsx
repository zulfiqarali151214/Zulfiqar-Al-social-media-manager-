import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

interface AuthScreenProps {
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { loginWithEmail, signUpWithEmail, loginWithGoogle, resetPassword } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Email format validation helper
  const isValidEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
  };

  // Handle Email + Password Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Frontend validations
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please provide a valid email address (e.g. name@company.com).');
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      const res = await resetPassword(email);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage('Password reset link sent! Please check your inbox.');
      } else {
        setErrorMessage(res.error || 'Failed to send password reset email.');
      }
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    if (mode === 'signup') {
      if (!confirmPassword) {
        setErrorMessage('Please confirm your password.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify and try again.');
        return;
      }

      setIsLoading(true);
      const res = await signUpWithEmail(email, password, displayName.trim() || undefined);
      setIsLoading(false);

      if (res.success) {
        onSuccess?.();
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    } else {
      // Login
      setIsLoading(true);
      const res = await loginWithEmail(email, password);
      setIsLoading(false);

      if (res.success) {
        onSuccess?.();
      } else {
        setErrorMessage(res.error || 'Failed to sign in.');
      }
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    if (isLoading || googleLoading) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setGoogleLoading(true);

    const res = await loginWithGoogle();
    setGoogleLoading(false);

    if (res.success) {
      onSuccess?.();
    } else {
      setErrorMessage(res.error || 'Google sign-in could not be completed.');
    }
  };

  const switchMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setMode(newMode);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Ambience / Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-600/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/20 mb-1">
            <Sparkles className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
              Zulfiqar AI
            </h1>
            <p className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-semibold mt-0.5">
              Social Media Manager
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {mode === 'login' && 'Sign in to access your AI content studio, calendar, and publishing campaigns.'}
            {mode === 'signup' && 'Create your account to unlock AI social media automation & multi-platform tools.'}
            {mode === 'forgot' && 'Enter your account email to receive a password reset link.'}
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Tab Selection */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name input for Sign Up */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name / Business Name <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Morgan or TechNova"
                    disabled={isLoading || googleLoading}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Email input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                  disabled={isLoading || googleLoading}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password input */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Password <span className="text-emerald-400">*</span>
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                    disabled={isLoading || googleLoading}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password input */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Confirm Password <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    disabled={isLoading || googleLoading}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || googleLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === 'login' && 'Signing in...'}
                    {mode === 'signup' && 'Creating account...'}
                    {mode === 'forgot' && 'Sending reset link...'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In with Email'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Send Password Reset Link'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Forgot mode back button */}
          {mode === 'forgot' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                &larr; Back to Sign In
              </button>
            </div>
          )}

          {/* Social Divider & Google Button */}
          {mode !== 'forgot' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono">
                  <span className="bg-slate-900 px-3 text-slate-500">Or continue with</span>
                </div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || googleLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-white font-medium text-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span className="text-slate-300">Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    {/* Official Google 'G' icon */}
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </>
          )}

          {/* Toggle between Login and Signup */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1"
                >
                  Sign Up here
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1"
                >
                  Sign In here
                </button>
              </p>
            ) : null}
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" />
          <span>Secured with Firebase Authentication</span>
        </div>
      </div>
    </div>
  );
};
