"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Stethoscope,
  CalendarCheck,
  Bot,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { doctors, money } from "@/lib/doctors";

type Message = {
  id: string;
  from: "bot" | "user";
  text: string;
  action?: { label: string; href: string };
};

export function MediBot() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [msgs, setMsgs] = useState<Message[]>([
    {
      id: "1",
      from: "bot",
      text: "👋 Assalam-o-Alaikum! I'm MediBot, your 24/7 AI health assistant at MEHR HOSPITAL.\n\nHow can I assist you today? You can ask about our specialist doctors, OPD timings, consultation fees, or book an appointment right now!",
    },
  ]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs, open]);

  useEffect(() => {
    const openAssistant = () => setOpen(true);
    window.addEventListener("mehr-open-medi-bot", openAssistant);
    return () => window.removeEventListener("mehr-open-medi-bot", openAssistant);
  }, []);

  function reply(raw: string) {
    const q = raw.toLowerCase().trim();
    const userMsg: Message = { id: crypto.randomUUID(), from: "user", text: raw };
    setMsgs((m) => [...m, userMsg]);
    setValue("");
    setIsTyping(true);

    setTimeout(() => {
      let botText = "I can guide you regarding our doctors, fees, OPD timings, or help you book an appointment. Pick a quick option below or type your question.";
      let action: { label: string; href: string } | undefined = undefined;

      if (q.includes("cardio") || q.includes("heart") || q.includes("dil")) {
        const doc = doctors.find((d) => d.category === "Cardiology") || doctors[0];
        botText = `❤️ Cardiology Specialist: ${doc.name} (${doc.qualification})\n• Fee: ${money(doc.fee)}\n• Shift: ${doc.shift} (${doc.timing})\n• Working Days: ${doc.days.join(", ")}`;
        action = { label: `Book with ${doc.name.split(" ")[1]}`, href: `/appointments?doctor=${doc.id}` };
      } else if (q.includes("neuro") || q.includes("brain") || q.includes("dimagh")) {
        const doc = doctors.find((d) => d.category === "Neurology");
        if (doc) {
          botText = `🧠 Neurology Specialist: ${doc.name} (${doc.qualification})\n• Fee: ${money(doc.fee)}\n• Shift: ${doc.shift} (${doc.timing})\n• Days: ${doc.days.join(", ")}`;
          action = { label: `Book Consultation`, href: `/appointments?doctor=${doc.id}` };
        }
      } else if (q.includes("ortho") || q.includes("bone") || q.includes("haddi") || q.includes("joint")) {
        const doc = doctors.find((d) => d.category === "Orthopedic");
        if (doc) {
          botText = `🦴 Orthopedic Specialist: ${doc.name}\n• Fee: ${money(doc.fee)}\n• Shift: ${doc.shift} (${doc.timing})\n• Days: ${doc.days.join(", ")}`;
          action = { label: `Book with Dr. Shahroz`, href: `/appointments?doctor=${doc.id}` };
        }
      } else if (q.includes("skin") || q.includes("derma") || q.includes("jild")) {
        const doc = doctors.find((d) => d.category === "Dermatology");
        if (doc) {
          botText = `✨ Dermatology Specialist: ${doc.name} (${doc.qualification})\n• Fee: ${money(doc.fee)}\n• Shift: ${doc.shift} (${doc.timing})\n• Days: ${doc.days.join(", ")}`;
          action = { label: `Book Skin Consult`, href: `/appointments?doctor=${doc.id}` };
        }
      } else if (q.includes("child") || q.includes("pedi") || q.includes("bacha") || q.includes("baby")) {
        const doc = doctors.find((d) => d.category === "Pediatrics");
        if (doc) {
          botText = `👶 Pediatrics Specialist: ${doc.name} (${doc.qualification})\n• Fee: ${money(doc.fee)}\n• Shift: ${doc.shift} (${doc.timing})\n• Days: ${doc.days.join(", ")}`;
          action = { label: `Book Pediatrician`, href: `/appointments?doctor=${doc.id}` };
        }
      } else if (q.includes("fee") || q.includes("fees") || q.includes("cost") || q.includes("price") || q.includes("charges")) {
        botText = `💰 Transparent Consultation Fees at MEHR HOSPITAL:\n\n` +
          doctors.map((d) => `• ${d.name} (${d.specialty}): ${money(d.fee)}`).join("\n");
        action = { label: "View Doctor Directory", href: "/doctors" };
      } else if (q.includes("time") || q.includes("timing") || q.includes("schedule") || q.includes("shift") || q.includes("waqt")) {
        botText = `⏰ Doctor OPD Shifts & Timings:\n\n` +
          doctors.map((d) => `• ${d.name}: ${d.timing} (${d.shift}) [${d.days.join(", ")}]`).join("\n");
        action = { label: "Filter by Shift & Timings", href: "/doctors" };
      } else if (q.includes("emergency") || q.includes("ambulance") || q.includes("urgent")) {
        botText = `🚨 24/7 Emergency & Trauma Response:\nOur emergency department and ICU are active 24 hours a day, 7 days a week. You do NOT need prior appointment for emergencies.\n\nHelpline: +92 300 1234567`;
        action = { label: "Call Emergency Dispatch", href: "tel:+923001234567" };
      } else if (q.includes("book") || q.includes("appointment") || q.includes("visit")) {
        botText = `📅 Booking an appointment takes under 60 seconds:\n1. Choose Doctor & Medical Specialty\n2. Select Date & Slot\n3. Provide Patient Information\n4. Confirm Instant Booking!`;
        action = { label: "Open Appointment Booking", href: "/appointments" };
      } else if (q.includes("doctor") || q.includes("specialist") || q.includes("team")) {
        botText = `👨‍⚕️ We have top specialists across Cardiology, Neurology, Orthopedics, Dermatology, Pediatrics, General Medicine, Ophthalmology, and Gynecology.\nAll doctors are PMDC certified with 8-15+ years of clinical experience.`;
        action = { label: "Explore All Doctors", href: "/doctors" };
      }

      setMsgs((m) => [...m, { id: crypto.randomUUID(), from: "bot", text: botText, action }]);
      setIsTyping(false);
    }, 450);
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full border border-cyan-100/60 bg-gradient-to-r from-cyan-200 via-cyan-300 to-cyan-400 px-5 py-3.5 font-black text-slate-950 shadow-[0_12px_40px_rgba(34,211,238,0.32)] cursor-pointer"
        aria-label="Open MediBot AI Assistant"
      >
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-slate-950/10">
          <Bot size={19} />
          <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-cyan-300 bg-cyan-500" />
        </span>
        <span className="hidden text-left sm:inline">
          <span className="block text-xs font-extrabold uppercase tracking-wider">MediBot</span>
          <span className="block text-[10px] font-semibold opacity-70">Here to help</span>
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed bottom-24 right-4 z-50 flex h-[min(650px,calc(100dvh-8rem))] w-[min(410px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[28px] border border-cyan-300/20 bg-[#071426] text-slate-100 shadow-[0_28px_90px_rgba(2,20,36,0.55)] [html.light-mode_&]:border-white/80 [html.light-mode_&]:bg-[#f7fbfc] [html.light-mode_&]:text-slate-800"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-br from-[#082f49] via-[#0e7490] to-[#0e7490] p-4 text-white">
              <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full border border-white/10 bg-white/5" />
              <div className="pointer-events-none absolute -bottom-12 right-20 h-28 w-28 rounded-full border border-white/10" />
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="relative grid h-11 w-11 place-items-center rounded-2xl border border-white/25 bg-white/15 text-white shadow-lg backdrop-blur"
                >
                  <Stethoscope size={20} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-cyan-700 bg-cyan-300" />
                </motion.div>
                <div className="relative">
                  <div className="flex items-center gap-1.5">
                    <b className="text-base font-extrabold tracking-tight text-white">MediBot</b>
                    <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-cyan-50">
                      HEALTH ASSISTANT
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-cyan-50/80">
                    Ask us about care at Mehr Hospital
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="relative rounded-full border border-white/20 bg-white/10 p-2 text-white/80 transition hover:rotate-90 hover:bg-white/20 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.11),_transparent_60%)] p-4 scrollbar-thin [html.light-mode_&]:bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.08),_transparent_60%)]">
              {msgs.map((m, index) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.24, delay: Math.min(index * 0.025, 0.15) }}
                  className={`flex flex-col ${
                    m.from === "bot" ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                      m.from === "bot"
                        ? "rounded-tl-md border border-white/10 bg-[#0d2035] text-slate-200 shadow-[0_5px_18px_rgba(2,8,23,0.25)] [html.light-mode_&]:border-slate-200/80 [html.light-mode_&]:bg-white [html.light-mode_&]:text-slate-700"
                        : "rounded-tr-md bg-gradient-to-br from-cyan-600 to-cyan-600 font-semibold text-white shadow-[0_8px_20px_rgba(34,211,238,0.2)]"
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.action && (
                    <Link
                      href={m.action.href}
                      onClick={() => setOpen(false)}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-cyan-200 bg-white px-3 py-2 text-xs font-bold text-cyan-800 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-50"
                    >
                      <CalendarCheck size={13} className="text-cyan-600" />
                      {m.action.label}
                      <ChevronRight size={13} />
                    </Link>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500 shadow-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] ml-1">MediBot is typing...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips */}
            <div className="border-t border-white/10 bg-[#091729] px-3 py-2.5 [html.light-mode_&]:border-slate-200/80 [html.light-mode_&]:bg-white">
              <div className="flex flex-wrap gap-1.5">
                {[
                  "📅 Book Appointment",
                  "❤️ Heart Specialist",
                  "🧠 Neurologist",
                  "✨ Skin Specialist",
                  "💰 Check Doctor Fees",
                  "⏰ OPD Timings",
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => reply(chip)}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 transition hover:border-cyan-300/70 hover:bg-cyan-500/10 hover:text-cyan-200 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-50 [html.light-mode_&]:text-slate-600 [html.light-mode_&]:hover:bg-cyan-50 [html.light-mode_&]:hover:text-cyan-800"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (value.trim()) reply(value.trim());
              }}
              className="flex items-center gap-2 border-t border-white/10 bg-[#091729] p-3 [html.light-mode_&]:border-slate-200/80 [html.light-mode_&]:bg-white"
            >
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask doctor fee, timings, appointment..."
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white/[0.09] focus:ring-4 focus:ring-cyan-500/10 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-50 [html.light-mode_&]:text-slate-800 [html.light-mode_&]:focus:bg-white"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-600 text-white shadow-md shadow-cyan-700/20 transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
