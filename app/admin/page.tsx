"use client";

import { useEffect, useState } from "react";
import {
  Stethoscope,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  DollarSign,
  Clock,
  Sparkles
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { doctors as defaultDoctors, Doctor, categories } from "@/lib/doctors";
import {
  getUsers,
  saveUsers,
  User,
  getExtraDoctors,
  saveExtraDoctors,
  Appointment,
  getAppointments,
} from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { showIosNotification } from "@/components/ios-notification";

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminPortal() {
  const [users, setUsers] = useState<User[]>([]);
  const [extraDoctors, setExtraDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Add Doctor Form state
  const [name, setName] = useState("");
  const [spec, setSpec] = useState("Cardiology");
  const [fee, setFee] = useState("2000");
  const [shift, setShift] = useState<"Morning" | "Evening">("Morning");
  const [days, setDays] = useState("Mon, Tue, Wed, Thu, Fri");
  const [timing, setTiming] = useState("10:00 AM – 02:00 PM");
  const [qualification, setQualification] = useState("MBBS, FCPS");
  const [experience, setExperience] = useState("10+ years");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [about, setAbout] = useState("Experienced consultant providing patient-centered clinical care.");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");

  useEffect(() => {
    setUsers(getUsers());
    setExtraDoctors(getExtraDoctors());
    setAppointments(getAppointments());
    const handleAppointmentUpdate = () => setAppointments(getAppointments());
    window.addEventListener("mehr-appointments-change", handleAppointmentUpdate);
    return () => window.removeEventListener("mehr-appointments-change", handleAppointmentUpdate);
  }, []);

  async function handleAddDoctor(e: React.FormEvent) {
    e.preventDefault();

    const formattedName = name.startsWith("Dr.") ? name.trim() : `Dr. ${name.trim()}`;
    const mail = doctorEmail.trim().toLowerCase();
    if (!mail || doctorPassword.length < 6) {
      showIosNotification({
        title: "Doctor Credentials Required",
        message: "Enter a valid email and a password with at least 6 characters.",
        type: "warning",
      });
      return;
    }
    if (users.some((user) => user.email === mail)) {
      showIosNotification({
        title: "Account Already Exists",
        message: "Use a different email address for this doctor.",
        type: "warning",
      });
      return;
    }

    const pendingDoctor: User = {
      name: formattedName,
      email: mail,
      phone: "+92 300 0000000",
      role: "Doctor",
      passwordHash: await hashPassword(doctorPassword),
      approvalStatus: "Pending",
      doctorApplication: {
        specialty: spec,
        qualification,
        experienceYears: parseInt(experience) || 10,
        fee: Number(fee) || 2000,
        gender,
      },
    };
    const nextUsers = [...users, pendingDoctor];
    saveUsers(nextUsers);
    setUsers(nextUsers);
    setName("");
    setDoctorEmail("");
    setDoctorPassword("");

    showIosNotification({
      title: "Doctor Application Created",
      message: `${formattedName} is pending admin approval and is not listed or able to log in yet.`,
      type: "info",
    });
  }

  function handleRemoveDoctor(id: string) {
    const next = extraDoctors.filter((d) => d.id !== id);
    saveExtraDoctors(next);
    setExtraDoctors(next);

    showIosNotification({
      title: "Doctor Removed",
      message: "The doctor profile was removed from this browser directory.",
      type: "warning",
    });
  }

  function handleDoctorApplication(user: User, approved: boolean) {
    let doctorId: string | undefined;
    const application = user.doctorApplication;

    if (approved) {
      if (!application) {
        showIosNotification({
          title: "Application Incomplete",
          message: "This doctor application is missing profile details and cannot be approved.",
          type: "warning",
        });
        return;
      }

      doctorId = `custom-${Date.now()}`;
      const doctorName = user.name.startsWith("Dr.") ? user.name.trim() : `Dr. ${user.name.trim()}`;
      const newDoctor: Doctor = {
        id: doctorId,
        name: doctorName,
        specialty: `${application.specialty} Specialist`,
        category: application.specialty,
        fee: application.fee,
        shift: "Morning",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        timing: "09:00 AM – 05:00 PM",
        slots: ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM"],
        image:
          application.gender === "Female"
            ? "https://images.unsplash.com/photo-1594824813583-a97e411b9136?w=900&q=85"
            : "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=900&q=85",
        qualification: application.qualification,
        experience: `${application.experienceYears}+ years`,
        experienceYears: application.experienceYears,
        about: `${application.specialty} specialist at MEHR HOSPITAL.`,
        rating: 5,
        reviewsCount: 0,
        gender: application.gender,
        languages: ["English", "Urdu"],
        consultationType: ["In-Person"],
        nextAvailable: "Tomorrow",
        opdRoom: "OPD Room assigned by hospital",
        services: [`${application.specialty} consultation`],
        badge: "Newly Approved",
        isAvailableToday: true,
      };

      const nextDoctors = [...extraDoctors, newDoctor];
      saveExtraDoctors(nextDoctors);
      setExtraDoctors(nextDoctors);
    }

    const nextUsers = users.map((item) =>
      item.email === user.email
        ? {
            ...item,
            approvalStatus: approved ? "Approved" as const : "Rejected" as const,
            ...(doctorId ? { doctorId } : {}),
          }
        : item
    );
    saveUsers(nextUsers);
    setUsers(nextUsers);

    showIosNotification({
      title: approved ? "Doctor Approved" : "Application Rejected",
      message: approved
        ? `${user.name}'s profile is now published and their dashboard is enabled.`
        : `${user.name}'s doctor application was rejected.`,
      type: approved ? "success" : "info",
    });
  }

  const allDoctors = [...defaultDoctors, ...extraDoctors];
  const pendingDoctors = users.filter(
    (user) => user.role === "Doctor" && user.approvalStatus === "Pending"
  );
  const doctorReach = Object.values(
    appointments.reduce<Record<string, { name: string; count: number }>>((result, appointment) => {
      const key = appointment.doctorName;
      result[key] = result[key] || { name: key, count: 0 };
      result[key].count += 1;
      return result;
    }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxDoctorReach = Math.max(1, ...doctorReach.map((doctor) => doctor.count));

  return (
    <DashboardShell role="Admin">
      <div className="space-y-8">
        {/* Metric Cards */}
        <div className="rounded-3xl border border-white/10 bg-[#0C1527] p-6 sm:p-8 shadow-2xl backdrop-blur-xl [html.light-mode_&]:bg-white [html.light-mode_&]:border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 [html.light-mode_&]:border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 [html.light-mode_&]:text-cyan-300">
                Hospital Administration
              </span>
              <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl [html.light-mode_&]:text-slate-900">
                Administrative Control Panel
              </h1>
            </div>
            <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-bold text-cyan-300">
              Super Admin Privilege
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { n: allDoctors.length, t: "Active Doctors", c: "text-cyan-300" },
              { n: appointments.length, t: "Total Consultations", c: "text-cyan-300" },
              { n: users.length + 3, t: "Registered Accounts", c: "text-cyan-300" },
              { n: "500+", t: "Inpatient Bed Capacity", c: "text-cyan-300" },
            ].map(({ n, t, c }) => (
              <div
                key={t}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-50"
              >
                <b className={`text-2xl font-black ${c}`}>{n}</b>
                <p className="mt-1 text-xs font-semibold text-slate-400">{t}</p>
              </div>
            ))}
          </div>

          <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-white">Doctor Reach</h2>
                <p className="mt-1 text-xs text-slate-400">Appointment requests by specialist</p>
              </div>
              <span className="text-[11px] font-semibold text-cyan-300">Top 5 doctors</span>
            </div>
            {doctorReach.length ? (
              <div
                className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5"
                role="img"
                aria-label={`Appointment requests by doctor: ${doctorReach.map((doctor) => `${doctor.name}, ${doctor.count}`).join("; ")}`}
              >
                {doctorReach.map((doctor) => (
                  <div key={doctor.name} className="flex min-w-0 flex-col items-center gap-2 text-center">
                    <span className="text-xs font-bold text-white">{doctor.count}</span>
                    <div className="flex h-28 w-full items-end rounded-xl bg-slate-950/40 p-1.5">
                      <div
                        className="w-full rounded-lg bg-gradient-to-t from-cyan-700 to-cyan-300 transition-all duration-500"
                        style={{ height: `${Math.max(8, (doctor.count / maxDoctorReach) * 100)}%` }}
                      />
                    </div>
                    <span className="w-full truncate text-[10px] font-semibold text-slate-400" title={doctor.name}>
                      {doctor.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-white/10 bg-slate-950/30 p-5 text-center text-xs text-slate-400">
                Doctor reach will appear here as appointment requests come in.
              </p>
            )}
          </section>

          <section id="doctor-approvals" className="mt-8 rounded-3xl border border-cyan-400/20 bg-white/[0.04] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-black text-white">Doctor Applications</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Pending doctors remain unlisted and cannot access the doctor dashboard until approved.
                </p>
              </div>
              <span className="w-fit rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                {pendingDoctors.length} awaiting review
              </span>
            </div>
            {pendingDoctors.length ? (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {pendingDoctors.map((applicant) => (
                  <article key={applicant.email} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-white">{applicant.name}</h3>
                        <p className="mt-0.5 truncate text-xs text-slate-400">{applicant.email} · {applicant.phone}</p>
                        <div className="mt-2 space-y-1 text-xs text-slate-300">
                          <p>{applicant.doctorApplication?.specialty || "Specialty not provided"} · {applicant.doctorApplication?.experienceYears ?? 0} years</p>
                          <p>{applicant.doctorApplication?.qualification || "Qualifications not provided"} · PKR {(applicant.doctorApplication?.fee ?? 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button size="sm" variant="lime" onClick={() => handleDoctorApplication(applicant, true)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDoctorApplication(applicant, false)}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center text-xs text-slate-400">
                No doctor applications are waiting for review.
              </p>
            )}
          </section>

          {/* Add Doctor & Directory Grid */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* Add Doctor Form */}
            <form
              onSubmit={handleAddDoctor}
              className="rounded-3xl border border-cyan-400/30 bg-white/[0.03] p-6 backdrop-blur-md"
            >
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Plus size={18} className="text-cyan-300" /> Add Doctor to Directory
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Doctor accounts stay pending until an admin approves them. Approved doctors then appear in the live directory and can sign in.
              </p>

              <div className="mt-5 space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Doctor Name</label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Haris Qureshi"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Doctor Email</label>
                    <Input
                      required
                      type="email"
                      value={doctorEmail}
                      onChange={(e) => setDoctorEmail(e.target.value)}
                      placeholder="doctor@mehr.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Temporary Password</label>
                    <Input
                      required
                      type="password"
                      value={doctorPassword}
                      onChange={(e) => setDoctorPassword(e.target.value)}
                      placeholder="Min 6 characters"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Department</label>
                    <Select value={spec} onChange={(e) => setSpec(e.target.value)}>
                      {["Cardiology", "Neurology", "Orthopedic", "Dermatology", "Pediatrics", "General Medicine", "Ophthalmology", "Gynecology"].map(
                        (c) => (
                          <option key={c} value={c}>{c}</option>
                        )
                      )}
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Fee (PKR)</label>
                    <Input
                      type="number"
                      required
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Shift</label>
                    <Select value={shift} onChange={(e) => setShift(e.target.value as any)}>
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Gender</label>
                    <Select value={gender} onChange={(e) => setGender(e.target.value as any)}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Working Days</label>
                    <Input
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      placeholder="Mon, Tue, Wed"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Timings</label>
                    <Input
                      value={timing}
                      onChange={(e) => setTiming(e.target.value)}
                      placeholder="10:00 AM – 02:00 PM"
                    />
                  </div>
                </div>

                <Button type="submit" variant="lime" className="w-full mt-2">
                  <Plus size={16} /> Save & Publish Doctor
                </Button>
              </div>
            </form>

            {/* Doctors List */}
            <div>
              <h2 id="doctors" className="text-lg font-black text-white">
                Live Specialist Roster ({allDoctors.length})
              </h2>
              <div className="mt-4 space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {allDoctors.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-md"
                  >
                    <div>
                      <b className="text-sm font-bold text-white block">{d.name}</b>
                      <span className="text-xs text-cyan-300">
                        {d.specialty} • PKR {d.fee.toLocaleString()} • {d.shift}
                      </span>
                    </div>

                    {extraDoctors.some((x) => x.id === d.id) && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleRemoveDoctor(d.id)}
                      >
                        <Trash2 size={13} /> Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
