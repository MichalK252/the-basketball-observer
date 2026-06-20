import pandas as pd

def add_per_game_stats(df):


    df = df.copy()

    df['PPG'] = df['PTS'] / df['GP']
    df['APG'] = df['AST'] / df['GP']
    df['RPG'] = df['REB'] / df['GP']

    return df


def add_all_around_score(df, w_ppg=0.5, w_apg=0.3, w_rpg=0.2):

    df = df.copy()

    df['ALL_AROUND_SCORE'] = (
        df['PPG'] * w_ppg +
        df['APG'] * w_apg +
        df['RPG'] * w_rpg
    )

    return df


def build_player_summary(df):
    
    summary = {
        "PPG": df['PTS'].sum() / df['GP'].sum(),
        "APG": df['AST'].sum() / df['GP'].sum(),
        "RPG": df['REB'].sum() / df['GP'].sum(),
    }

    return summary