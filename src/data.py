from nba_api.stats.static import teams, players
import pandas as pd
from nba_api.stats.endpoints import *

nba_players = players.get_players()

players_df = pd.DataFrame(nba_players)

def get_player_id(name):
    player = players_df[players_df['full_name'].str.lower().str.contains(name.lower(), na=False)]
    return player['id'].iloc[0]

def get_career_stats(player_id):

    Player = playercareerstats.PlayerCareerStats(player_id=player_id)
    df = Player.get_data_frames()[0]

    return df[['SEASON_ID', 'GP', 'PTS', 'MIN']]