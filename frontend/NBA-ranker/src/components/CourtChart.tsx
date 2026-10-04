import { useState } from "react";
import type { Shot } from "../types";

interface CourtChartProps {
  shots: Shot[];
  filter: "all" | "made" | "missed" | "3pt" | "2pt";
}

export function CourtChart({ shots, filter }: CourtChartProps) {
  const [hoveredShot, setHoveredShot] = useState<Shot | null>(null);

  const filteredShots = shots.filter((shot) => {
    if (filter === "made") return shot.SHOT_MADE_FLAG === 1;
    if (filter === "missed") return shot.SHOT_MADE_FLAG === 0;
    if (filter === "3pt") return shot.SHOT_TYPE.includes("3PT");
    if (filter === "2pt") return shot.SHOT_TYPE.includes("2PT");
    return true;
  });

  return (
    <div className="relative w-full max-w-[620px] mx-auto bg-paper-card border border-border-strong p-4 shadow-[1px_1px_0px_#111]">
      <div className="h-6 mb-2 text-center font-mono text-[11px] text-ink-secondary truncate">
        {hoveredShot ? (
          <span className="bg-paper px-2 py-0.5 border border-border-strong">
            {hoveredShot.ACTION_TYPE} · {hoveredShot.SHOT_DISTANCE} ft · {hoveredShot.SHOT_TYPE} ·{" "}
            <strong className={hoveredShot.SHOT_MADE_FLAG === 1 ? "text-ink" : "text-accent"}>
              {hoveredShot.SHOT_MADE_FLAG === 1 ? "MADE [●]" : "MISSED [✕]"}
            </strong>
          </span>
        ) : (
          <span className="text-ink-muted">Hover cursor over plotted coordinates for shot dispatch</span>
        )}
      </div>

      <svg
        viewBox="-250 -52 500 472"
        className="w-full h-auto text-ink select-none block"
        style={{ backgroundColor: "var(--color-paper)" }}
      >
        <rect
          x="-250"
          y="-52"
          width="500"
          height="470"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        <line
          x1="-30"
          y1="-7.5"
          x2="30"
          y2="-7.5"
          stroke="currentColor"
          strokeWidth="2"
        />

        <circle
          cx="0"
          cy="0"
          r="7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        <path
          d="M -40 -7.5 A 40 40 0 0 1 40 -7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        <rect
          x="-80"
          y="-52"
          width="160"
          height="190"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        <rect
          x="-60"
          y="-52"
          width="120"
          height="190"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />

        <path
          d="M -60 138 A 60 60 0 0 1 60 138"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        <path
          d="M -60 138 A 60 60 0 0 0 60 138"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        <line
          x1="-220"
          y1="-52"
          x2="-220"
          y2="88"
          stroke="currentColor"
          strokeWidth="2"
        />

        <line
          x1="220"
          y1="-52"
          x2="220"
          y2="88"
          stroke="currentColor"
          strokeWidth="2"
        />

        <path
          d="M -220 88 A 237.5 237.5 0 0 1 220 88"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        <line
          x1="-250"
          y1="418"
          x2="250"
          y2="418"
          stroke="currentColor"
          strokeWidth="2"
        />

        <path
          d="M -60 418 A 60 60 0 0 1 60 418"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        <g>
          {filteredShots.map((shot, idx) => {
            const isMade = shot.SHOT_MADE_FLAG === 1;

            if (isMade) {
              return (
                <circle
                  key={idx}
                  cx={shot.LOC_X}
                  cy={shot.LOC_Y}
                  r="3.2"
                  fill="#111111"
                  opacity="0.75"
                  className="cursor-pointer hover:opacity-100 hover:r-[5]"
                  onMouseEnter={() => setHoveredShot(shot)}
                  onMouseLeave={() => setHoveredShot(null)}
                />
              );
            }

            return (
              <g
                key={idx}
                transform={`translate(${shot.LOC_X}, ${shot.LOC_Y})`}
                opacity="0.65"
                className="cursor-pointer hover:opacity-100"
                onMouseEnter={() => setHoveredShot(shot)}
                onMouseLeave={() => setHoveredShot(null)}
              >
                <line x1="-2.8" y1="-2.8" x2="2.8" y2="2.8" stroke="#8b1e0f" strokeWidth="1.4" />
                <line x1="-2.8" y1="2.8" x2="2.8" y2="-2.8" stroke="#8b1e0f" strokeWidth="1.4" />
              </g>
            );
          })}
        </g>
      </svg>

      <div className="mt-3 pt-2 border-t border-border-muted flex justify-between items-center font-mono text-[11px] text-ink-secondary">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-ink"></span>
            Made Shot ({shots.filter((s) => s.SHOT_MADE_FLAG === 1).length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block font-bold text-accent">✕</span>
            Missed Shot ({shots.filter((s) => s.SHOT_MADE_FLAG === 0).length})
          </span>
        </div>
        <span>Total: {shots.length}</span>
      </div>
    </div>
  );
}
