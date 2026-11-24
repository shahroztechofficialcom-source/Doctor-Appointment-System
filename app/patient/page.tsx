"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Printer,
  XCircle,
  FileText,
  ClipboardList,
  UserRound,
  Download,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Plus,
  Eye,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { getAppointments, saveAppointments, Appointment, getSession } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/doctors";
import { showIosNotification } from "@/components/ios-notification";

export default function PatientPortal() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientName, setPatientName] = useState("");
  const [tab, setTab] = useState<"Upcoming" | "Past" | "Cancelled">("Upcoming");
  const [activeModalAppt, setActiveModalAppt] = useState<Appointment | null>(null);
  const [cancelModalAppt, setCancelModalAppt] = useState<Appointment | null>(null);
  const [activeReportModal, setActiveReportModal] = useState<any | null>(null);

  function loadAppointments() {
    const user = getSession();
    if (user?.email) {
      setPatientName(user.name);
      const all = getAppointments();
      const myAppts = all.filter((a) => a.patientEmail.toLowerCase() === user.email.toLowerCase());
      setAppointments(myAppts);
    }
  }

  useEffect(() => {
    loadAppointments();
    const handleUpdate = () => loadAppointments();
    window.addEventListener("mehr-appointments-change", handleUpdate);
    return () => window.removeEventListener("mehr-appointments-change", handleUpdate);
  }, []);

  function handleCancelConfirm(id: string) {
    const all = getAppointments();
    const updated = all.map((a) =>
      a.id === id ? { ...a, status: "Cancelled" as const } : a
    );
    saveAppointments(updated);
    setCancelModalAppt(null);
    loadAppointments();

    showIosNotification({
      title: "Appointment Cancelled",
      message: "Your appointment request has been cancelled.",
      type: "warning",
    });
  }

  const rows = appointments.filter((a) => {
    if (tab === "Upcoming") return ["Pending", "Approved"].includes(a.status);
    if (tab === "Past") return a.status === "Completed";
    return ["Cancelled", "Rejected"].includes(a.status);
  });
  const upcomingCount = appointments.filter((a) => ["Pending", "Approved"].includes(a.status)).length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const balanceDue = appointments
    .filter((a) => a.paymentStatus !== "Paid" && ["Pending", "Approved", "Completed"].includes(a.status))
    .reduce((total, appointment) => total + appointment.fee, 0);

  return (
    <DashboardShell role="Patient">
      <div className="space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-[#0b2440] via-[#0c1e2d] to-[#0c1527] p-6 shadow-2xl sm:p-8"
        >
          <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
                  <ShieldCheck size={13} /> Patient care overview
                </span>
                <h1 className="mt-4 text-2xl font-black text-white sm:text-3xl">
                  Welcome back, {patientName.split(" ")[0] || "Patient"}
                </h1>
                <p className="mt-2 max-w-xl text-xs leading-5 text-slate-300">
                  Keep your appointments, medical records, prescriptions, and payment preferences together.
                </p>
              </div>
              <Link href="/appointments">
                <Button variant="lime" size="sm">
                  <Plus size={15} /> Book a visit
                </Button>
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { label: "Upcoming visits", value: upcomingCount, icon: CalendarDays },
                { label: "Completed visits", value: completedCount, icon: CheckCircle2 },
                { label: "Appointments", value: appointments.length, icon: ClipboardList },
                { label: "Balance due", value: money(balanceDue), icon: CreditCard },
              ].map(({ label, value, icon: Icon }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-300">{label}</span>
                    <Icon size={15} className="shrink-0 text-cyan-300" />
                  </div>
                  <strong className="mt-2 block truncate text-lg font-black text-white">{value}</strong>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Appointments Section */}
        <div id="appointments" className="rounded-3xl border border-white/10 bg-[#0C1527] p-6 sm:p-8 shadow-2xl backdrop-blur-xl [html.light-mode_&]:bg-white [html.light-mode_&]:border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 [html.light-mode_&]:border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 [html.light-mode_&]:text-cyan-300">
                Care Management
              </span>
              <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl [html.light-mode_&]:text-slate-900">
                My Appointments
              </h1>
            </div>

            <Link href="/appointments">
              <Button variant="lime" size="sm" className="shadow-[0_0_18px_rgba(34,211,238,.18)]">
                <Plus size={15} /> Book New Consultation
              </Button>
            </Link>
          </div>

          {/* Tab Filter */}
          <div className="mt-6 flex gap-2">
            {(["Upcoming", "Past", "Cancelled"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  tab === t
                    ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20 [html.light-mode_&]:bg-cyan-400 [html.light-mode_&]:text-white"
                    : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-100 [html.light-mode_&]:text-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Appointments List */}
          <div className="mt-6 space-y-3.5">
            {rows.length > 0 ? (
              rows.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md hover:border-cyan-400/50 transition [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <b className="text-base font-black text-white [html.light-mode_&]:text-slate-900">{a.doctorName}</b>
                      <span className="text-xs text-cyan-300 [html.light-mode_&]:text-cyan-300">({a.doctorSpecialty || "Consultant"})</span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-3">
                      <span>📅 {a.date} at {a.slot}</span>
                      <span>•</span>
                      <span>💰 {money(a.fee)}</span>
                      <span>•</span>
                      <span>Token: <strong className="text-white [html.light-mode_&]:text-slate-900">{a.appointmentNumber || a.id.slice(0, 8)}</strong></span>
                    </p>
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <CreditCard size={12} /> {a.paymentMethod || "Cash at hospital"}
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-cyan-300 [html.light-mode_&]:text-cyan-300">
                        {a.paymentStatus === "Paid" ? "Paid" : "Payment due"}
                      </span>
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          a.status === "Approved"
                            ? "bg-cyan-400/15 text-cyan-300 [html.light-mode_&]:bg-[#E9D7BF] [html.light-mode_&]:text-white"
                            : a.status === "Pending"
                            ? "bg-cyan-400/15 text-cyan-300 [html.light-mode_&]:bg-[#E9D7BF] [html.light-mode_&]:text-cyan-800"
                            : "bg-slate-500/20 text-slate-300 [html.light-mode_&]:bg-slate-100 [html.light-mode_&]:text-slate-800"
                        }`}
                      >
                        {a.status}
                      </span>
                      {a.consultationType && (
                        <span className="rounded-full bg-white/[0.04] border border-white/10 px-2 py-0.5 text-[10px] text-slate-300 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:text-slate-600">
                          {a.consultationType}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveModalAppt(a)}
                    >
                      <Eye size={13} /> View Slip
                    </Button>

                    {["Pending", "Approved"].includes(a.status) && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setCancelModalAppt(a)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center text-xs text-slate-400 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-50">
                <p>No {tab.toLowerCase()} appointments found in this browser.</p>
                <Link href="/appointments" className="mt-3 inline-block font-bold text-cyan-300 hover:underline">
                  Book an appointment now →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Medical Records & Diagnostics */}
        <div id="records" className="rounded-3xl border border-white/10 bg-[#0C1527] p-6 sm:p-8 shadow-2xl backdrop-blur-xl [html.light-mode_&]:bg-white [html.light-mode_&]:border-slate-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 [html.light-mode_&]:border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 [html.light-mode_&]:text-cyan-300">
                Laboratory Findings
              </span>
              <h2 className="text-xl font-black text-white mt-0.5 [html.light-mode_&]:text-slate-900">
                Medical Records & Lab Reports
              </h2>
            </div>
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
              Verified Pathology Lab
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Complete Blood Count (CBC)",
                date: "14 Nov 2026",
                doctor: "Dr. Afzal Bashir",
                status: "Normal",
                details: "Hemoglobin: 14.2 g/dL • WBC: 6,800 /mcL • Platelets: 240,000 /mcL. All indices are within physiological range.",
              },
              {
                title: "12-Lead Electrocardiogram (ECG)",
                date: "10 Nov 2026",
                doctor: "Dr. Afzal Bashir",
                status: "Normal Sinus",
                details: "Normal sinus rhythm at 72 bpm. PR interval 160ms. QRS duration 88ms. No ST-elevation or ischemic changes.",
              },
              {
                title: "Fasting Lipid Profile",
                date: "02 Oct 2026",
                doctor: "Dr. Fatima Tariq",
                status: "Optimal",
                details: "Total Cholesterol: 172 mg/dL • HDL: 52 mg/dL • LDL: 98 mg/dL • Triglycerides: 110 mg/dL.",
              },
            ].map((report) => (
              <div
                key={report.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-cyan-400/15 px-2 py-0.5 text-[10px] font-bold text-cyan-300 [html.light-mode_&]:bg-[#E9D7BF] [html.light-mode_&]:text-cyan-800">
                    {report.status}
                  </span>
                  <span className="text-[11px] text-slate-400">{report.date}</span>
                </div>
                <h4 className="mt-3 font-extrabold text-sm text-white [html.light-mode_&]:text-slate-900">{report.title}</h4>
                <p className="text-xs text-slate-400 mt-1">Ref: {report.doctor}</p>
                <button
                  onClick={() => setActiveReportModal(report)}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:underline cursor-pointer"
                >
                  <Eye size={13} /> View Findings
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Prescriptions Section */}
        <div id="prescriptions" className="rounded-3xl border border-white/10 bg-[#0C1527] p-6 sm:p-8 shadow-2xl backdrop-blur-xl [html.light-mode_&]:bg-white [html.light-mode_&]:border-slate-200">
          <div className="border-b border-white/10 pb-4 [html.light-mode_&]:border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 [html.light-mode_&]:text-cyan-300">
              Prescription Orders
            </span>
            <h2 className="text-xl font-black text-white mt-0.5 [html.light-mode_&]:text-slate-900">
              Active Prescriptions & Dosages
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {[
              {
                drug: "Tab. Concor 2.5mg (Bisoprolol)",
                schedule: "1 tablet once daily in the morning",
                duration: "30 Days",
                prescribedBy: "Dr. Afzal Bashir (Cardiology)",
              },
              {
                drug: "Tab. Panadol CF",
                schedule: "1 tablet twice daily after meals if needed",
                duration: "5 Days (SOS)",
                prescribedBy: "Dr. Fatima Tariq (General Medicine)",
              },
            ].map((rx, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-50"
              >
                <div>
                  <b className="text-sm font-black text-white [html.light-mode_&]:text-slate-900">{rx.drug}</b>
                  <p className="text-xs text-cyan-300 mt-0.5 [html.light-mode_&]:text-cyan-300">{rx.schedule} • {rx.duration}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">By {rx.prescribedBy}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    showIosNotification({
                      title: "Prescription Downloaded",
                      message: `Slip for ${rx.drug} saved.`,
                      type: "success",
                    })
                  }
                >
                  <Download size={13} /> Save Rx
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slip Modal */}
      <AnimatePresence>
        {activeModalAppt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg rounded-3xl border border-cyan-400/40 bg-[#0B1426] p-7 text-white shadow-2xl [html.light-mode_&]:bg-white [html.light-mode_&]:text-slate-900 [html.light-mode_&]:border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 [html.light-mode_&]:border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  MEHR HOSPITAL • APPOINTMENT SLIP
                </span>
                <button
                  onClick={() => setActiveModalAppt(null)}
                  className="rounded-full p-1 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 space-y-3 text-xs">
                <p><strong>Token Number:</strong> {activeModalAppt.appointmentNumber || activeModalAppt.id.slice(0, 8)}</p>
                <p><strong>Specialist:</strong> {activeModalAppt.doctorName} ({activeModalAppt.doctorSpecialty})</p>
                <p><strong>Appointment Time:</strong> {activeModalAppt.date} at {activeModalAppt.slot}</p>
                <p><strong>Consultation Fee:</strong> {money(activeModalAppt.fee)}</p>
                <p><strong>Patient Name:</strong> {activeModalAppt.patientName}</p>
                <p><strong>Status:</strong> {activeModalAppt.status}</p>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-white/10 pt-4 [html.light-mode_&]:border-slate-100">
                <Button size="sm" variant="ghost" onClick={() => setActiveModalAppt(null)}>
                  Close
                </Button>
                <Button size="sm" variant="lime" onClick={() => window.print()}>
                  <Printer size={13} /> Print Pass
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelModalAppt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-3xl border border-slate-500/40 bg-[#0B1426] p-7 text-white shadow-2xl"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-500/20 text-slate-400 mb-4">
                <AlertCircle size={26} />
              </div>
              <h3 className="text-lg font-black">Confirm Cancellation</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Are you sure you want to cancel your consultation with <strong>{cancelModalAppt.doctorName}</strong> on {cancelModalAppt.date}? This slot will be released back to other patients.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setCancelModalAppt(null)}>
                  Keep Appointment
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleCancelConfirm(cancelModalAppt.id)}
                >
                  Yes, Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lab Report Modal */}
      <AnimatePresence>
        {activeReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg rounded-3xl border border-cyan-400/40 bg-[#0B1426] p-7 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <b className="text-base font-bold text-white">{activeReportModal.title}</b>
                <button onClick={() => setActiveReportModal(null)}>✕</button>
              </div>
              <div className="mt-4 text-xs text-slate-300 space-y-2">
                <p><strong>Date:</strong> {activeReportModal.date}</p>
                <p><strong>Ordering Clinician:</strong> {activeReportModal.doctor}</p>
                <p><strong>Diagnostic Interpretation:</strong></p>
                <div className="rounded-xl bg-white/[0.04] p-3 text-slate-200">
                  {activeReportModal.details}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2 border-t border-white/10 pt-4">
                <Button size="sm" variant="lime" onClick={() => setActiveReportModal(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
