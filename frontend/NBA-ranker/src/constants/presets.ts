import type { Weights } from "../types";

export const PRESETS: Record<string, Weights> = {
  "Standard (50/30/20)": { w_ppg: 0.5, w_apg: 0.3, w_rpg: 0.2, w_def: 0.1 },
  "Pure Scorer (70/15/15)": { w_ppg: 0.7, w_apg: 0.15, w_rpg: 0.15, w_def: 0.05 },
  "Floor General (30/50/20)": { w_ppg: 0.3, w_apg: 0.5, w_rpg: 0.2, w_def: 0.1 },
  "Lockdown Defender": { w_ppg: 0.3, w_apg: 0.2, w_rpg: 0.2, w_def: 0.5 },
  "Glass Master (30/20/50)": { w_ppg: 0.3, w_apg: 0.2, w_rpg: 0.5, w_def: 0.1 },
  "Equal Share (25/25/25)": { w_ppg: 0.25, w_apg: 0.25, w_rpg: 0.25, w_def: 0.25 },
};
