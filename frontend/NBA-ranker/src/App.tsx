import { useEffect, useState, useCallback } from "react";
import type { PlayerRank, SearchPlayer, Weights } from "./types";
import { PRESETS } from "./constants/presets";
import { Masthead } from "./components/Masthead";
import { IndexCalibration } from "./components/IndexCalibration";
import { RankingTable } from "./components/RankingTable";
import { ArchiveSearch } from "./components/ArchiveSearch";
import { EditorialFooter } from "./components/EditorialFooter";
import { ShotChartView } from "./components/ShotChartView";

const DEFAULT_NAMES = [
  "LeBron James",
  "Stephen Curry",
  "Luka Dončić",
  "Giannis Antetokounmpo",
  "Nikola Jokić",
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"ranking" | "shotchart">("ranking");
  const [players, setPlayers] = useState<PlayerRank[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(DEFAULT_NAMES);
  const [weights, setWeights] = useState<Weights>({
    w_ppg: 0.5,
    w_apg: 0.3,
    w_rpg: 0.2,
    w_def: 0.1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchPlayer[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const fetchRanking = useCallback(
    async (currentWeights: Weights, currentPlayers: string[]) => {
      if (currentPlayers.length === 0) {
        setPlayers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const encodedPlayers = encodeURIComponent(currentPlayers.join(","));
        const url = `http://127.0.0.1:8000/ranking?players=${encodedPlayers}&w_ppg=${currentWeights.w_ppg}&w_apg=${currentWeights.w_apg}&w_rpg=${currentWeights.w_rpg}&w_def=${currentWeights.w_def}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Telegraph server returned error code ${res.status}`);
        }
        const data = await res.json();
        setPlayers(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Network error";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchRanking(weights, selectedPlayers);
  }, [fetchRanking]);

  const handleWeightChange = (key: keyof Weights, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: Math.round(value * 100) / 100,
    }));
  };

  const handleApplyPreset = (presetName: string) => {
    const p = PRESETS[presetName];
    if (p) {
      setWeights(p);
      fetchRanking(p, selectedPlayers);
    }
  };

  const handleAddPlayer = (player: SearchPlayer) => {
    const isAlreadySelected = selectedPlayers.some(
      (name) => name.toLowerCase() === player.full_name.toLowerCase()
    );
    if (isAlreadySelected) return;

    const nextRoster = [...selectedPlayers, player.full_name];
    setSelectedPlayers(nextRoster);
    fetchRanking(weights, nextRoster);
  };

  const handleRemovePlayer = (playerName: string) => {
    const nextRoster = selectedPlayers.filter(
      (name) => name.toLowerCase() !== playerName.toLowerCase()
    );
    setSelectedPlayers(nextRoster);
    fetchRanking(weights, nextRoster);
  };

  const handleResetRoster = () => {
    setSelectedPlayers(DEFAULT_NAMES);
    fetchRanking(weights, DEFAULT_NAMES);
  };

  const handleClearRoster = () => {
    setSelectedPlayers([]);
    setPlayers([]);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/players/search?q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=10`
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-5 sm:px-6 w-full">
      <Masthead activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "ranking" ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 border-b border-border-strong pb-8">
            <IndexCalibration
              weights={weights}
              onWeightChange={handleWeightChange}
              onApplyPreset={handleApplyPreset}
              onCalculate={() => fetchRanking(weights, selectedPlayers)}
              loading={loading}
            />

            <RankingTable
              players={players}
              loading={loading}
              error={error}
              onRemovePlayer={handleRemovePlayer}
              onResetRoster={handleResetRoster}
              onClearRoster={handleClearRoster}
            />
          </div>

          <ArchiveSearch
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
            searching={searching}
            hasSearched={hasSearched}
            searchResults={searchResults}
            onAddPlayer={handleAddPlayer}
            enlistedNames={selectedPlayers}
          />
        </>
      ) : (
        <ShotChartView />
      )}

      <EditorialFooter />
    </div>
  );
}