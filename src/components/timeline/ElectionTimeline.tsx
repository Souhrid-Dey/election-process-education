/**
 * ElectionTimeline — vertical or horizontal timeline of election events.
 *
 * TODO Phase 4:
 *  [ ] Render SAMPLE_TIMELINE_EVENTS sorted by date
 *  [ ] Color-code by ElectionType (primary / general / runoff / special)
 *  [ ] Highlight today's position on the timeline
 *  [ ] Filter controls: show all / upcoming / past
 *  [ ] Expand event card to show full description
 *  [ ] Mobile: collapse to list view; desktop: full timeline rail
 */

import type { ElectionEvent } from "@/types";

interface ElectionTimelineProps {
  events: ElectionEvent[];
}

export function ElectionTimeline({ events }: ElectionTimelineProps) {
  return (
    <div className="relative pl-6 border-l-2 border-blue-200 space-y-6">
      {events.map((event) => (
        <div key={event.id} className="relative">
          {/* Timeline dot */}
          <span className="absolute -left-[1.45rem] top-1 w-3 h-3 rounded-full bg-blue-700 border-2 border-white" />

          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <h4 className="font-semibold text-gray-900 text-sm">{event.title}</h4>
            <p className="text-gray-600 text-xs mt-1">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
