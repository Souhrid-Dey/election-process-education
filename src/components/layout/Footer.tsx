export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 mt-auto border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p className="font-semibold text-[#1B3A6B]">Election Process Education</p>
          <p>Built for PromptWars April 2026 - Challenge 2.</p>
          <p className="text-xs text-gray-500 mt-1">Hack2Skill & Google for Developers Community</p>
        </div>
        <div className="flex space-x-6">
          <a href="https://vote.gov" target="_blank" rel="noopener noreferrer" className="hover:text-[#B22234] focus:outline-none focus:ring-2 focus:ring-[#B22234] rounded">
            Vote.gov
          </a>
          <a href="https://www.usa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-[#B22234] focus:outline-none focus:ring-2 focus:ring-[#B22234] rounded">
            USA.gov
          </a>
        </div>
      </div>
    </footer>
  );
}
