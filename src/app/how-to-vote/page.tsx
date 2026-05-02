import Link from 'next/link';

export const metadata = {
  title: "How to Vote | Election Process Education",
};

export default function HowToVotePage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-[#1B3A6B] mb-6">How to Vote</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        This interactive guide is coming in Phase 5! We will walk you through eligibility, registration, and casting your ballot.
      </p>
      <Link href="/chat" className="bg-[#B22234] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#8c1b29] transition-colors inline-block">
        Ask a Question Instead
      </Link>
    </div>
  );
}
