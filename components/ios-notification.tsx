"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Bell, X, Stethoscope } from "lucide-react";

export type ToastPayload = {
  id?: string;
  title: string;
  message: string;
  type?: "success" | "info" | "warning" | "appointment";
  duration?: number;
};

export function showIosNotification(payload: ToastPayload) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("mehr-ios-notification", { detail: payload })
    );
  }
}

export function IosNotification() {
  const [notification, setNotification] = useState<ToastPayload | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<ToastPayload>;
      setNotification(custom.detail);
    };

    window.addEventListener("mehr-ios-notification", handler);
    return () => window.removeEventListener("mehr-ios-notification", handler);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, notification.duration || 4500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4">
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id || `${notification.title}-${notification.message}`}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto relative flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/15 bg-[#071827]/95 p-4 text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-cyan-300 text-slate-950 shadow-lg shadow-cyan-900/20">
              {notification.type === "appointment" ? (
                <Stethoscope size={19} strokeWidth={2.5} />
              ) : notification.type === "warning" ? (
                <AlertCircle size={19} strokeWidth={2.5} />
              ) : notification.type === "info" ? (
                <Bell size={19} strokeWidth={2.5} />
              ) : (
                <CheckCircle2 size={19} strokeWidth={2.5} />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-extrabold tracking-tight text-white">
                  {notification.title}
                </p>
                <span className="shrink-0 rounded-full bg-cyan-300/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-200">
                  Mehr Hospital
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                {notification.message}
              </p>
            </div>

            <button
              onClick={() => setNotification(null)}
              aria-label="Dismiss notification"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/15 hover:text-white"
            >
              <X size={13} />
            </button>
            <div className="absolute inset-x-4 bottom-0 h-px overflow-hidden bg-white/10">
              <motion.div
                key={`progress-${notification.id || notification.title}`}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: (notification.duration || 4500) / 1000, ease: "linear" }}
                className="h-full origin-left bg-gradient-to-r from-cyan-300 to-cyan-200"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
