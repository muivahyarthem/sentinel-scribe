'use client';

import Navbar from '@/components/Navbar';
import { Settings, User, Bell, Shield, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">Settings</h1>
          <p className="text-[#64748B] text-lg">Manage your account preferences and system settings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 text-[#0F4C81] font-medium">Profile</button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 text-[#64748B] font-medium">Notifications</button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 text-[#64748B] font-medium">Security</button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 text-[#64748B] font-medium">Integrations</button>
          </div>

          <div className="md:col-span-3">
             <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
               <div className="p-6 border-b border-[#E2E8F0]">
                 <h2 className="text-xl font-bold text-[#0F172A]">Profile Information</h2>
                 <p className="text-[#64748B] text-sm mt-1">Update your personal details and public profile.</p>
               </div>
               <div className="p-6 space-y-6">
                 <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-[#64748B]">
                     <User size={32} />
                   </div>
                   <button className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm font-medium hover:bg-slate-50">Change Photo</button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-[#0F172A]">Full Name</label>
                     <input type="text" defaultValue="Dr. Mitchell" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]" />
                   </div>
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-[#0F172A]">Email Address</label>
                     <input type="email" defaultValue="doctor@clinic.ai" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]" />
                   </div>
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-[#0F172A]">Specialty</label>
                     <input type="text" defaultValue="Emergency Medicine" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]" />
                   </div>
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-[#0F172A]">NPI Number</label>
                     <input type="text" defaultValue="1234567890" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]" />
                   </div>
                 </div>
               </div>
               <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
                 <button className="px-6 py-2 bg-[#0F4C81] text-white font-medium rounded-lg hover:bg-[#0c3e6b] transition-colors shadow-sm">Save Changes</button>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
