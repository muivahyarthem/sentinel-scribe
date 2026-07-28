'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, FileText, Download, FileDown, ChevronDown, ChevronUp } from 'lucide-react';
import {
  getPortalData, exportSoapAsPdf, exportSoapAsDocx,
  PortalData, SoapRecord,
} from '@/lib/patientPortal';
import { Badge } from '@/components/ui/badge';

export default function RecordsPage() {
  const [data, setData] = useState<PortalData | null>(null);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { setData(getPortalData()); }, []);

  const doctors = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.soapRecords.map(r => r.doctorName))];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.soapRecords.filter(r => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.chiefComplaint.toLowerCase().includes(q)
        || r.doctorName.toLowerCase().includes(q)
        || r.assessment.toLowerCase().includes(q);
      const matchDate = !dateFilter || r.date.startsWith(dateFilter);
      const matchDoctor = !doctorFilter || r.doctorName === doctorFilter;
      return matchSearch && matchDate && matchDoctor;
    });
  }, [data, search, dateFilter, doctorFilter]);

  const toggleExpand = (id: string) => setExpanded(expanded === id ? null : id);

  if (!data) return null;

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">Medical Records</h1>
        <p className="text-[#64748B] mt-1">View SOAP notes and consultation history.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
            <input
              type="text"
              placeholder="Search by complaint, doctor, or diagnosis..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>
          <input
            type="month"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            title="Filter by date"
          />
          <select
            value={doctorFilter}
            onChange={e => setDoctorFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="">All Doctors</option>
            {doctors.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <FileText size={40} className="mx-auto text-[#CBD5E1] mb-3" />
            <p className="text-[#64748B]">No records match your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {filtered.map(record => (
              <RecordRow
                key={record.id}
                record={record}
                expanded={expanded === record.id}
                onToggle={() => toggleExpand(record.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function RecordRow({ record, expanded, onToggle }: {
  record: SoapRecord; expanded: boolean; onToggle: () => void;
}) {
  return (
    <div className="hover:bg-slate-50/50 transition-colors">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-[#2563EB]" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A] text-sm truncate">{record.chiefComplaint}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{record.doctorName} · {record.date} · {record.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {expanded ? <ChevronUp size={16} className="text-[#64748B]" /> : <ChevronDown size={16} className="text-[#64748B]" />}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          <div className="ml-14 p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
            {(['subjective', 'objective', 'assessment', 'plan'] as const).map(section => (
              <div key={section}>
                <p className="text-xs font-bold text-[#2563EB] uppercase tracking-wide mb-1">{section}</p>
                <p className="text-sm text-[#334155] leading-relaxed">{record[section]}</p>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => exportSoapAsPdf(record)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A] hover:bg-slate-50"
              >
                <Download size={14} /> Export PDF
              </button>
              <button
                onClick={() => exportSoapAsDocx(record)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A] hover:bg-slate-50"
              >
                <FileDown size={14} /> Export DOCX
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
