'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { User, Activity, FileText, Calendar, ShieldAlert, HeartPulse, Stethoscope, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Patient, Consultation } from '@/lib/types';

export default function PatientProfilePage() {
  const params = useParams();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, consultsRes] = await Promise.all([
          api.get(`/patients/${patientId}`),
          api.get(`/consultations?patient_id=${patientId}`)
        ]);
        setPatient(patientRes.data);
        setConsultations(consultsRes.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (patientId) {
      fetchData();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 flex items-center justify-center">
          <div className="text-[#64748B]">Loading patient data...</div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 flex items-center justify-center">
          <div className="text-[#64748B]">Patient not found.</div>
        </main>
      </div>
    );
  }

  // Calculate age if DOB exists
  let ageString = '';
  if (patient.dob) {
    const dob = new Date(patient.dob);
    if (!isNaN(dob.getTime())) {
      const ageDifMs = Date.now() - dob.getTime();
      const ageDate = new Date(ageDifMs);
      ageString = ` (${Math.abs(ageDate.getUTCFullYear() - 1970)}y)`;
    }
  }

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
              <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">{patient.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-[#64748B] text-sm">
                <span>DOB: {patient.dob || 'Unknown'}{ageString}</span>
                <span className="w-1 h-1 rounded-full bg-[#E2E8F0]" />
                <span>{patient.gender || 'Unknown'}</span>
                <span className="w-1 h-1 rounded-full bg-[#E2E8F0]" />
                <span>MRN: {patient.mrn || patient.id.substring(0, 8)}</span>
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
                  {patient.chronic_conditions && patient.chronic_conditions.length > 0 ? (
                    patient.chronic_conditions.map((condition, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 text-[#0F172A] font-medium rounded-lg border border-[#E2E8F0]">
                        {condition}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-[#64748B]">No known conditions recorded.</div>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <h2 className="font-bold text-[#0F172A] flex items-center gap-2">
                    <HeartPulse size={18} className="text-emerald-600" /> Recent Vitals
                  </h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="text-sm text-[#64748B] text-center italic py-2">
                    No recent vitals available.
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
                  {consultations.length === 0 ? (
                    <div className="text-[#64748B] text-center py-4">No consultation history found.</div>
                  ) : (
                    <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-8">
                       {consultations.map((consultation, idx) => {
                         const date = new Date(consultation.created_at);
                         const isLatest = idx === 0;
                         return (
                           <div key={consultation.id} className="relative">
                             <span className={`absolute -left-[31px] top-1 w-4 h-4 bg-white border-2 rounded-full ${isLatest ? 'border-[#2563EB]' : 'border-[#E2E8F0]'}`} />
                             <p className={`text-sm font-medium mb-1 ${isLatest ? 'text-[#2563EB]' : 'text-[#64748B]'}`}>
                               {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                             </p>
                             <div className={`p-4 border rounded-xl ${isLatest ? 'bg-[#F8FAFC] border-[#E2E8F0]' : 'bg-white border-[#E2E8F0]'}`}>
                               <h3 className="font-bold text-[#0F172A] mb-2 flex items-center gap-2">
                                 <Stethoscope size={16} /> Consultation
                               </h3>
                               <p className="text-sm text-[#64748B] leading-relaxed">
                                 {consultation.chief_complaint ? consultation.chief_complaint : (
                                   consultation.soap_note?.assessment ? consultation.soap_note.assessment.substring(0, 150) + '...' : 'Consultation details recorded.'
                                 )}
                               </p>
                             </div>
                           </div>
                         );
                       })}
                    </div>
                  )}
                </div>
              </div>
           </div>

        </div>
      </main>
    </div>
  );
}
