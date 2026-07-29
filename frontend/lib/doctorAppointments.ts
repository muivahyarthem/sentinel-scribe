// doctorAppointments.ts
// Shared localStorage bridge for patient→doctor appointment sync.
// The patient portal writes here; the doctor appointments page reads & reacts live.

export interface DoctorAppointmentEntry {
  id: string;                   // appointment ID (from patientPortal)
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  department: string;
  roomNumber: string;
  date: string;
  time: string;
  status: 'scheduled' | 'cancelled' | 'completed' | 'rescheduled';
  bookedAt: string;             // ISO timestamp when the appointment was booked/changed
  cancelledAt?: string;
}

export interface DoctorNotification {
  id: string;
  type: 'new_appointment' | 'cancellation' | 'reschedule';
  appointmentId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const APPOINTMENTS_KEY = 'doctor_appointments_store';
const NOTIFICATIONS_KEY = 'doctor_notifications_store';

// ─── Appointments ────────────────────────────────────────────────────────────

export function getDoctorAppointments(): DoctorAppointmentEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(APPOINTMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDoctorAppointments(entries: DoctorAppointmentEntry[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event('doctorAppointmentsUpdated'));
}

/** Add or update an appointment in the doctor store */
export function upsertDoctorAppointment(entry: DoctorAppointmentEntry) {
  const all = getDoctorAppointments();
  const idx = all.findIndex(a => a.id === entry.id);
  if (idx >= 0) {
    all[idx] = entry;
  } else {
    all.unshift(entry);
  }
  saveDoctorAppointments(all);
}

// ─── Doctor Notifications ────────────────────────────────────────────────────

export function getDoctorNotifications(): DoctorNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDoctorNotifications(notifications: DoctorNotification[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event('doctorNotificationsUpdated'));
}

export function addDoctorNotification(n: Omit<DoctorNotification, 'id' | 'timestamp' | 'read'>) {
  const all = getDoctorNotifications();
  const notification: DoctorNotification = {
    ...n,
    id: `dn-${Date.now()}`,
    timestamp: new Date().toISOString(),
    read: false,
  };
  saveDoctorNotifications([notification, ...all]);
  return notification;
}

export function markDoctorNotificationRead(id: string) {
  const all = getDoctorNotifications();
  const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
  saveDoctorNotifications(updated);
}

export function markAllDoctorNotificationsRead() {
  const all = getDoctorNotifications().map(n => ({ ...n, read: true }));
  saveDoctorNotifications(all);
}

export function getUnreadDoctorNotificationCount(): number {
  return getDoctorNotifications().filter(n => !n.read).length;
}

export function clearAllDoctorNotifications() {
  saveDoctorNotifications([]);
}

