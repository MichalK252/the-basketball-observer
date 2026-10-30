interface EditorialFooterProps {
  onOpenFaq?: () => void;
}

export function EditorialFooter({ onOpenFaq }: EditorialFooterProps) {
  return (
    <footer className="mt-12 py-6 border-t-2 border-border-strong flex flex-col sm:flex-row justify-between items-center font-mono text-[11px] text-ink-secondary gap-3">
      <span>Official NBA Data Records · Regular Season Tracking</span>
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {onOpenFaq && (
          <button
            type="button"
            onClick={onOpenFaq}
            className="cursor-pointer underline decoration-dotted underline-offset-4 hover:text-ink font-bold uppercase tracking-wider text-accent transition-colors"
          >
            [ Technical FAQ & Colophon ]
          </button>
        )}
        <span>The Basketball Observer</span>
      </div>
    </footer>
  );
}
