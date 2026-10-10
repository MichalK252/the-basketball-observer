import os
import sys
import time
import pandas as pd

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.data import get_player_id, get_career_totals
from src.metrics import add_per_game_stats

PLAYERS_LIST = [
    "Michael Jordan", "LeBron James", "Kareem Abdul-Jabbar", "Kobe Bryant", "Shaquille O'Neal",
    "Tim Duncan", "Magic Johnson", "Larry Bird", "Stephen Curry", "Nikola Jokić",
    "Giannis Antetokounmpo", "Luka Dončić", "Kevin Durant", "Hakeem Olajuwon", "Kevin Garnett",
    "Dirk Nowitzki", "Dwyane Wade", "James Harden", "Chris Paul", "Russell Westbrook",
    "Kawhi Leonard", "Anthony Davis", "Allen Iverson", "Steve Nash", "John Stockton",
    "Jason Kidd", "David Robinson", "Charles Barkley", "Scottie Pippen", "Patrick Ewing",
    "Dwight Howard", "Damian Lillard", "Kyrie Irving", "Joel Embiid", "Paul George",
    "Jimmy Butler", "Klay Thompson", "Ray Allen", "Reggie Miller", "Vince Carter",
    "Carmelo Anthony", "Tracy McGrady", "Rudy Gobert", "Domantas Sabonis", "Bam Adebayo",
    "Jayson Tatum", "Devin Booker", "Donovan Mitchell", "Anthony Edwards", "Victor Wembanyama"
]

def build_database():
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "dna_database.csv")

    existing_df = pd.DataFrame()
    if os.path.exists(output_file):
        try:
            existing_df = pd.read_csv(output_file)
            print(f"Loaded existing database with {len(existing_df)} players.")
        except Exception:
            existing_df = pd.DataFrame()

    results = []
    if not existing_df.empty and 'id' in existing_df.columns:
        results = existing_df.to_dict(orient="records")
        existing_ids = set(existing_df['id'])
    else:
        existing_ids = set()

    for idx, name in enumerate(PLAYERS_LIST):
        player_id = get_player_id(name)
        if player_id is None:
            print(f"Skipping {name} (ID not found)")
            continue

        if player_id in existing_ids:
            print(f"[{idx+1}/{len(PLAYERS_LIST)}] {name} already in database.")
            continue

        print(f"[{idx+1}/{len(PLAYERS_LIST)}] Fetching {name} (ID: {player_id})...")
        time.sleep(0.6)  # Be polite to stats.nba.com

        try:
            df = get_career_totals(player_id)
            if df.empty or df["GP"].iloc[0] == 0:
                print(f"No games found for {name}")
                continue

            row = {
                "id": player_id,
                "Player": name,
                "PTS": int(df["PTS"].iloc[0]),
                "AST": int(df["AST"].iloc[0]),
                "REB": int(df["REB"].iloc[0]),
                "GP": int(df["GP"].iloc[0]),
                "STL": int(df["STL"].iloc[0]) if "STL" in df else 0,
                "BLK": int(df["BLK"].iloc[0]) if "BLK" in df else 0,
                "FGM": int(df["FGM"].iloc[0]) if "FGM" in df else 0,
                "FGA": int(df["FGA"].iloc[0]) if "FGA" in df else 0,
            }
            results.append(row)
            existing_ids.add(player_id)

            # Periodically save
            partial_df = pd.DataFrame(results)
            partial_df = add_per_game_stats(partial_df)
            partial_df.to_csv(output_file, index=False)
        except Exception as e:
            print(f"Failed to fetch {name}: {e}")

    final_df = pd.DataFrame(results)
    final_df = add_per_game_stats(final_df)
    final_df.to_csv(output_file, index=False)
    print(f"Finished! Database written to {output_file} with {len(final_df)} players.")

if __name__ == "__main__":
    build_database()
