"use client";

import { cn } from "@/lib/utils";

/**
 * The thread spine: the conversation drawn as one continuous thread —
 * a sagging indigo line with a gold needle tick at the end. Comments sit on
 * it like beads. Rendered behind the comment cards.
 */
export function ThreadSpine({
  commentCount,
  className,
}: {
  commentCount: number;
  className?: string;
}) {
  const segmentCount = Math.max(commentCount, 2);
  const spacing = 132;
  const height = segmentCount * spacing;

  let path = "";
  for (let i = 0; i < segmentCount; i++) {
    const y0 = i * spacing;
    const y1 = (i + 1) * spacing;
    const bulge = i % 2 === 0 ? 10 : -10;
    path += `M 0 ${y0} C ${bulge} ${y0 + spacing / 3}, ${-bulge} ${y0 + (2 * spacing) / 3}, 0 ${y1} `;
  }

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-0 left-1/2 z-0 w-full -translate-x-1/2",
        className,
      )}
      style={{ height }}
    >
      <svg
        viewBox={`-40 0 80 ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full"
        fill="none"
      >
        <path
          d={path}
          stroke="#007A70"
          strokeOpacity={0.5}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="4 5"
        />
        <path
          d={path}
          stroke="#00B5AB"
          strokeOpacity={0.18}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <g transform={`translate(0 ${height})`}>
          <line
            x1="-5"
            y1="2"
            x2="6"
            y2="13"
            stroke="#C77D1A"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <line
            x1="6"
            y1="13"
            x2="10"
            y2="11"
            stroke="#C77D1A"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <circle cx="-3" cy="4" r="1.6" fill="#C77D1A" />
        </g>
      </svg>
    </div>
  );
}
