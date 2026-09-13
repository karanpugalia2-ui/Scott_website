import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SCOTT — Photography & Cinematography",
  description:
    "Portfolio of Scott (Karan Pugalia) — Photographer & Cinematographer from Vadodara, India. Specializing in concert photography, music videos, and event coverage.",
  keywords: [
    "Scott",
    "Karan Pugalia",
    "photographer",
    "cinematographer",
    "concert photography",
    "Vadodara",
    "India",
    "music videos",
    "event coverage",
  ],
  openGraph: {
    title: "SCOTT — Photography & Cinematography",
    description: "Capturing raw emotions through the lens.",
    type: "website",
    images: ["/scott.jpeg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <head>
        <link rel="preload" as="image" href="/work/chaar-diwari/1.jpg" />
        <link rel="preload" as="image" href="/work/seedhe-maut/1.jpg" />
        <link rel="preload" as="image" href="/work/sunidhi-chauhan/1.jpg" />
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
