import type { PlayerRank } from "../types";

interface RankingTableProps {
  players: PlayerRank[];
  loading: boolean;
  error: string | null;
  onRemovePlayer: (playerName: string) => void;
  onResetRoster: () => void;
  onClearRoster: () => void;
}

export function RankingTable({
  players,
  loading,
  error,
  onRemovePlayer,
  onResetRoster,
  onClearRoster,
}: RankingTableProps) {
  return (
    <main className="w-full">
      <div className="bg-paper-card border border-border-strong p-5 relative shadow-[1px_1px_0px_#111]">
        {/* Table Header Strip */}
        <div className="border-b-2 border-border-strong pb-1.5 mb-4 flex flex-wrap justify-between items-baseline gap-2">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-lg uppercase tracking-wider text-ink font-bold">
              Canonical Player Ranking
            </h2>
            <span className="font-mono text-[10px] text-ink-muted tracking-wider">
              ({players.length} Enlisted)
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <button
              type="button"
              onClick={onResetRoster}
              className="text-ink-secondary hover:text-ink underline cursor-pointer"
            >
              [Standard 5]
            </button>
            <button
              type="button"
              onClick={onClearRoster}
              className="text-ink-muted hover:text-accent underline cursor-pointer"
            >
              [Clear All]
            </button>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 mb-4 text-center font-mono text-xs text-accent bg-accent/5 border border-accent">
            [TELEGRAPH DISCONNECTED]: Unable to communicate with statistics server.
            <br />
            Ensure FastAPI is running at port 8000. ({error})
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-12 text-center font-mono text-xs tracking-wider text-ink-secondary border border-dashed border-border-muted my-2">
            [TABULATING OFFICIAL LEAGUE DISPATCHES... PLEASE STAND BY]
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-border-strong font-mono text-[11px] text-ink-secondary tracking-wider uppercase">
                  <th className="text-left py-2 px-2.5 w-9">Pos.</th>
                  <th className="text-left py-2 px-2.5">Player & Moniker</th>
                  <th className="text-right py-2 px-1.5">GP</th>
                  <th className="text-right py-2 px-1.5">PPG</th>
                  <th className="text-right py-2 px-1.5">APG</th>
                  <th className="text-right py-2 px-1.5">RPG</th>
                  <th className="text-right py-2 px-1.5">SPG</th>
                  <th className="text-right py-2 px-1.5">BPG</th>
                  <th className="text-right py-2 px-1.5">FG%</th>
                  <th className="text-right py-2 px-2 font-bold">Impact Rating</th>
                  <th className="text-center py-2 px-1.5 w-8">Drop</th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="py-10 text-center font-mono text-xs text-ink-secondary"
                    >
                      [NO BALLPLAYERS CURRENTLY ENLISTED IN LEDGER. QUERY ARCHIVE BELOW TO ENLIST PLAYERS.]
                    </td>
                  </tr>
                ) : (
                  players.map((p, index) => {
                    const isFirst = index === 0;
                    return (
                      <tr
                        key={p.Player}
                        className="border-b border-border-muted hover:bg-black/[0.02] transition-colors"
                      >
                        {/* Rank Position */}
                        <td
                          className={`py-3 px-2.5 font-display text-lg font-black ${
                            isFirst ? "text-accent" : "text-ink"
                          }`}
                        >
                          {index + 1}.
                        </td>

                        {/* Player Name and Subtitle */}
                        <td className="py-3 px-2.5">
                          <div className="font-serif text-base font-semibold text-ink">
                            {p.Player}
                          </div>
                          <div className="font-mono text-[10px] text-ink-muted mt-0.5">
                            {p.PTS.toLocaleString()} PTS · {p.AST.toLocaleString()} AST · {p.REB.toLocaleString()} REB · {p.STL.toLocaleString()} STL · {p.BLK.toLocaleString()} BLK
                          </div>
                        </td>

                        {/* Stats */}
                        <td className="py-3 px-1.5 font-mono text-xs text-right text-ink">
                          {p.GP}
                        </td>
                        <td className="py-3 px-1.5 font-mono text-xs text-right text-ink">
                          {p.PPG.toFixed(1)}
                        </td>
                        <td className="py-3 px-1.5 font-mono text-xs text-right text-ink">
                          {p.APG.toFixed(1)}
                        </td>
                        <td className="py-3 px-1.5 font-mono text-xs text-right text-ink">
                          {p.RPG.toFixed(1)}
                        </td>
                        <td className="py-3 px-1.5 font-mono text-xs text-right text-ink">
                          {p.SPG.toFixed(1)}
                        </td>
                        <td className="py-3 px-1.5 font-mono text-xs text-right text-ink">
                          {p.BPG.toFixed(1)}
                        </td>
                        <td className="py-3 px-1.5 font-mono text-xs text-right text-ink">
                          {p.FG_PCT.toFixed(1)}%
                        </td>

                        {/* Impact Score */}
                        <td
                          className={`py-3 px-2 font-mono text-base font-bold text-right ${
                            isFirst ? "text-accent" : "text-ink"
                          }`}
                        >
                          {p.ALL_AROUND_SCORE.toFixed(2)}
                        </td>

                        {/* Remove Action */}
                        <td className="py-3 px-1.5 text-center font-mono text-xs">
                          <button
                            type="button"
                            title={`Drop ${p.Player} from ledger`}
                            onClick={() => onRemovePlayer(p.Player)}
                            className="text-ink-muted hover:text-accent font-bold cursor-pointer transition-colors px-1"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
