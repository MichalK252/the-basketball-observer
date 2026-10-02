export function Masthead() {
  return (
    <header className="mb-6">
      {/* Top Ledger Strip */}
      <div className="flex justify-between items-center font-mono text-[11px] tracking-widest uppercase text-ink-secondary border-b border-border-strong pb-1.5">
        <span>The National Sports Archive · Issue No. 4,812</span>
        <span>Late City Edition</span>
        <span className="hidden sm:inline">Weather: Clear Hardwood</span>
      </div>

      {/* Main Newspaper Title */}
      <div className="text-center py-5">
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none text-ink">
          The Basketball Statistical Observer
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink-secondary mt-2">
          An Empirical Compendium of Hardwood Impact, Per-Game Metrics, and All-Around Valuation
        </p>
      </div>

      {/* Dateline Double Rule */}
      <div className="border-t-4 border-double border-b border-border-strong py-1.5 px-1 flex justify-between font-mono text-[11px] uppercase tracking-wider text-ink-secondary">
        <span>Vol. XXIV · Special Statistical Section</span>
        <span className="hidden sm:inline">United States Basketball Registry</span>
        <span>Price: Five Cents</span>
      </div>
    </header>
  );
}
