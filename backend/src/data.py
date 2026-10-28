import os
from nba_api.stats.endpoints import playercareerstats, shotchartdetail
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
    career_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "career_seasons.csv")
    if os.path.exists(career_file):
        try:
            cdf = pd.read_csv(career_file)
            matched = cdf[cdf['PLAYER_ID'] == player_id]
            if not matched.empty:
                cols = [c for c in ['SEASON_ID', 'GP', 'PTS', 'AST', 'REB', 'MIN'] if c in matched.columns]
                return matched[cols]
        except Exception as e:
            print(f"Error reading local career_seasons.csv: {e}")

    try:
        Player = playercareerstats.PlayerCareerStats(player_id=player_id, timeout=10)
        frames = Player.get_data_frames()
        if not frames or frames[0].empty:
            return pd.DataFrame()
        df = frames[0]
        cols = [c for c in ['SEASON_ID', 'GP', 'PTS', 'AST', 'REB', 'MIN'] if c in df.columns]
        return df[cols]
    except Exception as e:
        print(f"Error fetching career stats for {player_id}: {e}")
        return pd.DataFrame()

_CAREER_CACHE = {}

def get_career_totals(player_id):
    if player_id in _CAREER_CACHE:
        return _CAREER_CACHE[player_id].copy()

    try:
        Player = playercareerstats.PlayerCareerStats(player_id=player_id, timeout=10)
        frames = Player.get_data_frames()
        if not frames or frames[0].empty:
            return pd.DataFrame()

        df = frames[0]
        df_cleaned = df.groupby('SEASON_ID', group_keys=False).apply(
            lambda g: g[g['TEAM_ABBREVIATION'] == 'TOT'] if 'TOT' in g['TEAM_ABBREVIATION'].values else g
        )
        res = pd.DataFrame([{
            "GP": df_cleaned["GP"].sum() if "GP" in df_cleaned else 0,
            "PTS": df_cleaned["PTS"].sum() if "PTS" in df_cleaned else 0,
            "AST": df_cleaned["AST"].sum() if "AST" in df_cleaned else 0,
            "REB": df_cleaned["REB"].sum() if "REB" in df_cleaned else 0,
            "STL": df_cleaned["STL"].sum() if "STL" in df_cleaned else 0,
            "BLK": df_cleaned["BLK"].sum() if "BLK" in df_cleaned else 0,
            "FGM": df_cleaned["FGM"].sum() if "FGM" in df_cleaned else 0,
            "FGA": df_cleaned["FGA"].sum() if "FGA" in df_cleaned else 0
        }])
        _CAREER_CACHE[player_id] = res
        return res.copy()
    except Exception as e:
        print(f"Error fetching stats for player_id {player_id}: {e}")
        return pd.DataFrame()

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



_SEASONS_CACHE = {}

def get_player_seasons(player_id):
    if player_id in _SEASONS_CACHE:
        return _SEASONS_CACHE[player_id].copy()

    career_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "career_seasons.csv")
    if os.path.exists(career_file):
        try:
            cdf = pd.read_csv(career_file)
            matched = cdf[cdf['PLAYER_ID'] == player_id]
            if not matched.empty and 'SEASON_ID' in matched.columns:
                seasons = matched['SEASON_ID'].dropna().unique().tolist()
                valid = sorted([s for s in seasons if str(s) >= '1996-97'], reverse=True)
                if valid:
                    _SEASONS_CACHE[player_id] = valid
                    return valid.copy()
        except Exception as e:
            print(f"Error reading seasons from file: {e}")

    try:
        career = playercareerstats.PlayerCareerStats(player_id=player_id, timeout=10)
        frames = career.get_data_frames()
        if not frames or frames[0].empty:
            return ["2023-24"]

        df = frames[0]
        all_seasons = df['SEASON_ID'].unique()
        valid_seasons = [s for s in all_seasons if str(s) >= '1996-97']
        sorted_seasons = sorted(valid_seasons, reverse=True)

        _SEASONS_CACHE[player_id] = sorted_seasons
        return sorted_seasons.copy()
    except Exception as e:
        print(f"Error fetching seasons for this player {player_id}: {e}")
        return ["2023-24", "2022-23"]

_SHOTS_CACHE = {}

def get_player_shots(player_id, season):
    cache_key = (player_id, season)
    if cache_key in _SHOTS_CACHE:
        return _SHOTS_CACHE[cache_key].copy()

    shot_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", f"shots_{player_id}.csv")
    if os.path.exists(shot_file):
        try:
            df = pd.read_csv(shot_file)
            columns = ['LOC_X', 'LOC_Y', 'SHOT_MADE_FLAG', 'SHOT_TYPE', 'SHOT_DISTANCE', 'ACTION_TYPE']
            existing_cols = [c for c in columns if c in df.columns]
            clean_df = df[existing_cols].copy().fillna({
                'LOC_X': 0, 'LOC_Y': 0, 'SHOT_MADE_FLAG': 0, 'SHOT_TYPE': '', 'SHOT_DISTANCE': 0, 'ACTION_TYPE': ''
            })
            shots = clean_df.to_dict(orient="records")
            _SHOTS_CACHE[cache_key] = shots
            return shots.copy()
        except Exception as e:
            print(f"Error reading local shots file {shot_file}: {e}")

    try:
        sc = shotchartdetail.ShotChartDetail(
            team_id=0,
            player_id=player_id,
            season_nullable=season,
            context_measure_simple='FGA',
            timeout=10
        )
        frames = sc.get_data_frames()
        if not frames or frames[0].empty:
            return []

        df = frames[0]
        columns = ['LOC_X', 'LOC_Y', 'SHOT_MADE_FLAG', 'SHOT_TYPE', 'SHOT_DISTANCE', 'ACTION_TYPE']
        existing_cols = [c for c in columns if c in df.columns]
        clean_df = df[existing_cols].copy().fillna({
            'LOC_X': 0, 'LOC_Y': 0, 'SHOT_MADE_FLAG': 0, 'SHOT_TYPE': '', 'SHOT_DISTANCE': 0, 'ACTION_TYPE': ''
        })
        shots = clean_df.to_dict(orient="records")
        _SHOTS_CACHE[cache_key] = shots
        return shots.copy()

    except Exception as e:
        print(f"Error fetching shots for this player {player_id}: {e}")
        fallback_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "shots_201939.csv")
        if os.path.exists(fallback_file):
            try:
                df = pd.read_csv(fallback_file)
                columns = ['LOC_X', 'LOC_Y', 'SHOT_MADE_FLAG', 'SHOT_TYPE', 'SHOT_DISTANCE', 'ACTION_TYPE']
                existing_cols = [c for c in columns if c in df.columns]
                clean_df = df[existing_cols].copy().fillna({
                    'LOC_X': 0, 'LOC_Y': 0, 'SHOT_MADE_FLAG': 0, 'SHOT_TYPE': '', 'SHOT_DISTANCE': 0, 'ACTION_TYPE': ''
                })
                return clean_df.to_dict(orient="records")
            except Exception:
                pass
        return []
