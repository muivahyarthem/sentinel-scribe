'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, User, ArrowRight, Activity } from 'lucide-react';

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans p-6 selection:bg-blue-200">
      
      <motion.div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-8 md:p-12 overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0F4C81]" />
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-center mb-6 text-[#0F4C81]">
            <Activity size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Welcome to SentinelScribe
          </h1>
          <p className="text-slate-600 text-lg max-w-md">
            Please select your role to continue to your secure portal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          <Link href="/login/doctor">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex flex-col items-center text-center p-8 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer h-full"
            >
              <div className="w-16 h-16 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F4C81] mb-6 group-hover:bg-[#0F4C81] group-hover:border-[#0F4C81] group-hover:text-white transition-colors shadow-sm">
                <Stethoscope size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Clinician Portal</h2>
              <p className="text-slate-600 text-sm mb-6 flex-grow">
                Access AI triage, automated SOAP notes, and patient insights.
              </p>
              <div className="flex items-center text-blue-600 font-semibold text-sm">
                Sign in <ArrowRight size={16} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </motion.div>
          </Link>

          <Link href="/login/patient">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex flex-col items-center text-center p-8 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer h-full"
            >
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-colors shadow-sm">
                <User size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Patient Portal</h2>
              <p className="text-slate-600 text-sm mb-6 flex-grow">
                Securely register and submit your medical intake forms directly to your provider.
              </p>
              <div className="flex items-center text-indigo-600 font-semibold text-sm">
                Sign in <ArrowRight size={16} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </motion.div>
          </Link>

        </div>
      </motion.div>
    </div>
  );
}
