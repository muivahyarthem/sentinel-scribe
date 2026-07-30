'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Activity, Brain, Search, Stethoscope, Loader2, RotateCcw } from 'lucide-react';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';

const STORAGE_KEY_QUERY  = 'insights_query';
const STORAGE_KEY_RESULT = 'insights_result';

export default function InsightsPage() {
  const [query,   setQuery]   = useState('');
  const [result,  setResult]  = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Restore persisted state on mount
  useEffect(() => {
    const savedQuery  = sessionStorage.getItem(STORAGE_KEY_QUERY);
    const savedResult = sessionStorage.getItem(STORAGE_KEY_RESULT);
    if (savedQuery)  setQuery(savedQuery);
    if (savedResult) setResult(savedResult);
  }, []);

  // Persist whenever query or result changes
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_QUERY, query);
  }, [query]);

  useEffect(() => {
    if (result !== null) sessionStorage.setItem(STORAGE_KEY_RESULT, result);
  }, [result]);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/copilot/chat', { message: query, context: 'insights' });
      setResult(res.data.answer);
    } catch (err) {
      console.error(err);
      setResult('Failed to retrieve insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setResult(null);
    sessionStorage.removeItem(STORAGE_KEY_QUERY);
    sessionStorage.removeItem(STORAGE_KEY_RESULT);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-[#0F4C81] rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-sm">
            <Activity size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">Clinical Search</h1>
          <p className="text-[#64748B] text-lg max-w-xl mx-auto">
            Query across thousands of patient histories, clinical notes, and protocols securely.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-[0_2px_15px_rgb(0,0,0,0.03)] mb-8">
          <div className="relative flex items-center gap-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563EB]" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="e.g. 'Patients with chronic hypertension prescribed lisinopril last month'"
              className="w-full pl-12 pr-12 py-4 bg-transparent border-0 text-[#0F172A] text-lg placeholder:text-[#94A3B8] focus:outline-none focus:ring-0"
              disabled={loading}
            />
            {(query || result) && !loading && (
              <button
                onClick={handleReset}
                title="Reset search"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 border border-[#E2E8F0] hover:border-red-100 transition-colors"
              >
                <RotateCcw size={13} />
                Reset
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center my-12">
            <Loader2 className="animate-spin text-[#2563EB]" size={32} />
          </div>
        )}

        {result && !loading && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_2px_15px_rgb(0,0,0,0.03)] mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#0F172A] flex items-center gap-2">
                <Activity size={20} className="text-[#2563EB]" />
                Insight Result
              </h2>
              <span className="text-xs text-[#94A3B8] italic truncate max-w-xs">"{query}"</span>
            </div>
            <div className="text-[#334155] leading-relaxed">
              <ReactMarkdown
                components={{
                  h1: ({children}) => <h1 className="text-2xl font-bold text-[#0F172A] mt-6 mb-3 pb-2 border-b border-[#E2E8F0]">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-semibold text-[#0F172A] mt-5 mb-2">{children}</h2>,
                  h3: ({children}) => <h3 className="text-base font-semibold text-[#1E293B] mt-4 mb-1">{children}</h3>,
                  p:  ({children}) => <p className="mb-3 text-[#334155] text-sm leading-7">{children}</p>,
                  ul: ({children}) => <ul className="mb-3 space-y-1.5 pl-4">{children}</ul>,
                  ol: ({children}) => <ol className="mb-3 space-y-1.5 pl-4 list-decimal">{children}</ol>,
                  li: ({children}) => <li className="text-sm text-[#334155] leading-7 flex gap-2 items-start"><span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" /><span>{children}</span></li>,
                  strong: ({children}) => <strong className="font-semibold text-[#0F172A]">{children}</strong>,
                  em: ({children}) => <em className="italic text-[#475569]">{children}</em>,
                  code: ({children}) => <code className="px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#0F4C81] text-xs font-mono">{children}</code>,
                  blockquote: ({children}) => <blockquote className="border-l-4 border-[#2563EB] pl-4 my-3 text-[#475569] italic">{children}</blockquote>,
                  hr: () => <hr className="my-4 border-[#E2E8F0]" />,
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Stethoscope size={18} />
                </div>
                <h3 className="font-semibold text-[#0F172A]">Recent Queries</h3>
              </div>
              <ul className="space-y-3">
                <li className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer" onClick={() => setQuery('Post-op guidelines for ACL reconstruction')}>Post-op guidelines for ACL reconstruction</li>
                <li className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer" onClick={() => setQuery('Interactions between warfarin and amiodarone')}>Interactions between warfarin and amiodarone</li>
                <li className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer" onClick={() => setQuery('Triage protocols for acute chest pain')}>Triage protocols for acute chest pain</li>
              </ul>
            </div>

            <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Brain size={18} />
                </div>
                <h3 className="font-semibold text-[#0F172A]">Suggested Insights</h3>
              </div>
              <ul className="space-y-3">
                <li className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer" onClick={() => setQuery('Review updated hypertension guidelines (2025)')}>Review updated hypertension guidelines (2025)</li>
                <li className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer" onClick={() => setQuery('Summarize standard pediatric asthma action plan')}>Summarize standard pediatric asthma action plan</li>
                <li className="text-sm text-[#64748B] hover:text-[#2563EB] cursor-pointer" onClick={() => setQuery('Identify common contraindications for Paxlovid')}>Identify common contraindications for Paxlovid</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
