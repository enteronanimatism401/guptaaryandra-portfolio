export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-6 font-mono text-[11px] text-muted-foreground">
        <div>© {new Date().getFullYear()} Aryandra Gupta · all systems nominal</div>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          <span>runtime · online</span>
          <span className="opacity-40">·</span>
          <span>build · v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
