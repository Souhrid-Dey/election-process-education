import Link from 'next/link';

export const metadata = {
  title: "Election Timeline | Election Process Education",
};

export default function TimelinePage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-[#1B3A6B] mb-6">Election Timeline</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        The interactive election timeline is coming in Phase 5! You will be able to see all key dates from primaries to Inauguration Day.
      </p>
      <Link href="/chat" className="bg-[#B22234] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#8c1b29] transition-colors inline-block">
        Ask a Question Instead
      </Link>
    </div>
  );
}
