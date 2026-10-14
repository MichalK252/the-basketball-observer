import io
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


def generate_efficiency_plot(df: pd.DataFrame) -> bytes:
    if df.empty:
        return b""

    fig, ax = plt.subplots(figsize=(8, 5.5), facecolor="#f7f5ef")
    ax.set_facecolor("#fdfbf7")

    ax.scatter(df["PPG"], df["FG_PCT"], color="#8b1e0f", s=40, alpha=0.8, edgecolors="#111111")


    mean_ppg = df['PPG'].mean()
    mean_fg = df['FG_PCT'].mean()

    ax.axvline(mean_ppg, color="#cfc9bb", linestyle="--", linewidth=1)
    ax.axhline(mean_fg, color="#cfc9bb", linestyle="--", linewidth=1)

    notable = df.sort_values(by="PPG", ascending=False).head(8)
    for _, row in notable.iterrows():
        ax.annotate(
            row['Player'],
            (row['PPG'], row['FG_PCT']),
            textcoords="offset points",
            xytext=(5, 5),
            fontsize=8,
            fontfamily="monospace",
            color="#111111"
        )

    ax.set_title("SCORING VOLUME VS. SHOOTING EFFICIENCY", fontsize=11, fontfamily="monospace", fontweight="bold",
                 pad=12)
    ax.set_xlabel("Points Per Game (PPG)", fontsize=9, fontfamily="monospace")
    ax.set_ylabel("Field Goal Percentage (FG%)", fontsize=9, fontfamily="monospace")

    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight", dpi=130)
    plt.close(fig)

    buf.seek(0)
    return buf.getvalue()


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


def generate_correlation_plot(df: pd.DataFrame) -> bytes:
    cols = ['PPG', 'APG', 'RPG', 'SPG', 'BPG', 'FG_PCT']

    corr_matrix = df[cols].corr()

    fig, ax = plt.subplots(figsize=(6.5, 5), facecolor="#f7f5ef")
    ax.set_facecolor("#fdfbf7")

    cax = ax.matshow(corr_matrix, cmap="copper_r", vmin=-1, vmax=1)
    fig.colorbar(cax, shrink=0.8)

    ax.set_xticks(range(len(cols)))
    ax.set_yticks(range(len(cols)))
    ax.set_xticklabels(cols, fontsize=9, fontfamily="monospace")
    ax.set_yticklabels(cols, fontsize=9, fontfamily="monospace")

    for i in range(len(cols)):
        for j in range(len(cols)):
            val = corr_matrix.iloc[i, j]
            ax.text(j, i, f"{val:.2f}", ha="center", va="center", color="#ffffff" if abs(val) > 0.4 else "#111111",
                    fontsize=8, fontfamily="monospace")

    ax.set_title("FEATURE CORRELATION MATRIX", fontsize=10, fontfamily="monospace", fontweight="bold", pad=16)

    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight", dpi=130)
    plt.close(fig)
    buf.seek(0)
    return buf.getvalue()