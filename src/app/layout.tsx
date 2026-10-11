import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { readStore } from "@/lib/store";
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

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const { artists } = await readStore();
  const preloadCovers = artists
    .filter((a) => a.featured && a.cover)
    .slice(0, 3);

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <head>
        {preloadCovers.map((a) => (
          <link key={a.id} rel="preload" as="image" href={a.cover} />
        ))}
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
