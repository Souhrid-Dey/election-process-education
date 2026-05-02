import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-[#1B3A6B] text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-[#D4AF37] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#1B3A6B] rounded">
          ElectionEd
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded">Home</Link>
          <Link href="/how-to-vote" className="hover:text-[#D4AF37] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded">How to Vote</Link>
          <Link href="/timeline" className="hover:text-[#D4AF37] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded">Timeline</Link>
          <Link href="/chat" className="hover:text-[#D4AF37] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded">Ask a Question</Link>
        </nav>
      </div>
    </header>
  );
}
