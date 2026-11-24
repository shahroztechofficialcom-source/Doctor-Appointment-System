"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  AlertCircle,
  Search,
  Filter
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { getAppointments, getSession, saveAppointments, Appointment } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/doctors";
import { showIosNotification } from "@/components/ios-notification";

export default function DoctorPortal() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Completed">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotesAppt, setSelectedNotesAppt] = useState<Appointment | null>(null);

  function load() {
    const user = getSession();
    const assignedDoctorId =
      user?.email === "doctor@mehr.com" ? "afzal-bashir" : user?.doctorId;
    setAppointments(
      assignedDoctorId
        ? getAppointments().filter((appointment) => appointment.doctorId === assignedDoctorId)
        : []
    );
  }

  useEffect(() => {
    load();
    const handleUpdate = () => load();
    window.addEventListener("mehr-appointments-change", handleUpdate);
    return () => window.removeEventListener("mehr-appointments-change", handleUpdate);
  }, []);

  function updateStatus(id: string, status: "Approved" | "Rejected" | "Completed") {
    const next = getAppointments().map((a) => (a.id === id ? { ...a, status } : a));
    saveAppointments(next);
    load();

    showIosNotification({
      title: `Appointment ${status}`,
      message: `The consultation request has been marked as ${status}.`,
      type: status === "Approved" ? "success" : "info",
    });
  }

  const filtered = appointments.filter((a) => {
    if (statusFilter !== "All" && a.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.patientName.toLowerCase().includes(q) ||
        a.patientEmail.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        (a.appointmentNumber && a.appointmentNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const approvedCount = appointments.filter((a) => a.status === "Approved").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;

  return (
    <DashboardShell role="Doctor">
      <div className="space-y-8">
        {/* Overview Header */}
        <div className="rounded-3xl border border-white/10 bg-[#0C1527] p-6 sm:p-8 shadow-2xl backdrop-blur-xl [html.light-mode_&]:bg-white [html.light-mode_&]:border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 [html.light-mode_&]:border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 [html.light-mode_&]:text-cyan-300">
                Clinical OPD Manager
              </span>
              <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl [html.light-mode_&]:text-slate-900">
                Doctor OPD Dashboard
              </h1>
            </div>
            <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300">
              ● Consultant On Duty
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { n: appointments.length, t: "Total Bookings", color: "text-cyan-300" },
              { n: pendingCount, t: "Pending Action", color: "text-cyan-300" },
              { n: approvedCount, t: "Approved Consultations", color: "text-cyan-300" },
              { n: completedCount, t: "Completed", color: "text-cyan-300" },
            ].map(({ n, t, color }) => (
              <div
                key={t}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-50"
              >
                <b className={`text-2xl font-black ${color}`}>{n}</b>
                <p className="mt-1 text-xs font-semibold text-slate-400">{t}</p>
              </div>
            ))}
          </div>

          {/* Table Filters & Search */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(["All", "Pending", "Approved", "Completed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                    statusFilter === status
                      ? "bg-cyan-400 text-slate-950 font-black [html.light-mode_&]:bg-cyan-400 [html.light-mode_&]:text-white"
                      : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-100 [html.light-mode_&]:text-slate-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name or token..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#0B1628]/40 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Appointments Table */}
          <div id="patients" className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-100">
                <tr>
                  <th className="p-3.5">Token / Patient</th>
                  <th className="p-3.5">Assigned Specialist</th>
                  <th className="p-3.5">Date & Slot</th>
                  <th className="p-3.5">Mode / Fee</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B1628]/10 [html.light-mode_&]:divide-slate-200">
                {filtered.length > 0 ? (
                  filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-white/[0.05] [html.light-mode_&]:hover:bg-slate-50">
                      <td className="p-3.5">
                        <strong className="text-white block [html.light-mode_&]:text-slate-900">{a.patientName}</strong>
                        <span className="text-slate-400 text-[11px]">{a.patientEmail} • {a.patientPhone || "No phone"}</span>
                        <div className="text-[10px] text-cyan-300 font-bold mt-0.5">{a.appointmentNumber || a.id.slice(0, 8)}</div>
                      </td>
                      <td className="p-3.5 text-slate-300 [html.light-mode_&]:text-slate-700">
                        {a.doctorName}
                        <span className="block text-[11px] text-slate-400">{a.doctorSpecialty}</span>
                      </td>
                      <td className="p-3.5 text-slate-300 [html.light-mode_&]:text-slate-700">
                        {a.date}
                        <span className="block font-bold text-cyan-300">{a.slot}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="block text-slate-300 [html.light-mode_&]:text-slate-700">{a.consultationType || "In-Person"}</span>
                        <strong className="text-cyan-300">{money(a.fee)}</strong>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            a.status === "Approved"
                              ? "bg-cyan-400/15 text-cyan-300 [html.light-mode_&]:bg-[#E9D7BF] [html.light-mode_&]:text-white"
                              : a.status === "Pending"
                              ? "bg-cyan-400/15 text-cyan-300 [html.light-mode_&]:bg-[#E9D7BF] [html.light-mode_&]:text-cyan-800"
                              : a.status === "Completed"
                              ? "bg-cyan-400/15 text-cyan-300 [html.light-mode_&]:bg-[#E9D7BF] [html.light-mode_&]:text-cyan-800"
                              : "bg-slate-500/20 text-slate-300 [html.light-mode_&]:bg-slate-100 [html.light-mode_&]:text-slate-800"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {a.symptoms && (
                            <button
                              onClick={() => setSelectedNotesAppt(a)}
                              className="rounded-lg border border-white/10 p-1.5 text-slate-300 hover:text-white"
                              title="View Patient Symptoms"
                            >
                              <FileText size={14} />
                            </button>
                          )}
                          {a.status === "Pending" && (
                            <>
                              <Button size="sm" variant="lime" onClick={() => updateStatus(a.id, "Approved")}>
                                Approve
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => updateStatus(a.id, "Rejected")}>
                                Reject
                              </Button>
                            </>
                          )}
                          {a.status === "Approved" && (
                            <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "Completed")}>
                              Mark Done
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No appointment records found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Notes Modal */}
      <AnimatePresence>
        {selectedNotesAppt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-3xl border border-cyan-400/30 bg-[#0B1426] p-6 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <b className="text-sm font-bold">Patient Clinical Symptoms</b>
                <button onClick={() => setSelectedNotesAppt(null)}>✕</button>
              </div>
              <div className="mt-4 text-xs space-y-2 text-slate-300">
                <p><strong>Patient:</strong> {selectedNotesAppt.patientName}</p>
                <p><strong>Token:</strong> {selectedNotesAppt.appointmentNumber}</p>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 mt-2 text-slate-200">
                  {selectedNotesAppt.symptoms}
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button size="sm" variant="lime" onClick={() => setSelectedNotesAppt(null)}>
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
