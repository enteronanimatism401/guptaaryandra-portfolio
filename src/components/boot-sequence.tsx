import { useEffect, useState } from "react";

type Node = {
  id: string;
  x: number;
  y: number;
  branch: "main" | "dev" | "merge";
  label?: string;
  hash?: string;
};

// Layout: main branch top row, dev branch bottom row, then merge back
const NODES: Node[] = [
  { id: "init", x: 40,  y: 40, branch: "main", label: "init",     hash: "a18f2c" },
  { id: "m1",   x: 130, y: 40, branch: "main", label: "main",     hash: "93bc71" },
  { id: "d1",   x: 220, y: 90, branch: "dev",  label: "dev",      hash: "2d81fa" },
  { id: "d2",   x: 310, y: 90, branch: "dev",  hash: "7f4e08" },
  { id: "m2",   x: 400, y: 40, branch: "merge", label: "merge",   hash: "c0d3ed" },
  { id: "head", x: 490, y: 40, branch: "main", label: "HEAD",     hash: "ready0" },
];

const EDGES: Array<{ from: string; to: string; curved?: boolean }> = [
  { from: "init", to: "m1" },
  { from: "m1",   to: "d1", curved: true },
  { from: "d1",   to: "d2" },
  { from: "d2",   to: "m2", curved: true },
  { from: "m1",   to: "m2" }, // main line passes through
  { from: "m2",   to: "head" },
];

const LOG_LINES = [
  "$ git init",
  "  Initialized empty repository",
  "$ git checkout -b main",
  "  Switched to new branch 'main'",
  "$ git commit -m 'bootstrap'",
  "  [main a18f2c] bootstrap",
  "$ git commit -m 'core services'",
  "  [main 93bc71] core services",
  "$ git checkout -b dev",
  "  Switched to new branch 'dev'",
  "$ git commit -m 'experimental modules'",
  "  [dev 2d81fa] experimental modules",
  "$ git commit -m 'refine pipeline'",
  "  [dev 7f4e08] refine pipeline",
  "$ git checkout main",
  "$ git merge dev --no-ff",
  "  Merge made by the 'recursive' strategy.",
  "  HEAD -> main",
  "  Repository ready.",
];

// Timeline: when each node appears (ms)
const NODE_TIMES: Record<string, number> = {
  init: 200,
  m1:   700,
  d1:   1150,
  d2:   1600,
  m2:   2200,
  head: 2700,
};
const TOTAL = 3300;

export function BootSequence() {
  const [visible, setVisible] = useState<boolean | null>(null);
  const [closing, setClosing] = useState(false);
  const [t, setT] = useState(0);
  const [logIdx, setLogIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("boot_seen_git_v1");
    if (seen) { setVisible(false); return; }
    setVisible(true);
    localStorage.setItem("boot_seen_git_v1", "1");
  }, []);

  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const elapsed = now - start;
      setT(Math.min(elapsed, TOTAL + 400));
      if (elapsed < TOTAL + 400) raf = requestAnimationFrame(step);
      else {
        setTimeout(() => setClosing(true), 350);
        setTimeout(() => setVisible(false), 1100);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setLogIdx((i) => (i >= LOG_LINES.length ? i : i + 1));
    }, 180);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  const progress = Math.min(100, Math.round((t / TOTAL) * 100));

  // Compute edge draw progress based on time between endpoint appearances
  const edgeProgress = (from: string, to: string) => {
    const a = NODE_TIMES[from], b = NODE_TIMES[to];
    if (t < a) return 0;
    if (t >= b) return 1;
    return (t - a) / (b - a);
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-background"
      style={{ opacity: closing ? 0 : 1, transition: "opacity 700ms ease" }}
    >
      <div className="bg-scanlines absolute inset-0 opacity-30" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 500px at 50% 50%, color-mix(in oklab, var(--accent) 8%, transparent), transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-2xl px-8">
        <div className="mb-6 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          initializing repository
        </div>

        {/* Git graph */}
        <div className="mx-auto mb-8 w-full max-w-[540px]">
          <svg viewBox="0 0 540 140" className="h-[140px] w-full">
            <defs>
              <filter id="glow-node" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {EDGES.map((e, i) => {
              const A = NODES.find((n) => n.id === e.from)!;
              const B = NODES.find((n) => n.id === e.to)!;
              const p = edgeProgress(e.from, e.to);
              const d = e.curved
                ? `M ${A.x} ${A.y} C ${(A.x + B.x) / 2} ${A.y}, ${(A.x + B.x) / 2} ${B.y}, ${B.x} ${B.y}`
                : `M ${A.x} ${A.y} L ${B.x} ${B.y}`;
              const isDev = A.branch === "dev" || B.branch === "dev";
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={isDev ? "var(--accent)" : "var(--border-strong)"}
                  strokeWidth="1.2"
                  strokeOpacity={isDev ? 0.9 : 0.7}
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - p}
                  style={{ transition: "stroke-dashoffset 120ms linear" }}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((n) => {
              const appear = t >= NODE_TIMES[n.id];
              const isAccent = n.branch === "dev" || n.branch === "merge" || n.id === "head";
              return (
                <g
                  key={n.id}
                  style={{
                    opacity: appear ? 1 : 0,
                    transform: `scale(${appear ? 1 : 0.4})`,
                    transformOrigin: `${n.x}px ${n.y}px`,
                    transition: "opacity 260ms ease, transform 320ms cubic-bezier(.2,.9,.3,1.2)",
                  }}
                >
                  <circle cx={n.x} cy={n.y} r="8" fill="var(--background)" stroke={isAccent ? "var(--accent)" : "var(--foreground)"} strokeWidth="1" />
                  <circle
                    cx={n.x} cy={n.y} r="3.6"
                    fill={isAccent ? "var(--accent)" : "var(--foreground)"}
                    filter="url(#glow-node)"
                  />
                  {n.label && (
                    <text
                      x={n.x}
                      y={n.branch === "dev" ? n.y + 22 : n.y - 14}
                      textAnchor="middle"
                      fontSize="8"
                      fontFamily="JetBrains Mono, monospace"
                      fill="var(--muted-foreground)"
                    >
                      {n.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Log stream */}
        <div className="mx-auto mb-6 h-[132px] max-w-[540px] overflow-hidden rounded-md border border-border bg-panel/60 p-3 font-mono text-[11px] leading-relaxed">
          {LOG_LINES.slice(Math.max(0, logIdx - 7), logIdx).map((line, i) => (
            <div
              key={i + logIdx}
              className="animate-fade-up"
              style={{
                color: line.startsWith("$") ? "var(--foreground)" : "var(--muted-foreground)",
              }}
            >
              {line}
            </div>
          ))}
          {logIdx < LOG_LINES.length && (
            <span className="blink text-accent">▍</span>
          )}
        </div>

        {/* Progress */}
        <div className="mx-auto max-w-[540px]">
          <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>{progress < 100 ? "building" : "repository ready"}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-panel-2">
            <div
              className="h-full bg-accent"
              style={{ width: `${progress}%`, transition: "width 120ms linear" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
