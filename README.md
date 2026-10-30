# The Basketball Observer

> **Live Production Demo:** [https://the-basketball-observer.vercel.app/](https://the-basketball-observer.vercel.app/)  
> **Backend API Telegraph:** [https://the-basketball-observer.onrender.com](https://the-basketball-observer.onrender.com)

A full-stack basketball analytics platform that combines real-time and historical NBA statistics to evaluate player impact, map shot dispersion on an authentic half-court projection, and identify player archetypes using dimensionality reduction and vector similarity.

The interface is styled after a classic broadsheet newspaper ("The Basketball Observer"), utilizing high-contrast typography, authentic column layouts, and a restrained newsprint parchment palette.

---

## Architecture Overview

The project is structured as a decoupled client-server architecture deployed on global edge infrastructure:

```
the-basketball-observer/
├── backend/
│   ├── api.py                  # FastAPI service and REST route definitions
│   ├── data/
│   │   ├── dna_database.csv    # Precomputed 50-player historical baseline dataset
│   │   ├── active_players_stats_2023_24.csv # 572-player regular season stats
│   │   └── shots.db            # 235,279 indexed field goal attempts (2023-24 & legends)
│   ├── src/
│   │   ├── data.py             # SQLite query engine, nba_api caching, data retrieval
│   │   ├── metrics.py          # Per-game metrics and impact scoring formulas
│   │   ├── dna.py              # Cosine similarity matching and PCA projection
│   │   └── viz.py              # Server-side Matplotlib chart generation (Agg backend)
│   ├── Dockerfile              # Container definition for Render Web Service
│   └── requirements.txt
│
└── frontend/
    └── NBA-ranker/
        ├── src/
        │   ├── components/     # React presentation, court projection & FAQ components
        │   │   ├── FaqView.tsx # Section IV: Technical Colophon & Methodology
        │   │   ├── CourtChart.tsx # SVG Half-Court shot dispersion projection
        │   │   ├── DnaAnalysisView.tsx # Radar fingerprint & PCA constellation
        │   │   ├── Masthead.tsx # Broadsheet newspaper masthead & navigation
        │   │   └── EditorialFooter.tsx # Footer colophon & technical FAQ trigger
        │   ├── constants/      # Calibration presets and static definitions
        │   ├── types/          # TypeScript domain models
        │   ├── App.tsx         # Main state coordination
        │   ├── config.ts       # Environment-aware API base URL configuration
        │   └── main.tsx
        ├── index.html
        ├── package.json
        ├── vercel.json         # Vercel SPA routing and build configuration
        └── vite.config.ts
```

---

## Core Sections & Features

### 1. Section I: Ranking Ledger (Custom Impact Valuation)

The Ranking Ledger evaluates player performance using customizable weights across scoring, playmaking, rebounding, and defensive impact.

#### Valuation Formula

$$\text{Impact Index} = (\text{PPG} \times w_{\text{ppg}}) + (\text{APG} \times w_{\text{apg}}) + (\text{RPG} \times w_{\text{rpg}}) + ((\text{SPG} + \text{BPG}) \times w_{\text{def}})$$

Where:
- $\text{PPG} = \frac{\text{PTS}}{\text{GP}}$ (Points per game)
- $\text{APG} = \frac{\text{AST}}{\text{GP}}$ (Assists per game)
- $\text{RPG} = \frac{\text{REB}}{\text{GP}}$ (Rebounds per game)
- $\text{SPG} = \frac{\text{STL}}{\text{GP}}$ (Steals per game)
- $\text{BPG} = \frac{\text{BLK}}{\text{GP}}$ (Blocks per game)

#### Weight Calibration & Presets

Users can adjust the four weight sliders in real time or select preset archetypes:
- **Balanced (Default):** $w_{\text{ppg}}=0.5$, $w_{\text{apg}}=0.3$, $w_{\text{rpg}}=0.2$, $w_{\text{def}}=0.1$
- **Pure Scorer:** $w_{\text{ppg}}=1.0$, $w_{\text{apg}}=0.1$, $w_{\text{rpg}}=0.1$, $w_{\text{def}}=0.0$
- **Floor General:** $w_{\text{ppg}}=0.3$, $w_{\text{apg}}=0.9$, $w_{\text{rpg}}=0.2$, $w_{\text{def}}=0.1$
- **Two-Way Lockdown:** $w_{\text{ppg}}=0.4$, $w_{\text{apg}}=0.2$, $w_{\text{rpg}}=0.3$, $w_{\text{def}}=0.8$
- **Glass Cleaner:** $w_{\text{ppg}}=0.2$, $w_{\text{apg}}=0.1$, $w_{\text{rpg}}=0.9$, $w_{\text{def}}=0.4$

---

### 2. Section II: Shot Dispersion (Court Geometry)

Visualizes individual field goal attempts across specific seasons using official NBA coordinates.

- **Coverage Scope:** Indexed SQLite database (`backend/data/shots.db`, 19.4 MB) storing **235,279 charted field goal attempts** covering the complete **2023–24 Season** across all 30 NBA franchises and 570+ active roster players. Historical superstars also feature their iconic championship and MVP campaigns (e.g. Michael Jordan 1997–98, Kobe Bryant 2005–06, Shaquille O'Neal 1999–00, Stephen Curry 2015–16 & 2020–21, LeBron James 2012–13, Victor Wembanyama 2023–24).
- **Coordinate System:** NBA API records shot coordinates in tenths of a foot, with $(0, 0)$ positioned at the center of the basket hoop (`LOC_X` spans from $-250$ to $+250$, `LOC_Y` spans from $-52$ behind the backboard to $+418$ at the half-court line).
- **SVG Projection:** The frontend renders an authentic half-court with precise regulation markings, including three-point arcs, restricted area, free-throw lane, and key markings.
- **Interactive Inspection:** Filtering by shot distance, made/missed outcome, 2PT/3PT category, and hovering over any shot displays action type, exact distance in feet, and result.
- **Perspective Flip:** Allows toggling court orientation between basket-at-bottom and basket-at-top.

---

### 3. Section III: Style DNA & Historical Archetypes

Analyzes playing style characteristics and compares active players to 50 historical NBA superstars.

#### A. Radar Fingerprint
Normalizes five statistical dimensions (Scoring, Playmaking, Rebound, Defense, Efficiency) using `MinMaxScaler` across the player pool to generate an authentic radar fingerprint.

#### B. Archetype Matching (Cosine Similarity)
Calculates cosine distance between the target player's feature vector and the historical dataset to discover the closest stylistic counterparts:

$$\text{Similarity}(u, v) = \frac{u \cdot v}{\|u\|_2 \|v\|_2}$$

#### C. PCA 2D Clustering
Uses Principal Component Analysis (`sklearn.decomposition.PCA(n_components=2)`) to reduce high-dimensional player profiles into a two-dimensional coordinate system, grouping players by statistical similarities.

#### D. Server-Rendered Matplotlib Figures
- **Fig. I (Scoring Volume vs. Shooting Accuracy):** Plots historical superstars on a Cartesian plane (PPG vs. FG%) with dataset average reference crosshairs, highlighting the selected player with custom annotations.
- **Fig. II (Career Trajectory & Prime Window):** Generates season-by-season curves for points, assists, and rebounds across the player's career, pinpointing their peak scoring season.

---

### 4. Section IV: Colophon & Technical FAQ

A comprehensive documentation dispatch accessible from both the navigation masthead and the footer (`[ Technical FAQ & Colophon ]`), providing full transparency on:
- **Telemetry Provenance:** How official NBA data is queried via `nba_api` from `stats.nba.com` (Second Spectrum optical tracking).
- **High-Speed Archival Engine:** The architectural rationale for compiling the 235k-shot SQLite engine to overcome cloud datacenter WAF perimeter throttling (`Read timed out (10s)`), achieving a **10,000× speedup (< 1 ms latency)**.
- **Valuation Formula:** Mathematical formulation of the Player Impact Index and standard editorial presets.
- **Spatial Geometry:** Tenths-of-a-foot coordinate system and SVG projection mechanics.
- **Style DNA Pipeline:** Standardized min-max radar axes, cosine similarity against 50 legends, and PCA dimensionality reduction.
- **Technology Stack:** Decoupled architecture leveraging Vercel Edge CDN and Render Web Services.

---

## Data Pipeline & Reliability Strategy

- **WAF & Rate Limit Protection:** Querying `stats.nba.com` live from cloud datacenter IPs frequently triggers Akamai Bot Manager timeouts (`Read timed out (10s)`). The system utilizes an embedded compound B-Tree indexed SQLite database (`backend/data/shots.db`) and a precomputed baseline dataset (`backend/data/dna_database.csv`), delivering sub-millisecond query responses.
- **In-Memory Caching:** Career stats and player search mappings are cached in memory during runtime to eliminate redundant HTTP requests to NBA endpoints.
- **Dynamic On-Demand Fetching:** When a user searches for an unlisted player, the backend dynamically queries `nba_api`, calculates their metrics, and appends them to the active analysis session.

---

## API Reference

| Method | Endpoint | Parameters | Description |
|---|---|---|---|
| `GET` | `/ranking` | `players` (str), `w_ppg`, `w_apg`, `w_rpg`, `w_def` (float) | Computes impact scores and per-game stats for specified players. |
| `GET` | `/players/search` | `q` (str), `limit` (int, default=10) | Searches active and historical NBA players by name. |
| `GET` | `/players/{player_id}/seasons` | `player_id` (int) | Returns all recorded seasons for a player. |
| `GET` | `/players/{player_id}/shots` | `player_id` (int), `season` (str, optional) | Returns shot coordinates and outcomes for a season from `shots.db`. |
| `GET` | `/analytics/dna/{player_id}` | `player_id` (int) | Returns radar dimensions, PCA coordinates, and top 3 archetypes. |
| `GET` | `/analytics/plots/efficiency.png` | `player_id` (int, optional) | Returns server-rendered PNG comparing volume vs efficiency. |
| `GET` | `/analytics/plots/trajectory.png` | `player_id` (int) | Returns server-rendered PNG of career progression by season. |

---

## Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for optimized production builds
- **Tailwind CSS v4** with a custom vintage newsprint `@theme`
- **Custom SVG Vector Rendering** for half-court shot charts, radar plots, and PCA constellations
- **Hosted on Vercel Edge CDN** ([https://the-basketball-observer.vercel.app/](https://the-basketball-observer.vercel.app/))

### Backend
- **Python 3.12**
- **FastAPI & Uvicorn** for async REST endpoints and image streaming
- **SQLite3** with compound B-Tree indices on `(player_id, season)` for instant 235k-shot queries
- **Pandas & NumPy** for data transformation and per-game aggregations
- **Scikit-Learn** for MinMax scaling, Cosine Similarity, and PCA
- **Matplotlib** (`Agg` headless backend) for server-side plot generation
- **nba_api** for official NBA statistics integration
- **Hosted on Render Web Services** ([https://the-basketball-observer.onrender.com](https://the-basketball-observer.onrender.com))

---

## Local Setup

### 1. Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher (with npm)

### 2. Backend Setup

From the repository root:

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn api:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`. Swagger documentation is accessible at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup

In a separate terminal window:

```bash
# Navigate to frontend directory
cd frontend/NBA-ranker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.
