'use client';

import { useEffect, useState } from 'react';
import {
  Calendar, Clock, MapPin, Plus, X, RefreshCw, User,
} from 'lucide-react';
import {
  getPortalData, savePortalData, getDoctorsByDepartment,
  generateBill, DEPARTMENTS, PortalData, Appointment, Doctor,
} from '@/lib/patientPortal';
import {
  upsertDoctorAppointment, addDoctorNotification,
} from '@/lib/doctorAppointments';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AppointmentsPage() {
  const [data, setData] = useState<PortalData | null>(null);
  const [showBook, setShowBook] = useState(false);
  const [showReschedule, setShowReschedule] = useState<Appointment | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => { setData(getPortalData()); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const cancelAppointment = (id: string) => {
    if (!data) return;
    const apt = data.appointments.find(a => a.id === id);
    const updated = {
      ...data,
      appointments: data.appointments.map(a =>
        a.id === id ? { ...a, status: 'cancelled' as const, cancelledAt: new Date().toISOString() } : a
      ),
      notifications: [
        {
          id: `n-${Date.now()}`,
          type: 'appointment' as const,
          title: 'Appointment Cancelled',
          message: 'Your appointment has been cancelled successfully.',
          date: new Date().toISOString(),
          read: false,
          channels: ['in_app' as const, 'email' as const],
        },
        ...data.notifications,
      ],
    };
    savePortalData(updated);
    setData(updated);

    // Sync cancellation to doctor store
    if (apt) {
      upsertDoctorAppointment({
        id: apt.id,
        patientId: data.profile.id,
        patientName: data.profile.name,
        patientEmail: data.profile.email,
        doctorId: apt.doctorId,
        doctorName: apt.doctorName,
        department: apt.department,
        roomNumber: apt.roomNumber,
        date: apt.date,
        time: apt.time,
        status: 'cancelled',
        bookedAt: apt.date,
        cancelledAt: new Date().toISOString(),
      });
      addDoctorNotification({
        type: 'cancellation',
        appointmentId: apt.id,
        title: 'Appointment Cancelled',
        message: `${data.profile.name} has cancelled their appointment on ${apt.date} at ${apt.time}.`,
      });
    }

    showToast('Appointment cancelled.');
  };

  if (!data) return null;

  const scheduled = data.appointments.filter(a => a.status === 'scheduled');
  const past = data.appointments.filter(a => a.status !== 'scheduled');

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {toast && (
        <div className="fixed top-20 right-4 z-50 px-4 py-3 bg-[#0F172A] text-white text-sm rounded-lg shadow-lg animate-in fade-in">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">Appointments</h1>
          <p className="text-[#64748B] mt-1">Book, reschedule, or cancel your clinic visits.</p>
        </div>
        <button
          onClick={() => setShowBook(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium text-sm transition-colors shadow-sm"
        >
          <Plus size={16} /> Book Appointment
        </button>
      </div>

      {/* Upcoming */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Upcoming</h2>
        {scheduled.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
            <Calendar size={40} className="mx-auto text-[#CBD5E1] mb-3" />
            <p className="text-[#64748B]">No upcoming appointments.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduled.map(apt => (
              <AppointmentCard
                key={apt.id}
                apt={apt}
                onCancel={() => cancelAppointment(apt.id)}
                onReschedule={() => setShowReschedule(apt)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Past & Cancelled</h2>
          <div className="space-y-3">
            {past.map(apt => (
              <div key={apt.id} className="bg-white rounded-xl border border-[#E2E8F0] px-5 py-4 flex items-center justify-between opacity-70">
                <div>
                  <p className="font-medium text-[#0F172A] text-sm">{apt.doctorName}</p>
                  <p className="text-xs text-[#64748B]">{apt.date} at {apt.time} · Room {apt.roomNumber}</p>
                </div>
                <Badge className={
                  apt.status === 'completed' ? 'bg-slate-50 text-slate-600 border-slate-200'
                    : 'bg-red-50 text-red-600 border-red-200'
                }>
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      {showBook && (
        <BookModal
          onClose={() => setShowBook(false)}
          onBook={(apt) => {
            const bill = generateBill(apt);
            const updated = {
              ...data,
              appointments: [...data.appointments, apt],
              bills: [bill, ...data.bills],
              currentDoctor: getDoctorsByDepartment(apt.department).find(d => d.id === apt.doctorId) || data.currentDoctor,
              notifications: [
                {
                  id: `n-${Date.now()}`,
                  type: 'appointment' as const,
                  title: 'Appointment Confirmed',
                  message: `Your appointment with ${apt.doctorName} is scheduled for ${apt.date} at ${apt.time}, Room ${apt.roomNumber}.`,
                  date: new Date().toISOString(),
                  read: false,
                  channels: ['in_app' as const, 'email' as const, 'sms' as const],
                },
                {
                  id: `n-${Date.now() + 1}`,
                  type: 'bill' as const,
                  title: 'Bill Generated',
                  message: `A bill of $${bill.total.toFixed(2)} has been auto-generated for your upcoming visit.`,
                  date: new Date().toISOString(),
                  read: false,
                  channels: ['in_app' as const, 'email' as const],
                },
                ...data.notifications,
              ],
            };
            savePortalData(updated);
            setData(updated);

            // Sync new booking to doctor store
            upsertDoctorAppointment({
              id: apt.id,
              patientId: data.profile.id,
              patientName: data.profile.name,
              patientEmail: data.profile.email,
              doctorId: apt.doctorId,
              doctorName: apt.doctorName,
              department: apt.department,
              roomNumber: apt.roomNumber,
              date: apt.date,
              time: apt.time,
              status: 'scheduled',
              bookedAt: new Date().toISOString(),
            });
            addDoctorNotification({
              type: 'new_appointment',
              appointmentId: apt.id,
              title: 'New Appointment Booked',
              message: `${data.profile.name} booked an appointment on ${apt.date} at ${apt.time} (${apt.department}, Room ${apt.roomNumber}).`,
            });

            setShowBook(false);
            showToast('Appointment booked successfully!');
          }}
        />
      )}

      {showReschedule && (
        <BookModal
          existing={showReschedule}
          onClose={() => setShowReschedule(null)}
          onBook={(apt) => {
            const updated = {
              ...data,
              appointments: data.appointments.map(a =>
                a.id === showReschedule.id ? { ...apt, id: a.id } : a
              ),
              notifications: [
                {
                  id: `n-${Date.now()}`,
                  type: 'appointment' as const,
                  title: 'Appointment Rescheduled',
                  message: `Your appointment has been moved to ${apt.date} at ${apt.time}.`,
                  date: new Date().toISOString(),
                  read: false,
                  channels: ['in_app' as const, 'email' as const, 'sms' as const],
                },
                ...data.notifications,
              ],
            };
            savePortalData(updated);
            setData(updated);

            // Sync reschedule to doctor store
            upsertDoctorAppointment({
              id: showReschedule.id,
              patientId: data.profile.id,
              patientName: data.profile.name,
              patientEmail: data.profile.email,
              doctorId: apt.doctorId,
              doctorName: apt.doctorName,
              department: apt.department,
              roomNumber: apt.roomNumber,
              date: apt.date,
              time: apt.time,
              status: 'rescheduled',
              bookedAt: new Date().toISOString(),
            });
            addDoctorNotification({
              type: 'reschedule',
              appointmentId: showReschedule.id,
              title: 'Appointment Rescheduled',
              message: `${data.profile.name} rescheduled their appointment to ${apt.date} at ${apt.time}.`,
            });

            setShowReschedule(null);
            showToast('Appointment rescheduled.');
          }}
        />
      )}
    </main>
  );
}

function AppointmentCard({ apt, onCancel, onReschedule }: {
  apt: Appointment; onCancel: () => void; onReschedule: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <User size={20} className="text-[#2563EB]" />
          </div>
          <div>
            <p className="font-bold text-[#0F172A]">{apt.doctorName}</p>
            <p className="text-sm text-[#64748B]">{apt.department}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#64748B]">
              <span className="flex items-center gap-1"><Calendar size={12} /> {apt.date}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {apt.time}</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> Room {apt.roomNumber}</span>
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
        <div className="flex items-center gap-2">
          <button onClick={onReschedule} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-medium text-[#0F172A] hover:bg-slate-50">
            <RefreshCw size={14} /> Reschedule
          </button>
          <button onClick={onCancel} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50">
            <X size={14} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function BookModal({ onClose, onBook, existing }: {
  onClose: () => void;
  onBook: (apt: Appointment) => void;
  existing?: Appointment;
}) {
  const [department, setDepartment] = useState(existing?.department || '');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState(existing?.date || '');
  const [time, setTime] = useState(existing?.time || '');

  const availableDoctors = department ? getDoctorsByDepartment(department) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !time) return;
    onBook({
      id: existing?.id || `apt-${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      roomNumber: selectedDoctor.roomNumber,
      date,
      time,
      status: 'scheduled',
      bookedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E2E8F0] w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="font-bold text-[#0F172A]">{existing ? 'Reschedule Appointment' : 'Book Appointment'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Smart Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Department</label>
            <select
              value={department}
              onChange={e => { setDepartment(e.target.value); setSelectedDoctor(null); setTime(''); }}
              className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              required
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {department && (
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                Available Doctors in {department}
              </label>
              {availableDoctors.length === 0 ? (
                <p className="text-sm text-amber-600 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  No doctors currently available in this department.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableDoctors.map(doc => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => { setSelectedDoctor(doc); setTime(''); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                        selectedDoctor?.id === doc.id
                          ? 'border-[#2563EB] bg-blue-50'
                          : 'border-[#E2E8F0] hover:bg-slate-50'
                      }`}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-[#0F4C81] text-white text-xs">{getInitials(doc.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-[#0F172A]">{doc.name}</p>
                        <p className="text-xs text-[#64748B]">{doc.qualification} · Room {doc.roomNumber}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedDoctor && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Date</label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Available Time Slots</label>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        time === slot
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={!selectedDoctor || !date || !time}
            className="w-full py-2.5 rounded-lg bg-[#2563EB] text-white font-medium text-sm hover:bg-[#1d4ed8] disabled:opacity-50 transition-colors"
          >
            {existing ? 'Confirm Reschedule' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
