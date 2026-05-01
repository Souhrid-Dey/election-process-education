/**
 * Card — generic content card with optional header and footer slots.
 *
 * TODO Phase 2:
 *  [ ] Add header prop for card title + optional icon
 *  [ ] Add footer prop for action buttons
 *  [ ] Hover elevation variant (for clickable cards)
 *  [ ] Compact / expanded size variants
 */

import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 ${
        hover ? "hover:shadow-md transition-shadow cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
