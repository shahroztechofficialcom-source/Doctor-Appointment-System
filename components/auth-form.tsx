"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserRound,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  Stethoscope,
  Activity,
  Zap,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUsers, saveUsers, setSession, User } from "@/lib/storage";
import { showIosNotification } from "@/components/ios-notification";

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

const destination = (role: User["role"]) =>
  role === "Admin" ? "/admin" : role === "Doctor" ? "/doctor" : "/patient";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const role: "Patient" = "Patient";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  const handleDemoLogin = (role: "Patient" | "Doctor" | "Admin") => {
    const demoAccounts: Record<string, User> = {
      Patient: { name: "Mehr Patient", email: "patient@mehr.com", role: "Patient", phone: "+92 300 1234567" },
      Doctor: { name: "Dr. Afzal Bashir", email: "doctor@mehr.com", role: "Doctor", phone: "+92 300 7654321" },
      Admin: { name: "Hospital Director", email: "admin@mehr.com", role: "Admin", phone: "+92 42 35789000" },
    };

    const targetUser = demoAccounts[role];
    setSession(targetUser);

    showIosNotification({
      title: `Signed in as ${role}`,
      message: `Welcome to the ${role} Management Portal`,
      type: "success",
    });

    router.replace(destination(targetUser.role));
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStatusMessage("");
    setBusy(true);

    try {
      const mail = email.trim().toLowerCase();
      const users = getUsers();

      if (isSignup) {
        if (name.trim().length < 2) {
          setError("Please enter your full name.");
          return;
        }
        if (password.length < 6) {
          setError("Use a password with at least 6 characters.");
          return;
        }
        if (
          users.some((u) => u.email === mail) ||
          ["patient@mehr.com", "doctor@mehr.com", "admin@mehr.com"].includes(mail)
        ) {
          setError("An account with this email already exists. Please sign in.");
          return;
        }

        const newUser: User = {
          name: name.trim(),
          email: mail,
          phone: phone.trim() || "+92 300 0000000",
          role,
          passwordHash: await hashPassword(password),
          approvalStatus: "Approved",
        };

        saveUsers([...users, newUser]);
        setSession({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          approvalStatus: newUser.approvalStatus,
        });

        // Trigger iPhone Dynamic Island Notification!
        showIosNotification({
          title: "Account Created Successfully",
          message: `Welcome to Mehr Hospital, ${newUser.name.split(" ")[0]}!`,
          type: "success",
          duration: 5000,
        });

        router.replace("/patient");
      } else {
        const demo: Record<string, User> = {
          "patient@mehr.com": { name: "Mehr Patient", email: mail, role: "Patient" },
          "doctor@mehr.com": { name: "Dr. Afzal Bashir", email: mail, role: "Doctor" },
          "admin@mehr.com": { name: "Hospital Director", email: mail, role: "Admin" },
        };

        const existingUser = users.find((u) => u.email === mail);

        if (demo[mail] && password === "123456") {
          setSession(demo[mail]);
          showIosNotification({
            title: "Signed In Successfully",
            message: `Logged in as ${demo[mail].name} (${demo[mail].role})`,
            type: "success",
          });
          router.replace(destination(demo[mail].role));
        } else if (existingUser?.passwordHash && existingUser.passwordHash === (await hashPassword(password))) {
          if (existingUser.role === "Doctor" && existingUser.approvalStatus !== "Approved") {
            setError(
              existingUser.approvalStatus === "Rejected"
                ? "Your doctor application was not approved. Please contact the hospital admin."
                : "Your doctor application is still awaiting admin approval."
            );
            return;
          }
          setSession({
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            phone: existingUser.phone,
            approvalStatus: existingUser.approvalStatus,
            doctorId: existingUser.doctorId,
          });
          showIosNotification({
            title: "Signed In Successfully",
            message: `Welcome back, ${existingUser.name}!`,
            type: "success",
          });
          router.replace(destination(existingUser.role));
        } else {
          setError("Email or password is incorrect. New accounts require the password used at signup.");
        }
      }
    } catch {
      setError("An error occurred during authentication. Please retry.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-[#0C1527]/95 p-7 sm:p-9 text-white shadow-2xl backdrop-blur-2xl"
    >
      {/* Neon corner glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-20 h-52 w-52 rounded-full bg-cyan-400/15 blur-3xl" />

      {/* Form Header */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 font-black shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            <Sparkles size={22} />
          </div>
          <span className="rounded-full border border-cyan-400/30 bg-cyan-950/40 px-3 py-1 text-[11px] font-bold text-cyan-300">
            {isSignup ? "Patient & Doctor Registration" : "Secure Authentication"}
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
          {isSignup ? "Create Your Account" : "Welcome Back"}
        </h2>
        <p className="mt-1.5 text-xs leading-5 text-slate-300">
          {isSignup
            ? "Create a patient account to book appointments and manage your care."
            : "Sign in with your email or use one of our instant 1-click demo profiles."}
        </p>

        {/* 1-Click Instant Demo Access (Super useful for user evaluation!) */}
        {!isSignup && (
          <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                <Zap size={12} className="text-cyan-300" /> Instant 1-Click Demo Logins
              </span>
              <span className="text-[10px] text-slate-400">Pass: 123456</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("Patient")}
                className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-bold text-slate-200 hover:border-cyan-400 hover:bg-cyan-500/20 transition cursor-pointer"
              >
                <UserRound size={14} className="text-cyan-400 mb-0.5" />
                Patient
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("Doctor")}
                className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-bold text-slate-200 hover:border-cyan-300 hover:bg-cyan-400/20 transition cursor-pointer"
              >
                <Stethoscope size={14} className="text-cyan-300 mb-0.5" />
                Doctor
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("Admin")}
                className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-bold text-slate-200 hover:border-cyan-400 hover:bg-cyan-500/20 transition cursor-pointer"
              >
                <ShieldCheck size={14} className="text-cyan-400 mb-0.5" />
                Admin
              </button>
            </div>
          </div>
        )}

        {/* Main Form Fields */}
        <form onSubmit={submit} className="mt-5 space-y-4">
          {isSignup && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <UserRound className="absolute left-3.5 top-3 text-cyan-400" size={16} />
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-cyan-400" size={16} />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full rounded-2xl border border-white/15 bg-white/5 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {isSignup && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Phone / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 text-cyan-300" size={16} />
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <LockKeyhole className="absolute left-3.5 top-3 text-cyan-400" size={16} />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? "Min 6 characters" : "Enter password (or 123456)"}
                className="w-full rounded-2xl border border-white/15 bg-white/5 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-500/30 bg-slate-950/50 p-3 text-xs text-slate-300"
            >
              {error}
            </motion.p>
          )}

          {statusMessage && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-3 text-xs text-cyan-200"
            >
              {statusMessage}
            </motion.p>
          )}

          {/* Glowing Submit Button */}
          <Button
            type="submit"
            disabled={busy}
            variant="lime"
            className="w-full py-3.5 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_30px_rgba(34,211,238,0.65)]"
          >
            {busy ? "Processing..." : isSignup ? "Create Patient Account" : "Sign In Securely"}
            <ArrowRight size={16} />
          </Button>

          {/* Toggle between Login and Signup */}
          <p className="text-center text-xs text-slate-400 pt-2">
            {isSignup ? "Already have an account?" : "Need a new patient profile?"}{" "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-bold text-cyan-300 hover:underline"
            >
              {isSignup ? "Sign in here" : "Register now"}
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
}
