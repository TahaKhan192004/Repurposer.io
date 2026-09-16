import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
  variable: "--font-manrope",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Repurposer: One Draft, Every Platform",
  description:
    "Paste one piece of content, pick up to three formats, and get platform-native posts written in your voice. Instagram, LinkedIn, X, Threads, YouTube, Reddit, carousels.",
  openGraph: {
    title: "Repurposer",
    description:
      "Paste one piece of content, pick up to three formats, get platform-native posts in your voice.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF9F1",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
