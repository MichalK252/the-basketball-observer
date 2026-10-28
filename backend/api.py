from fastapi import FastAPI
import pandas as pd

from src.data import get_player_id, get_career_totals, search_players, players_df, get_player_seasons, get_player_shots
from src.metrics import add_per_game_stats, add_all_around_score
from fastapi.middleware.cors import CORSMiddleware
from src.dna import get_dna_analysis, load_dna_database
from fastapi.responses import Response
from src.viz import generate_efficiency_plot, generate_correlation_plot, generate_trajectory_plot

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
    dna_df = load_dna_database()

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

        if not dna_df.empty:
            dna_match = dna_df[dna_df['id'] == player_id]
            if dna_match.empty and player_name:
                dna_match = dna_df[dna_df['Player'].str.lower() == player_name.lower()]
            if not dna_match.empty:
                row = dna_match.iloc[0]
                results.append({
                    "id": int(row["id"]),
                    "Player": str(row["Player"]),
                    "PTS": int(row["PTS"]),
                    "AST": int(row["AST"]),
                    "REB": int(row["REB"]),
                    "GP": int(row["GP"]),
                    "STL": int(row["STL"]) if "STL" in row else 0,
                    "BLK": int(row["BLK"]) if "BLK" in row else 0,
                    "FGM": int(row["FGM"]) if "FGM" in row else 0,
                    "FGA": int(row["FGA"]) if "FGA" in row else 0,
                })
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
async def player_shots(player_id: int, season: str | None = None):
    if not season or season.lower() in ("all", "latest"):
        available = get_player_seasons(player_id)
        season = available[0] if available else "2023-24"

    return get_player_shots(player_id, season=season)

@app.get("/analytics/dna/{player_id}")
async def player_dna(player_id: int):
    database_df = load_dna_database()
    if database_df.empty:
        database_df = build_ranking()

    if player_id not in database_df['id'].values:
        match = players_df[players_df['id'] == player_id]
        player_name = match['full_name'].iloc[0] if not match.empty else f"Player #{player_id}"
        career_df = get_career_totals(player_id)
        if not career_df.empty and career_df["GP"].iloc[0] > 0:
            new_row = {
                "id": player_id,
                "Player": player_name,
                "PTS": int(career_df["PTS"].iloc[0]),
                "AST": int(career_df["AST"].iloc[0]),
                "REB": int(career_df["REB"].iloc[0]),
                "GP": int(career_df["GP"].iloc[0]),
                "STL": int(career_df["STL"].iloc[0]) if "STL" in career_df else 0,
                "BLK": int(career_df["BLK"].iloc[0]) if "BLK" in career_df else 0,
                "FGM": int(career_df["FGM"].iloc[0]) if "FGM" in career_df else 0,
                "FGA": int(career_df["FGA"].iloc[0]) if "FGA" in career_df else 0,
            }
            new_df = pd.DataFrame([new_row])
            new_df = add_per_game_stats(new_df)
            database_df = pd.concat([database_df, new_df], ignore_index=True)

    data = get_dna_analysis(player_id, database_df)
    if not data:
        return {"error": "Player not found"}

    return data

@app.get("/analytics/plots/efficiency.png")
def plot_efficiency(player_id: int | None = None):
    df = load_dna_database()
    if df.empty:
        df = build_ranking()

    if player_id and player_id not in df['id'].values:
        match = players_df[players_df['id'] == player_id]
        player_name = match['full_name'].iloc[0] if not match.empty else f"Player #{player_id}"
        career_df = get_career_totals(player_id)
        if not career_df.empty and career_df["GP"].iloc[0] > 0:
            new_row = {
                "id": player_id,
                "Player": player_name,
                "PTS": int(career_df["PTS"].iloc[0]),
                "AST": int(career_df["AST"].iloc[0]),
                "REB": int(career_df["REB"].iloc[0]),
                "GP": int(career_df["GP"].iloc[0]),
                "STL": int(career_df["STL"].iloc[0]) if "STL" in career_df else 0,
                "BLK": int(career_df["BLK"].iloc[0]) if "BLK" in career_df else 0,
                "FGM": int(career_df["FGM"].iloc[0]) if "FGM" in career_df else 0,
                "FGA": int(career_df["FGA"].iloc[0]) if "FGA" in career_df else 0,
            }
            new_df = pd.DataFrame([new_row])
            new_df = add_per_game_stats(new_df)
            df = pd.concat([df, new_df], ignore_index=True)

    image_bytes = generate_efficiency_plot(df, target_player_id=player_id)
    return Response(
        content=image_bytes,
        media_type="image/png",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Access-Control-Allow-Origin": "*",
        },
    )

@app.get("/analytics/plots/trajectory.png")
def plot_trajectory(player_id: int = 203999):
    match = players_df[players_df['id'] == player_id]
    player_name = match['full_name'].iloc[0] if not match.empty else f"Player #{player_id}"
    image_bytes = generate_trajectory_plot(player_id, player_name=player_name)
    return Response(
        content=image_bytes,
        media_type="image/png",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Access-Control-Allow-Origin": "*",
        },
    )

@app.get("/analytics/plots/correlation.png")
def plot_correlation():
    df = load_dna_database()
    if df.empty:
        df = build_ranking()
    image_bytes = generate_correlation_plot(df)
    return Response(
        content=image_bytes,
        media_type="image/png",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Access-Control-Allow-Origin": "*",
        },
    )


