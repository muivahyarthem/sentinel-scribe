'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import {
  Calendar, Clock, MapPin, User, Bell, BellOff,
  CheckCircle2, XCircle, RefreshCw, ChevronDown, ChevronUp, X,
} from 'lucide-react';
import {
  getDoctorAppointments, getDoctorNotifications,
  markDoctorNotificationRead, markAllDoctorNotificationsRead,
  DoctorAppointmentEntry, DoctorNotification,
} from '@/lib/doctorAppointments';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

const STATUS_CONFIG = {
  scheduled:   { label: 'Scheduled',   cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled:   { label: 'Cancelled',   cls: 'bg-red-50 text-red-600 border-red-200' },
  completed:   { label: 'Completed',   cls: 'bg-slate-50 text-slate-600 border-slate-200' },
  rescheduled: { label: 'Rescheduled', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
};

const NOTIF_CONFIG = {
  new_appointment: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  cancellation:    { color: 'text-red-600 bg-red-50 border-red-200',             icon: XCircle },
  reschedule:      { color: 'text-amber-600 bg-amber-50 border-amber-200',       icon: RefreshCw },
};

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<DoctorAppointmentEntry[]>([]);
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'cancelled' | 'rescheduled'>('all');

  const reload = useCallback(() => {
    setAppointments(getDoctorAppointments());
    setNotifications(getDoctorNotifications());
  }, []);

  useEffect(() => {
    reload();

    // Live-update when the patient portal writes to the shared stores
    const handleApts  = () => setAppointments(getDoctorAppointments());
    const handleNotifs = () => setNotifications(getDoctorNotifications());

    window.addEventListener('doctorAppointmentsUpdated', handleApts);
    window.addEventListener('doctorNotificationsUpdated', handleNotifs);
    return () => {
      window.removeEventListener('doctorAppointmentsUpdated', handleApts);
      window.removeEventListener('doctorNotificationsUpdated', handleNotifs);
    };
  }, [reload]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  const upcoming  = filtered.filter(a => a.status === 'scheduled' || a.status === 'rescheduled');
  const others    = filtered.filter(a => a.status !== 'scheduled' && a.status !== 'rescheduled');

  const [popupNotif, setPopupNotif] = useState<{ title: string; message: string; type: string } | null>(null);
  const seenNotifIds = useRef<Set<string>>(new Set());

  // Listen for new notifications and trigger popup
  useEffect(() => {
    const newUnread = notifications.filter(n => !n.read && !seenNotifIds.current.has(n.id));
    newUnread.forEach(n => seenNotifIds.current.add(n.id));
    if (newUnread.length > 0) {
      const latest = newUnread[0];
      setPopupNotif({ title: latest.title, message: latest.message, type: latest.type });
      setTimeout(() => setPopupNotif(null), 6000);
    }
  }, [notifications]);

  const handleMarkRead = (id: string) => {
    markDoctorNotificationRead(id);
    setNotifications(getDoctorNotifications());
  };

  const handleMarkAllRead = () => {
    markAllDoctorNotificationsRead();
    setNotifications(getDoctorNotifications());
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Doctor notification popup */}
        {popupNotif && (
          <div className="fixed top-24 right-4 z-50 max-w-sm w-full animate-in slide-in-from-right fade-in duration-300">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-4 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                NOTIF_CONFIG[popupNotif.type as keyof typeof NOTIF_CONFIG]?.color || 'bg-blue-50 text-blue-600'
              }`}>
                <Bell size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0F172A] text-sm">{popupNotif.title}</p>
                <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{popupNotif.message}</p>
              </div>
              <button
                onClick={() => setPopupNotif(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-[#94A3B8] shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-1">Appointments</h1>
            <p className="text-[#64748B]">Live patient appointment schedule — updates automatically.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filter tabs */}
            {(['all', 'scheduled', 'cancelled', 'rescheduled'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${
                  filter === f
                    ? 'bg-[#0F4C81] text-white border-[#0F4C81]'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}

            {/* Notification bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notification dropdown */}
        {showNotifications && (
          <div className="mb-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-[#2563EB]" />
                <h2 className="font-semibold text-[#0F172A]">Appointment Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-medium text-[#2563EB] hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <BellOff size={32} className="mx-auto text-[#CBD5E1] mb-2" />
                <p className="text-sm text-[#64748B]">No appointment notifications yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F1F5F9] max-h-72 overflow-y-auto">
                {notifications.map(n => {
                  const cfg = NOTIF_CONFIG[n.type];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}
                      onClick={() => handleMarkRead(n.id)}
                    >
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold text-[#0F172A] ${!n.read ? 'font-bold' : ''}`}>{n.title}</p>
                        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-[#94A3B8] mt-1">
                          {new Date(n.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Empty state (no appointments at all) */}
        {appointments.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-16 text-center shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-[#CBD5E1]" />
            </div>
            <h3 className="text-[#0F172A] font-semibold text-lg mb-2">No appointments yet</h3>
            <p className="text-[#64748B] max-w-sm mx-auto text-sm">
              Appointments will appear here automatically when patients book through the Patient Portal.
            </p>
          </div>
        )}

        {/* Upcoming / Scheduled */}
        {upcoming.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Upcoming
            </h2>
            <div className="space-y-4">
              {upcoming.map(apt => (
                <AppointmentCard key={apt.id} apt={apt} />
              ))}
            </div>
          </section>
        )}

        {/* Past / Cancelled */}
        {others.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
              Past / Cancelled ({others.length})
            </h2>
            <div className="space-y-3">
              {others.map(apt => (
                <AppointmentCard key={apt.id} apt={apt} dimmed />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function AppointmentCard({ apt, dimmed }: { apt: DoctorAppointmentEntry; dimmed?: boolean }) {
  const sc = STATUS_CONFIG[apt.status] ?? STATUS_CONFIG.scheduled;

  return (
    <div className={`bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-opacity ${dimmed ? 'opacity-70' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Patient Avatar */}
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-50 text-[#2563EB] font-bold">
              {getInitials(apt.patientName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-[#0F172A]">{apt.patientName}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{apt.patientEmail}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#64748B]">
              <span className="flex items-center gap-1"><Calendar size={12} /> {apt.date}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {apt.time}</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> Room {apt.roomNumber}</span>
              <span className="flex items-center gap-1"><User size={12} /> {apt.department}</span>
            </div>
            {apt.cancelledAt && (
              <p className="text-xs text-red-500 mt-1.5">
                Cancelled at {new Date(apt.cancelledAt).toLocaleString()}
              </p>
            )}
            {apt.bookedAt && !apt.cancelledAt && (
              <p className="text-xs text-blue-500 mt-1.5">
                Booked at {new Date(apt.bookedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <Badge className={`shrink-0 ${sc.cls}`}>{sc.label}</Badge>
      </div>
    </div>
  );
}
