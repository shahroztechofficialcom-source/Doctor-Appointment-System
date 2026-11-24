"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Building2,
  Activity,
  Stethoscope,
  Users,
  PhoneCall,
  CalendarCheck,
  Sun,
  Moon,
  Menu,
  X,
  UserRound,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { HospitalLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getSession, setSession, User } from "@/lib/storage";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/services", label: "Services", icon: Activity },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/about", label: "About", icon: Building2 },
  { href: "/contact", label: "Contact", icon: PhoneCall },
];

const dashboardUrl = (role: User["role"]) =>
  role === "Admin" ? "/admin" : role === "Doctor" ? "/doctor" : "/patient";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => setUser(getSession());
    syncUser();
    window.addEventListener("mehr-auth-change", syncUser);
    window.addEventListener("storage", syncUser);

    const isLight = localStorage.getItem("mehr_theme") === "light";
    setLightMode(isLight);
    if (isLight) {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }

    return () => {
      window.removeEventListener("mehr-auth-change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const toggleTheme = () => {
    const next = !lightMode;
    setLightMode(next);
    if (next) {
      document.documentElement.classList.add("light-mode");
      localStorage.setItem("mehr_theme", "light");
    } else {
      document.documentElement.classList.remove("light-mode");
      localStorage.setItem("mehr_theme", "dark");
    }
  };

  const handleLogout = () => {
    setSession(null);
    setUser(null);
    setUserMenuOpen(false);
    setOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#050A14]/90 text-white backdrop-blur-2xl transition-colors duration-300 [html.light-mode_&]:bg-white/90 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:text-slate-900">
      {/* Main Navbar */}
      <div className="mx-auto mt-2 flex w-[calc(100%-1rem)] max-w-[1400px] items-center justify-between gap-3 rounded-2xl border border-cyan-400/20 bg-[#081426]/95 px-3 py-2.5 shadow-[0_12px_42px_rgba(0,0,0,.24)] sm:px-5 lg:px-6">
        {/* Brand Logo */}
        <Link href="/" className="group" onClick={() => setOpen(false)}>
          <HospitalLogo size="md" />
        </Link>

        {/* Navigation with Lucide Icons */}
        <nav className="hidden items-center gap-1.5 lg:flex">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] [html.light-mode_&]:bg-cyan-50 [html.light-mode_&]:text-cyan-700"
                    : "text-slate-300 hover:bg-white/5 hover:text-white [html.light-mode_&]:text-slate-600 [html.light-mode_&]:hover:bg-slate-100 [html.light-mode_&]:hover:text-slate-900"
                }`}
              >
                <Icon size={15} className={isActive ? "text-cyan-400 [html.light-mode_&]:text-cyan-600" : "text-slate-400"} />
                <span>{label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavBadge"
                    className="absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-cyan-400 [html.light-mode_&]:bg-cyan-600"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
            className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-cyan-300 shadow-sm transition-all hover:scale-105 hover:border-cyan-400/50 hover:bg-cyan-400/10 cursor-pointer [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-100 [html.light-mode_&]:text-slate-700"
            title={lightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {lightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* User Profile or Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-100 [html.light-mode_&]:text-slate-800"
              >
                <div className="grid h-6 w-6 place-items-center rounded-full bg-cyan-400/20 text-cyan-300 [html.light-mode_&]:bg-cyan-600 [html.light-mode_&]:text-white">
                  <UserRound size={13} />
                </div>
                <span>{user.name.split(" ")[0]}</span>
                <span className="rounded-md bg-cyan-400/20 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300 [html.light-mode_&]:bg-cyan-100 [html.light-mode_&]:text-cyan-800">
                  {user.role}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 rounded-3xl border border-white/15 bg-[#0A1224] p-2.5 shadow-2xl backdrop-blur-2xl z-50 [html.light-mode_&]:bg-white [html.light-mode_&]:border-slate-200"
                  >
                    <div className="border-b border-white/10 px-3 py-2 [html.light-mode_&]:border-slate-100">
                      <p className="text-xs font-black text-white truncate [html.light-mode_&]:text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      href={dashboardUrl(user.role)}
                      onClick={() => setUserMenuOpen(false)}
                      className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10 transition [html.light-mode_&]:text-slate-700 [html.light-mode_&]:hover:bg-slate-100"
                    >
                      <ShieldCheck size={14} className="text-cyan-400 [html.light-mode_&]:text-cyan-600" />
                      {user.role} Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-950/40 [html.light-mode_&]:text-cyan-700 [html.light-mode_&]:hover:bg-cyan-50"
                    >
                      <LogOut size={14} />
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="rounded-full px-5">
                  Sign In
                </Button>
              </Link>
            </div>
          )}

          {/* VIP Neon Appointment CTA */}
          <Link href="/appointments">
            <Button
              variant="lime"
              size="sm"
              className="shadow-[0_0_20px_rgba(34,211,238,.24)] hover:shadow-[0_0_30px_rgba(34,211,238,.4)]"
            >
              <CalendarCheck size={14} />
              Book Appointment
            </Button>
          </Link>
        </div>

        {/* Mobile Action Icons */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-cyan-300 [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-100 [html.light-mode_&]:text-slate-800"
          >
            {lightMode ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white [html.light-mode_&]:border-slate-200 [html.light-mode_&]:bg-slate-100 [html.light-mode_&]:text-slate-800"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with Icons */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-[#060B14]/98 px-5 py-6 lg:hidden [html.light-mode_&]:bg-white [html.light-mode_&]:border-slate-200"
          >
            <nav className="space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                      isActive
                        ? "bg-cyan-500/15 text-cyan-300 [html.light-mode_&]:bg-cyan-50 [html.light-mode_&]:text-cyan-700"
                        : "text-slate-300 hover:bg-white/5 [html.light-mode_&]:text-slate-700 [html.light-mode_&]:hover:bg-slate-100"
                    }`}
                  >
                    <Icon size={17} className={isActive ? "text-cyan-400" : "text-slate-400"} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 border-t border-white/10 pt-5 space-y-3 [html.light-mode_&]:border-slate-200">
              {user ? (
                <div className="flex items-center justify-between rounded-2xl bg-white/5 p-3 [html.light-mode_&]:bg-slate-100">
                  <div>
                    <b className="block text-sm text-white [html.light-mode_&]:text-slate-900">{user.name}</b>
                    <span className="text-xs text-cyan-300 [html.light-mode_&]:text-cyan-700">{user.role} Portal</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={dashboardUrl(user.role)} onClick={() => setOpen(false)}>
                      <Button size="sm" variant="outline">
                        Portal
                      </Button>
                    </Link>
                    <Button size="sm" variant="danger" onClick={handleLogout}>
                      Log Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full" size="sm">
                      Sign In
                    </Button>
                  </Link>

                </div>
              )}

              <Link href="/appointments" onClick={() => setOpen(false)} className="block">
                <Button variant="primary" className="w-full py-3 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                  <CalendarCheck size={16} />
                  Book Appointment Online
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default SiteHeader;
