from fastapi import FastAPI
import pandas as pd

from src.data import get_player_id, get_career_totals, search_players, players_df, get_player_seasons, get_player_shots
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

DEFAULT_PLAYERS = [
    'LeBron James',
    'Stephen Curry',
    'Luka Dončić',
    'Giannis Antetokounmpo',
    'Nikola Jokić'
]


def build_ranking(
    player_names: list[str] | None = None,
    w_ppg: float = 0.5,
    w_apg: float = 0.3,
    w_rpg: float = 0.2,
    w_def: float = 0.1
):
    target = player_names if player_names and len(player_names) > 0 else DEFAULT_PLAYERS
    results = []

    for item in target:
        if not item:
            continue
        item_str = str(item).strip()

        if item_str.isdigit():
            player_id = int(item_str)
            match = players_df[players_df['id'] == player_id]
            player_name = match['full_name'].iloc[0] if not match.empty else f"Player #{player_id}"
        else:
            player_id = get_player_id(item_str)
            player_name = item_str

        if player_id is None:
            continue

        df = get_career_totals(player_id)
        if df.empty or df["GP"].iloc[0] == 0:
            continue

        results.append({
            "id": player_id,
            "Player": player_name,
            "PTS": int(df["PTS"].iloc[0]),
            "AST": int(df["AST"].iloc[0]),
            "REB": int(df["REB"].iloc[0]),
            "GP": int(df["GP"].iloc[0]),
            "STL": int(df["STL"].iloc[0]) if "STL" in df else 0,
            "BLK": int(df["BLK"].iloc[0]) if "BLK" in df else 0,
            "FGM": int(df["FGM"].iloc[0]) if "FGM" in df else 0,
            "FGA": int(df["FGA"].iloc[0]) if "FGA" in df else 0,
        })

    if not results:
        return pd.DataFrame(columns=[
            "id", "Player", "PTS", "AST", "REB", "GP", "STL", "BLK", "FGM", "FGA",
            "PPG", "APG", "RPG", "SPG", "BPG", "FG_PCT", "ALL_AROUND_SCORE"
        ])

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
async def ranking(
    players: str | None = None,
    w_ppg: float = 0.5,
    w_apg: float = 0.3,
    w_rpg: float = 0.2,
    w_def: float = 0.1
):
    player_list = [p.strip() for p in players.split(",") if p.strip()] if players else None
    df = build_ranking(player_names=player_list, w_ppg=w_ppg, w_apg=w_apg, w_rpg=w_rpg, w_def=w_def)

    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.fillna(0)

    return df.to_dict(orient="records")


@app.get("/players/search")
async def search(q: str = "", limit: int = 10):
    return search_players(q, limit=limit)

@app.get("/players/{player_id}/seasons")
async def player_seasons(player_id: int):
    return get_player_seasons(player_id)


@app.get("/players/{player_id}/shots")
async def player_shots(player_id: int, season: str = "2023-24"):
    return get_player_shots(player_id, season=season)