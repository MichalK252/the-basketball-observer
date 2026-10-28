import { useState, useEffect } from "react";
import type { Shot, SearchPlayer } from "../types";
import { CourtChart } from "./CourtChart";
import { API_BASE_URL } from "../config";

const FEATURED_PLAYERS = [
  { id: 201939, name: "Stephen Curry", season: "2023-24" },
  { id: 203999, name: "Nikola Jokić", season: "2023-24" },
  { id: 2544, name: "LeBron James", season: "2023-24" },
  { id: 1629029, name: "Luka Dončić", season: "2023-24" },
  { id: 203507, name: "Giannis Antetokounmpo", season: "2023-24" },
  { id: 893, name: "Michael Jordan", season: "1997-98" },
  { id: 977, name: "Kobe Bryant", season: "2005-06" },
  { id: 406, name: "Shaquille O'Neal", season: "1999-00" },
];

export function ShotChartView() {
  const [query, setQuery] = useState("Stephen Curry");
  const [searchResults, setSearchResults] = useState<SearchPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<SearchPlayer>({
    id: 201939,
    full_name: "Stephen Curry",
    is_active: true,
  });
  const [seasons, setSeasons] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("2023-24");
  const [shots, setShots] = useState<Shot[]>([]);
  const [loadingShots, setLoadingShots] = useState(false);
  const [loadingSeasons, setLoadingSeasons] = useState(false);
  const [filter, setFilter] = useState<"all" | "made" | "missed" | "3pt" | "2pt">("all");
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/players/search?q=${encodeURIComponent(query.trim())}&limit=6`
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (!selectedPlayer) return;

    const loadSeasons = async () => {
      setLoadingSeasons(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/players/${selectedPlayer.id}/seasons`);
        if (!res.ok) throw new Error("Failed to load seasons");
        const data: string[] = await res.json();
        setSeasons(data);
        if (data.length > 0) {
          setSelectedSeason(data[0]);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error";
        setError(msg);
      } finally {
        setLoadingSeasons(false);
      }
    };

    loadSeasons();
  }, [selectedPlayer]);

  useEffect(() => {
    if (!selectedPlayer || !selectedSeason) return;

    const loadShots = async () => {
      setLoadingShots(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/players/${selectedPlayer.id}/shots?season=${selectedSeason}`
        );
        if (!res.ok) throw new Error("Failed to load shot coordinates");
        const data: Shot[] = await res.json();
        setShots(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error";
        setError(msg);
      } finally {
        setLoadingShots(false);
      }
    };

    loadShots();
  }, [selectedPlayer, selectedSeason]);

  const selectPlayer = (p: SearchPlayer) => {
    setSelectedPlayer(p);
    setQuery(p.full_name);
    setSearchResults([]);
  };

  const totalShots = shots.length;
  const madeShots = shots.filter((s) => s.SHOT_MADE_FLAG === 1).length;
  const fgPct = totalShots > 0 ? ((madeShots / totalShots) * 100).toFixed(1) : "0.0";

  const threeShots = shots.filter((s) => s.SHOT_TYPE.includes("3PT"));
  const madeThree = threeShots.filter((s) => s.SHOT_MADE_FLAG === 1).length;
  const threePct = threeShots.length > 0 ? ((madeThree / threeShots.length) * 100).toFixed(1) : "0.0";

  const twoShots = shots.filter((s) => s.SHOT_TYPE.includes("2PT"));
  const madeTwo = twoShots.filter((s) => s.SHOT_MADE_FLAG === 1).length;
  const twoPct = twoShots.length > 0 ? ((madeTwo / twoShots.length) * 100).toFixed(1) : "0.0";

  return (
    <div className="w-full">
      <div className="border border-border-strong bg-paper-card p-5 mb-6 shadow-[1px_1px_0px_#111]">
        <div className="border-b-2 border-border-strong pb-1.5 mb-4 flex justify-between items-baseline">
          <h2 className="font-display text-lg uppercase tracking-wider text-ink font-bold">
            Hardwood Shot Dispersion Archive
          </h2>
          <span className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase">
            [Spatial Optical Data 1996—Pres.]
          </span>
        </div>

        <p className="text-xs text-ink-secondary mb-4 font-serif">
          Inquire player records to render spatial coordinate dispersion patterns plotted upon the hardwood court surface.
        </p>

        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mr-1">
            Archival Dossiers:
          </span>
          {FEATURED_PLAYERS.map((p) => {
            const isSelected = selectedPlayer.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPlayer({ id: p.id, full_name: p.name, is_active: true });
                  setQuery(p.name);
                  setSelectedSeason(p.season);
                  setSearchResults([]);
                }}
                className={`font-serif text-xs px-2.5 py-1 border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-ink text-paper border-ink font-bold"
                    : "bg-paper text-ink border-border-strong hover:bg-paper-dark"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-3">
          <div className="relative">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Inquire player name, e.g. 'Curry', 'Jordan', 'Bryant'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border border-border-strong bg-paper px-3 py-2 font-serif text-sm text-ink outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="bg-paper hover:bg-paper-dark border border-border-strong text-ink text-xs font-serif px-4 py-2 cursor-pointer shadow-[1px_1px_0px_#111] transition-transform active:translate-x-0.5 active:translate-y-0.5"
              >
                Find Ballplayer
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-paper border border-border-strong shadow-[2px_2px_0px_#111]">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPlayer(p)}
                    className="w-full text-left px-3 py-2 border-b border-border-muted hover:bg-paper-dark flex justify-between items-center text-xs cursor-pointer font-serif"
                  >
                    <span className="font-semibold text-ink">{p.full_name}</span>
                    <span className="font-mono text-[10px] text-ink-muted">
                      ID #{p.id} · {p.is_active ? "Active" : "Archived"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              disabled={loadingSeasons || seasons.length === 0}
              className="w-full border border-border-strong bg-paper px-3 py-2 font-mono text-xs text-ink outline-none cursor-pointer focus:border-accent"
            >
              {loadingSeasons ? (
                <option>Loading campaign...</option>
              ) : seasons.length === 0 ? (
                <option>No campaigns on file</option>
              ) : (
                seasons.map((s) => (
                  <option key={s} value={s}>
                    Campaign {s}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {selectedPlayer && (
          <div className="mt-4 pt-3 border-t border-dashed border-border-muted flex flex-wrap justify-between items-center gap-3">
            <div>
              <span className="font-serif text-lg font-bold text-ink mr-2">
                {selectedPlayer.full_name}
              </span>
              <span className="font-mono text-xs text-ink-secondary">
                [Season {selectedSeason} Ledger]
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-ink">
              <span className="border border-border-strong bg-paper px-2 py-1">
                FGA: <strong>{totalShots}</strong>
              </span>
              <span className="border border-border-strong bg-paper px-2 py-1">
                FG%: <strong className="text-accent">{fgPct}%</strong> ({madeShots}/{totalShots})
              </span>
              <span className="border border-border-strong bg-paper px-2 py-1">
                2PT%: <strong>{twoPct}%</strong> ({madeTwo}/{twoShots.length})
              </span>
              <span className="border border-border-strong bg-paper px-2 py-1">
                3PT%: <strong>{threePct}%</strong> ({madeThree}/{threeShots.length})
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-1.5 mb-4 font-mono text-xs">
        {(["all", "made", "missed", "3pt", "2pt"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={`px-3 py-1 border border-border-strong uppercase cursor-pointer shadow-[1px_1px_0px_#111] transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
              filter === t ? "bg-ink text-paper font-bold" : "bg-paper text-ink hover:bg-paper-dark"
            }`}
          >
            {t === "all"
              ? "All Shots"
              : t === "made"
              ? "Made Only"
              : t === "missed"
              ? "Missed Only"
              : t === "3pt"
              ? "3-Pointers"
              : "2-Pointers"}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 mb-4 text-center font-mono text-xs text-accent bg-accent/5 border border-accent max-w-[620px] mx-auto">
          [DISPATCH ERROR]: Unable to retrieve shot records ({error}).
        </div>
      )}

      {loadingShots ? (
        <div className="py-20 text-center font-mono text-xs text-ink-secondary border border-dashed border-border-muted max-w-[620px] mx-auto my-4 bg-paper-card">
          [PLOTTING COURT DISPERSION COORDINATES... PLEASE STAND BY]
        </div>
      ) : shots.length === 0 ? (
        <div className="py-16 text-center font-mono text-xs text-ink-secondary border border-dashed border-border-muted max-w-[620px] mx-auto my-4 bg-paper-card">
          [NO RECORDED FIELD GOAL ATTEMPTS FOR THIS CAMPAIGN]
        </div>
      ) : (
        <CourtChart shots={shots} filter={filter} />
      )}
    </div>
  );
}
