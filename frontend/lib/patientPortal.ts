// Patient Portal — types, mock data, localStorage store, export helpers

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  photoUrl?: string;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  department: string;
  roomNumber: string;
  photoUrl?: string;
  available: boolean;
  availableSlots: string[];
}

export interface PreviousDoctor {
  id: string;
  name: string;
  department: string;
  visitDate: string;
}

export interface SoapRecord {
  id: string;
  date: string;
  doctorName: string;
  doctorId: string;
  department: string;
  chiefComplaint: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  department: string;
  roomNumber: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  bookedAt?: string;
  cancelledAt?: string;
}

export interface BillLineItem {
  label: string;
  amount: number;
}

export interface Bill {
  id: string;
  date: string;
  appointmentId?: string;
  items: BillLineItem[];
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  deliveredVia?: ('email' | 'sms' | 'whatsapp')[];
}

export interface InsurancePolicy {
  provider: string;
  policyNumber: string;
  coveragePercent: number;
  maxCoverage: number;
  expiryDate: string;
  status: 'active' | 'expiring' | 'expired';
}

export interface InsuranceClaim {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
}

export interface PortalNotification {
  id: string;
  type: 'appointment' | 'bill' | 'insurance' | 'prescription' | 'general';
  title: string;
  message: string;
  date: string;
  read: boolean;
  channels: ('in_app' | 'email' | 'sms' | 'whatsapp')[];
}

export interface PortalData {
  profile: PatientProfile;
  currentDoctor: Doctor;
  previousDoctors: PreviousDoctor[];
  soapRecords: SoapRecord[];
  appointments: Appointment[];
  bills: Bill[];
  insurance: InsurancePolicy;
  claims: InsuranceClaim[];
  notifications: PortalNotification[];
}

const STORAGE_KEY = 'sentinel_patient_portal';

export const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
] as const;

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Mitchell', qualification: 'MD, Internal Medicine', department: 'General Medicine', roomNumber: '204', available: true, availableSlots: ['09:00', '10:30', '14:00', '15:30'] },
  { id: 'd2', name: 'Dr. James Chen', qualification: 'MD, Cardiology', department: 'Cardiology', roomNumber: '312', available: true, availableSlots: ['08:30', '11:00', '13:30'] },
  { id: 'd3', name: 'Dr. Emily Rodriguez', qualification: 'MD, Orthopedics', department: 'Orthopedics', roomNumber: '118', available: false, availableSlots: [] },
  { id: 'd4', name: 'Dr. Michael Park', qualification: 'MD, Pediatrics', department: 'Pediatrics', roomNumber: '105', available: true, availableSlots: ['09:30', '11:30', '14:30'] },
  { id: 'd5', name: 'Dr. Lisa Thompson', qualification: 'MD, Dermatology', department: 'Dermatology', roomNumber: '220', available: true, availableSlots: ['10:00', '12:00', '16:00'] },
  { id: 'd6', name: 'Dr. Robert Hayes', qualification: 'MD, General Medicine', department: 'General Medicine', roomNumber: '206', available: true, availableSlots: ['08:00', '13:00', '16:30'] },
];

function defaultPortalData(profile?: Partial<PatientProfile>): PortalData {
  const isDemo = (!profile?.email || profile.email === 'alex.johnson@email.com');

  const p: PatientProfile = {
    id: profile?.id || 'PAT-2024-0847',
    name: profile?.name || 'Alex Johnson',
    email: profile?.email || 'alex.johnson@email.com',
    phone: profile?.phone || '+1 (555) 234-8901',
    dob: profile?.dob || '1990-03-15',
    gender: profile?.gender || 'Male',
    bloodGroup: profile?.bloodGroup || 'O+',
    photoUrl: profile?.photoUrl,
  };

  return {
    profile: p,
    currentDoctor: MOCK_DOCTORS[0],
    previousDoctors: isDemo ? [
      { id: 'pd1', name: 'Dr. James Chen', department: 'Cardiology', visitDate: '2025-11-20' },
      { id: 'pd2', name: 'Dr. Lisa Thompson', department: 'Dermatology', visitDate: '2025-09-08' },
    ] : [],
    soapRecords: isDemo ? [
      {
        id: 'soap1',
        date: '2026-01-15',
        doctorName: 'Dr. Sarah Mitchell',
        doctorId: 'd1',
        department: 'General Medicine',
        chiefComplaint: 'Persistent headache and fatigue',
        subjective: 'Patient reports headaches for 5 days, worse in mornings. Fatigue noted. No vision changes.',
        objective: 'BP 128/82, HR 72, afebrile. Neurological exam normal. No neck stiffness.',
        assessment: 'Tension-type headache, likely stress-related. Rule out secondary causes — low suspicion.',
        plan: 'Ibuprofen 400mg PRN. Stress management counseling. Follow up in 2 weeks if no improvement.',
      },
      {
        id: 'soap2',
        date: '2025-11-20',
        doctorName: 'Dr. James Chen',
        doctorId: 'd2',
        department: 'Cardiology',
        chiefComplaint: 'Routine cardiac check-up',
        subjective: 'No chest pain, palpitations, or dyspnea. Family history of hypertension.',
        objective: 'BP 122/78, HR 68 regular. Heart sounds S1/S2 normal. ECG: normal sinus rhythm.',
        assessment: 'Normal cardiac examination. Low cardiovascular risk.',
        plan: 'Continue healthy lifestyle. Annual follow-up recommended.',
      },
      {
        id: 'soap3',
        date: '2025-09-08',
        doctorName: 'Dr. Lisa Thompson',
        doctorId: 'd5',
        department: 'Dermatology',
        chiefComplaint: 'Seasonal eczema flare-up',
        subjective: 'Itchy patches on forearms for 1 week. No new products used.',
        objective: 'Erythematous patches bilateral forearms. No signs of infection.',
        assessment: 'Atopic dermatitis flare, mild.',
        plan: 'Hydrocortisone 1% cream BID x 7 days. Moisturizer daily. Avoid triggers.',
      },
    ] : [],
    appointments: isDemo ? [
      {
        id: 'apt1',
        doctorId: 'd1',
        doctorName: 'Dr. Sarah Mitchell',
        department: 'General Medicine',
        roomNumber: '204',
        date: '2026-02-05',
        time: '10:30',
        status: 'scheduled',
      },
    ] : [],
    bills: isDemo ? [
      {
        id: 'bill1',
        date: '2026-01-15',
        appointmentId: 'apt0',
        items: [
          { label: 'Consultation Fee', amount: 150 },
          { label: 'Lab — CBC Panel', amount: 45 },
          { label: 'Medicine — Ibuprofen', amount: 12 },
        ],
        tax: 20.7,
        total: 227.7,
        status: 'paid',
        deliveredVia: ['email', 'sms'],
      },
      {
        id: 'bill2',
        date: '2025-11-20',
        items: [
          { label: 'Consultation Fee', amount: 200 },
          { label: 'ECG Test', amount: 75 },
        ],
        tax: 27.5,
        total: 302.5,
        status: 'paid',
        deliveredVia: ['email'],
      },
    ] : [],
    insurance: isDemo ? {
      provider: 'BlueCross Health Plus',
      policyNumber: 'BCH-8847291-X',
      coveragePercent: 80,
      maxCoverage: 50000,
      expiryDate: '2026-12-31',
      status: 'active',
    } : {
      provider: 'Not Provided',
      policyNumber: 'N/A',
      coveragePercent: 0,
      maxCoverage: 0,
      expiryDate: 'N/A',
      status: 'expired',
    },
    claims: isDemo ? [
      { id: 'clm1', date: '2026-01-16', amount: 182.16, description: 'General consultation — Jan 15', status: 'approved' },
      { id: 'clm2', date: '2025-11-21', amount: 242, description: 'Cardiology check-up — Nov 20', status: 'approved' },
      { id: 'clm3', date: '2026-02-01', amount: 120, description: 'Upcoming dermatology visit', status: 'submitted' },
    ] : [],
    notifications: isDemo ? [
      { id: 'n1', type: 'appointment', title: 'Appointment Reminder', message: 'Your appointment with Dr. Sarah Mitchell is on Feb 5 at 10:30 AM, Room 204.', date: '2026-02-04T08:00:00', read: false, channels: ['in_app', 'email', 'sms'] },
      { id: 'n2', type: 'bill', title: 'Bill Generated', message: 'Your bill of $227.70 for the Jan 15 consultation has been generated.', date: '2026-01-15T14:30:00', read: true, channels: ['in_app', 'email'] },
      { id: 'n3', type: 'insurance', title: 'Claim Approved', message: 'Insurance claim CLM-884729 for $182.16 has been approved.', date: '2026-01-17T09:00:00', read: true, channels: ['in_app', 'email', 'whatsapp'] },
      { id: 'n4', type: 'prescription', title: 'Prescription Ready', message: 'Your Ibuprofen prescription is ready for pickup at the hospital pharmacy.', date: '2026-01-15T16:00:00', read: false, channels: ['in_app', 'sms'] },
    ] : [],
  };
}

export function getPortalData(): PortalData {
  if (typeof window === 'undefined') return defaultPortalData();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw) as PortalData; } catch { /* fall through */ }
  }
  const userRaw = localStorage.getItem('auth_user');
  let profile: Partial<PatientProfile> | undefined;
  if (userRaw) {
    try {
      const u = JSON.parse(userRaw);
      profile = { id: u.id, name: u.name, email: u.email, phone: u.phone_number || '' };
    } catch { /* ignore */ }
  }
  const data = defaultPortalData(profile);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function savePortalData(data: PortalData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function initPortalFromRegistration(info: {
  name: string; email: string; phone: string; dob?: string;
  gender?: string; bloodType?: string; id?: string;
}) {
  const data = defaultPortalData({
    id: info.id || `PAT-${Date.now()}`,
    name: info.name,
    email: info.email,
    phone: info.phone,
    dob: info.dob || '',
    gender: info.gender || '',
    bloodGroup: info.bloodType || '',
  });
  data.appointments = [];
  data.bills = [];
  data.claims = [];
  data.notifications = [
    {
      id: 'welcome',
      type: 'general',
      title: 'Welcome to Sentinel Patient Portal',
      message: 'Your account is ready. Book appointments, view records, and manage billing from here.',
      date: new Date().toISOString(),
      read: false,
      channels: ['in_app'],
    },
  ];
  savePortalData(data);
  return data;
}

export function getDoctorsByDepartment(department: string): Doctor[] {
  return MOCK_DOCTORS.filter(d => d.department === department && d.available);
}

export function generateBill(appointment: Appointment): Bill {
  const consultationFee = appointment.department === 'Cardiology' ? 200 : 150;
  const labFee = Math.random() > 0.5 ? 45 : 0;
  const medicineFee = Math.random() > 0.5 ? 12 : 0;
  const items: BillLineItem[] = [{ label: 'Consultation Fee', amount: consultationFee }];
  if (labFee) items.push({ label: 'Lab — Standard Panel', amount: labFee });
  if (medicineFee) items.push({ label: 'Medicine', amount: medicineFee });
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const tax = Math.round(subtotal * 0.09 * 100) / 100;
  return {
    id: `bill-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    appointmentId: appointment.id,
    items,
    tax,
    total: Math.round((subtotal + tax) * 100) / 100,
    status: 'pending',
  };
}

export function exportSoapAsDocx(record: SoapRecord) {
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
<head><meta charset='utf-8'><title>SOAP Note</title></head><body>
<h1>SOAP Note — ${record.chiefComplaint}</h1>
<p><b>Date:</b> ${record.date} | <b>Doctor:</b> ${record.doctorName} | <b>Department:</b> ${record.department}</p>
<h2>Subjective</h2><p>${record.subjective}</p>
<h2>Objective</h2><p>${record.objective}</p>
<h2>Assessment</h2><p>${record.assessment}</p>
<h2>Plan</h2><p>${record.plan}</p>
</body></html>`;
  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SOAP_${record.date}_${record.doctorName.replace(/\s+/g, '_')}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportSoapAsPdf(record: SoapRecord) {
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><title>SOAP Note</title>
<style>body{font-family:Arial,sans-serif;padding:40px;max-width:800px;margin:0 auto}
h1{font-size:20px;border-bottom:2px solid #0F4C81;padding-bottom:8px}
h2{font-size:14px;color:#0F4C81;margin-top:24px}p{font-size:13px;line-height:1.6;color:#334155}
.meta{color:#64748B;font-size:12px;margin-bottom:24px}</style></head><body>
<h1>SOAP Note — ${record.chiefComplaint}</h1>
<p class="meta">Date: ${record.date} | Doctor: ${record.doctorName} | Department: ${record.department}</p>
<h2>Subjective</h2><p>${record.subjective}</p>
<h2>Objective</h2><p>${record.objective}</p>
<h2>Assessment</h2><p>${record.assessment}</p>
<h2>Plan</h2><p>${record.plan}</p>
<script>window.onload=function(){window.print()}</script></body></html>`);
  w.document.close();
}

export function exportBillAsPdf(bill: Bill) {
  const itemsHtml = bill.items.map(i => `<tr><td>${i.label}</td><td style="text-align:right">$${i.amount.toFixed(2)}</td></tr>`).join('');
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><title>Bill ${bill.id}</title>
<style>body{font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto}
h1{font-size:20px;color:#0F4C81}table{width:100%;border-collapse:collapse;margin:16px 0}
td{padding:8px 0;border-bottom:1px solid #E2E8F0;font-size:13px}
.total{font-weight:bold;font-size:16px}</style></head><body>
<h1>Medical Bill</h1><p style="color:#64748B">Bill ID: ${bill.id} | Date: ${bill.date}</p>
<table>${itemsHtml}
<tr><td>Tax (9%)</td><td style="text-align:right">$${bill.tax.toFixed(2)}</td></tr>
<tr class="total"><td>Total</td><td style="text-align:right">$${bill.total.toFixed(2)}</td></tr></table>
<p>Status: ${bill.status.toUpperCase()}</p>
<script>window.onload=function(){window.print()}</script></body></html>`);
  w.document.close();
}

export function calcAge(dob: string): number {
  if (!dob) return 0;
  const diff = Date.now() - new Date(dob).getTime();
  return new Date(diff).getUTCFullYear() - 1970;
}

export function isPatientLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token') || !!localStorage.getItem('patient_demo');
}

export function patientLogout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('patient_demo');
  window.location.href = '/login/patient';
}

export function demoPatientLogin() {
  localStorage.setItem('patient_demo', 'true');
  localStorage.setItem('auth_user', JSON.stringify({
    id: 'demo-patient',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    role: 'Patient',
  }));
  getPortalData();
}
