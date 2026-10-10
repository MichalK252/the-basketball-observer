import os
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA

FEATURE_COLS = ['PPG', 'APG', 'RPG', 'SPG', 'BPG', 'FG_PCT']

def load_dna_database():
    csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "dna_database.csv")
    if os.path.exists(csv_path):
        try:
            return pd.read_csv(csv_path)
        except Exception as e:
            print(f"Error loading dna_database.csv: {e}")
    return pd.DataFrame()



def build_feature_matrix(df: pd.DataFrame):
    features = df[FEATURE_COLS].copy()
    PPG = features['PPG']
    APG = features['APG']
    RPG = features['RPG']
    SPG = features['SPG']
    BPG = features['BPG']
    FG_PCT = features['FG_PCT']

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(features)

    scaled_df = pd.DataFrame(scaled, columns=FEATURE_COLS, index=df['id'])

    return scaled_df, scaler


def find_top_similar(target_player_id: int, scaled_df: pd.DataFrame, top_n: int = 3):
    if target_player_id not in scaled_df.index:
        return []

    target_vec = scaled_df.loc[[target_player_id]]
    sims = cosine_similarity(target_vec, scaled_df)[0]

    sim_series = pd.Series(sims, index=scaled_df.index)
    sim_series = sim_series.drop(target_player_id)
    top_matches = sim_series.sort_values(ascending=False).head(top_n)

    results = []
    for pid, score in top_matches.items():
        results.append({
            "player_id": int(pid),
            "similarity_pct": round(float(score) * 100, 1)
        })

    return results


def compute_pca_coordinates(scaled_df: pd.DataFrame):
    pca = PCA(n_components=2, random_state=42)

    coords = pca.fit_transform(scaled_df)

    pca_df = pd.DataFrame(
        coords,
        columns=['pca_x', 'pca_y'],
        index=scaled_df.index
    )

    return pca_df

ARCHETYPE_PROFILES = pd.DataFrame([
    {
        "name": "Helicentric Floor General",
        "PPG": 0.9, "APG": 0.9, "RPG": 0.4, "SPG": 0.6, "BPG": 0.2, "FG_PCT": 0.5
    },
    {
        "name": "Point Center / Playmaking Big",
        "PPG": 0.7, "APG": 0.8, "RPG": 0.9, "SPG": 0.4, "BPG": 0.6, "FG_PCT": 0.8
    },
    {
        "name": "Two-Way Defensive Anchor",
        "PPG": 0.5, "APG": 0.3, "RPG": 0.8, "SPG": 0.9, "BPG": 0.9, "FG_PCT": 0.6
    },
    {
        "name": "Pure Perimeter Scorer",
        "PPG": 0.95, "APG": 0.35, "RPG": 0.35, "SPG": 0.5, "BPG": 0.2, "FG_PCT": 0.5
    },
    {
        "name": "Rim Protector & Glass Cleaner",
        "PPG": 0.5, "APG": 0.2, "RPG": 0.95, "SPG": 0.3, "BPG": 0.9, "FG_PCT": 0.85
    },
    {
        "name": "Balanced All-Around Contributor",
        "PPG": 0.5, "APG": 0.5, "RPG": 0.5, "SPG": 0.5, "BPG": 0.5, "FG_PCT": 0.5
    }
]).set_index("name")


def determine_archetype(player_vector: pd.Series):
    sims = cosine_similarity(
        player_vector.values.reshape(1, -1),
        ARCHETYPE_PROFILES[FEATURE_COLS]
    )[0]

    best_idx = int(np.argmax(sims))
    best_archetype = ARCHETYPE_PROFILES.index[best_idx]
    confidence = round(float(sims[best_idx]) * 100, 1)

    return best_archetype, confidence


def get_dna_analysis(target_player_id: int, players_df: pd.DataFrame):
    if players_df.empty or target_player_id not in players_df['id'].values:
        return None

    scaled_df, _ = build_feature_matrix(players_df)
    pca_df = compute_pca_coordinates(scaled_df)

    target_row = players_df[players_df['id'] == target_player_id].iloc[0]
    target_scaled = scaled_df.loc[target_player_id]
    archetype, confidence = determine_archetype(target_scaled)

    similar_raw = find_top_similar(target_player_id, scaled_df, top_n=3)
    id_to_name = dict(zip(players_df['id'], players_df['Player']))

    similar_players = [
        {
            "id": s["player_id"],
            "name": id_to_name.get(s["player_id"], f"Player #{s['player_id']}"),
            "similarity_pct": s["similarity_pct"]
        }
        for s in similar_raw
    ]

    league_map = []
    for pid in players_df['id']:
        p_row = players_df[players_df['id'] == pid].iloc[0]
        p_scaled = scaled_df.loc[pid]
        p_arch, _ = determine_archetype(p_scaled)
        league_map.append({
            "id": int(pid),
            "name": p_row['Player'],
            "x": round(float(pca_df.loc[pid, 'pca_x']), 3),
            "y": round(float(pca_df.loc[pid, 'pca_y']), 3),
            "archetype": p_arch,
            "is_target": int(pid) == target_player_id
        })

    radar = {
        "Scoring": round(float(target_scaled['PPG']) * 100),
        "Playmaking": round(float(target_scaled['APG']) * 100),
        "Rebounding": round(float(target_scaled['RPG']) * 100),
        "Defense": round(float((target_scaled['SPG'] + target_scaled['BPG']) / 2) * 100),
        "Efficiency": round(float(target_scaled['FG_PCT']) * 100),
    }

    return {
        "player_id": target_player_id,
        "name": target_row['Player'],
        "archetype": archetype,
        "confidence": confidence,
        "radar": radar,
        "similar_players": similar_players,
        "league_map": league_map
    }