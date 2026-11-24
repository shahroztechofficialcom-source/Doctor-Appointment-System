"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Brain,
  Activity,
  ScanFace,
  Baby,
  Eye,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Microscope,
  Ambulance,
  Pill,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const departments = [
  {
    name: "Cardiology",
    title: "Heart & Vascular Care",
    desc: "Complete cardiac care, 24/7 emergency angiography, 2D Echocardiography, post-infarction rehabilitation, and hypertension clinics.",
    icon: HeartPulse,
    color: "from-cyan-500/20 to-cyan-500/10",
    border: "border-cyan-500/30",
    textAccent: "text-cyan-400",
    features: ["Coronary Angiography", "Echocardiogram (Echo)", "Hypertension Clinic", "Pacemaker Follow-up"],
    category: "Cardiology",
  },
  {
    name: "Neurology",
    title: "Brain, Spine & Nerve Clinic",
    desc: "Expert diagnosis and neuro-rehabilitation for migraine, epilepsy, stroke, peripheral neuropathy, and tremors.",
    icon: Brain,
    color: "from-cyan-500/20 to-cyan-500/10",
    border: "border-cyan-500/30",
    textAccent: "text-cyan-400",
    features: ["Stroke Recovery Protocol", "Epilepsy Management", "EMG / NCS Evaluation", "Migraine Clinic"],
    category: "Neurology",
  },
  {
    name: "Orthopedic",
    title: "Bone & Joint Surgery",
    desc: "Joint reconstruction, arthroscopic knee surgeries, fracture fixation, sports injury rehabilitation, and arthritis therapies.",
    icon: Activity,
    color: "from-cyan-500/20 to-cyan-500/10",
    border: "border-cyan-500/30",
    textAccent: "text-cyan-400",
    features: ["Total Knee Replacement", "Sports Ligament Repair", "Spine Pain Therapy", "Trauma Fracture Unit"],
    category: "Orthopedic",
  },
  {
    name: "Dermatology",
    title: "Skin Health & Cosmetology",
    desc: "Advanced aesthetic skincare, medical dermatology, chemical peels, chronic psoriasis management, and laser treatments.",
    icon: ScanFace,
    color: "from-cyan-500/20 to-cyan-500/10",
    border: "border-cyan-500/30",
    textAccent: "text-cyan-400",
    features: ["Laser Skin Therapy", "Acne & Scar Rejuvenation", "PRP Hair Restoration", "Eczema Treatment"],
    category: "Dermatology",
  },
  {
    name: "Pediatrics",
    title: "Child & Neonatal Care",
    desc: "Family-centered infant and child medicine. Routine vaccinations, developmental milestones tracking, and newborn care.",
    icon: Baby,
    color: "from-cyan-500/20 to-cyan-500/10",
    border: "border-cyan-500/30",
    textAccent: "text-cyan-400",
    features: ["Neonatal Intensive Care", "Immunization Schedules", "Child Nutrition Counseling", "Pediatric Asthma"],
    category: "Pediatrics",
  },
  {
    name: "General Medicine",
    title: "Internal Medicine & Diabetes",
    desc: "Primary consultations, chronic diabetes profiling, cholesterol and metabolic care, and full adult body checkups.",
    icon: ShieldCheck,
    color: "from-cyan-500/20 to-cyan-500/10",
    border: "border-cyan-500/30",
    textAccent: "text-cyan-400",
    features: ["Diabetes Management", "Full Body Checkup", "Infectious Diseases", "Cardio-Metabolic Care"],
    category: "General Medicine",
  },
  {
    name: "Ophthalmology",
    title: "Eye Surgery & Vision Care",
    desc: "Cataract phacoemulsification, glaucoma assessment, optical refraction, and diabetic retinal screenings.",
    icon: Eye,
    color: "from-cyan-500/20 to-cyan-500/10",
    border: "border-cyan-500/30",
    textAccent: "text-cyan-400",
    features: ["Phaco Cataract Surgery", "Glaucoma Screening", "Refractive Vision Care", "Diabetic Retinopathy"],
    category: "Ophthalmology",
  },
  {
    name: "Gynecology",
    title: "Women's Health & Maternity",
    desc: "Comprehensive obstetrics, high-risk pregnancy monitoring, minimally invasive laparoscopy, and PCOS wellness.",
    icon: Sparkles,
    color: "from-cyan-500/20 to-cyan-500/10",
    border: "border-cyan-500/30",
    textAccent: "text-cyan-400",
    features: ["High-Risk Pregnancy", "PCOS Clinical Protocol", "Antenatal Checkups", "Women's Wellness"],
    category: "Gynecology",
  },
];

export default function ServicesPage() {
  const [selectedDept, setSelectedDept] = useState("All");

  const filtered = selectedDept === "All"
    ? departments
    : departments.filter((d) => d.category === selectedDept);

  return (
    <div className="min-h-screen bg-[#070D18] text-white py-14">
      <div className="container-page">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-bold text-cyan-300">
            <Sparkles size={14} className="text-cyan-300" /> Clinical Excellence
          </span>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">
            Specialized <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">Clinical Departments</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Our specialized medical units offer modern operating theaters, rapid diagnostics, and senior consultants dedicated to personalized patient recovery.
          </p>

          {/* Quick filter tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedDept("All")}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                selectedDept === "All"
                  ? "bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-400/20"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              All Specialties
            </button>
            {departments.map((d) => (
              <button
                key={d.name}
                onClick={() => setSelectedDept(d.category)}
                className={`rounded-2xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                  selectedDept === d.category
                    ? "bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-400/20"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Departments Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.name}
                className={`rounded-3xl border ${dept.border} bg-gradient-to-b ${dept.color} p-7 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10`}
              >
                <div className="flex items-center justify-between">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-white/10 ${dept.textAccent}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {dept.name}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-black text-white">{dept.title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-300">{dept.desc}</p>

                <div className="mt-5 border-t border-white/10 pt-4 space-y-1.5">
                  {dept.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <CheckCircle2 size={13} className={dept.textAccent} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <Link href={`/doctors?category=${dept.category}`}>
                    <Button variant="lime" size="sm">
                      Find Specialists <ArrowRight size={13} />
                    </Button>
                  </Link>
                  <Link
                    href={`/appointments`}
                    className="text-xs font-bold text-cyan-300 hover:underline"
                  >
                    Direct Booking →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hospital Ancillary Units */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-[#0C1527] p-8 shadow-2xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">24/7 Facilities</span>
            <h2 className="mt-2 text-2xl font-black text-white">Diagnostics & Critical Care Support</h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {[
              { title: "Trauma & ICU", desc: "Round-the-clock emergency surgical resuscitation.", icon: Ambulance },
              { title: "Pathology Lab", desc: "Automated hematology, biochemistry, and PCR.", icon: Microscope },
              { title: "24/7 Pharmacy", desc: "Authentic medicines and temperature-controlled storage.", icon: Pill },
              { title: "Digital Radiology", desc: "High-resolution X-Ray, Ultrasound, and CT Scan.", icon: Stethoscope },
            ].map(({ title, desc, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400 text-slate-950 font-black mb-3">
                  <Icon size={22} />
                </div>
                <h4 className="font-bold text-sm text-white">{title}</h4>
                <p className="text-xs text-slate-400 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
