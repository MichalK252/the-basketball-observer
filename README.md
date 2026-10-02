# NBA Player Impact Analysis 🏀

A Python project that compares NBA players based on career statistics and builds a custom "all-around impact score".

The project uses `nba_api` to fetch real NBA data and applies custom metrics to rank players.

---

## 📊 Project Goal

The goal of this project is to:
- compare selected NBA players
- calculate per-game performance metrics
- build a custom player impact score
- generate rankings and visualizations

---

## 🧠 How it works

Pipeline:

```text
data.py → metrics.py → viz.py → main.py
```

Steps:
1. Fetch player IDs and career stats from NBA API
2. Aggregate career totals
3. Convert to per-game stats
4. Compute custom "ALL_AROUND_SCORE"
5. Rank players
6. Visualize top performers

---

## 📦 Tech Stack

- Python
- pandas
- matplotlib
- nba_api

---

## 🚀 How to run

Install dependencies:

```bash
pip install -r requirements.txt
```
Run project:

```bash
python main.py
```

---

## 📈 Output

The project generates:
- ranked NBA players table
- custom ALL_AROUND_SCORE metric
- bar chart visualization
- CSV export with results