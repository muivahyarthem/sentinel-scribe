'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { DashboardStats, Consultation } from '@/lib/types';
import { formatTimeAgo, getInitials } from '@/lib/utils';
import {
  Users, Calendar, FileText, Activity, AlertCircle, ArrowRight, CheckCircle2, Clock
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState('Dr. Mitchell');

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      if (e?.response?.status === 401) router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!localStorage.getItem('auth_token')) { router.push('/login'); return; }
    const loadProfile = () => {
      const savedProfile = localStorage.getItem('doctor_profile');
      if (savedProfile) {
        try { setDoctorName(JSON.parse(savedProfile).name); } catch (e) {}
      }
    };
    loadProfile();
    window.addEventListener('profileUpdated', loadProfile);
    fetchStats();
    
    const intervalId = setInterval(fetchStats, 10000); // reduced polling frequency for a calmer experience
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('profileUpdated', loadProfile);
    };
  }, [fetchStats, router]);

  const kpis = [
    { label: "Today's Consultations", value: stats?.total_consultations || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Sign-offs', value: stats?.pending_reviews || 0, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'High Priority Cases', value: stats?.emergency_cases || 0, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Documentation Saved', value: `${Math.round((stats?.soap_notes_generated || 0) * 0.33)}h`, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
              Good morning, {doctorName}
            </h1>
            <p className="text-[#64748B] text-lg">
              Here is your clinical overview for today.
            </p>
          </div>
          <Link href="/workspace" className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#0F4C81] hover:bg-[#0c3e6b] text-white font-medium transition-colors shadow-sm text-sm">
            Start New Consultation
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                  <kpi.icon className={kpi.color} size={24} strokeWidth={2} />
                </div>
                <h3 className="text-[#64748B] font-medium text-sm">{kpi.label}</h3>
              </div>
              <p className="text-3xl font-bold text-[#0F172A]">
                {loading ? <span className="opacity-0">0</span> : kpi.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed: Recent Consultations */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0F172A]">Recent Consultations</h2>
                <Link href="/records" className="text-sm font-medium text-[#2563EB] hover:text-[#1d4ed8]">
                  View All
                </Link>
              </div>
              <div className="p-0">
                {loading ? (
                  <div className="p-6 space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />)}
                  </div>
                ) : stats?.recent_consultations?.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-[#64748B]">No consultations recorded today.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E2E8F0]">
                    {stats?.recent_consultations.slice(0, 5).map((c) => (
                      <div key={c.id} className="p-4 sm:px-6 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer group" onClick={() => router.push('/workspace')}>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-slate-100 text-[#0F4C81] font-semibold text-sm">
                              {c.patient ? getInitials(c.patient.name) : '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-[#0F172A] text-sm">{c.patient?.name ?? 'Unknown Patient'}</p>
                            <p className="text-xs text-[#64748B] mt-0.5">{formatTimeAgo(c.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="hidden sm:flex flex-col items-end">
                            {c.triage_result?.priority === 'P1' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-[#DC2626]">High Priority</span>}
                            {c.triage_result?.priority === 'P2' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-[#F59E0B]">Urgent</span>}
                            {c.triage_result?.priority === 'P3' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-[#2563EB]">Routine</span>}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            {c.soap_note ? (
                              <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={14} /> Signed</span>
                            ) : (
                              <span className="text-amber-600 flex items-center gap-1.5"><Clock size={14} /> Pending</span>
                            )}
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-[#2563EB] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Patient Insights Action Items */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#E2E8F0]">
                <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                  <Activity size={18} className="text-[#2563EB]" />
                  Clinical Insights
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1,2].map(i => <div key={i} className="h-20 bg-slate-50 rounded-xl animate-pulse" />)}
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 flex gap-3 items-start">
                      <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A] mb-1">2 Pending Reviews</p>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          Documentation for your morning consultations require final sign-off.
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex gap-3 items-start">
                      <FileText size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A] mb-1">New Lab Results</p>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          Patient Sarah Jenkins has new CBC results ready for review.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                <button className="text-sm font-medium text-[#2563EB] hover:text-[#1d4ed8] w-full text-left">
                  View all insights →
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
