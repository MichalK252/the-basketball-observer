import type { RadarStats } from "../types";

interface DnaRadarChartProps {
  radar: RadarStats;
  playerName: string;
}

const AXES: (keyof RadarStats)[] = [
  "Scoring",
  "Playmaking",
  "Rebounding",
  "Defense",
  "Efficiency",
];

export function DnaRadarChart({ radar, playerName }: DnaRadarChartProps) {
  const size = 320;
  const center = size / 2;
  const radius = 100;
  const numAxes = AXES.length;

  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (index * 2 * Math.PI) / numAxes - Math.PI / 2;
    const r = radius * Math.max(0.05, Math.min(1, valueRatio));
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLabelCoordinates = (index: number) => {
    const angle = (index * 2 * Math.PI) / numAxes - Math.PI / 2;
    const labelRadius = radius + 28;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
    };
  };

  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  const polygonPoints = AXES.map((axis, i) => {
    const ratio = (radar[axis] ?? 0) / 100;
    const { x, y } = getCoordinates(i, ratio);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="bg-paper-card border border-border-strong p-4 shadow-[1px_1px_0px_#111]">
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-border-muted font-mono text-xs">
        <span className="uppercase tracking-wider font-bold text-ink">
          Radar DNA Spectrum
        </span>
        <span className="text-ink-secondary">{playerName}</span>
      </div>

      <div className="flex justify-center items-center py-2">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[320px] h-auto select-none overflow-visible"
        >
          {rings.map((ringRatio, rIdx) => {
            const ringPoints = AXES.map((_, i) => {
              const { x, y } = getCoordinates(i, ringRatio);
              return `${x},${y}`;
            }).join(" ");

            return (
              <polygon
                key={rIdx}
                points={ringPoints}
                fill="none"
                stroke="var(--color-border-muted)"
                strokeWidth={rIdx === rings.length - 1 ? "1.5" : "0.75"}
                strokeDasharray={rIdx === rings.length - 1 ? undefined : "3 3"}
              />
            );
          })}

          {AXES.map((_, i) => {
            const { x, y } = getCoordinates(i, 1.0);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="var(--color-border-muted)"
                strokeWidth="1"
              />
            );
          })}

          <polygon
            points={polygonPoints}
            fill="var(--color-accent-light)"
            stroke="var(--color-accent)"
            strokeWidth="2"
          />

          {AXES.map((axis, i) => {
            const ratio = (radar[axis] ?? 0) / 100;
            const { x, y } = getCoordinates(i, ratio);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="var(--color-paper)"
                stroke="var(--color-accent)"
                strokeWidth="2"
              />
            );
          })}

          {AXES.map((axis, i) => {
            const { x, y } = getLabelCoordinates(i);
            const val = radar[axis] ?? 0;
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-mono text-[10px] uppercase font-bold fill-ink"
              >
                {axis} ({val})
              </text>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-5 gap-1 pt-3 border-t border-border-muted text-center font-mono">
        {AXES.map((axis) => (
          <div key={axis} className="bg-paper p-1 border border-border-muted">
            <div className="text-[9px] uppercase text-ink-muted truncate">
              {axis.slice(0, 4)}
            </div>
            <div className="text-xs font-bold text-ink">{radar[axis]}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
