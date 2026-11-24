import Link from "next/link";
import {
  HeartHandshake,
  ShieldCheck,
  Users,
  Building2,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070D18] text-white py-14">
      <div className="container-page">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-bold text-cyan-300">
            <Sparkles size={14} className="text-cyan-300" />
            Healthcare with Integrity
          </span>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">MEHR HOSPITAL</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Founded with a commitment to compassionate healthcare, MEHR HOSPITAL blends modern diagnostic equipment, senior clinical consultants, and a patient-first ethos.
          </p>
        </div>

        {/* Story Section */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2 items-center">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-cyan-400/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=85"
                alt="Mehr Hospital doctors consulting together"
                className="h-[380px] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 rounded-2xl border border-white/20 bg-[#0C1527] p-4 text-white shadow-xl backdrop-blur-xl hidden sm:block">
              <b className="text-2xl font-black text-cyan-300">14+ Years</b>
              <p className="text-xs text-slate-300">Of Community Healthcare Trust</p>
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              Our Clinical Philosophy & Mission
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              At MEHR HOSPITAL, we believe that true clinical excellence begins with listening to the patient. Every department is organized to minimize waiting times, maintain absolute clinical transparency, and provide world-class medical consultation at accessible fees.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: HeartHandshake, title: "Compassionate Care", desc: "Patient dignity at every step" },
                { icon: ShieldCheck, title: "PMDC Approved", desc: "100% verified clinicians" },
                { icon: Award, title: "ISO 9001 Certified", desc: "International standard protocols" },
                { icon: Building2, title: "500+ Bed Hospital", desc: "Fully equipped inpatient & ICU" },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md"
                >
                  <Icon className="text-cyan-400 mb-2" size={20} />
                  <strong className="block text-xs font-bold text-white">{title}</strong>
                  <span className="text-[11px] text-slate-400">{desc}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex gap-3">
              <Link href="/doctors">
                <Button variant="lime">
                  <Stethoscope size={15} /> Meet Our Doctors
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">
                  Contact Management
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
