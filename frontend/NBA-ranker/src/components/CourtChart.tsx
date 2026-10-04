import { useState } from "react";
import type { Shot } from "../types";

interface CourtChartProps {
  shots: Shot[];
  filter: "all" | "made" | "missed" | "3pt" | "2pt";
}

export function CourtChart({ shots, filter }: CourtChartProps) {
  const [hoveredShot, setHoveredShot] = useState<Shot | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredShots = shots.filter((shot) => {
    if (filter === "made") return shot.SHOT_MADE_FLAG === 1;
    if (filter === "missed") return shot.SHOT_MADE_FLAG === 0;
    if (filter === "3pt") return shot.SHOT_TYPE.includes("3PT");
    if (filter === "2pt") return shot.SHOT_TYPE.includes("2PT");
    return true;
  });

  return (
    <div className="relative w-full max-w-[640px] mx-auto bg-paper-card border border-border-strong p-4 shadow-[1px_1px_0px_#111]">
      <div className="flex justify-between items-center mb-2 font-mono text-[11px] text-ink-secondary">
        <div className="h-6 flex items-center truncate max-w-[420px]">
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

        <button
          type="button"
          onClick={() => setIsFlipped((prev) => !prev)}
          className="bg-paper hover:bg-paper-dark border border-border-strong px-2 py-0.5 text-[10px] uppercase font-mono cursor-pointer shadow-[1px_1px_0px_#111] transition-transform active:translate-x-0.5 active:translate-y-0.5"
        >
          {isFlipped ? "Flip: Hoop at Top" : "Flip: Hoop at Bottom"}
        </button>
      </div>

      <div className="w-full border border-border-strong bg-paper p-2 shadow-inner">
        <svg
          viewBox="-250 -48 500 360"
          className="w-full h-auto text-ink select-none block"
          style={{
            backgroundColor: "var(--color-paper)",
            transform: isFlipped ? "rotate(180deg)" : "none",
            transition: "transform 0.25s ease",
          }}
        >
          <rect
            x="-250"
            y="-48"
            width="500"
            height="360"
            fill="var(--color-paper)"
            stroke="currentColor"
            strokeWidth="2"
          />

          <rect
            x="-246"
            y="-44"
            width="492"
            height="352"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          />

          <rect
            x="-80"
            y="-47.5"
            width="160"
            height="190"
            fill="rgba(0, 0, 0, 0.03)"
            stroke="currentColor"
            strokeWidth="2"
          />

          <rect
            x="-60"
            y="-47.5"
            width="120"
            height="190"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          <rect x="-85" y="22.5" width="5" height="10" fill="currentColor" />
          <rect x="80" y="22.5" width="5" height="10" fill="currentColor" />

          <line x1="-86" y1="52.5" x2="-80" y2="52.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="80" y1="52.5" x2="86" y2="52.5" stroke="currentColor" strokeWidth="1.5" />

          <line x1="-86" y1="82.5" x2="-80" y2="82.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="80" y1="82.5" x2="86" y2="82.5" stroke="currentColor" strokeWidth="1.5" />

          <line x1="-86" y1="112.5" x2="-80" y2="112.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="80" y1="112.5" x2="86" y2="112.5" stroke="currentColor" strokeWidth="1.5" />

          <path
            d="M -40 -7.5 L -40 0 A 40 40 0 0 1 40 0 L 40 -7.5"
            fill="rgba(0, 0, 0, 0.04)"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          <line
            x1="-30"
            y1="-7.5"
            x2="30"
            y2="-7.5"
            stroke="currentColor"
            strokeWidth="3"
          />

          <line
            x1="0"
            y1="-7.5"
            x2="0"
            y2="-5"
            stroke="currentColor"
            strokeWidth="2"
          />

          <circle
            cx="0"
            cy="0"
            r="7.5"
            fill="var(--color-paper)"
            stroke="currentColor"
            strokeWidth="2"
          />

          <path
            d="M -60 142.5 A 60 60 0 0 1 60 142.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />

          <path
            d="M -60 142.5 A 60 60 0 0 0 60 142.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          <path
            d="M -220 -47.5 L -220 92.5 A 237.5 237.5 0 0 1 220 92.5 L 220 -47.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />

          <text x="-238" y="-34" fontFamily="var(--font-mono)" fontSize="6.5" fill="var(--color-ink-muted)">
            BASELINE (50 FT)
          </text>
          <text x="148" y="-34" fontFamily="var(--font-mono)" fontSize="6.5" fill="var(--color-ink-muted)">
            CORNER 3 (22 FT)
          </text>
          <text x="-238" y="298" fontFamily="var(--font-mono)" fontSize="6.5" fill="var(--color-ink-muted)">
            OUTER ARC (23 FT 9 IN)
          </text>
          <text x="132" y="298" fontFamily="var(--font-mono)" fontSize="6.5" fill="var(--color-ink-muted)">
            REGULATION NBA SPEC
          </text>

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
                    opacity="0.8"
                    className="cursor-pointer hover:opacity-100"
                    onMouseEnter={() => setHoveredShot(shot)}
                    onMouseLeave={() => setHoveredShot(null)}
                  />
                );
              }

              return (
                <g
                  key={idx}
                  transform={`translate(${shot.LOC_X}, ${shot.LOC_Y})`}
                  opacity="0.75"
                  className="cursor-pointer hover:opacity-100"
                  onMouseEnter={() => setHoveredShot(shot)}
                  onMouseLeave={() => setHoveredShot(null)}
                >
                  <line x1="-2.8" y1="-2.8" x2="2.8" y2="2.8" stroke="#8b1e0f" strokeWidth="1.5" />
                  <line x1="-2.8" y1="2.8" x2="2.8" y2="-2.8" stroke="#8b1e0f" strokeWidth="1.5" />
                </g>
              );
            })}
          </g>
        </svg>
      </div>

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
        <span>Total Dispatched: {shots.length}</span>
      </div>
    </div>
  );
}
