import matplotlib.pyplot as plt
import numpy as np


def plot_ppg_bar(df):
    x = np.arange(len(df['Player']))

    plt.figure()
    plt.bar(x, df['PPG'])
    plt.xticks(x, df['Player'], rotation=45)
    plt.title("PPG Comparison")
    plt.show()


def plot_dual_stats(df):

    x = np.arange(len(df['Player']))

    plt.figure()
    plt.bar(x - 0.2, df['PPG'], width=0.4, label='PPG')
    plt.bar(x + 0.2, df['APG'], width=0.4, label='APG')

    plt.xticks(x, df['Player'], rotation=45)
    plt.legend()
    plt.title("PPG vs APG")
    plt.show()


def plot_top5_score(df):

    top5 = df.sort_values(by='ALL_AROUND_SCORE', ascending=False).head(5)

    x = np.arange(len(top5['Player']))

    plt.figure()
    plt.bar(x, top5['ALL_AROUND_SCORE'])

    plt.xticks(x, top5['Player'], rotation=45)
    plt.title("Top 5 MVP Score")
    plt.show()