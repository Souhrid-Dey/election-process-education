/**
 * Root layout — wraps all pages.
 *
 * TODO Phase 2:
 *  [ ] Add Google Fonts (next/font)
 *  [ ] Add global navigation header
 *  [ ] Add footer with resources links
 *  [ ] Add accessibility skip-to-content link
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Election Process Education",
  description:
    "An interactive AI assistant that helps you understand U.S. elections — how to register, vote, and follow the results.",
  keywords: ["elections", "voting", "voter registration", "Electoral College", "civic education"],
  openGraph: {
    title: "Election Process Education",
    description: "Understand U.S. elections with an interactive AI guide.",
    // TODO Phase 6: Add og:image
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[#B22234] focus:text-white font-bold">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
