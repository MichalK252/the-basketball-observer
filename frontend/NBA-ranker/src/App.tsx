import { useEffect, useState, useCallback } from "react";
import type { PlayerRank, SearchPlayer, Weights } from "./types";
import { PRESETS } from "./constants/presets";
import { Masthead } from "./components/Masthead";
import { IndexCalibration } from "./components/IndexCalibration";
import { RankingTable } from "./components/RankingTable";
import { ArchiveSearch } from "./components/ArchiveSearch";
import { EditorialFooter } from "./components/EditorialFooter";

export default function App() {
  const [players, setPlayers] = useState<PlayerRank[]>([]);
  const [weights, setWeights] = useState<Weights>({
    w_ppg: 0.5,
    w_apg: 0.3,
    w_rpg: 0.2,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search archive state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchPlayer[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const fetchRanking = useCallback(async (currentWeights: Weights) => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://127.0.0.1:8000/ranking?w_ppg=${currentWeights.w_ppg}&w_apg=${currentWeights.w_apg}&w_rpg=${currentWeights.w_rpg}`;
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
  }, []);

  useEffect(() => {
    fetchRanking(weights);
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
      fetchRanking(p);
    }
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
        )}&limit=8`
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch {
      // silently handle network search errors
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-[1020px] mx-auto px-4 py-6 sm:px-6 sm:py-8 w-full">
      {/* Newspaper Masthead */}
      <Masthead />

      {/* Main Two-Column Editorial Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-7 border-b border-border-strong pb-8">
        <IndexCalibration
          weights={weights}
          onWeightChange={handleWeightChange}
          onApplyPreset={handleApplyPreset}
          onCalculate={() => fetchRanking(weights)}
          loading={loading}
        />

        <RankingTable
          players={players}
          loading={loading}
          error={error}
        />
      </div>

      {/* Archival Inquiry & Player Registry */}
      <ArchiveSearch
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
        searching={searching}
        hasSearched={hasSearched}
        searchResults={searchResults}
      />

      {/* Colophon & Footnotes */}
      <EditorialFooter />
    </div>
  );
}