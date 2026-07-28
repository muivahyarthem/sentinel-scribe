'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Download, Mail, MessageSquare, Phone, CheckCircle2 } from 'lucide-react';
import {
  getPortalData, savePortalData, exportBillAsPdf, PortalData, Bill,
} from '@/lib/patientPortal';
import { Badge } from '@/components/ui/badge';

export default function BillingPage() {
  const [data, setData] = useState<PortalData | null>(null);
  const [toast, setToast] = useState('');
  const [delivering, setDelivering] = useState<string | null>(null);

  useEffect(() => { setData(getPortalData()); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const deliverBill = (bill: Bill, channel: 'email' | 'sms' | 'whatsapp') => {
    if (!data) return;
    setDelivering(`${bill.id}-${channel}`);
    setTimeout(() => {
      const updated = {
        ...data,
        bills: data.bills.map(b =>
          b.id === bill.id
            ? { ...b, deliveredVia: [...new Set([...(b.deliveredVia || []), channel])] }
            : b
        ),
      };
      savePortalData(updated);
      setData(updated);
      setDelivering(null);
      const labels = { email: 'Email', sms: 'SMS', whatsapp: 'WhatsApp' };
      showToast(`Bill sent via ${labels[channel]} successfully.`);
    }, 1200);
  };

  const markPaid = (billId: string) => {
    if (!data) return;
    const updated = {
      ...data,
      bills: data.bills.map(b => b.id === billId ? { ...b, status: 'paid' as const } : b),
    };
    savePortalData(updated);
    setData(updated);
    showToast('Bill marked as paid.');
  };

  if (!data) return null;

  const totalPending = data.bills.filter(b => b.status === 'pending').reduce((s, b) => s + b.total, 0);
  const totalPaid = data.bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.total, 0);

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {toast && (
        <div className="fixed top-20 right-4 z-50 px-4 py-3 bg-[#0F172A] text-white text-sm rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">Billing</h1>
        <p className="text-[#64748B] mt-1">Auto-generated bills for consultations, labs, medicines, and taxes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <p className="text-xs text-[#64748B] font-medium">Total Bills</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">{data.bills.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <p className="text-xs text-[#64748B] font-medium">Pending Amount</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">${totalPending.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <p className="text-xs text-[#64748B] font-medium">Total Paid</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">${totalPaid.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.bills.map(bill => (
          <div key={bill.id} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <CreditCard size={18} className="text-[#2563EB]" />
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A]">Bill #{bill.id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-[#64748B]">{bill.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xl font-bold text-[#0F172A]">${bill.total.toFixed(2)}</p>
                <Badge className={
                  bill.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : bill.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }>
                  {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="px-6 py-4">
              <table className="w-full text-sm">
                <tbody>
                  {bill.items.map((item, i) => (
                    <tr key={i} className="border-b border-[#F1F5F9] last:border-0">
                      <td className="py-2 text-[#334155]">{item.label}</td>
                      <td className="py-2 text-right font-medium text-[#0F172A]">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-[#E2E8F0]">
                    <td className="py-2 text-[#64748B]">Tax (9%)</td>
                    <td className="py-2 text-right font-medium">${bill.tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-[#0F172A]">Total</td>
                    <td className="py-2 text-right font-bold text-[#0F172A]">${bill.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-wrap items-center gap-2">
              <button
                onClick={() => exportBillAsPdf(bill)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-medium hover:bg-slate-50"
              >
                <Download size={14} /> Export PDF
              </button>

              {(['email', 'sms', 'whatsapp'] as const).map(ch => {
                const icons = { email: Mail, sms: Phone, whatsapp: MessageSquare };
                const Icon = icons[ch];
                const sent = bill.deliveredVia?.includes(ch);
                return (
                  <button
                    key={ch}
                    onClick={() => !sent && deliverBill(bill, ch)}
                    disabled={!!delivering || sent}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      sent
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-[#E2E8F0] hover:bg-slate-50'
                    } disabled:opacity-60`}
                  >
                    {delivering === `${bill.id}-${ch}` ? (
                      <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : sent ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Icon size={14} />
                    )}
                    {sent ? `Sent via ${ch}` : `Send ${ch === 'sms' ? 'SMS' : ch.charAt(0).toUpperCase() + ch.slice(1)}`}
                  </button>
                );
              })}

              {bill.status === 'pending' && (
                <button
                  onClick={() => markPaid(bill.id)}
                  className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-medium hover:bg-[#1d4ed8]"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
