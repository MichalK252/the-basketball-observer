interface FaqViewProps {
  onBackToRanking?: () => void;
}

export function FaqView({ onBackToRanking }: FaqViewProps) {
  return (
    <article className="w-full">
      {/* Top Colophon Masthead */}
      <div className="border-b-2 border-border-strong pb-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-secondary">
            Special Gazette Supplement · Technical Colophon & Inquiry Ledger
          </div>

          {onBackToRanking && (
            <button
              type="button"
              onClick={onBackToRanking}
              className="font-mono text-xs uppercase tracking-wider px-3 py-1 border border-border-strong bg-paper hover:bg-ink hover:text-paper transition-colors cursor-pointer"
            >
              ← Return to Ledger
            </button>
          )}
        </div>

        <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-ink mb-2">
          The Observer's Handbook: Telemetry, Geometry & Valuation
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-ink-secondary max-w-3xl leading-relaxed">
          An authoritative disclosure detailing data provenance from official league archives,
          computational optimizations engineered for zero latency, and the mathematical mechanics
          governing our player valuation index.
        </p>
      </div>

      {/* Grid of Inquiries / Dispatches */}
      <div className="space-y-10">
        {/* DISPATCH 1: Data API */}
        <section className="border border-border-strong bg-paper-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
              Dispatch I · Telemetry Provenance
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-ink mb-4 pb-2 border-b border-border-muted">
            Which API and statistical records power The Basketball Observer?
          </h3>

          <div className="font-serif text-sm sm:text-base leading-relaxed text-ink space-y-4">
            <p>
              All statistics presented in <em>The Basketball Observer</em> originate from the official{" "}
              <strong>National Basketball Association (NBA)</strong> statistical telemetry infrastructure (
              <code className="font-mono text-xs bg-paper-dark px-1.5 py-0.5 border border-border-muted">
                stats.nba.com
              </code>
              ), interfaced via the battle-tested Python library{" "}
              <code className="font-mono text-xs bg-paper-dark px-1.5 py-0.5 border border-border-muted">
                nba_api
              </code>
              .
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 font-mono text-xs">
              <div className="border border-border-muted bg-paper p-3">
                <span className="font-bold text-ink block mb-1">LeagueDashPlayerStats</span>
                <span className="text-ink-secondary">
                  Aggregates per-game scoring, assists, rebounds, steals, blocks, minutes, and shooting accuracy for all rostered players.
                </span>
              </div>
              <div className="border border-border-muted bg-paper p-3">
                <span className="font-bold text-ink block mb-1">ShotChartDetail</span>
                <span className="text-ink-secondary">
                  Optical tracking coordinates recorded by arena SportVU / Second Spectrum camera arrays for every field goal attempt.
                </span>
              </div>
              <div className="border border-border-muted bg-paper p-3">
                <span className="font-bold text-ink block mb-1">CommonPlayerInfo</span>
                <span className="text-ink-secondary">
                  Archival biographical registers, active statuses, historical franchise tenure, and career season chronologies.
                </span>
              </div>
            </div>

            <p className="text-xs font-mono text-ink-muted">
              Note: Data reflects official regular-season games only. Exhibition preseason fixtures and summer leagues are excluded from historical ledgers.
            </p>
          </div>
        </section>

        {/* DISPATCH 2: Architecture & Optimization */}
        <section className="border border-border-strong bg-paper-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
              Dispatch II · High-Speed Archival Engine
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-ink mb-4 pb-2 border-b border-border-muted">
            Why are shot coordinates pre-indexed in SQLite rather than queried live?
          </h3>

          <div className="font-serif text-sm sm:text-base leading-relaxed text-ink space-y-4">
            <p>
              When deployed on cloud platforms such as <strong>Render</strong> or <strong>AWS</strong>, making live HTTP
              requests to <code className="font-mono text-xs bg-paper-dark px-1">stats.nba.com</code> on every user click
              creates severe operational bottlenecks. The NBA's perimeter firewall (Akamai Bot Manager) routinely
              blocks or drops traffic originating from commercial cloud datacenters, yielding painful{" "}
              <code className="font-mono text-xs text-accent bg-paper-dark px-1">
                Read timed out (10s)
              </code>{" "}
              exceptions and frozen screens.
            </p>

            {/* Performance Comparison Metric */}
            <div className="border-2 border-border-strong bg-paper p-4 font-mono text-xs my-4">
              <div className="font-bold text-ink uppercase tracking-wider mb-2 pb-1 border-b border-border-muted flex justify-between">
                <span>Performance Comparison Ledger</span>
                <span className="text-accent font-bold">10,000× Speedup</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-border-muted p-2 bg-paper-card">
                  <span className="text-ink-secondary block mb-1">Live Remote stats.nba.com</span>
                  <span className="text-accent font-bold text-sm block">4.0s – 10.0s (or Timeout Block)</span>
                  <span className="text-[10px] text-ink-muted">
                    Subject to rate-limits, Akamai datacenter drops & high latency
                  </span>
                </div>
                <div className="border border-border-muted p-2 bg-paper-card">
                  <span className="text-ink-secondary block mb-1">Observer Indexed SQLite (shots.db)</span>
                  <span className="text-ink font-bold text-sm block">0.0008 seconds (&lt; 1 ms)</span>
                  <span className="text-[10px] text-ink-muted">
                    Zero latency, deterministic offline reliability, B-tree indexes
                  </span>
                </div>
              </div>
            </div>

            <p>
              To eliminate latency completely, we compiled an embedded SQLite database (
              <code className="font-mono text-xs bg-paper-dark px-1">backend/data/shots.db</code>, 19.4 MB) containing{" "}
              <strong>235,279 verified field goal attempts</strong> spanning <strong>all 30 NBA franchises</strong> and{" "}
              <strong>571 players</strong> for the complete 2023–24 season. In addition, historic apex seasons were
              curated for the game's greatest silhouettes:
            </p>

            <ul className="list-disc list-inside space-y-1 font-mono text-xs text-ink-secondary pl-2">
              <li>
                <strong>Michael Jordan</strong> (1997–98) — The Last Dance Championship Campaign
              </li>
              <li>
                <strong>Kobe Bryant</strong> (2005–06) — Historic 35.4 PPG Scoring Peak & 81-pt Game
              </li>
              <li>
                <strong>Shaquille O'Neal</strong> (1999–00) — Dominant MVP & Title Campaign
              </li>
              <li>
                <strong>Stephen Curry</strong> (2015–16 & 2020–21) — Unanimous MVP 402-Threes Era & Scoring Title
              </li>
              <li>
                <strong>LeBron James</strong> (2012–13) — Peak Miami Heat Efficiency Season
              </li>
              <li>
                <strong>Victor Wembanyama</strong> (2023–24) — Historic Rookie Shot-Blocking & Scoring Debut
              </li>
            </ul>
          </div>
        </section>

        {/* DISPATCH 3: Points / Impact Score Calculation */}
        <section className="border border-border-strong bg-paper-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
              Dispatch III · Valuation Formula
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-ink mb-4 pb-2 border-b border-border-muted">
            How is the Player Impact Index score computed in the ledger?
          </h3>

          <div className="font-serif text-sm sm:text-base leading-relaxed text-ink space-y-4">
            <p>
              The <strong>Player Impact Index</strong> is a composite efficiency rating calibrated via transparent,
              linear mathematical weighting. Rather than relying on opaque black-box machine learning models, our ledger
              empowers the reader to adjust the relative philosophical valuation of scoring, playmaking, rebounding,
              and defensive disruption.
            </p>

            {/* Formula Callout Box */}
            <div className="border-2 border-border-strong bg-paper p-5 my-4 text-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-secondary block mb-2">
                The Canonical Impact Equation
              </span>
              <div className="font-mono text-sm sm:text-lg font-bold text-ink py-2 px-3 bg-paper-card border border-border-muted inline-block max-w-full overflow-x-auto">
                {"Impact Index = (PPG × w_ppg) + (APG × w_apg) + (RPG × w_rpg) + ((SPG + BPG) × w_def)"}
              </div>
            </div>

            {/* Terms Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="border border-border-muted p-3 bg-paper">
                <span className="font-bold text-ink block mb-0.5">PPG · Points Per Game (w_ppg)</span>
                <span className="text-ink-secondary">
                  Direct offensive scoring production. Default baseline weight is 0.50.
                </span>
              </div>
              <div className="border border-border-muted p-3 bg-paper">
                <span className="font-bold text-ink block mb-0.5">APG · Assists Per Game (w_apg)</span>
                <span className="text-ink-secondary">
                  Offensive facilitation, court vision, and shot creation for teammates. Default weight: 0.30.
                </span>
              </div>
              <div className="border border-border-muted p-3 bg-paper">
                <span className="font-bold text-ink block mb-0.5">RPG · Rebounds Per Game (w_rpg)</span>
                <span className="text-ink-secondary">
                  Control of defensive and offensive boards, ending or extending possessions. Default: 0.20.
                </span>
              </div>
              <div className="border border-border-muted p-3 bg-paper">
                <span className="font-bold text-ink block mb-0.5">SPG + BPG · Stocks / Defense (w_def)</span>
                <span className="text-ink-secondary">
                  Steals plus Blocks per contest, capturing both perimeter ball-hawking and rim protection. Default: 0.10.
                </span>
              </div>
            </div>

            {/* Archetype Presets Table */}
            <div className="mt-4 pt-4 border-t border-border-muted">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink mb-2">
                Standard Editorial Presets
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs border border-border-strong text-left">
                  <thead>
                    <tr className="bg-paper-dark border-b border-border-strong text-ink font-bold">
                      <th className="p-2">Preset Name</th>
                      <th className="p-2 text-center">w_ppg</th>
                      <th className="p-2 text-center">w_apg</th>
                      <th className="p-2 text-center">w_rpg</th>
                      <th className="p-2 text-center">w_def</th>
                      <th className="p-2">Philosophy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-muted bg-paper">
                    <tr>
                      <td className="p-2 font-bold text-ink">Balanced Ledger</td>
                      <td className="p-2 text-center">0.50</td>
                      <td className="p-2 text-center">0.30</td>
                      <td className="p-2 text-center">0.20</td>
                      <td className="p-2 text-center">0.10</td>
                      <td className="p-2 text-ink-secondary">
                        Holistic superstar balance across all major box score facets.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-ink">Pure Scorer</td>
                      <td className="p-2 text-center">1.00</td>
                      <td className="p-2 text-center">0.10</td>
                      <td className="p-2 text-center">0.10</td>
                      <td className="p-2 text-center">0.00</td>
                      <td className="p-2 text-ink-secondary">
                        Maximizes rewards for primary isolation volume and bucket generation.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-ink">Floor General</td>
                      <td className="p-2 text-center">0.30</td>
                      <td className="p-2 text-center">0.90</td>
                      <td className="p-2 text-center">0.20</td>
                      <td className="p-2 text-center">0.10</td>
                      <td className="p-2 text-ink-secondary">
                        Heavy premium placed on distributors, playmakers, and conductors.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-ink">Two-Way Lockdown</td>
                      <td className="p-2 text-center">0.40</td>
                      <td className="p-2 text-center">0.20</td>
                      <td className="p-2 text-center">0.30</td>
                      <td className="p-2 text-center">0.80</td>
                      <td className="p-2 text-ink-secondary">
                        Prioritizes rim deterrence, perimeter stops, and high-impact defenders.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-ink">Glass Cleaner</td>
                      <td className="p-2 text-center">0.20</td>
                      <td className="p-2 text-center">0.10</td>
                      <td className="p-2 text-center">0.90</td>
                      <td className="p-2 text-center">0.40</td>
                      <td className="p-2 text-ink-secondary">
                        Values interior post anchors and relentless rebound vacuum machines.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* DISPATCH 4: Shot Dispersion Geometry */}
        <section className="border border-border-strong bg-paper-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
              Dispatch IV · Spatial Geometry
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-ink mb-4 pb-2 border-b border-border-muted">
            How are shot coordinates mapped onto the broadsheet court?
          </h3>

          <div className="font-serif text-sm sm:text-base leading-relaxed text-ink space-y-4">
            <p>
              In NBA optical tracking data, court coordinates are expressed in <strong>tenths of a foot</strong>{" "}
              (where 10 units = 1 foot). The exact center of the basket rim is anchored at the origin coordinate{" "}
              <code className="font-mono text-xs bg-paper-dark px-1.5 py-0.5 border border-border-muted">
                (LOC_X = 0, LOC_Y = 0)
              </code>
              .
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="border border-border-muted bg-paper p-3">
                <span className="font-bold text-ink block mb-1">X-Axis: Court Width</span>
                <span className="text-ink-secondary">
                  Spans [-250, +250], exactly mapping the regulation 50-foot NBA court width from left sideline to right sideline.
                </span>
              </div>
              <div className="border border-border-muted bg-paper p-3">
                <span className="font-bold text-ink block mb-1">Y-Axis: Half-Court Depth</span>
                <span className="text-ink-secondary">
                  Spans [-52, +418], covering the distance from the baseline behind the backboard to the half-court divider line 47 feet away.
                </span>
              </div>
            </div>

            <p>
              Our SVG rendering engine translates these raw measurements into a vector court diagram adhering to NBA
              specifications: the 4-foot restricted area arc, 16-foot painted lane, 22-foot corner three-point lines,
              and 23.75-foot three-point arc.
            </p>
          </div>
        </section>

        {/* DISPATCH 5: Style DNA & PCA Clustering */}
        <section className="border border-border-strong bg-paper-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
              Dispatch V · Style DNA & Clustering
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-ink mb-4 pb-2 border-b border-border-muted">
            How does the Style DNA radar and historical legend matching operate?
          </h3>

          <div className="font-serif text-sm sm:text-base leading-relaxed text-ink space-y-4">
            <p>
              Section III evaluates players not merely on volume, but on their stylistic archetype through a
              multi-stage geometric pipeline:
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="border border-border-muted bg-paper p-3">
                <span className="font-bold text-ink block mb-1">
                  1. Min-Max Standardized Radar Axes
                </span>
                <p className="text-ink-secondary font-serif text-xs">
                  Each player's Scoring, Playmaking, Rebounding, Defense, and Efficiency are scaled between 0 and 100 relative to the modern NBA distribution using min-max normalization.
                </p>
              </div>

              <div className="border border-border-muted bg-paper p-3">
                <span className="font-bold text-ink block mb-1">
                  2. Cosine Vector Similarity with 50 Historical Legends
                </span>
                <p className="text-ink-secondary font-serif text-xs">
                  The player's 5D feature vector is compared against a curated registry of 50 NBA Hall of Fame silhouettes (e.g. Magic Johnson, Larry Bird, Hakeem Olajuwon, Steve Nash, Ray Allen, Kevin Garnett) using Cosine Similarity to isolate their closest stylistic predecessor.
                </p>
              </div>

              <div className="border border-border-muted bg-paper p-3">
                <span className="font-bold text-ink block mb-1">
                  3. 2D Principal Component Analysis (PCA)
                </span>
                <p className="text-ink-secondary font-serif text-xs">
                  High-dimensional telemetry is projected onto the two primary orthogonal variance vectors (PC1 and PC2) to render the player inside the interactive league archetype constellation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DISPATCH 6: System Stack & Deployment */}
        <section className="border border-border-strong bg-paper-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
              Dispatch VI · Technology Stack
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-ink mb-4 pb-2 border-b border-border-muted">
            What infrastructure powers The Basketball Observer?
          </h3>

          <div className="font-serif text-sm sm:text-base leading-relaxed text-ink space-y-4">
            <p>
              The application is built on a modern, decoupled architecture designed for high availability, zero cold-start
              delays, and instant static delivery:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="border border-border-muted bg-paper p-4">
                <span className="font-bold text-ink block mb-1 uppercase tracking-wider text-accent">
                  Frontend (Vercel CDN)
                </span>
                <ul className="list-disc list-inside space-y-1 text-ink-secondary">
                  <li>React 19 & TypeScript</li>
                  <li>Tailwind CSS v4 (Custom Broadsheet Theme)</li>
                  <li>Vite 6 build system</li>
                  <li>Global Edge Network delivery</li>
                </ul>
              </div>

              <div className="border border-border-muted bg-paper p-4">
                <span className="font-bold text-ink block mb-1 uppercase tracking-wider text-accent">
                  Backend (Render Cloud)
                </span>
                <ul className="list-disc list-inside space-y-1 text-ink-secondary">
                  <li>Python 3.12 & FastAPI framework</li>
                  <li>High-performance Uvicorn ASGI server</li>
                  <li>Embedded SQLite3 engine (235k shots)</li>
                  <li>Scikit-Learn (PCA & Cosine Similarity)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Colophon Navigation */}
      <div className="mt-10 pt-6 border-t-2 border-border-strong flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs">
        <span className="text-ink-secondary uppercase tracking-widest">
          The Basketball Observer · End of Supplement
        </span>

        {onBackToRanking && (
          <button
            type="button"
            onClick={onBackToRanking}
            className="px-4 py-2 bg-ink text-paper hover:bg-paper-dark hover:text-ink border border-border-strong uppercase tracking-wider font-bold transition-colors cursor-pointer"
          >
            ← Return to Section I: Ranking Ledger
          </button>
        )}
      </div>
    </article>
  );
}
