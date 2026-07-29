'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, HeartPulse, GraduationCap, FileText, Settings, Shield, LayoutDashboard, BrainCircuit } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar overlay style as seen in reference */}
      <header className="absolute top-0 left-0 w-full h-[72px] flex items-center z-50 px-4 lg:px-8 border-b border-white/10 bg-black/10 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-auto text-white">
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-[#0F4C81]">
            <HeartPulse size={18} strokeWidth={2.5} />
          </div>
          <p className="font-bold text-lg leading-none tracking-tight">
            SentinelScribe
          </p>
        </Link>
        <div className="flex gap-4">
           <Link href="/"><Button variant="secondary" className="bg-white/20 text-white border-none hover:bg-white/30">Home</Button></Link>
           <Button variant="outline" className="bg-white text-[#0F4C81] border-none hover:bg-slate-100" onClick={() => window.history.back()}>
             Back to App
           </Button>
        </div>
      </header>

      <main className="flex-grow w-full">
        
        {/* 1. Hero Section */}
        <div className="relative w-full py-32 md:py-48 flex items-center justify-center bg-[#0F4C81] overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=800&fit=crop')" }}
          ></div>
          <div className="relative z-10 text-center px-4 mt-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">About us</h1>
            <p className="text-blue-50 max-w-2xl mx-auto text-lg md:text-xl">
              SentinelScribe is a clinical intelligence platform with AI capabilities designed to streamline healthcare processes.
            </p>
          </div>
        </div>

        {/* 2. About Company (Split Layout) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F4C81] mb-6">What is SentinelScribe?</h2>
            <p className="text-slate-600 mb-6 leading-relaxed text-lg">
              SentinelScribe lets medical personnel spend more time providing high-quality patient care by integrating intelligent documentation, patient history retrieval, and clinical insights into a single, cohesive solution.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              Healthcare workers frequently have more administrative duties to complete, which cuts into their time for providing direct patient care. In order to overcome these difficulties, SentinelScribe was developed, which uses artificial intelligence to consolidate patient data, automate documentation, and assist with clinical decision-making. 
            </p>
            <p className="text-slate-700 font-semibold text-lg border-l-4 border-[#0F4C81] pl-4">
              Our objective is to develop technology that complements, not replaces, the knowledge of medical experts.
            </p>
          </div>
          <div className="lg:w-1/2 relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-[4/3]">
              {/* Decorative shapes behind image */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#0F4C81] rounded-tr-[40px] rounded-bl-[40px] hidden md:block"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#0F4C81] rounded-tl-[40px] rounded-br-[40px] hidden md:block"></div>
              <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop" 
                alt="Medical professionals working" 
                className="relative z-10 rounded-2xl shadow-xl w-full h-full object-cover border-4 border-white"
              />
            </div>
          </div>
        </div>

        {/* 3. Core Features / Unique Factors */}
        <div className="bg-slate-50 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F4C81] mb-16">Core Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Feature Cards */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-blue-50 text-[#0F4C81] rounded-full flex items-center justify-center mb-2">
                  <BrainCircuit size={28} />
                </div>
                <h3 className="font-bold text-slate-800">AI SOAP Notes</h3>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-blue-50 text-[#0F4C81] rounded-full flex items-center justify-center mb-2">
                  <FileText size={28} />
                </div>
                <h3 className="font-bold text-slate-800">Patient History</h3>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-blue-50 text-[#0F4C81] rounded-full flex items-center justify-center mb-2">
                  <Shield size={28} />
                </div>
                <h3 className="font-bold text-slate-800">Secure Records</h3>
              </div>

              {/* Highlighted feature card (matches the blue one in reference) */}
              <div className="bg-[#0F4C81] p-8 rounded-2xl shadow-md flex flex-col items-center justify-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-white/20 text-white rounded-full flex items-center justify-center mb-2">
                  <LayoutDashboard size={28} />
                </div>
                <h3 className="font-bold text-white">Doctor & Patient Portals</h3>
              </div>
              
            </div>
          </div>
        </div>

        {/* 4. Meet Our Team */}
        <div className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F4C81] mb-6">Meet Our Team</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-16">
            The minds behind SentinelScribe. We are passionate about bridging healthcare and artificial intelligence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {team.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Note: User explicitly requested to keep images NOT round and uncropped earlier. */}
                <div className="relative w-full h-64 mb-6 flex items-center justify-center">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm font-bold text-[#0F4C81] mb-2">{member.role}</p>
                <div className="flex gap-2 text-slate-400 mt-2">
                  <a href="#" className="hover:text-[#0077b5]"><div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center"><Mail size={12} /></div></a>
                </div>
              </div>
            ))}
          </div>

          {/* Acknowledgements Section styled similarly within the team area */}
          <div className="mt-32 max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-[#0F4C81] mb-12">Acknowledgements</h2>
            <div className="flex flex-col md:flex-row items-center gap-8 text-left bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="w-48 h-56 flex-shrink-0 flex items-center justify-center bg-white rounded-xl p-2 border border-slate-200">
                <img 
                  src="/team/Dalvin.jpg" 
                  alt="Dr. Dalvin Vinoth Kumar A" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm text-[#0F4C81] font-bold uppercase tracking-wider mb-2">Special Thanks To</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Dr. Dalvin Vinoth Kumar A</h3>
                <p className="text-slate-600 font-medium mb-1">Assistant Professor, Department of Statistics & Data Science</p>
                <p className="text-slate-600 font-medium mb-4">Coordinator, CDC & Center for AI, CHRIST</p>
                <p className="text-slate-500 italic">"For his mentorship, guidance, and continuous support throughout the development of SentinelScribe."</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Bottom CTA Banner (Our Goals) */}
        <div className="bg-[#0F4C81] py-24 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8">
              Our Goals
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed font-light">
              To provide healthcare workers with intelligent tools that use safe and responsible AI to improve patient outcomes, streamline clinical workflows, and improve decision-making.
            </p>
          </div>
        </div>

      </main>
      
      {/* 6. Footer */}
      <footer className="w-full py-12 bg-white border-t border-slate-200 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#0F4C81] flex items-center justify-center text-white">
              <HeartPulse size={18} strokeWidth={2.5} />
            </div>
            <p className="font-bold text-xl text-slate-900">SentinelScribe</p>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} SentinelScribe. Developed at CHRIST (Deemed to be University).
          </p>
        </div>
      </footer>
    </div>
  );
}
