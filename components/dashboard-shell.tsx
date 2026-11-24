"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CalendarDays, FileText, UserRound, LayoutDashboard, Users, Stethoscope, LogOut, ClipboardList, Clock, ShieldCheck, Bot, Bell, Search, Menu, X, ChevronRight, Sun, Moon } from "lucide-react";
import { getSession, getUsers, setSession, User } from "@/lib/storage";
import { HospitalLogo } from "@/components/logo";
import { showIosNotification } from "@/components/ios-notification";

const menu = {
  Patient: [
    { label: "Overview", href: "/patient", icon: LayoutDashboard },
    { label: "Appointments", href: "/patient#appointments", icon: CalendarDays },
    { label: "Medical Records", href: "/patient#records", icon: FileText },
    { label: "Prescriptions", href: "/patient#prescriptions", icon: ClipboardList },
  ],
  Doctor: [
    { label: "Clinical Overview", href: "/doctor", icon: LayoutDashboard },
    { label: "Patient Requests", href: "/doctor#patients", icon: Users },
  ],
  Admin: [
    { label: "Hospital Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Doctor Approvals", href: "/admin#doctor-approvals", icon: ShieldCheck },
    { label: "Doctors Directory", href: "/admin#doctors", icon: Stethoscope },
  ],
} as const;

export function DashboardShell({ role, children }: { role: "Patient" | "Doctor" | "Admin"; children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    const u = getSession();
    const isApprovedDoctor = u?.role !== "Doctor" || u.email === "doctor@mehr.com" || getUsers().some((account) => account.email === u.email && account.role === "Doctor" && account.approvalStatus === "Approved" && Boolean(account.doctorId));
    const canAccess = Boolean(u && u.role === role && isApprovedDoctor);
    setUser(canAccess ? u : null);
    if (!canAccess) router.replace("/login");
    const light = localStorage.getItem("mehr_theme") === "light";
    setLightMode(light);
    document.documentElement.classList.toggle("light-mode", light);
  }, [role, router]);

  const handleLogout = () => {
    setSession(null);
    showIosNotification({ title: "Signed Out", message: "You have been safely signed out.", type: "info" });
    router.push("/login");
  };
  const toggleTheme = () => {
    const next = !lightMode;
    setLightMode(next);
    localStorage.setItem("mehr_theme", next ? "light" : "dark");
    document.documentElement.classList.toggle("light-mode", next);
  };

  if (!user || user.role !== role) return <div className="min-h-[70vh] bg-[#070D18] grid place-items-center text-white"><div><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"/><p className="mt-4 text-xs font-bold text-slate-400">Verifying secure session...</p></div></div>;

  const portalLabel = role === "Patient" ? "Patient Care" : role === "Doctor" ? "Clinical Workspace" : "Hospital Control";
  const portalLinks = menu[role];
  const sidebar = (mobile = false) => (
    <>
      <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6">
        <Link href="/" className="rounded-lg bg-[#0B1628] px-2 py-1"><HospitalLogo size="sm"/></Link>
        {mobile && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10"><X size={19}/></button>}
      </div>
      <div className="px-4 pt-5"><p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{portalLabel}</p>
        <nav className="mt-3 space-y-1.5">{portalLinks.map(({label,href,icon:Icon},index) => {
          const targetHash = href.split("#")[1];
          const isActive = targetHash
            ? pathname === href.split("#")[0] && activeHash === `#${targetHash}`
            : pathname === href && !activeHash && index === 0;
          return <Link key={label} href={href} onClick={() => setMobileOpen(false)} className={`group flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-bold transition-all ${isActive ? "bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/25 shadow-[0_0_24px_rgba(34,211,238,.08)]" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"}`}><span className="flex items-center gap-3"><Icon size={17} className={isActive?"text-cyan-300":"text-slate-500 group-hover:text-cyan-300"}/>{label}</span>{isActive&&<ChevronRight size={14} className="text-cyan-300"/>}</Link>;
        })}</nav>
      </div>
      <div className="mt-auto p-4">
        <button type="button" onClick={() => { window.dispatchEvent(new Event("mehr-open-medi-bot")); setMobileOpen(false); }} className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-cyan-400/[0.04] p-3 text-left transition hover:border-cyan-300/50 hover:shadow-[0_0_24px_rgba(34,211,238,.1)]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300"><Bot size={18}/></span><span><b className="block text-xs text-white">AI Health Assistant</b><span className="text-[10px] text-slate-400">Care guidance and booking help</span></span></button>
        <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.06] hover:text-cyan-100"><LogOut size={15}/> Log Out</button>
      </div>
    </>
  );

  return <div className="min-h-screen bg-[#070D18] text-white [html.light-mode_&]:bg-slate-50 [html.light-mode_&]:text-slate-900">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col border-r border-white/10 bg-[#0B1324] lg:flex [html.light-mode_&]:bg-white [html.light-mode_&]:border-slate-200">{sidebar()}</aside>
    <header className="fixed left-0 right-0 top-0 z-30 flex h-[76px] items-center border-b border-white/10 bg-[#070D18]/90 px-4 backdrop-blur-xl lg:left-[272px] lg:px-8 [html.light-mode_&]:bg-white/90 [html.light-mode_&]:border-slate-200">
      <button type="button" aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="mr-3 grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-300 hover:border-cyan-300/40 lg:hidden"><Menu size={19}/></button>
      <div className="relative hidden max-w-md flex-1 sm:block"><Search className="absolute left-3.5 top-2.5 text-slate-500" size={17}/><input className="w-full rounded-xl border border-white/10 bg-white/[0.035] py-2.5 pl-10 pr-4 text-xs text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60 [html.light-mode_&]:text-slate-900 [html.light-mode_&]:bg-slate-50" placeholder="Search doctors, appointments, records..."/></div>
      <div className="ml-auto flex items-center gap-2">
        <button aria-label="Toggle color theme" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-300 transition hover:border-cyan-300/50 hover:shadow-[0_0_20px_rgba(34,211,238,.12)] [html.light-mode_&]:bg-slate-100 [html.light-mode_&]:border-slate-200">{lightMode?<Moon size={17}/>:<Sun size={17}/>}</button>
        <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 [html.light-mode_&]:bg-slate-100 [html.light-mode_&]:border-slate-200"><Bell size={17}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300"/></button>
        <div className="ml-1 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-3 [html.light-mode_&]:bg-slate-100 [html.light-mode_&]:border-slate-200"><span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-300 to-cyan-400 text-xs font-black text-slate-950">{user.name.charAt(0)}</span><span className="hidden sm:block"><b className="block max-w-32 truncate text-xs">{user.name}</b><span className="text-[10px] text-slate-400">{role}</span></span></div>
      </div>
    </header>
    {mobileOpen&&<div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/70"/><aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col border-r border-white/10 bg-[#0B1324]">{sidebar(true)}</aside></div>}
    <main className="min-h-screen pt-[76px] lg:ml-[272px]"><div className="mx-auto max-w-[1450px] p-4 sm:p-6 lg:p-8">{children}</div></main>
  </div>;
}
