import sqlite3
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

players_df['normalized_name'] = players_df['full_name'].apply(normalize_text)

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

def load_active_database():
    active_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "active_players_totals.csv")
    if os.path.exists(active_file):
        try:
            return pd.read_csv(active_file)
        except Exception as e:
            print(f"Error loading active_players_totals.csv: {e}")
    return pd.DataFrame()

def get_career_totals(player_id):
    if player_id in _CAREER_CACHE:
        return _CAREER_CACHE[player_id].copy()

    # 1. Check dna_database.csv
    dna_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "dna_database.csv")
    if os.path.exists(dna_file):
        try:
            dna_df = pd.read_csv(dna_file)
            m = dna_df[dna_df['id'] == player_id]
            if not m.empty:
                r = m.iloc[0]
                res = pd.DataFrame([{
                    "GP": int(r.get("GP", 0)),
                    "PTS": int(r.get("PTS", 0)),
                    "AST": int(r.get("AST", 0)),
                    "REB": int(r.get("REB", 0)),
                    "STL": int(r.get("STL", 0)),
                    "BLK": int(r.get("BLK", 0)),
                    "FGM": int(r.get("FGM", 0)),
                    "FGA": int(r.get("FGA", 0)),
                }])
                _CAREER_CACHE[player_id] = res
                return res.copy()
        except Exception as e:
            pass

    # 2. Check career_seasons.csv
    career_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "career_seasons.csv")
    if os.path.exists(career_file):
        try:
            cdf = pd.read_csv(career_file)
            m = cdf[cdf['PLAYER_ID'] == player_id]
            if not m.empty:
                res = pd.DataFrame([{
                    "GP": int(m["GP"].sum()) if "GP" in m else 0,
                    "PTS": int(m["PTS"].sum()) if "PTS" in m else 0,
                    "AST": int(m["AST"].sum()) if "AST" in m else 0,
                    "REB": int(m["REB"].sum()) if "REB" in m else 0,
                    "STL": int(m["STL"].sum()) if "STL" in m else 0,
                    "BLK": int(m["BLK"].sum()) if "BLK" in m else 0,
                    "FGM": int(m["FGM"].sum()) if "FGM" in m else 0,
                    "FGA": int(m["FGA"].sum()) if "FGA" in m else 0,
                }])
                _CAREER_CACHE[player_id] = res
                return res.copy()
        except Exception as e:
            pass

    # 3. Check active_players_totals.csv
    active_df = load_active_database()
    if not active_df.empty:
        m = active_df[active_df['id'] == player_id]
        if not m.empty:
            r = m.iloc[0]
            res = pd.DataFrame([{
                "GP": int(r.get("GP", 0)),
                "PTS": int(r.get("PTS", 0)),
                "AST": int(r.get("AST", 0)),
                "REB": int(r.get("REB", 0)),
                "STL": int(r.get("STL", 0)),
                "BLK": int(r.get("BLK", 0)),
                "FGM": int(r.get("FGM", 0)),
                "FGA": int(r.get("FGA", 0)),
            }])
            _CAREER_CACHE[player_id] = res
            return res.copy()

    try:
        Player = playercareerstats.PlayerCareerStats(player_id=player_id, timeout=4)
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
    if 'normalized_name' in players_df.columns:
        matches = players_df[players_df['normalized_name'].str.contains(target, na=False)].copy()
    else:
        matches = players_df[players_df['full_name'].apply(lambda x: target in normalize_text(x))].copy()

    if matches.empty:
        return []

    matches = matches.sort_values(by=['is_active', 'full_name'], ascending=[False, True])
    return matches[['id', 'full_name', 'is_active']].head(limit).to_dict(orient="records")



_SEASONS_CACHE = {}

def get_player_seasons(player_id):
    if player_id in _SEASONS_CACHE:
        return _SEASONS_CACHE[player_id].copy()

    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "shots.db")
    db_seasons = []
    if os.path.exists(db_path):
        try:
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute("SELECT DISTINCT season FROM shots WHERE player_id = ? ORDER BY season DESC", (player_id,))
            db_seasons = [r[0] for r in c.fetchall()]
            conn.close()
        except Exception as e:
            print(f"Error querying seasons from shots.db: {e}")

    career_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "career_seasons.csv")
    if os.path.exists(career_file):
        try:
            cdf = pd.read_csv(career_file)
            matched = cdf[cdf['PLAYER_ID'] == player_id]
            if not matched.empty and 'SEASON_ID' in matched.columns:
                file_seasons = matched['SEASON_ID'].dropna().unique().tolist()
                valid = sorted(list(set(db_seasons + [s for s in file_seasons if str(s) >= '1996-97'])), reverse=True)
                if valid:
                    _SEASONS_CACHE[player_id] = valid
                    return valid.copy()
        except Exception as e:
            print(f"Error reading seasons from file: {e}")

    if db_seasons:
        _SEASONS_CACHE[player_id] = db_seasons
        return db_seasons.copy()

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

    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
    db_path = os.path.join(data_dir, "shots.db")

    # 1. Query SQLite indexed database (covers all 571 NBA players and multiple seasons)
    if os.path.exists(db_path):
        try:
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            if season:
                c.execute(
                    "SELECT loc_x, loc_y, shot_made_flag, shot_type, shot_distance, action_type FROM shots WHERE player_id = ? AND season = ?",
                    (player_id, season)
                )
            else:
                c.execute(
                    "SELECT loc_x, loc_y, shot_made_flag, shot_type, shot_distance, action_type FROM shots WHERE player_id = ? ORDER BY season DESC",
                    (player_id,)
                )
            rows = c.fetchall()
            conn.close()
            if rows:
                shots = [
                    {
                        "LOC_X": r[0],
                        "LOC_Y": r[1],
                        "SHOT_MADE_FLAG": r[2],
                        "SHOT_TYPE": r[3],
                        "SHOT_DISTANCE": r[4],
                        "ACTION_TYPE": r[5]
                    }
                    for r in rows
                ]
                _SHOTS_CACHE[cache_key] = shots
                return shots.copy()
        except Exception as e:
            print(f"Error querying shots.db for player {player_id}: {e}")

    # 2. Check season-specific file: shots_{player_id}_{season}.csv
    specific_file = os.path.join(data_dir, f"shots_{player_id}_{season}.csv")
    if os.path.exists(specific_file):
        try:
            df = pd.read_csv(specific_file)
            columns = ['LOC_X', 'LOC_Y', 'SHOT_MADE_FLAG', 'SHOT_TYPE', 'SHOT_DISTANCE', 'ACTION_TYPE']
            existing_cols = [c for c in columns if c in df.columns]
            clean_df = df[existing_cols].copy().fillna({
                'LOC_X': 0, 'LOC_Y': 0, 'SHOT_MADE_FLAG': 0, 'SHOT_TYPE': '', 'SHOT_DISTANCE': 0, 'ACTION_TYPE': ''
            })
            shots = clean_df.to_dict(orient="records")
            _SHOTS_CACHE[cache_key] = shots
            return shots.copy()
        except Exception as e:
            print(f"Error reading season shots file {specific_file}: {e}")

    # 3. Live query from stats.nba.com
    try:
        sc = shotchartdetail.ShotChartDetail(
            team_id=0,
            player_id=player_id,
            season_nullable=season,
            context_measure_simple='FGA',
            timeout=8
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
        print(f"Error fetching shots for player {player_id} season {season}: {e}")
        return []
