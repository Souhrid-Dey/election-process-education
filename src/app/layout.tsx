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
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* TODO Phase 2: Add <Header /> here */}
        <main className="flex-1">{children}</main>
        {/* TODO Phase 2: Add <Footer /> here */}
      </body>
    </html>
  );
}
