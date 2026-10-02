import type { SearchPlayer } from "../types";

interface ArchiveSearchProps {
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  onSearch: (e?: React.FormEvent) => void;
  searching: boolean;
  hasSearched: boolean;
  searchResults: SearchPlayer[];
}

export function ArchiveSearch({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  searching,
  hasSearched,
  searchResults,
}: ArchiveSearchProps) {
  return (
    <section className="mt-8 border border-border-strong p-5 bg-paper-card shadow-[1px_1px_0px_#111]">
      <div className="border-b-2 border-border-strong pb-1.5 mb-3 flex justify-between items-baseline">
        <h2 className="font-display text-lg uppercase tracking-wider text-ink font-bold">
          Player Archive Inquiry
        </h2>
        <span className="font-mono text-[10px] text-ink-muted font-bold tracking-widest uppercase">
          [Index Ledger]
        </span>
      </div>

      <p className="text-xs text-ink-secondary mb-3 font-serif">
        Query the historical and active roster database to verify eligibility and player identification numbers.
      </p>

      <form onSubmit={onSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search by surname or full name, e.g. 'Bryant', 'Curry', 'Doncic'..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="flex-1 border border-border-strong bg-paper px-3 py-2 font-serif text-sm text-ink outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="bg-paper hover:bg-paper-dark border border-border-strong text-ink text-xs font-serif px-4 py-2 cursor-pointer shadow-[1px_1px_0px_#111] transition-transform active:translate-x-0.5 active:translate-y-0.5"
        >
          {searching ? "Inquiring..." : "Query Registry"}
        </button>
      </form>

      {hasSearched && (
        <div className="mt-4 border-t border-border-muted flex flex-col">
          {searchResults.length === 0 ? (
            <div className="py-4 text-center font-mono text-xs text-ink-secondary">
              No registered records matched "{searchQuery}" in the league archive.
            </div>
          ) : (
            searchResults.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2.5 px-1 border-b border-dotted border-border-muted text-sm"
              >
                <span className="font-serif font-semibold text-ink">
                  {item.full_name}
                </span>
                <div className="font-mono text-xs text-ink-muted flex items-center gap-3">
                  <span>Registry ID #{item.id}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] uppercase border ${
                      item.is_active
                        ? "bg-paper-dark text-ink border-border-strong"
                        : "bg-transparent text-ink-muted border-border-muted"
                    }`}
                  >
                    {item.is_active ? "Active Roster" : "Archived / Retired"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
