interface MastheadProps {
  activeTab: "ranking" | "shotchart";
  onTabChange: (tab: "ranking" | "shotchart") => void;
}

export function Masthead({ activeTab, onTabChange }: MastheadProps) {
  return (
    <header className="mb-6">
      <div className="text-center pt-2 pb-4">
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none text-ink">
          The Basketball Observer
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-ink-secondary mt-2">
          NBA Player Impact Valuation & Shot Dispersion
        </p>
      </div>

      <nav className="flex flex-wrap border-t-2 border-b-2 border-border-strong font-mono text-xs uppercase tracking-wider">
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
