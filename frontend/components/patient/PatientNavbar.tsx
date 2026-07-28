'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartPulse, LayoutDashboard, FileText, Calendar, CreditCard,
  Shield, Bell, LogOut,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { getPortalData, patientLogout } from '@/lib/patientPortal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/portal', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/portal/records', icon: FileText, label: 'Records' },
  { href: '/portal/appointments', icon: Calendar, label: 'Appointments' },
  { href: '/portal/billing', icon: CreditCard, label: 'Billing' },
  { href: '/portal/insurance', icon: Shield, label: 'Insurance' },
  { href: '/portal/notifications', icon: Bell, label: 'Notifications' },
];

export default function PatientNavbar() {
  const pathname = usePathname();
  const [name, setName] = useState('Patient');
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const data = getPortalData();
    setName(data.profile.name);
    setUnread(data.notifications.filter(n => !n.read).length);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/portal" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <HeartPulse size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-[#0F172A] text-sm leading-tight">SentinelScribe</p>
              <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider">Patient Portal</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || (href !== '/portal' && pathname.startsWith(href));
              const showBadge = href === '/portal/notifications' && unread > 0;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-[#2563EB]'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                  {showBadge && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-[#2563EB] text-xs font-semibold">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-[#0F172A] max-w-[120px] truncate">{name}</span>
            </div>
            <button
              onClick={patientLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#64748B] hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="lg:hidden flex gap-1 pb-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/portal' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  active ? 'bg-[#2563EB] text-white' : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
