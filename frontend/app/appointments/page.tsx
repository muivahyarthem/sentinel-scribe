'use client';

import Navbar from '@/components/Navbar';
import { Search, Calendar as CalendarIcon, Clock, Video, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">Appointments</h1>
            <p className="text-[#64748B] text-lg">Your upcoming schedule and clinic visits.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
              Today
            </button>
            <Link href="/appointments/new" className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-[#0F4C81] hover:bg-[#0c3e6b] text-white font-medium transition-colors shadow-sm text-sm">
              Schedule Visit
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#64748B] mb-4">
                 <CalendarIcon size={32} />
               </div>
               <h3 className="text-[#0F172A] font-semibold text-lg mb-2">No appointments scheduled</h3>
               <p className="text-[#64748B] max-w-sm">You have no upcoming appointments for today. Enjoy your day or review patient records.</p>
            </div>
          </div>
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
               <h3 className="font-semibold text-[#0F172A] mb-4">Mini Calendar</h3>
               <div className="w-full h-64 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#64748B]">
                 Calendar Component
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
