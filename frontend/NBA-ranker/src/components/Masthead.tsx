interface MastheadProps {
  activeTab: "ranking" | "shotchart" | "dna";
  onTabChange: (tab: "ranking" | "shotchart" | "dna") => void;
}

export function Masthead({ activeTab, onTabChange }: MastheadProps) {
  return (
    <header className="mb-6">
      <div className="text-center pt-2 pb-4">
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none text-ink">
          The Basketball Observer
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-ink-secondary mt-2">
          NBA Player Impact Valuation, Shot Dispersion & Style Archetypes
        </p>
      </div>

      <nav className="grid grid-cols-3 border-t-2 border-b-2 border-border-strong font-mono text-xs uppercase tracking-wider divide-x divide-border-strong">
        <button
          type="button"
          onClick={() => onTabChange("ranking")}
          className={`py-2.5 px-2 text-center cursor-pointer transition-colors truncate ${
            activeTab === "ranking"
              ? "bg-ink text-paper font-bold"
              : "bg-paper text-ink hover:bg-paper-dark"
          }`}
        >
          Section I: Ranking Ledger
        </button>
        <button
          type="button"
          onClick={() => onTabChange("shotchart")}
          className={`py-2.5 px-2 text-center cursor-pointer transition-colors truncate ${
            activeTab === "shotchart"
              ? "bg-ink text-paper font-bold"
              : "bg-paper text-ink hover:bg-paper-dark"
          }`}
        >
          Section II: Shot Dispersion
        </button>
        <button
          type="button"
          onClick={() => onTabChange("dna")}
          className={`py-2.5 px-2 text-center cursor-pointer transition-colors truncate ${
            activeTab === "dna"
              ? "bg-ink text-paper font-bold"
              : "bg-paper text-ink hover:bg-paper-dark"
          }`}
        >
          Section III: Style DNA
        </button>
      </nav>
    </header>
  );
}


