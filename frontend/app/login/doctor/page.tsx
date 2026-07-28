'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, loginDemo } from '@/lib/auth';
import Link from 'next/link';
import { Shield, ArrowRight, CheckCircle2, Lock, Eye, EyeOff, Activity } from 'lucide-react';

const FEATURES = [
  'Secure patient record access',
  'Clinical insights and triage',
  'Automated SOAP documentation',
  'HIPAA-compliant infrastructure',
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('doctor@clinic.ai');
  const [password, setPassword] = useState('demo1234');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await login(email, password); router.push('/'); }
    catch { setError('Invalid credentials. Use the demo credentials below.'); }
    finally { setLoading(false); }
  };

  const handleDemo = async () => {
    setLoading(true); setError('');
    try { await loginDemo(); router.push('/'); }
    catch { setError('Backend offline. Please start the FastAPI server.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] font-sans selection:bg-[#E2E8F0]">
      
      {/* ── Left: Professional Hospital Panel ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden bg-[#0F4C81] text-white">
        
        {/* Simple geometric pattern instead of glowing gradients */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Activity size={20} className="text-[#0F4C81]" />
          </div>
          <div>
            <p className="font-bold text-lg tracking-tight text-white">SentinelScribe</p>
            <p className="text-white/80 text-xs font-medium">Provider Portal</p>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 my-auto max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
            Clinical intelligence, seamlessly integrated.
          </h1>
          <p className="text-[#E2E8F0] text-lg mb-10 leading-relaxed">
            Access patient records, review clinical insights, and manage documentation securely from a single interface.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-white/80" />
                <span className="text-white font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10">
          <p className="text-white/60 text-xs flex items-center gap-2">
            <Shield size={14} /> Encrypted and Secure connection
          </p>
        </div>
      </div>

      {/* ── Right: Login Form ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden bg-white lg:bg-[#F8FAFC]">
        
        <div className="w-full max-w-[420px] bg-white lg:shadow-[0_2px_15px_rgb(0,0,0,0.02)] lg:border lg:border-[#E2E8F0] rounded-2xl p-6 lg:p-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-lg bg-[#0F4C81] flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-[#0F172A] tracking-tight">SentinelScribe</p>
              <p className="text-xs font-medium text-[#64748B]">Provider Portal</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
              Sign In
            </h2>
            <p className="text-[#64748B] text-sm">
              Enter your credentials to access the portal.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-[#DC2626] flex items-start gap-3">
              <Shield size={18} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-[#0F172A]">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all sm:text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="provider@hospital.org"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-[#0F172A]">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all sm:text-sm pr-12"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#64748B] hover:text-[#0F172A] transition-colors rounded"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 rounded-lg bg-[#0F4C81] hover:bg-[#0c3e6b] text-white font-medium transition-colors disabled:opacity-70 shadow-sm"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={16} className="opacity-80" /> 
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs font-medium text-[#64748B] uppercase">System Access</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          <div className="space-y-4">
            <button
              onClick={handleDemo}
              disabled={loading}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0F172A] font-medium transition-colors border border-[#E2E8F0]"
            >
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#2563EB]" />
                <span>Demo Provider Access</span>
              </div>
              <ArrowRight size={16} className="text-[#64748B]" />
            </button>

            <div className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2 block">Demo Credentials</span>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#64748B]">Email:</span>
                  <span className="font-mono text-[#0F172A]">doctor@clinic.ai</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#64748B]">Password:</span>
                  <span className="font-mono text-[#0F172A]">demo1234</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
