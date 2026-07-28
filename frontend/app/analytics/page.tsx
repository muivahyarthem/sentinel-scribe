'use client';

import Navbar from '@/components/Navbar';
import { LineChart, BarChart3, TrendingUp, Download } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">Analytics</h1>
            <p className="text-[#64748B] text-lg">Hospital and clinic performance metrics.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
            <Download size={16} /> Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                 <LineChart size={20} />
               </div>
               <h3 className="font-medium text-[#64748B]">Patient Volume</h3>
             </div>
             <p className="text-3xl font-bold text-[#0F172A]">1,248</p>
             <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp size={14} /> +12% this month</p>
           </div>
           
           <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                 <BarChart3 size={20} />
               </div>
               <h3 className="font-medium text-[#64748B]">Avg Wait Time</h3>
             </div>
             <p className="text-3xl font-bold text-[#0F172A]">14m</p>
             <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp size={14} className="rotate-180" /> -3m this month</p>
           </div>
           
           <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                 <TrendingUp size={20} />
               </div>
               <h3 className="font-medium text-[#64748B]">Documentation Time Saved</h3>
             </div>
             <p className="text-3xl font-bold text-[#0F172A]">342h</p>
             <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp size={14} /> +24h this month</p>
           </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] h-96 flex items-center justify-center">
           <p className="text-[#64748B]">Detailed charts and analytics will load here.</p>
        </div>
      </main>
    </div>
  );
}
