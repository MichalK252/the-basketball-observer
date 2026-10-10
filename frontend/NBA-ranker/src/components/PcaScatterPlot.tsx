import { useState } from "react";
import type { PcaPoint } from "../types";

interface PcaScatterPlotProps {
  points: PcaPoint[];
  onSelectPlayer?: (playerId: number, playerName: string) => void;
}

const ARCHETYPE_COLORS: Record<string, string> = {
  "Helicentric Floor General": "#8b1e0f",
  "Point Center / Playmaking Big": "#1e3a8a",
  "Two-Way Defensive Anchor": "#14532d",
  "Pure Perimeter Scorer": "#b45309",
  "Rim Protector & Glass Cleaner": "#0f766e",
  "Balanced All-Around Contributor": "#4a4a4a",
};

export function PcaScatterPlot({ points, onSelectPlayer }: PcaScatterPlotProps) {
  const [hoveredPoint, setHoveredPoint] = useState<PcaPoint | null>(null);

  const width = 480;
  const height = 320;
  const padding = 45;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

  const minX = Math.min(...xs, -1);
  const maxX = Math.max(...xs, 1);
  const minY = Math.min(...ys, -1);
  const maxY = Math.max(...ys, 1);

  const rangeX = maxX - minX || 2;
  const rangeY = maxY - minY || 2;

  const toSvgX = (x: number) => padding + ((x - minX) / rangeX) * (width - 2 * padding);
  const toSvgY = (y: number) => height - padding - ((y - minY) / rangeY) * (height - 2 * padding);

  const originX = toSvgX(0);
  const originY = toSvgY(0);

  const archetypes = Array.from(new Set(points.map((p) => p.archetype)));

  return (
    <div className="bg-paper-card border border-border-strong p-4 shadow-[1px_1px_0px_#111]">
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-border-muted font-mono text-xs">
        <span className="uppercase tracking-wider font-bold text-ink">
          2D League Style Landscape (PCA Space)
        </span>
        <span className="text-ink-muted text-[10px]">
          Click point to calibrate player
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none block bg-paper border border-border-muted"
        >
          {originX >= padding && originX <= width - padding && (
            <line
              x1={originX}
              y1={padding}
              x2={originX}
              y2={height - padding}
              stroke="var(--color-border-muted)"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
          )}
          {originY >= padding && originY <= height - padding && (
            <line
              x1={padding}
              y1={originY}
              x2={width - padding}
              y2={originY}
              stroke="var(--color-border-muted)"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
          )}

          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            className="font-mono text-[9px] uppercase tracking-wider fill-ink-muted"
          >
            PCA Component 1 · Primary Role Dimension
          </text>

          <text
            x={14}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 14 ${height / 2})`}
            className="font-mono text-[9px] uppercase tracking-wider fill-ink-muted"
          >
            PCA Component 2 · Secondary Usage Dimension
          </text>

          {points.map((pt) => {
            const cx = toSvgX(pt.x);
            const cy = toSvgY(pt.y);
            const color = ARCHETYPE_COLORS[pt.archetype] || "#4a4a4a";
            const isTarget = pt.is_target;
            const isHovered = hoveredPoint?.id === pt.id;

            return (
              <g
                key={pt.id}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => onSelectPlayer && onSelectPlayer(pt.id, pt.name)}
              >
                {isTarget && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={isTarget ? 7 : isHovered ? 6 : 4.5}
                  fill={isTarget ? "var(--color-accent)" : color}
                  stroke="var(--color-paper)"
                  strokeWidth="1.5"
                />

                {(isTarget || isHovered) && (
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    className="font-mono text-[10px] font-bold fill-ink pointer-events-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                  >
                    {pt.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {hoveredPoint && (
          <div className="absolute top-2 left-2 pointer-events-none bg-paper border border-border-strong px-2 py-1 shadow font-mono text-[11px]">
            <strong className="text-ink">{hoveredPoint.name}</strong> ·{" "}
            <span className="text-ink-secondary">{hoveredPoint.archetype}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pt-2 border-t border-border-muted font-mono text-[10px]">
        {archetypes.map((arch) => (
          <div key={arch} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: ARCHETYPE_COLORS[arch] || "#4a4a4a" }}
            />
            <span className="text-ink-secondary">{arch}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
