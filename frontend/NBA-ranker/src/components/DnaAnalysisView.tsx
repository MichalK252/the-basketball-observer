import { useState, useEffect } from "react";
import type { DnaResponse, SearchPlayer } from "../types";
import { DnaRadarChart } from "./DnaRadarChart";
import { PcaScatterPlot } from "./PcaScatterPlot";
import { API_BASE_URL } from "../config";

const FEATURED_PLAYERS = [
  { id: 203999, name: "Nikola Jokić" },
  { id: 201939, name: "Stephen Curry" },
  { id: 2544, name: "LeBron James" },
  { id: 1629029, name: "Luka Dončić" },
  { id: 203507, name: "Giannis Antetokounmpo" },
  { id: 893, name: "Michael Jordan" },
  { id: 977, name: "Kobe Bryant" },
  { id: 406, name: "Shaquille O'Neal" },
];


const ARCHETYPE_DESCRIPTIONS: Record<string, string> = {
  "Helicentric Floor General":
    "Primary engine commanding overwhelming possession shares. Operates as both primary scorer and playmaking hub with high assist usage.",
  "Point Center / Playmaking Big":
    "Anomalous high-post orchestrator combining paint dominance, rebounding leverage, and elite facilitation vision.",
  "Two-Way Defensive Anchor":
    "Rim deterrence and switchable perimeter disruptor capable of turning stops directly into efficient transition offense.",
  "Pure Perimeter Scorer":
    "High-gravity shooting specialist who bends defensive geometries through off-ball movement, perimeter range, and isolation scoring.",
  "Rim Protector & Glass Cleaner":
    "Vertical rim runner and defensive deterrent controlling second-chance opportunities and dominating inside finishing.",
  "Balanced All-Around Contributor":
    "Versatile multi-category asset without statistical liability, balancing scoring, rebounding, and facilitation across possessions.",
};

const getApiHost = () => {
  return API_BASE_URL;
};


export function DnaAnalysisView() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(203999);
  const [selectedPlayerName, setSelectedPlayerName] = useState<string>("Nikola Jokić");

  const [data, setData] = useState<DnaResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchPlayer[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchDna = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/analytics/dna/${selectedPlayerId}`);
        if (!res.ok) {
          throw new Error(`Dispatch server error ${res.status}`);
        }
        const json = await res.json();
        if (json.error) {
          throw new Error(json.error);
        }
        if (!isCancelled) {
          setData(json);
          if (json.name) setSelectedPlayerName(json.name);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : "Error loading analysis";
          setError(msg);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchDna();

    return () => {
      isCancelled = true;
    };
  }, [selectedPlayerId]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/players/search?q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=6`
      );
      if (res.ok) {
        const results = await res.json();
        setSearchResults(results);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchPlayer = (p: SearchPlayer) => {
    setSelectedPlayerId(p.id);
    setSelectedPlayerName(p.full_name);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-paper-card border border-border-strong p-4 shadow-[1px_1px_0px_#111]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
              Comparative Analytical Intelligence
            </div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink">
              Player Style DNA & Archetype Clustering: {selectedPlayerName}
            </h2>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 relative">
            <input
              type="text"
              placeholder="Search historical player..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono bg-paper border border-border-strong focus:outline-none focus:ring-1 focus:ring-ink w-48 sm:w-60"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-3 py-1.5 text-xs font-mono uppercase bg-ink text-paper font-bold cursor-pointer hover:bg-ink-secondary"
            >
              {searching ? "..." : "Query"}
            </button>

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-paper border border-border-strong shadow-[2px_2px_0px_#111] z-20">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectSearchPlayer(p)}
                    className="w-full text-left px-3 py-2 text-xs font-mono border-b border-border-muted last:border-b-0 hover:bg-paper-dark flex justify-between"
                  >
                    <span>{p.full_name}</span>
                    <span className="text-ink-muted">
                      {p.is_active ? "[ACTIVE]" : "[RET.]"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border-muted font-mono text-xs">
          <span className="uppercase text-ink-muted text-[11px] mr-1">
            Featured Profiles:
          </span>
          {FEATURED_PLAYERS.map((fp) => (
            <button
              key={fp.id}
              type="button"
              onClick={() => {
                setSelectedPlayerId(fp.id);
                setSelectedPlayerName(fp.name);
              }}
              className={`px-2.5 py-1 text-[11px] uppercase border border-border-strong cursor-pointer transition-colors ${
                selectedPlayerId === fp.id
                  ? "bg-accent text-paper font-bold"
                  : "bg-paper text-ink hover:bg-paper-dark"
              }`}
            >
              {fp.name}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="bg-paper-card border border-border-strong p-12 text-center font-mono text-sm text-ink-muted">
          Computing high-dimensional cosine similarity and 2D PCA projection...
        </div>
      )}

      {error && !loading && (
        <div className="bg-accent-light border border-accent p-4 text-center font-mono text-xs text-accent">
          {error}
        </div>
      )}

      {!loading && data && (
        <>
          <div className="bg-paper-card border border-border-strong p-4 shadow-[1px_1px_0px_#111]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-border-muted pb-4 md:pb-0 md:pr-4">
                <div className="font-mono text-[11px] uppercase tracking-wider text-ink-secondary mb-1">
                  Classified Stylistic Archetype
                </div>
                <div className="font-display text-2xl font-bold uppercase text-ink flex items-baseline gap-3">
                  <span>{data.archetype}</span>
                  <span className="font-mono text-xs bg-ink text-paper px-2 py-0.5">
                    {data.confidence}% Fit
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-secondary leading-relaxed font-serif">
                  {ARCHETYPE_DESCRIPTIONS[data.archetype] ||
                    "Demonstrates characteristic high-leverage traits consistent with modern NBA positional paradigms."}
                </p>
              </div>

              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-ink-secondary mb-2">
                  Top Statistical Doppelgängers
                </div>
                <div className="space-y-2">
                  {data.similar_players.map((sp) => (
                    <div
                      key={sp.id}
                      onClick={() => {
                        setSelectedPlayerId(sp.id);
                        setSelectedPlayerName(sp.name);
                      }}
                      className="bg-paper border border-border-muted p-2 cursor-pointer hover:border-ink transition-colors"
                    >
                      <div className="flex justify-between font-mono text-xs mb-1">
                        <strong className="text-ink">{sp.name}</strong>
                        <span className="text-accent font-bold">
                          {sp.similarity_pct}%
                        </span>
                      </div>
                      <div className="w-full bg-paper-dark h-1.5 border border-border-muted">
                        <div
                          className="bg-accent h-full"
                          style={{ width: `${Math.min(100, sp.similarity_pct)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DnaRadarChart radar={data.radar} playerName={data.name} />
            <PcaScatterPlot
              points={data.league_map}
              onSelectPlayer={(id, name) => {
                setSelectedPlayerId(id);
                setSelectedPlayerName(name);
              }}
            />
          </div>

          <div className="bg-paper-card border border-border-strong p-4 shadow-[1px_1px_0px_#111]">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-border-muted font-mono text-xs">
              <span className="uppercase tracking-wider font-bold text-ink">
                Hardwood Statistical Dispatches · Matplotlib Engine
              </span>
              <span className="text-ink-secondary text-[11px]">
                Server-Rendered Exploratory Data Analysis
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-border-muted bg-paper p-3 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs font-bold uppercase text-ink mb-1">
                    Fig. I · Scoring Volume vs Shooting Accuracy ({data.name})
                  </div>
                  <p className="font-serif text-xs text-ink-secondary mb-3 leading-relaxed">
                    Highlights {data.name} on the historical efficiency landscape vs 50 NBA superstars. Dashed crosshairs indicate league average scoring volume and accuracy.
                  </p>
                </div>
                <div className="border border-border-strong overflow-hidden bg-white shadow-inner flex items-center justify-center min-h-[260px]">
                  <img
                    key={`eff-${selectedPlayerId}`}
                    src={`${getApiHost()}/analytics/plots/efficiency.png?player_id=${selectedPlayerId}`}
                    alt={`Scoring Volume vs Shooting Accuracy - ${data.name}`}
                    className="w-full h-auto object-contain block"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.retried) {
                        target.dataset.retried = "true";
                        if (getApiHost().includes("localhost")) {
                          target.src = `http://127.0.0.1:8000/analytics/plots/efficiency.png?player_id=${selectedPlayerId}`;
                        } else if (getApiHost().includes("127.0.0.1")) {
                          target.src = `http://localhost:8000/analytics/plots/efficiency.png?player_id=${selectedPlayerId}`;
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="border border-border-muted bg-paper p-3 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs font-bold uppercase text-ink mb-1">
                    Fig. II · Career Trajectory & Prime Window ({data.name})
                  </div>
                  <p className="font-serif text-xs text-ink-secondary mb-3 leading-relaxed">
                    Season-by-season progression across points (PPG), assists (APG), and rebounds (RPG), pinpointing the peak scoring prime season for {data.name}.
                  </p>
                </div>
                <div className="border border-border-strong overflow-hidden bg-white shadow-inner flex items-center justify-center min-h-[260px]">
                  <img
                    key={`traj-${selectedPlayerId}`}
                    src={`${getApiHost()}/analytics/plots/trajectory.png?player_id=${selectedPlayerId}`}
                    alt={`Career Trajectory - ${data.name}`}
                    className="w-full h-auto object-contain block"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.retried) {
                        target.dataset.retried = "true";
                        if (getApiHost().includes("localhost")) {
                          target.src = `http://127.0.0.1:8000/analytics/plots/trajectory.png?player_id=${selectedPlayerId}`;
                        } else if (getApiHost().includes("127.0.0.1")) {
                          target.src = `http://localhost:8000/analytics/plots/trajectory.png?player_id=${selectedPlayerId}`;
                        }
                      }
                    }}
                  />
                </div>
              </div>


            </div>
          </div>
        </>
      )}
    </div>
  );
}
