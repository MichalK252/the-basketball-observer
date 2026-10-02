import pandas as pd

def add_per_game_stats(df):


    df = df.copy()

    df['PPG'] = df['PTS'] / df['GP']
    df['APG'] = df['AST'] / df['GP']
    df['RPG'] = df['REB'] / df['GP']

    df['SPG'] = df['STL'] / df['GP']
    df['BPG'] = df['BLK'] / df['GP']
    df['FGPG'] = df['FGM'] / df['GP']
    df['FAPG'] = df['FGA'] / df['GP']

    # Safe division for FG%
    df['FG_PCT'] = (df['FGM'] / df['FGA'].replace(0, float('nan')) * 100).fillna(0)
    df['FG%'] = df['FG_PCT']

    return df


def add_all_around_score(df, w_ppg=0.5, w_apg=0.3, w_rpg=0.2, w_def=0.1):

    df = df.copy()

    df['ALL_AROUND_SCORE'] = (
        df['PPG'] * w_ppg +
        df['APG'] * w_apg +
        df['RPG'] * w_rpg +
        (df['SPG'] + df['BPG']) * w_def
    )

    return df


def build_player_summary(df):
    
    summary = {
        "PPG": df['PTS'].sum() / df['GP'].sum(),
        "APG": df['AST'].sum() / df['GP'].sum(),
        "RPG": df['REB'].sum() / df['GP'].sum(),
    }

    return summary