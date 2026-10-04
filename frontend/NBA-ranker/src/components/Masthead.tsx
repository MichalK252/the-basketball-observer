interface MastheadProps {
  activeTab: "ranking" | "shotchart";
  onTabChange: (tab: "ranking" | "shotchart") => void;
}

export function Masthead({ activeTab, onTabChange }: MastheadProps) {
  return (
    <header className="mb-6">
      <div className="flex justify-between items-center font-mono text-[11px] tracking-widest uppercase text-ink-secondary border-b border-border-strong pb-1.5">
        <span>The National Sports Archive · Issue No. 4,812</span>
        <span>Late City Edition</span>
        <span className="hidden sm:inline">Weather: Clear Hardwood</span>
      </div>

      <div className="text-center py-5">
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none text-ink">
          The Basketball Statistical Observer
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink-secondary mt-2">
          An Empirical Compendium of Hardwood Impact, Per-Game Metrics, and All-Around Valuation
        </p>
      </div>

      <div className="border-t-4 border-double border-b border-border-strong py-1.5 px-1 flex justify-between font-mono text-[11px] uppercase tracking-wider text-ink-secondary">
        <span>Vol. XXIV · Special Statistical Section</span>
        <span className="hidden sm:inline">United States Basketball Registry</span>
        <span>Price: Five Cents</span>
      </div>

      <nav className="flex flex-wrap border-b border-border-strong mt-3 font-mono text-xs uppercase tracking-wider">
        <button
          type="button"
          onClick={() => onTabChange("ranking")}
          className={`px-4 py-2 border-r border-border-strong cursor-pointer transition-colors ${
            activeTab === "ranking"
              ? "bg-ink text-paper font-bold"
              : "bg-paper text-ink hover:bg-paper-dark"
          }`}
        >
          Section I: Canonical Ranking Ledger
        </button>
        <button
          type="button"
          onClick={() => onTabChange("shotchart")}
          className={`px-4 py-2 border-r border-border-strong cursor-pointer transition-colors ${
            activeTab === "shotchart"
              ? "bg-ink text-paper font-bold"
              : "bg-paper text-ink hover:bg-paper-dark"
          }`}
        >
          Section II: Hardwood Shot Dispersion Chart
        </button>
      </nav>
    </header>
  );
}
