import type { PlayerRank } from "../types";

interface RankingTableProps {
  players: PlayerRank[];
  loading: boolean;
  error: string | null;
}

export function RankingTable({ players, loading, error }: RankingTableProps) {
  return (
    <main className="w-full">
      <div className="bg-paper-card border border-border-strong p-5 relative shadow-[1px_1px_0px_#111]">
        {/* Table Header Strip */}
        <div className="border-b-2 border-border-strong pb-1.5 mb-4 flex justify-between items-baseline">
          <h2 className="font-display text-lg uppercase tracking-wider text-ink font-bold">
            Canonical Player Ranking
          </h2>
          <span className="font-mono text-[10px] text-ink-muted font-bold tracking-widest uppercase">
            [Table I]
          </span>
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
                  <th className="text-left py-2 px-2.5 w-10">Pos.</th>
                  <th className="text-left py-2 px-2.5">Player & Moniker</th>
                  <th className="text-right py-2 px-1.5">GP</th>
                  <th className="text-right py-2 px-1.5">PPG</th>
                  <th className="text-right py-2 px-1.5">APG</th>
                  <th className="text-right py-2 px-1.5">RPG</th>
                  <th className="text-right py-2 px-1.5">SPG</th>
                  <th className="text-right py-2 px-1.5">BPG</th>
                  <th className="text-right py-2 px-1.5">FG%</th>
                  <th className="text-right py-2 px-2 font-bold">Impact Rating</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, index) => {
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
