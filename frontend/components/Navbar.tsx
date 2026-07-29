'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity, LayoutDashboard, Users, FileText, Calendar,
  LineChart, Settings, LogOut, Bell, ChevronDown, Search, HeartPulse, Info
} from 'lucide-react';
import { logout, getStoredUser } from '@/lib/auth';
import { getInitials } from '@/lib/utils';
import { useEffect, useState, useCallback } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getUnreadDoctorNotificationCount } from '@/lib/doctorAppointments';

const NAV_LINKS = [
  { href: '/',             icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/patients',     icon: Users,           label: 'Patients' },
  { href: '/records',      icon: FileText,        label: 'Records' },
  { href: '/appointments', icon: Calendar,        label: 'Appointments' },
  { href: '/insights',     icon: Activity,        label: 'Patient Insights' },
  { href: '/analytics',    icon: LineChart,       label: 'Analytics' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => { 
    const loadUser = () => {
      const stored = getStoredUser();
      const docProfile = localStorage.getItem('doctor_profile');
      if (docProfile && stored) {
        try {
          const dp = JSON.parse(docProfile);
          setUser({ ...stored, name: dp.name, role: dp.specialty || stored.role });
        } catch (e) {
          setUser(stored as any);
        }
      } else {
        setUser(stored as any);
      }
    };
    
    loadUser();
    window.addEventListener('profileUpdated', loadUser);

    // Live notification badge
    const updateBadge = () => setUnreadNotifs(getUnreadDoctorNotificationCount());
    updateBadge();
    window.addEventListener('doctorNotificationsUpdated', updateBadge);

    return () => {
      window.removeEventListener('profileUpdated', loadUser);
      window.removeEventListener('doctorNotificationsUpdated', updateBadge);
    };
  }, []);

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <header className="w-full h-[72px] flex items-center flex-shrink-0 sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 lg:px-6 w-full max-w-7xl mx-auto">
        {/* Logo & Search */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded bg-[#0F4C81] flex items-center justify-center text-white">
              <HeartPulse size={18} strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-lg leading-none text-[#0F172A] tracking-tight">
                SentinelScribe
              </p>
            </div>
          </Link>

          {/* Global Search */}
          <div className="hidden lg:flex relative w-48 xl:w-64 transition-all">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search patients, records, or insights..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
            />
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden xl:flex items-center justify-center gap-1">
          {NAV_LINKS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors ${active ? 'text-[#0F4C81] bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                <span className="hidden xl:inline-block">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center justify-end gap-3">
          {/* Notification bell — links to appointments page */}
          <Button variant="ghost" size="icon" className="relative hidden md:flex text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full" onClick={() => router.push('/appointments')}>
            <Bell size={18} />
            {unreadNotifs > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#DC2626] border-2 border-white text-white text-[9px] font-bold flex items-center justify-center">
                {unreadNotifs > 9 ? '9+' : unreadNotifs}
              </span>
            ) : (
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#DC2626] border-2 border-white" />
            )}
          </Button>

          {/* User menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className={buttonVariants({ variant: 'ghost', className: 'h-auto p-1.5 px-2 flex items-center gap-3 rounded-full hover:bg-slate-50' })}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs font-bold text-[#0F4C81] bg-blue-100">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-none text-slate-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {user.role}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-200 shadow-lg p-2">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-slate-500">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-slate-50" onClick={() => router.push('/about')}>
                  <Info className="mr-2 h-4 w-4 text-slate-500" />
                  <span>About Us</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-slate-50" onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4 text-slate-500" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
