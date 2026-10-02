from backend.src.data import get_player_id, get_career_totals
from backend.src.metrics import add_per_game_stats, add_all_around_score
from backend.src.viz import plot_top5_score
import pandas as pd

names = [
    'LeBron James',
    'Stephen Curry',
    'Luka Dončić',
    'Giannis Antetokounmpo',
    'Nikola Jokić'
]

results = []

for name in names:
    player_id = get_player_id(name)

    if player_id is None:
        continue

    df = get_career_totals(player_id)

    summary = {
        "Player": name,
        "PTS": int(df['PTS'].iloc[0]),
        "AST": int(df['AST'].iloc[0]),
        "REB": int(df['REB'].iloc[0]),
        "GP": int(df['GP'].iloc[0])
    }

    results.append(summary)

results_df = pd.DataFrame(results)

results_df = add_per_game_stats(results_df)
results_df = add_all_around_score(results_df)
results_df = results_df.sort_values(by='ALL_AROUND_SCORE', ascending=False)
results_df.to_csv("output/player_ranking.csv", index=False)
print(results_df)

plot_top5_score(results_df)