'use client';

import Navbar from '@/components/Navbar';
import { User, Activity, FileText, Calendar, ShieldAlert, HeartPulse, Stethoscope, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PatientProfilePage() {
  const params = useParams();
  const patientId = params.id;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        
        <Link href="/patients" className="inline-flex items-center text-[#64748B] hover:text-[#0F172A] font-medium mb-6 text-sm transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Patients
        </Link>

        {/* Patient Header */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-50 border border-[#E2E8F0] rounded-2xl flex items-center justify-center text-[#0F4C81]">
              <User size={36} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">John Doe</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-[#64748B] text-sm">
                <span>DOB: 12/04/1980 (45y)</span>
                <span className="w-1 h-1 rounded-full bg-[#E2E8F0]" />
                <span>Male</span>
                <span className="w-1 h-1 rounded-full bg-[#E2E8F0]" />
                <span>MRN: {patientId}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-6 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
               Edit Profile
             </button>
             <Link href="/workspace" className="px-6 py-2 bg-[#0F4C81] text-white font-medium rounded-lg hover:bg-[#0c3e6b] transition-colors shadow-sm">
               Start Consultation
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left Column: Vitals & Conditions */}
           <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <h2 className="font-bold text-[#0F172A] flex items-center gap-2">
                    <ShieldAlert size={18} className="text-[#DC2626]" /> Active Conditions
                  </h2>
                </div>
                <div className="p-5 space-y-3">
                  <div className="p-3 bg-red-50 text-[#DC2626] font-medium rounded-lg border border-red-100">Hypertension</div>
                  <div className="p-3 bg-slate-50 text-[#0F172A] font-medium rounded-lg border border-[#E2E8F0]">Type 2 Diabetes</div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <h2 className="font-bold text-[#0F172A] flex items-center gap-2">
                    <HeartPulse size={18} className="text-emerald-600" /> Recent Vitals
                  </h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
                    <span className="text-[#64748B] text-sm">Blood Pressure</span>
                    <span className="font-semibold text-[#0F172A]">138/88 mmHg</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
                    <span className="text-[#64748B] text-sm">Heart Rate</span>
                    <span className="font-semibold text-[#0F172A]">72 bpm</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-[#64748B] text-sm">Weight</span>
                    <span className="font-semibold text-[#0F172A]">185 lbs</span>
                  </div>
                </div>
              </div>
           </div>

           {/* Right Column: Timeline & Notes */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
                  <h2 className="font-bold text-[#0F172A] flex items-center gap-2">
                    <FileText size={18} className="text-[#0F4C81]" /> Clinical History
                  </h2>
                  <button className="text-sm font-medium text-[#2563EB] hover:text-[#1d4ed8]">Filter</button>
                </div>
                <div className="p-6">
                  <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-8">
                     
                     <div className="relative">
                       <span className="absolute -left-[31px] top-1 w-4 h-4 bg-white border-2 border-[#2563EB] rounded-full" />
                       <p className="text-sm font-medium text-[#2563EB] mb-1">Oct 12, 2025</p>
                       <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                         <h3 className="font-bold text-[#0F172A] mb-2 flex items-center gap-2"><Stethoscope size={16} /> Routine Follow-up</h3>
                         <p className="text-sm text-[#64748B] leading-relaxed">
                           Patient reported feeling generally well. Blood pressure remains slightly elevated. Prescribed continuing current dosage of Lisinopril.
                         </p>
                       </div>
                     </div>

                     <div className="relative">
                       <span className="absolute -left-[31px] top-1 w-4 h-4 bg-white border-2 border-[#E2E8F0] rounded-full" />
                       <p className="text-sm font-medium text-[#64748B] mb-1">Aug 05, 2025</p>
                       <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl">
                         <h3 className="font-bold text-[#0F172A] mb-2 flex items-center gap-2"><Activity size={16} /> Lab Results Review</h3>
                         <p className="text-sm text-[#64748B] leading-relaxed">
                           A1C is stable at 6.8%. Lipid panel showed slight improvement. Diet and exercise discussed.
                         </p>
                       </div>
                     </div>

                  </div>
                </div>
              </div>
           </div>

        </div>
      </main>
    </div>
  );
}
