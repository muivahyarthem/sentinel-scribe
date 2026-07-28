'use client';

import { useEffect, useState } from 'react';
import { Shield, FileText, Plus, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { getPortalData, savePortalData, PortalData, InsuranceClaim } from '@/lib/patientPortal';
import { Badge } from '@/components/ui/badge';

const STATUS_STYLE: Record<InsuranceClaim['status'], { icon: typeof CheckCircle2; color: string; bg: string }> = {
  submitted: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  under_review: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  approved: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
};

export default function InsurancePage() {
  const [data, setData] = useState<PortalData | null>(null);
  const [showClaim, setShowClaim] = useState(false);
  const [claimDesc, setClaimDesc] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => { setData(getPortalData()); }, []);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const submitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !claimDesc || !claimAmount) return;
    const claim: InsuranceClaim = {
      id: `clm-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(claimAmount),
      description: claimDesc,
      status: 'submitted',
    };
    const updated = {
      ...data,
      claims: [claim, ...data.claims],
      notifications: [
        {
          id: `n-${Date.now()}`,
          type: 'insurance' as const,
          title: 'Claim Submitted',
          message: `Your insurance claim for $${claim.amount.toFixed(2)} has been submitted for review.`,
          date: new Date().toISOString(),
          read: false,
          channels: ['in_app' as const, 'email' as const],
        },
        ...data.notifications,
      ],
    };
    savePortalData(updated);
    setData(updated);
    setShowClaim(false);
    setClaimDesc('');
    setClaimAmount('');
    showToastMsg('Claim submitted successfully.');
  };

  if (!data) return null;

  const { insurance, claims } = data;
  const daysToExpiry = Math.ceil((new Date(insurance.expiryDate).getTime() - Date.now()) / 86400000);

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {toast && (
        <div className="fixed top-20 right-4 z-50 px-4 py-3 bg-[#0F172A] text-white text-sm rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">Insurance</h1>
          <p className="text-[#64748B] mt-1">Manage your policy, coverage, and claims.</p>
        </div>
        <button
          onClick={() => setShowClaim(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium text-sm transition-colors"
        >
          <Plus size={16} /> Submit Claim
        </button>
      </div>

      {/* Policy Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-6">
          <Shield size={20} className="text-[#2563EB]" />
          <h2 className="text-lg font-semibold text-[#0F172A]">Active Policy</h2>
          <Badge className={
            insurance.status === 'active'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 ml-auto'
              : 'bg-amber-50 text-amber-700 border-amber-200 ml-auto'
          }>
            {insurance.status === 'active' ? 'Active' : 'Expiring Soon'}
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">Provider</p>
            <p className="font-semibold text-[#0F172A] mt-1">{insurance.provider}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">Policy Number</p>
            <p className="font-semibold text-[#0F172A] mt-1">{insurance.policyNumber}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">Coverage</p>
            <p className="font-semibold text-[#0F172A] mt-1">{insurance.coveragePercent}% up to ${insurance.maxCoverage.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">Expiry</p>
            <p className="font-semibold text-[#0F172A] mt-1">{insurance.expiryDate}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{daysToExpiry > 0 ? `${daysToExpiry} days remaining` : 'Expired'}</p>
          </div>
        </div>

        {/* Coverage bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-[#64748B] mb-1.5">
            <span>Coverage Utilization</span>
            <span>{insurance.coveragePercent}% covered</span>
          </div>
          <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full transition-all"
              style={{ width: `${Math.min(insurance.coveragePercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Claims Tracking */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center gap-2">
          <FileText size={18} className="text-[#2563EB]" />
          <h2 className="font-semibold text-[#0F172A]">Claim History & Tracking</h2>
        </div>
        {claims.length === 0 ? (
          <div className="p-12 text-center text-[#64748B]">No claims submitted yet.</div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {claims.map(claim => {
              const style = STATUS_STYLE[claim.status];
              const Icon = style.icon;
              const label = claim.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
              return (
                <div key={claim.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${style.bg}`}>
                      <Icon size={16} className={style.color} />
                    </div>
                    <div>
                      <p className="font-medium text-[#0F172A] text-sm">{claim.description}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{claim.date} · Claim #{claim.id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:ml-4">
                    <p className="font-bold text-[#0F172A]">${claim.amount.toFixed(2)}</p>
                    <Badge className={`${style.bg} ${style.color} border`}>{label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowClaim(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-[#0F172A]">Submit Insurance Claim</h3>
            </div>
            <form onSubmit={submitClaim} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Description</label>
                <input
                  type="text"
                  value={claimDesc}
                  onChange={e => setClaimDesc(e.target.value)}
                  placeholder="e.g. General consultation — Feb 2026"
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Claim Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={claimAmount}
                  onChange={e => setClaimAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  required
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-[#2563EB] text-white font-medium text-sm hover:bg-[#1d4ed8]">
                Submit Claim
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
