import type { Metadata } from "next";
import { readStore } from "@/lib/store";
import HomePage from "@/components/HomePage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await readStore();
  return {
    title: content.site.title,
    description: content.site.description,
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
      title: content.site.title,
      description: content.site.description,
      type: "website",
      images: [content.site.ogImage],
    },
  };
}

export default async function Home() {
  const data = await readStore();
  return <HomePage data={data} />;
}
