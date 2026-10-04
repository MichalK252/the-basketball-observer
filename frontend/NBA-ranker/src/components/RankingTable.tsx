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
        <div className="border-b-2 border-border-strong pb-2 mb-4 flex flex-wrap justify-between items-baseline gap-2">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-lg uppercase tracking-wider text-ink font-bold">
              Player Impact Ledger
            </h2>
            <span className="font-mono text-[11px] text-ink-muted">
              ({players.length} Enlisted)
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
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

        {error && (
          <div className="p-3 mb-4 text-center font-mono text-xs text-accent bg-accent/5 border border-accent">
            Unable to communicate with statistics server. ({error})
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center font-mono text-xs tracking-wider text-ink-secondary border border-dashed border-border-muted my-2">
            Tabulating player records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-border-strong font-mono text-xs text-ink-secondary tracking-wider uppercase">
                  <th className="text-left py-2 px-2.5 w-10">#</th>
                  <th className="text-left py-2 px-3">Player</th>
                  <th className="text-right py-2 px-2 font-mono">GP</th>
                  <th className="text-right py-2 px-2 font-mono">PPG</th>
                  <th className="text-right py-2 px-2 font-mono">APG</th>
                  <th className="text-right py-2 px-2 font-mono">RPG</th>
                  <th className="text-right py-2 px-2 font-mono">SPG</th>
                  <th className="text-right py-2 px-2 font-mono">BPG</th>
                  <th className="text-right py-2 px-2 font-mono">FG%</th>
                  <th className="text-right py-2 px-3 font-mono font-bold text-ink">Score</th>
                  <th className="text-center py-2 px-2 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="py-10 text-center font-mono text-xs text-ink-secondary"
                    >
                      No ballplayers currently enlisted. Use the inquiry archive below to enlist players.
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
                        <td
                          className={`py-2.5 px-2.5 font-display text-base font-black ${
                            isFirst ? "text-accent" : "text-ink"
                          }`}
                        >
                          {index + 1}.
                        </td>

                        <td className="py-2.5 px-3 font-serif text-base font-semibold text-ink whitespace-nowrap">
                          {p.Player}
                        </td>

                        <td className="py-2.5 px-2 font-mono text-xs text-right text-ink tabular-nums">
                          {p.GP}
                        </td>
                        <td className="py-2.5 px-2 font-mono text-xs text-right text-ink font-semibold tabular-nums">
                          {p.PPG.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-2 font-mono text-xs text-right text-ink tabular-nums">
                          {p.APG.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-2 font-mono text-xs text-right text-ink tabular-nums">
                          {p.RPG.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-2 font-mono text-xs text-right text-ink tabular-nums">
                          {p.SPG.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-2 font-mono text-xs text-right text-ink tabular-nums">
                          {p.BPG.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-2 font-mono text-xs text-right text-ink tabular-nums">
                          {p.FG_PCT.toFixed(1)}%
                        </td>

                        <td
                          className={`py-2.5 px-3 font-mono text-base font-bold text-right tabular-nums ${
                            isFirst ? "text-accent" : "text-ink"
                          }`}
                        >
                          {p.ALL_AROUND_SCORE.toFixed(2)}
                        </td>

                        <td className="py-2.5 px-2 text-center font-mono text-xs">
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
