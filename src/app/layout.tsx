import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "SCOTT — Photography & Videography",
  description:
    "Portfolio of Scott (Karan Pugalia) — Photographer & Videographer from Daman, India. Specializing in concert photography, music videos, and event coverage.",
  keywords: [
    "Scott",
    "Karan Pugalia",
    "photographer",
    "videographer",
    "concert photography",
    "Daman",
    "India",
    "music videos",
    "event coverage",
  ],
  openGraph: {
    title: "SCOTT — Photography & Videography",
    description: "Capturing raw emotions through the lens.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
