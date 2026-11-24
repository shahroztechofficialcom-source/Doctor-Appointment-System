import { AuthForm } from "@/components/auth-form";
import { HeartPulse, ShieldCheck, UserPlus, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
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
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-950/40 px-4 py-2 text-xs font-bold text-cyan-200 backdrop-blur-md">
            <UserPlus size={15} />
            PATIENT & DOCTOR REGISTRATION
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
            Start Your Care Today
          </p>

          <h1 className="mt-3 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">
            Register in Seconds,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-300 to-cyan-400">
              Heal with Trust.
            </span>
          </h1>

          <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
            Create a patient profile to manage appointments, prescriptions, and records. Doctors can submit their credentials for admin review before their profile is published.
          </p>

          {/* Benefits list */}
          <div className="mt-8 space-y-3 text-xs sm:text-sm text-slate-300">
            {[
              "Instant confirmation for doctor consultations",
              "Access digital prescriptions and diagnostic lab slips",
              "Exclusive reminders and hospital emergency assistance",
              "Receive iPhone-style real-time status notifications",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full max-w-lg mx-auto">
          <AuthForm mode="signup" />
        </div>
      </div>
    </div>
  );
}
