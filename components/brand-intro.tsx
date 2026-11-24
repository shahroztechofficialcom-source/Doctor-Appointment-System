"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

export function BrandIntro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("mehr-brand-intro-seen");
    if (seen) return;
    sessionStorage.setItem("mehr-brand-intro-seen", "true");
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 2300);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="brand-intro" role="presentation" aria-hidden="true">
      <div className="brand-intro-rings"><span /><span /><span /></div>
      <div className="brand-intro-mark">
        <Activity size={44} strokeWidth={2.4} />
      </div>
      <div className="brand-intro-name">
        <b>MEHR</b>
        <span>HOSPITAL</span>
      </div>
      <div className="brand-intro-progress"><span /></div>
    </div>
  );
}
