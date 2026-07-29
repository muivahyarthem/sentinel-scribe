'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Linkedin, Mail, Phone, HeartPulse, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const team = [
    {
      name: 'Yarthem Muivah',
      role: 'Project Lead & AI Engineer',
      description: 'Led the architecture, AI engineering, and development of SentinelScribe.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      name: 'Shaina Asheal Veigas',
      role: 'UI/UX Designer & Documentation',
      description: 'Designed the user experience and contributed to project documentation.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
      name: 'Sumedha K N',
      role: 'UI/UX Designer & Documentation',
      description: 'Contributed to UI/UX design and project documentation.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    },
    {
      name: 'Owaize Sharieff Mohammed',
      role: 'AI Engineer & Backend Developer',
      description: 'Developed backend services and AI integrations.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Basic header so users can navigate back */}
      <header className="w-full h-[72px] flex items-center flex-shrink-0 sticky top-0 z-50 bg-white border-b border-slate-200 px-4 lg:px-8">
        <div className="flex items-center gap-2 flex-shrink-0 mr-auto">
          <div className="w-8 h-8 rounded bg-[#0F4C81] flex items-center justify-center text-white">
            <HeartPulse size={18} strokeWidth={2.5} />
          </div>
          <p className="font-bold text-lg leading-none text-[#0F172A] tracking-tight">
            SentinelScribe
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => window.history.back()}>
          <ArrowLeft size={16} />
          Back
        </Button>
      </header>

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Meet the Core Team
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            The minds behind SentinelScribe. We are passionate about bridging healthcare and artificial intelligence.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-24">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1">
              <div className="relative w-36 h-36 mb-6 rounded-full overflow-hidden border-4 border-slate-50 group-hover:border-blue-50 transition-colors shadow-sm">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
              <p className="text-sm font-semibold text-[#0F4C81] mb-3">{member.role}</p>
              
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500 mb-5 bg-slate-50 py-1.5 px-3 rounded-full border border-slate-100">
                <GraduationCap size={14} className="text-slate-400" />
                <span>Master of Data Analytics, CHRIST</span>
              </div>
              
              <p className="text-sm text-slate-600 mb-8 flex-grow leading-relaxed">
                {member.description}
              </p>
              
              <div className="flex items-center justify-center gap-3 w-full mt-auto pt-5 border-t border-slate-100">
                <a href="#" className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 hover:bg-[#0077b5] hover:text-white flex items-center justify-center transition-colors shadow-sm">
                  <Linkedin size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors shadow-sm">
                  <Mail size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 hover:bg-green-500 hover:text-white flex items-center justify-center transition-colors shadow-sm">
                  <Phone size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Acknowledgements */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 text-center max-w-4xl mx-auto relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-[#0F4C81] to-[#3b82f6]"></div>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Acknowledgements</h2>
          
          <div className="space-y-4">
            <p className="text-lg text-slate-500 font-medium">Special thanks to</p>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#0F4C81]">Dr. Dalvin Vinoth Kumar A</h3>
            
            <div className="inline-block bg-slate-50/80 rounded-2xl p-5 my-5 border border-slate-100">
              <p className="text-sm md:text-base text-slate-700 font-semibold mb-1">Assistant Professor, Department of Statistics & Data Science</p>
              <p className="text-sm md:text-base text-slate-700 font-semibold">Coordinator, CDC & Center for AI</p>
              <div className="flex items-center justify-center gap-2 mt-3 text-slate-500">
                <GraduationCap size={16} />
                <p className="text-sm font-medium">CHRIST (Deemed to be University), Bengaluru</p>
              </div>
            </div>
            
            <p className="text-slate-600 max-w-2xl mx-auto italic leading-relaxed text-lg">
              "For his mentorship, guidance, and continuous support throughout the development of SentinelScribe."
            </p>
          </div>
        </div>
      </main>
      
      <footer className="w-full border-t border-slate-200 py-8 mt-12 bg-white text-center">
        <p className="text-sm text-slate-500 font-medium">
          © {new Date().getFullYear()} SentinelScribe. Developed at CHRIST (Deemed to be University).
        </p>
      </footer>
    </div>
  );
}
