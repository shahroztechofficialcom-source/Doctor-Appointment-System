import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MediBot } from "@/components/medi-bot";
import { IosNotification } from "@/components/ios-notification";
import { PageTransition } from "@/components/page-transition";
import { BrandIntro } from "@/components/brand-intro";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MEHR HOSPITAL - Best Multispecialty Hospital | Book Doctors Online",
  description:
    "Leading specialist doctors at MEHR HOSPITAL. Instant appointment booking for Cardiology, Neurology, Orthopedic, Dermatology, Pediatrics, General Medicine, Ophthalmology, and Gynecology with transparent fees.",
  keywords: [
    "Mehr Hospital",
    "book doctor online",
    "cardiologist",
    "neurologist",
    "hospital OPD",
    "Pakistan hospital",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable} antialiased selection:bg-cyan-500 selection:text-slate-950`}>
        <BrandIntro />
        <IosNotification />
        <SiteHeader />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
        <MediBot />
      </body>
    </html>
  );
}
