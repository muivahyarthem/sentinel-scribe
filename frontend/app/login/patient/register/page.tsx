'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, ArrowLeft, CheckCircle2, ChevronRight, HeartPulse, Eye, EyeOff, Lock, Mail, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { initPortalFromRegistration } from '@/lib/patientPortal';

const TOTAL_STEPS = 4;

const STEP_LABELS = [
  'Personal Info',
  'Create Account',
  'Medical History',
  'Review & Submit',
];

export default function PatientIntakePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 — Personal Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  // Step 2 — Account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 3 — Medical History
  const [conditions, setConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [bloodType, setBloodType] = useState('');

  // Step 4 — consent
  const [consent, setConsent] = useState(false);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 2) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
    }

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Final submission
      setLoading(true);
      try {
        // 1. Create patient account
        await api.post('/auth/signup', {
          name: `${firstName} ${lastName}`.trim(),
          role: 'Patient',
          email,
          phone_number: phone,
          password,
        });

        // 2. Log in to get token
        const loginRes = await api.post('/auth/login', { email, password });
        const { access_token: token, user } = loginRes.data;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));

        initPortalFromRegistration({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          dob,
          gender,
          bloodType,
          id: user.id,
        });

        // 3. Register patient record with medical info
        await api.post(
          '/patients',
          {
            name: `${firstName} ${lastName}`.trim(),
            dob: dob || null,
            gender: gender || null,
            mrn: null,
            blood_type: bloodType || null,
            allergies: allergies ? allergies.split(',').map((s) => s.trim()).filter(Boolean) : [],
            chronic_conditions: conditions ? conditions.split(',').map((s) => s.trim()).filter(Boolean) : [],
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStep(TOTAL_STEPS + 1); // success screen
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Registration failed. The email may already be registered.');
      } finally {
        setLoading(false);
      }
    }
  };

  const inputCls =
    'w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all text-sm';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans selection:bg-[#E2E8F0]">

      {/* Header */}
      <header className="h-[72px] flex items-center px-6 lg:px-8 bg-white border-b border-[#E2E8F0]">
        <Link href="/login/patient" className="inline-flex items-center text-[#64748B] hover:text-[#0F172A] transition-colors text-sm font-medium">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Link>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2">
            <HeartPulse size={20} className="text-[#0F4C81]" />
            <span className="font-bold text-[#0F172A] tracking-tight">SentinelScribe</span>
          </div>
        </div>
        <div className="w-16" />
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-12 flex flex-col justify-center">

        {step <= TOTAL_STEPS ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_15px_rgb(0,0,0,0.02)] overflow-hidden">

            {/* Progress */}
            <div className="px-8 py-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {/* Step labels */}
              <div className="flex justify-between mb-4">
                {STEP_LABELS.map((label, i) => (
                  <span
                    key={label}
                    className={`text-[11px] font-semibold uppercase tracking-wide transition-colors ${step >= i + 1 ? 'text-[#0F4C81]' : 'text-[#CBD5E1]'}`}
                    style={{ width: `${100 / TOTAL_STEPS}%`, textAlign: 'center' }}
                  >
                    {label}
                  </span>
                ))}
              </div>
              {/* Bar + dots */}
              <div className="flex items-center relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#E2E8F0] rounded-full z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0F4C81] rounded-full z-0 transition-all duration-500"
                  style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
                />
                <div className="relative z-10 w-full flex justify-between">
                  {STEP_LABELS.map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                        step > i + 1
                          ? 'bg-[#0F4C81] text-white border-2 border-[#0F4C81]'
                          : step === i + 1
                          ? 'bg-white text-[#0F4C81] border-2 border-[#0F4C81] shadow-sm'
                          : 'bg-white text-[#CBD5E1] border-2 border-[#E2E8F0]'
                      }`}
                    >
                      {step > i + 1 ? <CheckCircle2 size={16} /> : i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10">
              {error && (
                <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                  <AlertTriangle size={17} className="flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleNext}>

                {/* ── Step 1: Personal Info ─────────────────────── */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
                    <div>
                      <h2 className="text-2xl font-bold text-[#0F172A] mb-1">Personal Information</h2>
                      <p className="text-[#64748B] text-sm">Let's start with your basic details for your medical record.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0F172A]">First Name *</label>
                        <input type="text" required className={inputCls} placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0F172A]">Last Name *</label>
                        <input type="text" required className={inputCls} placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0F172A]">Date of Birth *</label>
                        <input type="date" required className={inputCls} value={dob} onChange={e => setDob(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0F172A]">Phone Number *</label>
                        <input type="tel" required className={inputCls} placeholder="(555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="block text-sm font-semibold text-[#0F172A]">Gender</label>
                        <select className={inputCls} value={gender} onChange={e => setGender(e.target.value)}>
                          <option value="">Prefer not to say</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Create Account ─────────────────────── */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
                    <div>
                      <h2 className="text-2xl font-bold text-[#0F172A] mb-1">Create Your Account</h2>
                      <p className="text-[#64748B] text-sm">Set up your credentials so you can securely access your patient portal anytime.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                      <Lock size={16} className="text-[#0F4C81] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[#0F4C81] font-medium">
                        After registration, use these credentials to sign in and view your health records, appointments, and messages.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0F172A]">Email Address *</label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                          <input
                            type="email"
                            required
                            className={`${inputCls} pl-10`}
                            placeholder="you@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0F172A]">Password *</label>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                          <input
                            type={showPw ? 'text' : 'password'}
                            required
                            className={`${inputCls} pl-10 pr-11`}
                            placeholder="Min. 8 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="new-password"
                          />
                          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#94A3B8] hover:text-[#64748B] transition-colors">
                            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {password && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {[1,2,3,4].map(i => (
                              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                                password.length >= i * 3
                                  ? password.length >= 12 ? 'bg-emerald-500' : password.length >= 8 ? 'bg-amber-400' : 'bg-red-400'
                                  : 'bg-[#E2E8F0]'
                              }`} />
                            ))}
                            <span className="text-[11px] text-[#64748B] ml-1 whitespace-nowrap">
                              {password.length < 8 ? 'Too short' : password.length < 12 ? 'Fair' : 'Strong'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0F172A]">Confirm Password *</label>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                          <input
                            type={showConfirm ? 'text' : 'password'}
                            required
                            className={`${inputCls} pl-10 pr-11 ${confirmPassword && confirmPassword !== password ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : ''}`}
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                          />
                          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#94A3B8] hover:text-[#64748B] transition-colors">
                            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {confirmPassword && confirmPassword !== password && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertTriangle size={11} /> Passwords don't match
                          </p>
                        )}
                        {confirmPassword && confirmPassword === password && (
                          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                            <CheckCircle2 size={11} /> Passwords match
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 3: Medical History ──────────────────────── */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
                    <div>
                      <h2 className="text-2xl font-bold text-[#0F172A] mb-1">Medical History</h2>
                      <p className="text-[#64748B] text-sm">Please list any known conditions or allergies. This helps your care team prepare for your visit.</p>
                    </div>
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0F172A]">Blood Type</label>
                        <select className={inputCls} value={bloodType} onChange={e => setBloodType(e.target.value)}>
                          <option value="">Unknown</option>
                          {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => <option key={bt} value={bt}>{bt}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0F172A]">Known Medical Conditions <span className="font-normal text-[#94A3B8]">(Optional)</span></label>
                        <textarea
                          rows={3}
                          className={inputCls}
                          placeholder="e.g. Hypertension, Asthma, Type 2 Diabetes... (comma separated)"
                          value={conditions}
                          onChange={e => setConditions(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0F172A]">Allergies <span className="font-normal text-[#94A3B8]">(Optional)</span></label>
                        <textarea
                          rows={2}
                          className={inputCls}
                          placeholder="e.g. Penicillin, Peanuts, Latex... (comma separated)"
                          value={allergies}
                          onChange={e => setAllergies(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 4: Review & Submit ──────────────────────── */}
                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
                    <div>
                      <h2 className="text-2xl font-bold text-[#0F172A] mb-1">Review & Submit</h2>
                      <p className="text-[#64748B] text-sm">Please confirm your details before submitting to the clinic.</p>
                    </div>

                    <div className="rounded-xl border border-[#E2E8F0] divide-y divide-[#E2E8F0] overflow-hidden text-sm">
                      <div className="flex justify-between px-5 py-3.5 bg-[#F8FAFC]">
                        <span className="font-semibold text-[#0F172A]">Name</span>
                        <span className="text-[#475569]">{firstName} {lastName}</span>
                      </div>
                      <div className="flex justify-between px-5 py-3.5">
                        <span className="font-semibold text-[#0F172A]">Date of Birth</span>
                        <span className="text-[#475569]">{dob || '—'}</span>
                      </div>
                      <div className="flex justify-between px-5 py-3.5 bg-[#F8FAFC]">
                        <span className="font-semibold text-[#0F172A]">Phone</span>
                        <span className="text-[#475569]">{phone}</span>
                      </div>
                      <div className="flex justify-between px-5 py-3.5">
                        <span className="font-semibold text-[#0F172A]">Account Email</span>
                        <span className="text-[#475569]">{email}</span>
                      </div>
                      <div className="flex justify-between px-5 py-3.5 bg-[#F8FAFC]">
                        <span className="font-semibold text-[#0F172A]">Blood Type</span>
                        <span className="text-[#475569]">{bloodType || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between px-5 py-3.5">
                        <span className="font-semibold text-[#0F172A]">Conditions</span>
                        <span className="text-[#475569] text-right max-w-[220px]">{conditions || 'None listed'}</span>
                      </div>
                      <div className="flex justify-between px-5 py-3.5 bg-[#F8FAFC]">
                        <span className="font-semibold text-[#0F172A]">Allergies</span>
                        <span className="text-[#475569] text-right max-w-[220px]">{allergies || 'None listed'}</span>
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={e => setConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-[#E2E8F0] accent-[#0F4C81] cursor-pointer"
                      />
                      <p className="text-sm text-[#475569] leading-relaxed">
                        I consent to having my medical information securely stored in the hospital database for clinical care purposes. I understand I can access and manage my records via my patient portal.
                      </p>
                    </label>
                  </div>
                )}

                {/* Nav buttons */}
                <div className="pt-8 mt-8 border-t border-[#E2E8F0] flex items-center justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => { setError(''); setStep(step - 1); }}
                      className="px-6 py-2.5 rounded-lg border border-[#E2E8F0] text-[#0F172A] font-medium hover:bg-[#F8FAFC] transition-colors"
                    >
                      Previous
                    </button>
                  ) : <div />}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0F4C81] text-white font-medium hover:bg-[#0c3e6b] transition-colors disabled:opacity-60 shadow-sm"
                  >
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                    ) : step === TOTAL_STEPS ? (
                      <><CheckCircle2 size={16} /> Complete Registration</>
                    ) : (
                      <>Continue <ChevronRight size={16} /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_15px_rgb(0,0,0,0.02)] p-12 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-[#16A34A]" />
            </div>
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Registration Complete</h2>
            <p className="text-[#64748B] text-lg max-w-md mx-auto mb-8 leading-relaxed">
              Your information has been securely added to the hospital database. Your provider will review it during your next visit.
            </p>
            <Link 
              href="/portal" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#0F4C81] text-white font-medium hover:bg-[#0c3e6b] transition-colors shadow-sm"
            >
              Go to Patient Portal
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
