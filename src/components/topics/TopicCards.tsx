/**
 * TopicCards — grid of clickable topic tiles.
 *
 * TODO Phase 2:
 *  [ ] Accept onClick prop — navigate to /chat?topic=<id> with pre-seeded question
 *  [ ] Hover state: lift + show "Ask about this →" CTA
 *  [ ] Active/selected state for the currently open topic
 *  [ ] Keyboard accessible (Enter/Space triggers onClick)
 *
 * TODO Phase 4:
 *  [ ] Animate in on mount (staggered fade-up)
 */

import type { Topic } from "@/types";

interface TopicCardsProps {
  topics: Topic[];
  onSelect?: (topic: Topic) => void;
}

export function TopicCards({ topics, onSelect }: TopicCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onSelect?.(topic)}
          className={`p-6 rounded-xl border-2 text-left cursor-pointer hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${topic.color}`}
        >
          <span className="text-3xl mb-3 block">{topic.icon}</span>
          <h3 className="font-bold text-lg text-gray-900 mb-2">{topic.title}</h3>
          <p className="text-gray-600 text-sm">{topic.description}</p>
        </button>
      ))}
    </div>
  );
}
