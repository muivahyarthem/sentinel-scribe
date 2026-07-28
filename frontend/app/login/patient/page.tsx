'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight, Lock, Eye, EyeOff, Activity, ArrowLeft } from 'lucide-react';
import { login } from '@/lib/auth';
import { demoPatientLogin, initPortalFromRegistration } from '@/lib/patientPortal';

export default function PatientLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = await login(email, password);
      initPortalFromRegistration({
        name: user.name,
        email: user.email,
        id: user.id,
      });
      router.push('/portal');
    } catch {
      setError('Invalid email or password. Try demo access below.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    demoPatientLogin();
    router.push('/portal');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans selection:bg-[#E2E8F0]">
      
      <header className="h-[72px] flex items-center px-6 lg:px-8 bg-white border-b border-[#E2E8F0]">
        <Link href="/login" className="inline-flex items-center text-[#64748B] hover:text-[#0F172A] transition-colors text-sm font-medium">
          <ArrowLeft size={16} className="mr-2" /> Back to Role Selection
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        
        <div className="w-full max-w-[420px] bg-white shadow-[0_2px_15px_rgb(0,0,0,0.02)] border border-[#E2E8F0] rounded-2xl p-8 lg:p-10">
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-[#0F172A] tracking-tight">SentinelScribe</p>
              <p className="text-xs font-medium text-[#64748B]">Patient Portal</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-[#64748B] text-sm">
              Sign in to view your records, appointments, and messages.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 flex items-start gap-3">
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
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-[#0F172A]">Password</label>
                <a href="#" className="text-xs font-medium text-[#2563EB] hover:text-[#1d4ed8]">Forgot password?</a>
              </div>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium transition-colors disabled:opacity-70 shadow-sm"
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

          <div className="mt-6">
            <button
              onClick={handleDemo}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-medium hover:bg-slate-50 transition-colors text-sm"
            >
              Try Demo Portal <ArrowRight size={16} className="text-[#64748B]" />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
            <p className="text-sm text-[#64748B]">
              First time visiting the clinic?
            </p>
            <Link 
              href="/login/patient/register" 
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-medium hover:bg-slate-50 transition-colors w-full justify-center"
            >
              Complete New Patient Intake <ArrowRight size={16} className="text-[#64748B]" />
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}
