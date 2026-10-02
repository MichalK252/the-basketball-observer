from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import teams, players
import pandas as pd
from nba_api.stats.endpoints.playercareerstats import PlayerCareerStats


nba_players = players.get_players()

players_df = pd.DataFrame(nba_players)

import unicodedata

def normalize_text(text: str) -> str:
    if not text:
        return ""
    return ''.join(c for c in unicodedata.normalize('NFD', str(text)) if unicodedata.category(c) != 'Mn').lower()

def get_player_id(name):
    target = normalize_text(name)
    match = players_df[
        players_df['full_name'].apply(lambda x: target in normalize_text(x))
    ]

    if match.empty:
        print(f" Player not found: {name}")
        return None

    return int(match['id'].iloc[0])

def get_career_stats(player_id):

    Player = playercareerstats.PlayerCareerStats(player_id=player_id)
    df = Player.get_data_frames()[0]

    return df[['SEASON_ID', 'GP', 'PTS', 'AST', 'REB', 'MIN']]

_CAREER_CACHE = {}

def get_career_totals(player_id):
    if player_id in _CAREER_CACHE:
        return _CAREER_CACHE[player_id].copy()

    Player = playercareerstats.PlayerCareerStats(player_id=player_id)
    df = Player.get_data_frames()[0]
    df_cleaned = df.groupby('SEASON_ID', group_keys=False).apply(
        lambda g: g[g['TEAM_ABBREVIATION'] == 'TOT'] if 'TOT' in g['TEAM_ABBREVIATION'].values else g
    )
    res = pd.DataFrame([{
        "GP": df_cleaned["GP"].sum(),
        "PTS": df_cleaned["PTS"].sum(),
        "AST": df_cleaned["AST"].sum(),
        "REB": df_cleaned["REB"].sum(),
        "STL": df_cleaned["STL"].sum(),
        "BLK": df_cleaned["BLK"].sum(),
        "FGM": df_cleaned["FGM"].sum(),
        "FGA": df_cleaned["FGA"].sum()
    }])
    _CAREER_CACHE[player_id] = res
    return res.copy()

def search_players(query: str, limit: int = 10):
    if not query or not query.strip():
        return []

    target = normalize_text(query.strip())
    matches = players_df[
        players_df['full_name'].apply(lambda x: target in normalize_text(x))
    ].copy()

    if matches.empty:
        return []

    matches = matches.sort_values(by=['is_active', 'full_name'], ascending=[False, True])
    return matches[['id', 'full_name', 'is_active']].head(limit).to_dict(orient="records")