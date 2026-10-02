import type { Weights } from "../types";

export const PRESETS: Record<string, Weights> = {
  "Standard (50/30/20)": { w_ppg: 0.5, w_apg: 0.3, w_rpg: 0.2 },
  "Pure Scorer (70/15/15)": { w_ppg: 0.7, w_apg: 0.15, w_rpg: 0.15 },
  "Floor General (30/50/20)": { w_ppg: 0.3, w_apg: 0.5, w_rpg: 0.2 },
  "Glass Master (30/20/50)": { w_ppg: 0.3, w_apg: 0.2, w_rpg: 0.5 },
  "Equal Share (33/33/33)": { w_ppg: 0.33, w_apg: 0.33, w_rpg: 0.33 },
};
