'use client';

import Navbar from '@/components/Navbar';
import { Activity, Brain, Search, Stethoscope } from 'lucide-react';

export default function InsightsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-[#0F4C81] rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-sm">
            <Activity size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">Clinical Search</h1>
          <p className="text-[#64748B] text-lg max-w-xl mx-auto">
            Query across thousands of patient histories, clinical notes, and protocols securely.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-[0_2px_15px_rgb(0,0,0,0.03)] mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563EB]" size={20} />
            <input 
              type="text" 
              placeholder="e.g. 'Patients with chronic hypertension prescribed lisinopril last month'"
              className="w-full pl-12 pr-4 py-4 bg-transparent border-0 text-[#0F172A] text-lg placeholder:text-[#94A3B8] focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 rounded bg-blue-50 text-[#2563EB] flex items-center justify-center">
                 <Stethoscope size={18} />
               </div>
               <h3 className="font-semibold text-[#0F172A]">Recent Queries</h3>
             </div>
             <ul className="space-y-3">
               <li className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer">Post-op guidelines for ACL reconstruction</li>
               <li className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer">Interactions between warfarin and amiodarone</li>
               <li className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer">Triage protocols for acute chest pain</li>
             </ul>
           </div>
           
           <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                 <Brain size={18} />
               </div>
               <h3 className="font-semibold text-[#0F172A]">Suggested Insights</h3>
             </div>
             <ul className="space-y-3">
               <li className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer">Review updated hypertension guidelines (2025)</li>
               <li className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer">Summarize standard pediatric asthma action plan</li>
               <li className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer">Identify common contraindications for Paxlovid</li>
             </ul>
           </div>
        </div>
      </main>
    </div>
  );
}
