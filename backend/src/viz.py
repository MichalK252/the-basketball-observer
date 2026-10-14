import io
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


def generate_efficiency_plot(df: pd.DataFrame, target_player_id: int | None = None) -> bytes:
    if df.empty:
        return b""

    fig, ax = plt.subplots(figsize=(8, 5.5), facecolor="#f7f5ef")
    ax.set_facecolor("#fdfbf7")

    mean_ppg = df['PPG'].mean()
    mean_fg = df['FG_PCT'].mean()

    ax.axvline(mean_ppg, color="#cfc9bb", linestyle="--", linewidth=1)
    ax.axhline(mean_fg, color="#cfc9bb", linestyle="--", linewidth=1)

    others = df[df['id'] != target_player_id] if target_player_id else df
    ax.scatter(others["PPG"], others["FG_PCT"], color="#b0a89a", s=32, alpha=0.6, edgecolors="#4a4a4a", linewidth=0.5)

    target_name = ""
    target = df[df['id'] == target_player_id] if target_player_id else pd.DataFrame()
    if not target.empty:
        t_row = target.iloc[0]
        target_name = str(t_row['Player'])
        t_ppg, t_fg = float(t_row['PPG']), float(t_row['FG_PCT'])

        ax.scatter([t_ppg], [t_fg], color="none", s=220, edgecolors="#8b1e0f", linewidth=2.5, linestyle="--")
        ax.scatter([t_ppg], [t_fg], color="#8b1e0f", s=90, edgecolors="#111111", linewidth=1.5, zorder=5)

        ax.annotate(
            f"★ {target_name.upper()}\n{t_ppg:.1f} PPG | {t_fg:.1f}% FG",
            (t_ppg, t_fg),
            textcoords="offset points",
            xytext=(10, 8),
            fontsize=9,
            fontfamily="monospace",
            fontweight="bold",
            color="#8b1e0f",
            bbox=dict(boxstyle="square,pad=0.3", fc="#fdfbf7", ec="#8b1e0f", lw=1),
            zorder=6
        )

    notable = others.sort_values(by="PPG", ascending=False).head(5)
    for _, row in notable.iterrows():
        ax.annotate(
            row['Player'],
            (row['PPG'], row['FG_PCT']),
            textcoords="offset points",
            xytext=(4, 4),
            fontsize=7.5,
            fontfamily="monospace",
            color="#555555"
        )

    title = f"SCORING PROFILE: {target_name.upper()} vs HISTORICAL SUPERSTARS" if target_name else "SCORING VOLUME VS. SHOOTING EFFICIENCY"
    ax.set_title(title, fontsize=10, fontfamily="monospace", fontweight="bold", pad=12)
    ax.set_xlabel("Points Per Game (PPG)", fontsize=9, fontfamily="monospace")
    ax.set_ylabel("Field Goal Percentage (FG%)", fontsize=9, fontfamily="monospace")
    ax.grid(True, linestyle=":", color="#e2ddd2", alpha=0.6)

    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight", dpi=130)
    plt.close(fig)

    buf.seek(0)
    return buf.getvalue()


def generate_trajectory_plot(player_id: int, player_name: str = "") -> bytes:
    from src.data import get_career_stats
    df = get_career_stats(player_id)
    if df.empty or 'GP' not in df.columns:
        return b""

    df = df[df['GP'] > 0].copy()
    if df.empty:
        return b""

    df['PPG'] = df['PTS'] / df['GP']
    df['APG'] = df['AST'] / df['GP']
    df['RPG'] = df['REB'] / df['GP']

    fig, ax = plt.subplots(figsize=(8, 5.5), facecolor="#f7f5ef")
    ax.set_facecolor("#fdfbf7")

    x = range(len(df))
    seasons = df['SEASON_ID'].tolist()

    ax.plot(x, df['PPG'], marker='o', color='#8b1e0f', label='PPG (Points)', linewidth=2.2, zorder=3)
    ax.plot(x, df['APG'], marker='s', color='#111111', label='APG (Assists)', linewidth=1.6, linestyle='--', zorder=3)
    ax.plot(x, df['RPG'], marker='^', color='#b45309', label='RPG (Rebounds)', linewidth=1.6, linestyle=':', zorder=3)

    max_idx = int(df['PPG'].argmax())
    max_ppg = df['PPG'].iloc[max_idx]
    max_season = seasons[max_idx]
    ax.annotate(
        f"Peak: {max_ppg:.1f} PPG\n({max_season})",
        (max_idx, max_ppg),
        textcoords="offset points",
        xytext=(0, 14),
        ha="center",
        fontsize=8,
        fontfamily="monospace",
        fontweight="bold",
        color="#8b1e0f",
        bbox=dict(boxstyle="round,pad=0.2", fc="#fdfbf7", ec="#8b1e0f", lw=0.8),
        arrowprops=dict(arrowstyle="->", color="#8b1e0f", lw=1)
    )

    ax.set_xticks(list(x))
    ax.set_xticklabels(seasons, rotation=45, fontsize=8, fontfamily="monospace")
    ax.set_ylabel("Per-Game Production", fontsize=9, fontfamily="monospace")
    ax.set_xlabel("Season Progression", fontsize=9, fontfamily="monospace")
    ax.legend(loc="upper left", frameon=True, facecolor="#f7f5ef", edgecolor="#111111", fontsize=8)
    ax.grid(True, linestyle=":", color="#e2ddd2", alpha=0.6)

    title = f"CAREER EVOLUTION & PRIME WINDOW: {player_name.upper()}" if player_name else "CAREER PROGRESSION BY SEASON"
    ax.set_title(title, fontsize=10, fontfamily="monospace", fontweight="bold", pad=12)

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