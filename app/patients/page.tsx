import Link from "next/link";
import {
  ClipboardList,
  ShieldCheck,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  CalendarCheck,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";

const guidelines = [
  {
    icon: ClipboardList,
    title: "Before Your OPD Visit",
    items: [
      "Carry your previous medical slips, recent lab reports, and current medication list.",
      "Arrive at least 15 minutes before your scheduled slot for registration & vital signs check.",
      "Fast for at least 8 to 10 hours if fasting blood tests (Lipid, Sugar) are requested.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Hospital Check-in & Desk",
    items: [
      "Show your digital appointment token from your mobile screen at the reception desk.",
      "Collect your printed consultation pass and head towards your doctor's designated OPD room.",
      "Wheelchair assistance and dedicated patient escorts are available upon request.",
    ],
  },
  {
    icon: FileText,
    title: "Medical Records & Prescriptions",
    items: [
      "All consultations and prescription records are automatically archived in your Patient Portal.",
      "Diagnostic test results can be viewed online or collected directly from the pathology counter.",
      "Discharge summaries and certificates are handed over upon consultation completion.",
    ],
  },
  {
    icon: Clock,
    title: "Rescheduling & Cancellations",
    items: [
      "You can cancel or reschedule appointments anytime without cancellation charges.",
      "Simply sign in to the Patient Portal to change your doctor or appointment timing.",
      "For urgent same-day shifts, contact our 24/7 hospital helpline: +92 300 1234567.",
    ],
  },
];

export default function PatientsGuidePage() {
  return (
    <div className="min-h-screen bg-[#070D18] text-white py-14">
      <div className="container-page">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-bold text-cyan-300">
            <Sparkles size={14} className="text-cyan-300" />
            Patient Care & Guidance
          </span>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">
            Patient Guidelines & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">Visitor Protocols</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Everything you need to know before visiting MEHR HOSPITAL. Our priority is to ensure your visit is organized, comfortable, and stress-free.
          </p>
        </div>

        {/* Guidelines Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {guidelines.map(({ icon: Icon, title, items }) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-[#0C1527] p-7 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-400 text-slate-950 font-black">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-black text-white">{title}</h3>
              </div>

              <ul className="mt-5 space-y-3">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle2 size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Appointment CTA */}
        <div className="mt-12 rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-cyan-950/60 via-[#0B1528] to-cyan-950/40 p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-2xl">
          <div>
            <h3 className="text-2xl font-black text-white">Need to Schedule an Appointment?</h3>
            <p className="mt-1 text-xs text-slate-300">
              Browse specialist doctors, check availability, and receive your token in 60 seconds.
            </p>
          </div>
          <div className="mt-5 sm:mt-0 flex flex-wrap gap-3">
            <Link href="/appointments">
              <Button variant="lime" size="md">
                <CalendarCheck size={16} /> Book Appointment Online
              </Button>
            </Link>
            <a href="tel:+923001234567">
              <Button variant="outline" size="md">
                <PhoneCall size={16} /> 24/7 Helpline
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
