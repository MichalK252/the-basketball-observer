import type { Weights } from "../types";
import { PRESETS } from "../constants/presets";

interface IndexCalibrationProps {
  weights: Weights;
  onWeightChange: (key: keyof Weights, value: number) => void;
  onApplyPreset: (presetName: string) => void;
  onCalculate: () => void;
  loading: boolean;
}

export function IndexCalibration({
  weights,
  onWeightChange,
  onApplyPreset,
  onCalculate,
  loading,
}: IndexCalibrationProps) {
  return (
    <aside className="w-full">
      <div className="bg-paper-card border border-border-strong p-5 relative shadow-[1px_1px_0px_#111]">
        {/* Header */}
        <div className="border-b-2 border-border-strong pb-1.5 mb-4 flex justify-between items-baseline">
          <h2 className="font-display text-lg uppercase tracking-wider text-ink font-bold">
            Index Calibration
          </h2>
          <span className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase">
            [Formula]
          </span>
        </div>

        <p className="text-xs text-ink-secondary mb-4 leading-relaxed font-serif">
          Adjust the coefficient weights below to re-calibrate the canonical impact index for all evaluated players.
        </p>

        {/* PPG Slider */}
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink">
              Points Per Game
            </span>
            <span className="font-mono text-xs font-bold text-accent">
              {weights.w_ppg.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={weights.w_ppg}
            onChange={(e) => onWeightChange("w_ppg", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-paper-dark border border-border-strong rounded-none appearance-none cursor-pointer accent-ink"
          />
        </div>

        {/* APG Slider */}
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink">
              Assists Per Game
            </span>
            <span className="font-mono text-xs font-bold text-accent">
              {weights.w_apg.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={weights.w_apg}
            onChange={(e) => onWeightChange("w_apg", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-paper-dark border border-border-strong rounded-none appearance-none cursor-pointer accent-ink"
          />
        </div>

        {/* RPG Slider */}
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink">
              Rebounds Per Game
            </span>
            <span className="font-mono text-xs font-bold text-accent">
              {weights.w_rpg.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={weights.w_rpg}
            onChange={(e) => onWeightChange("w_rpg", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-paper-dark border border-border-strong rounded-none appearance-none cursor-pointer accent-ink"
          />
        </div>

        {/* Defense Slider */}
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink">
              Defense (Stocks: SPG + BPG)
            </span>
            <span className="font-mono text-xs font-bold text-accent">
              {weights.w_def.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={weights.w_def}
            onChange={(e) => onWeightChange("w_def", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-paper-dark border border-border-strong rounded-none appearance-none cursor-pointer accent-ink"
          />
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onCalculate}
          disabled={loading}
          className="w-full bg-ink text-paper font-mono text-xs font-bold tracking-widest uppercase py-2.5 px-4 mt-2 border border-border-strong cursor-pointer hover:bg-accent transition-colors disabled:opacity-50 shadow-[1px_1px_0px_#111] active:translate-x-0.5 active:translate-y-0.5"
        >
          {loading ? "Re-tabulating..." : "Calculate Table"}
        </button>

        {/* Presets */}
        <div className="mt-5 pt-3 border-t border-dashed border-border-muted">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2">
            Editorial Presets
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.keys(PRESETS).map((presetKey) => (
              <button
                key={presetKey}
                onClick={() => onApplyPreset(presetKey)}
                className="bg-paper hover:bg-paper-dark border border-border-strong text-ink text-xs font-serif py-1 px-2 cursor-pointer shadow-[1px_1px_0px_#111] transition-transform active:translate-x-0.5 active:translate-y-0.5"
              >
                {presetKey.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
