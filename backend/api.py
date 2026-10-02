from fastapi import FastAPI
import pandas as pd

from src.data import get_player_id, get_career_totals, search_players
from src.metrics import add_per_game_stats, add_all_around_score
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

names = [
    'LeBron James',
    'Stephen Curry',
    'Luka Dončić',
    'Giannis Antetokounmpo',
    'Nikola Jokić'
]


def build_ranking(w_ppg: float = 0.5, w_apg: float = 0.3, w_rpg: float = 0.2, w_def: float = 0.1):
    results = []

    for name in names:
        player_id = get_player_id(name)

        if player_id is None:
            continue

        df = get_career_totals(player_id)

        results.append({
            "Player": name,
            "PTS": int(df["PTS"].iloc[0]),
            "AST": int(df["AST"].iloc[0]),
            "REB": int(df["REB"].iloc[0]),
            "GP": int(df["GP"].iloc[0]),
            "STL": int(df["STL"].iloc[0]) if "STL" in df else 0,
            "BLK": int(df["BLK"].iloc[0]) if "BLK" in df else 0,
            "FGM": int(df["FGM"].iloc[0]) if "FGM" in df else 0,
            "FGA": int(df["FGA"].iloc[0]) if "FGA" in df else 0,
        })

    results_df = pd.DataFrame(results)
    results_df = add_per_game_stats(results_df)
    results_df = add_all_around_score(results_df, w_ppg, w_apg, w_rpg, w_def)

    results_df = results_df.sort_values(
        by="ALL_AROUND_SCORE",
        ascending=False
    )

    return results_df


@app.get("/")
def home():
    return {"API is working"}


import numpy as np

@app.get("/ranking")
async def ranking(w_ppg: float = 0.5, w_apg: float = 0.3, w_rpg: float = 0.2, w_def: float = 0.1):
    df = build_ranking(w_ppg, w_apg, w_rpg, w_def)

    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.fillna(0)

    return df.to_dict(orient="records")


@app.get("/players/search")
async def search(q: str = "", limit: int = 10):
    return search_players(q, limit=limit)