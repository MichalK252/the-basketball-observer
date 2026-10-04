export interface PlayerRank {
  id?: number;
  Player: string;
  PTS: number;
  AST: number;
  REB: number;
  GP: number;
  STL: number;
  BLK: number;
  PPG: number;
  APG: number;
  RPG: number;
  SPG: number;
  BPG: number;
  FG_PCT: number;
  ALL_AROUND_SCORE: number;
}

export interface SearchPlayer {
  id: number;
  full_name: string;
  is_active: boolean;
}

export interface Weights {
  w_ppg: number;
  w_apg: number;
  w_rpg: number;
  w_def: number;
}

export interface Shot {
  LOC_X: number;
  LOC_Y: number;
  SHOT_MADE_FLAG: number;
  SHOT_TYPE: string;
  SHOT_DISTANCE: number;
  ACTION_TYPE: string;
}
