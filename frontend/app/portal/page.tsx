'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Calendar, FileText, Shield, CreditCard, Bell, User,
  MapPin, Clock, ChevronRight, Stethoscope, X, CheckCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';
import {
  getPortalData, savePortalData, calcAge, PortalData,
} from '@/lib/patientPortal';

export default function PatientDashboard() {
  const [data, setData] = useState<PortalData | null>(null);
  const [popupNotif, setPopupNotif] = useState<{ title: string; message: string } | null>(null);
  const seenNotifIds = useRef<Set<string>>(new Set());

  const refresh = () => {
    const fresh = getPortalData();
    setData(fresh);

    // Show popup for any new unread appointment notifications
    const newUnread = fresh.notifications.filter(
      n => !n.read && n.type === 'appointment' && !seenNotifIds.current.has(n.id)
    );
    newUnread.forEach(n => seenNotifIds.current.add(n.id));
    if (newUnread.length > 0) {
      const latest = newUnread[0];
      setPopupNotif({ title: latest.title, message: latest.message });
      setTimeout(() => setPopupNotif(null), 6000);
    }
  };

  useEffect(() => {
    refresh();
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    const onFocus   = () => refresh();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onFocus);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2563EB]/30 border-t-[#2563EB] rounded-full animate-spin" />
      </main>
    );
  }

  const { profile, currentDoctor, soapRecords, appointments, bills, insurance, notifications } = data;
  const upcoming = appointments.find(a => a.status === 'scheduled');
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Appointment notification popup */}
      {popupNotif && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-in slide-in-from-right fade-in duration-300">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <CheckCircle size={20} className="text-[#2563EB]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#0F172A] text-sm">{popupNotif.title}</p>
              <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{popupNotif.message}</p>
              <Link
                href="/portal/appointments"
                className="inline-block mt-2 text-xs font-medium text-[#2563EB] hover:underline"
              >
                View appointment →
              </Link>
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

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
          Welcome back, {profile.name.split(' ')[0]}
        </h1>
        <p className="text-[#64748B] mt-1">Your health dashboard at a glance.</p>
      </div>

      {/* TOP: Profile, Upcoming Appointment, Insurance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Patient Profile */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-[#2563EB]" />
            <h2 className="font-semibold text-[#0F172A]">Patient Profile</h2>
          </div>
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-blue-100 text-[#2563EB] text-lg font-bold">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#0F172A] truncate">{profile.name}</p>
              <p className="text-xs text-[#64748B] mt-0.5">ID: {profile.id}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs">
                <span className="text-[#64748B]">Age</span>
                <span className="text-[#0F172A] font-medium">{calcAge(profile.dob) || '—'} yrs</span>
                <span className="text-[#64748B]">Gender</span>
                <span className="text-[#0F172A] font-medium">{profile.gender || '—'}</span>
                <span className="text-[#64748B]">Blood Group</span>
                <span className="text-[#0F172A] font-medium">{profile.bloodGroup || '—'}</span>
                <span className="text-[#64748B]">Phone</span>
                <span className="text-[#0F172A] font-medium truncate">{profile.phone}</span>
                <span className="text-[#64748B]">Email</span>
                <span className="text-[#0F172A] font-medium truncate">{profile.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointment */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#2563EB]" />
              <h2 className="font-semibold text-[#0F172A]">Upcoming Appointment</h2>
            </div>
            <Link href="/portal/appointments" className="text-xs font-medium text-[#2563EB] hover:underline">
              Manage
            </Link>
          </div>
          {upcoming ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                <p className="font-semibold text-[#0F172A]">{upcoming.doctorName}</p>
                <p className="text-sm text-[#64748B]">{upcoming.department}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {upcoming.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {upcoming.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> Room {upcoming.roomNumber}</span>
                </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Scheduled</Badge>
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar size={32} className="mx-auto text-[#CBD5E1] mb-2" />
              <p className="text-sm text-[#64748B] mb-3">No upcoming appointments</p>
              <Link href="/portal/appointments" className="text-sm font-medium text-[#2563EB] hover:underline">
                Book an appointment →
              </Link>
            </div>
          )}
        </div>

        {/* Insurance Summary */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#2563EB]" />
              <h2 className="font-semibold text-[#0F172A]">Insurance Summary</h2>
            </div>
            <Link href="/portal/insurance" className="text-xs font-medium text-[#2563EB] hover:underline">
              Details
            </Link>
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-[#0F172A]">{insurance.provider}</p>
              <p className="text-xs text-[#64748B] mt-0.5">Policy: {insurance.policyNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-[#64748B]">Coverage</p>
                <p className="font-bold text-[#0F172A] text-lg">{insurance.coveragePercent}%</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-[#64748B]">Max Limit</p>
                <p className="font-bold text-[#0F172A] text-lg">${(insurance.maxCoverage / 1000).toFixed(0)}K</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Expires: {insurance.expiryDate}</span>
              <Badge className={
                insurance.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }>
                {insurance.status === 'active' ? 'Active' : 'Expiring Soon'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE: Assigned Doctor, Recent SOAP Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Assigned Doctor */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center gap-2">
            <Stethoscope size={16} className="text-[#2563EB]" />
            <h2 className="font-semibold text-[#0F172A]">Assigned Doctor</h2>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-[#0F4C81] text-white font-semibold">
                  {getInitials(currentDoctor.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-[#0F172A]">{currentDoctor.name}</p>
                <p className="text-sm text-[#64748B]">{currentDoctor.qualification}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">{currentDoctor.department}</Badge>
                  <Badge className="bg-slate-50 text-slate-600 border-slate-200">Room {currentDoctor.roomNumber}</Badge>
                  <Badge className={currentDoctor.available ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}>
                    {currentDoctor.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
            </div>
            {data.previousDoctors.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">Previous Doctors</p>
                <div className="space-y-2">
                  {data.previousDoctors.slice(0, 3).map(pd => (
                    <div key={pd.id} className="flex items-center justify-between text-sm py-2 border-b border-[#F1F5F9] last:border-0">
                      <div>
                        <p className="font-medium text-[#0F172A]">{pd.name}</p>
                        <p className="text-xs text-[#64748B]">{pd.department}</p>
                      </div>
                      <span className="text-xs text-[#64748B]">{pd.visitDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent SOAP Notes */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#2563EB]" />
              <h2 className="font-semibold text-[#0F172A]">Recent SOAP Notes</h2>
            </div>
            <Link href="/portal/records" className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {soapRecords.slice(0, 3).map(record => (
              <div key={record.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-[#0F172A] text-sm truncate">{record.chiefComplaint}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{record.doctorName} · {record.date}</p>
                    <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{record.assessment}</p>
                  </div>
                  <Badge className="shrink-0 bg-slate-50 text-slate-600 border-slate-200 text-[10px]">{record.department}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM: Recent Bills, Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bills */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-[#2563EB]" />
              <h2 className="font-semibold text-[#0F172A]">Recent Bills</h2>
            </div>
            <Link href="/portal/billing" className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {bills.slice(0, 3).map(bill => (
              <div key={bill.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#0F172A] text-sm">${bill.total.toFixed(2)}</p>
                  <p className="text-xs text-[#64748B]">{bill.date} · {bill.items.length} items</p>
                </div>
                <Badge className={
                  bill.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : bill.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }>
                  {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#2563EB]" />
              <h2 className="font-semibold text-[#0F172A]">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{unreadCount}</span>
              )}
            </div>
            <Link href="/portal/notifications" className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {notifications.slice(0, 4).map(n => (
              <div key={n.id} className={`px-6 py-4 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                <div className="flex items-start gap-3">
                  {!n.read && <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />}
                  <div className={!n.read ? '' : 'ml-5'}>
                    <p className="font-medium text-[#0F172A] text-sm">{n.title}</p>
                    <p className="text-xs text-[#64748B] mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
