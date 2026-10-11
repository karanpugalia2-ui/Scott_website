"use client";

import { createContext, useContext } from "react";
import type { ArtistProject, SiteContent } from "@/lib/content";

export interface SiteData {
  artists: ArtistProject[];
  content: SiteContent;
}

const SiteContext = createContext<SiteData | null>(null);

export function SiteProvider({
  data,
  children,
}: {
  data: SiteData;
  children: React.ReactNode;
}) {
  return <SiteContext.Provider value={data}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteData {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
