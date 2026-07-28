'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PatientNavbar from '@/components/patient/PatientNavbar';
import { isPatientLoggedIn } from '@/lib/patientPortal';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isPatientLoggedIn()) {
      router.replace('/login/patient');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <PatientNavbar />
      {children}
    </div>
  );
}
