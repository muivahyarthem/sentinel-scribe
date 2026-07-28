'use client';

import { useEffect, useState } from 'react';
import {
  Bell, Calendar, CreditCard, Shield, Pill, Info, CheckCheck, Mail, MessageSquare, Phone,
} from 'lucide-react';
import { getPortalData, savePortalData, PortalData, PortalNotification } from '@/lib/patientPortal';
import { Badge } from '@/components/ui/badge';

const TYPE_CONFIG: Record<PortalNotification['type'], { icon: typeof Bell; color: string; bg: string }> = {
  appointment: { icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  bill: { icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
  insurance: { icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  prescription: { icon: Pill, color: 'text-purple-600', bg: 'bg-purple-50' },
  general: { icon: Info, color: 'text-slate-600', bg: 'bg-slate-50' },
};

const CHANNEL_ICONS = {
  in_app: Bell,
  email: Mail,
  sms: Phone,
  whatsapp: MessageSquare,
};

export default function NotificationsPage() {
  const [data, setData] = useState<PortalData | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => { setData(getPortalData()); }, []);

  const markRead = (id: string) => {
    if (!data) return;
    const updated = {
      ...data,
      notifications: data.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    };
    savePortalData(updated);
    setData(updated);
  };

  const markAllRead = () => {
    if (!data) return;
    const updated = {
      ...data,
      notifications: data.notifications.map(n => ({ ...n, read: true })),
    };
    savePortalData(updated);
    setData(updated);
  };

  if (!data) return null;

  const filtered = data.notifications.filter(n => filter === 'all' || !n.read);
  const unreadCount = data.notifications.filter(n => !n.read).length;

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">Notifications</h1>
          <p className="text-[#64748B] mt-1">
            Appointment reminders, bills, insurance updates, and prescriptions.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#0F172A] hover:bg-slate-50"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? 'All' : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Bell size={40} className="mx-auto text-[#CBD5E1] mb-3" />
            <p className="text-[#64748B]">{filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {filtered.map(n => {
              const cfg = TYPE_CONFIG[n.type];
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id}
                  className={`px-6 py-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/20' : ''}`}
                  onClick={() => !n.read && markRead(n.id)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon size={18} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!n.read ? 'font-bold text-[#0F172A]' : 'font-medium text-[#334155]'}`}>
                        {n.title}
                      </p>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-sm text-[#64748B] mt-0.5 leading-relaxed">{n.message}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs text-[#94A3B8]">
                        {new Date(n.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {n.channels.map(ch => {
                        const ChIcon = CHANNEL_ICONS[ch];
                        return (
                          <Badge key={ch} className="bg-slate-50 text-slate-500 border-slate-200 text-[10px] gap-1">
                            <ChIcon size={10} />
                            {ch === 'in_app' ? 'In-App' : ch.charAt(0).toUpperCase() + ch.slice(1)}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
