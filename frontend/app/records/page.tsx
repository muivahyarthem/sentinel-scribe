'use client';

import Navbar from '@/components/Navbar';
import { Search, FileText, Download, Filter } from 'lucide-react';
import Link from 'next/link';

export default function RecordsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">Medical Records</h1>
            <p className="text-[#64748B] text-lg">Access and review complete patient histories.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
              <Filter size={16} /> Filter
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by ID, keyword, or ICD-10 code..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
              />
            </div>
          </div>
          
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#64748B] mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-[#0F172A] font-semibold text-lg mb-2">No records found</h3>
            <p className="text-[#64748B] max-w-sm">No historical medical records match your current search criteria.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
