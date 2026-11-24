import { AuthForm } from "@/components/auth-form";
import { HeartPulse, ShieldCheck, Activity, Award, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      className="relative isolate min-h-[85vh] overflow-hidden bg-[#07111e] bg-cover bg-center py-14 text-white sm:py-20"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(7,17,30,.97) 0%, rgba(7,17,30,.9) 54%, rgba(7,17,30,.76) 100%), url('https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=65')",
      }}
    >
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Information Column */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-4 py-2 text-xs font-bold text-cyan-200 backdrop-blur-md">
            <HeartPulse size={15} className="text-cyan-300" />
            MEHR HOSPITAL CLINICAL PORTAL
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
            Welcome Back
          </p>

          <h1 className="mt-3 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">
            Your Health Journey,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-300">
              Connected.
            </span>
          </h1>

          <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
            Access your upcoming OPD consultations, review test findings, download medical passes, or manage clinic schedules with our encrypted healthcare platform.
          </p>

          {/* Trust Highlights */}
          <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-md">
              <ShieldCheck size={18} className="text-cyan-400 shrink-0" />
              <span>HIPAA Compliant Data Security</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-md">
              <Stethoscope size={18} className="text-cyan-400 shrink-0" />
              <span>Instant OPD Token Access</span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
            <Award size={15} className="text-cyan-300" />
            <span>Serving over 120,000 satisfied patients across the community.</span>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full max-w-lg mx-auto">
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  );
}
