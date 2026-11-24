"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { showIosNotification } from "@/components/ios-notification";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    showIosNotification({
      title: "Message Delivered",
      message: "Thank you! Our hospital helpdesk will contact you shortly.",
      type: "success",
    });

    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
  };

  const handleCopyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("123 Health Avenue, Medical City, Main Boulevard, Pakistan");
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-white py-14">
      <div className="container-page">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-bold text-cyan-300">
            <Sparkles size={14} className="text-cyan-300" />
            24/7 Patient Assistance
          </span>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">
            Get in Touch with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">MEHR HOSPITAL</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Have questions regarding OPD consultations, specialized treatments, or emergency care? Our medical coordination desk is available 24/7.
          </p>
        </div>

        {/* Contact Information & Form Grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          {/* Left Details Card */}
          <div className="rounded-3xl border border-white/10 bg-[#0C1527] p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <div>
              <h3 className="text-xl font-black text-white">Hospital Locations & Helpdesk</h3>
              <p className="mt-1 text-xs text-slate-400">
                Direct contact lines for general inquiries, appointments, and emergency dispatch.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <MapPin className="text-cyan-400 shrink-0 mt-0.5" size={18} />
                <div className="flex-1">
                  <strong className="block text-white mb-0.5">Hospital Address</strong>
                  <p>123 Health Avenue, Medical City, Main Boulevard</p>
                  <button
                    onClick={handleCopyAddress}
                    className="mt-2 inline-flex items-center gap-1 font-bold text-cyan-400 hover:underline"
                  >
                    {copiedAddress ? <Check size={12} className="text-cyan-400" /> : <Copy size={12} />}
                    {copiedAddress ? "Address Copied" : "Copy Address"}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Phone className="text-cyan-300 shrink-0 mt-0.5" size={18} />
                <div className="flex-1">
                  <strong className="block text-white mb-0.5">Emergency Helpline (24/7)</strong>
                  <a href="tel:+923001234567" className="font-bold text-cyan-300 hover:underline">
                    +92 300 1234567
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">General OPD: +92 42 35789000</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Mail className="text-cyan-400 shrink-0 mt-0.5" size={18} />
                <div className="flex-1">
                  <strong className="block text-white mb-0.5">Official Inquiries</strong>
                  <a href="mailto:care@mehrhospital.pk" className="text-cyan-300 hover:underline">
                    care@mehrhospital.pk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Clock className="text-cyan-300 shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="block text-white mb-0.5">OPD & Visiting Hours</strong>
                  <p>Morning Shift: 9:00 AM – 2:00 PM</p>
                  <p>Evening Shift: 4:00 PM – 9:00 PM</p>
                  <p className="text-cyan-400 font-bold mt-1">● Emergency Open 24 Hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Message Form */}
          <div className="rounded-3xl border border-cyan-400/30 bg-[#0C1527] p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xl font-black text-white">Send Us a Direct Message</h3>
            <p className="mt-1 text-xs text-slate-400">
              Submit your inquiry and our patient desk will reply promptly.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Your Full Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Phone Number</label>
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Subject</label>
                  <input
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="OPD Consultation, Tests, etc."
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our clinical team help you today?"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <Button type="submit" variant="lime" className="w-full py-3">
                <Send size={15} /> Send Message to Helpdesk
              </Button>

              {submitted && (
                <p className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-3 text-xs text-cyan-300">
                  ✓ Thank you! Your inquiry has been submitted to the Mehr Hospital desk.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
