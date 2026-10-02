export function EditorialFooter() {
  return (
    <footer className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-ink-secondary border-t border-border-strong pt-6">
      <div>
        <h3 className="font-display text-xs uppercase tracking-widest text-ink font-bold mb-2 pb-1 border-b border-border-strong">
          Methodological Note
        </h3>
        <p className="font-serif">
          The All-Around Impact Rating synthesizes per-game scoring, distribution, and glass maintenance.
          Unlike gross totals, per-game valuations control for career longevity and team pacing variations,
          yielding a standardized measure of nightly output on the hardwood.
        </p>
      </div>

      <div>
        <h3 className="font-display text-xs uppercase tracking-widest text-ink font-bold mb-2 pb-1 border-b border-border-strong">
          Publisher's Memorandum
        </h3>
        <p className="font-serif">
          Statistical tables compiled from National Basketball Association records. Regular season competitions
          only. Published by the Editorial Board of the Statistical Observer, New York & Philadelphia. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
