/**
 * Home page — entry point for the Election Process Education app.
 *
 * Layout vision (Phase 2):
 * ┌─────────────────────────────────────┐
 * │  Hero: headline + CTA               │
 * ├─────────────────────────────────────┤
 * │  Topic Cards (6 tiles)              │
 * ├─────────────────────────────────────┤
 * │  How It Works (3-step)              │
 * ├─────────────────────────────────────┤
 * │  Election Timeline preview          │
 * └─────────────────────────────────────┘
 *
 * TODO Phase 2:
 *  [ ] Build Hero section with civic branding
 *  [ ] Render <TopicCards /> with all 6 topics
 *  [ ] Add "How It Works" explainer section
 *  [ ] Link topics to the /chat route with pre-seeded questions
 *
 * TODO Phase 3:
 *  [ ] Add <ChatInterface /> as a floating or dedicated /chat page
 */

import { TOPICS } from "@/lib/election-data";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          🗳️ Election Process Education
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Ask anything about U.S. elections. From voter registration to the
          Electoral College — get clear, nonpartisan answers powered by AI.
        </p>
        {/* TODO Phase 2: Replace with styled <Button /> component */}
        <Link href="/chat" className="inline-block bg-[#B22234] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#8c1b29] transition-colors">
          Ask a Question →
        </Link>
      </section>

      {/* ── Topic Cards ───────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Explore Topics
        </h2>
        {/* TODO Phase 2: Replace with <TopicCards topics={TOPICS} /> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((topic) => (
            <div
              key={topic.id}
              className={`p-6 rounded-xl border-2 cursor-pointer hover:shadow-md transition-shadow ${topic.color}`}
            >
              <span className="text-3xl mb-3 block">{topic.icon}</span>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{topic.title}</h3>
              <p className="text-gray-600 text-sm">{topic.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Construction Notice ───────────────────────────────── */}
      <section className="text-center text-gray-500 text-sm border-t pt-8">
        <p>🚧 This app is under construction — more features coming soon.</p>
        <p className="mt-1">
          See <code className="bg-gray-100 px-1 rounded">Instruction.md</code> for the full build plan.
        </p>
      </section>
    </div>
  );
}
