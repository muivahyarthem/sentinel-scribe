'use client';

import Navbar from '@/components/Navbar';
import { Search, Plus, Filter, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

const MOCK_PATIENTS = [
  { id: 'PAT-001', name: 'Alex Johnson', dob: '1990-03-15', gender: 'Male', doctor: 'Dr. Sarah Mitchell', condition: 'Hypertension' },
  { id: 'PAT-002', name: 'Maria Garcia', dob: '1985-07-22', gender: 'Female', doctor: 'Dr. James Chen', condition: 'Arrhythmia' },
  { id: 'PAT-003', name: 'David Smith', dob: '1978-11-05', gender: 'Male', doctor: 'Dr. Emily Rodriguez', condition: 'Osteoarthritis' },
  { id: 'PAT-004', name: 'Emma Davis', dob: '2015-02-14', gender: 'Female', doctor: 'Dr. Michael Park', condition: 'Asthma' },
  { id: 'PAT-005', name: 'Robert Wilson', dob: '1965-09-30', gender: 'Male', doctor: 'Dr. Lisa Thompson', condition: 'Psoriasis' },
  { id: 'PAT-006', name: 'Linda Martinez', dob: '1972-04-18', gender: 'Female', doctor: 'Dr. Robert Hayes', condition: 'Type 2 Diabetes' },
];

export default function PatientsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">Patients</h1>
            <p className="text-[#64748B] text-lg">Manage and view your patient directory.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by name, MRN, or condition..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
              />
            </div>
          </div>
          
          <div className="divide-y divide-[#E2E8F0]">
            {MOCK_PATIENTS.map((patient) => (
              <Link
                href={`/patients/${patient.id}`}
                key={patient.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-[#0F4C81] text-white font-semibold">
                      {patient.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-[#0F172A]">{patient.name}</p>
                    <p className="text-sm text-[#64748B]">
                      MRN: {patient.id} • {patient.gender} • DOB: {patient.dob}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-[#0F172A]">{patient.condition}</p>
                  <p className="text-xs text-[#64748B]">Provider: {patient.doctor}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
