'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, HeartPulse, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const team = [
    {
      name: 'Yarthem Muivah',
      role: 'Project Lead & AI Engineer',
      description: 'Led the architecture, AI engineering, and development of SentinelScribe.',
      image: '/team/yarthem.jpg',
    },
    {
      name: 'Shaina Asheal Veigas',
      role: 'UI/UX Designer & Documentation',
      description: 'Designed the user experience and contributed to project documentation.',
      image: '/team/shaina.jpeg',
    },
    {
      name: 'Sumedha K N',
      role: 'UI/UX Designer & Documentation',
      description: 'Contributed to UI/UX design and project documentation.',
      image: '/team/sumedha.jpeg',
    },
    {
      name: 'Owaize Sharieff Mohammed',
      role: 'AI Engineer & Backend Developer',
      description: 'Developed backend services and AI integrations.',
      image: '/team/owaize.jpeg',
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
        
        {/* About Us Section */}
        <div className="mb-24">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              About Us
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              SentinelScribe is a clinical intelligence platform with AI capabilities designed to streamline healthcare processes. SentinelScribe lets medical personnel spend more time providing high-quality patient care by integrating intelligent documentation, patient history retrieval, and clinical insights into a single, cohesive solution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 h-full">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What is SentinelScribe?</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                SentinelScribe is designed to support both healthcare professionals and patients through an intelligent, secure, and user-friendly platform.
              </p>
              
              <h3 className="text-lg font-semibold text-[#0F4C81] mb-4">Core Features</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>AI-powered SOAP note generation</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>Patient medical history management</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>Clinical decision support</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>Appointment scheduling</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>Insurance & billing integration</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>Secure medical record management</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>Doctor & Patient portals</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 h-full">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why SentinelScribe Was Constructed</h2>
              <p className="text-slate-600 mb-5 leading-relaxed">
                Healthcare workers frequently have more administrative duties to complete, which cuts into their time for providing direct patient care. Inefficiencies and physician burnout can result from laborious workflows, disjointed patient records, and documentation.
              </p>
              <p className="text-slate-600 leading-relaxed">
                In order to overcome these difficulties, SentinelScribe was developed, which uses artificial intelligence to consolidate patient data, automate documentation, and assist with clinical decision-making. Our objective is to develop technology that complements, not replaces, the knowledge of medical experts.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16 space-y-4 pt-12 border-t border-slate-200 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Meet the Core Team
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            The minds behind SentinelScribe. We are passionate about bridging healthcare and artificial intelligence.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-24">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1">
              <div className="relative w-full h-56 mb-6 flex items-center justify-center">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-contain"
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
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
            
            <div className="flex justify-center mt-6 mb-6">
              <div className="relative w-48 h-56 flex items-center justify-center">
                <img 
                  src="/team/Dalvin.jpg" 
                  alt="Dr. Dalvin Vinoth Kumar A" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
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

        {/* Our Goals */}
        <div className="mt-16 bg-[#0F4C81] rounded-3xl p-8 md:p-12 shadow-md text-center max-w-4xl mx-auto relative overflow-hidden">
          <h2 className="text-3xl font-bold text-white mb-6">Our Goals</h2>
          <p className="text-lg md:text-xl text-blue-50 max-w-3xl mx-auto leading-relaxed">
            To provide healthcare workers with intelligent tools that use safe and responsible AI to improve patient outcomes, streamline clinical workflows, and improve decision-making.
          </p>
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
