import { useEffect, useRef, useState } from "react";

/**
 * Vertical Git history visualization.
 * - Default: a clean, static merged history (like `git log --graph`).
 * - Hover: replays the branching + merging flow with a glowing runner
 *   commit that travels down main, checks out feature/ai, commits, merges,
 *   then feature/devops, and finally settles back on main.
 * - Commit hover reveals a tiny hash + message tooltip.
 */

const V_W = 340;
const V_H = 620;
const MAIN_X = 90;
const FEAT_X = 210;

type Commit = {
  id: string;
  x: number;
  y: number;
  branch: "main" | "ai" | "ops";
  hash: string;
  label: string;
  // progress threshold at which the runner "creates" this commit
  activateAt: number;
};

const COMMITS: Commit[] = [
  { id: "m1", x: MAIN_X, y: 60,  branch: "main", hash: "a18f2c1", label: "chore: init repo",          activateAt: 0.00 },
  { id: "m2", x: MAIN_X, y: 120, branch: "main", hash: "93bc71e", label: "feat: core services",       activateAt: 0.08 },
  { id: "a1", x: FEAT_X, y: 170, branch: "ai",   hash: "c91f8d2", label: "feat(ai): agent runtime",   activateAt: 0.22 },
  { id: "a2", x: FEAT_X, y: 220, branch: "ai",   hash: "7f4e08b", label: "feat(ai): tool router",     activateAt: 0.32 },
  { id: "m3", x: MAIN_X, y: 280, branch: "main", hash: "2d81fa4", label: "merge: feature/ai",         activateAt: 0.46 },
  { id: "m4", x: MAIN_X, y: 340, branch: "main", hash: "5ea9c30", label: "feat: platform api",        activateAt: 0.54 },
  { id: "d1", x: FEAT_X, y: 390, branch: "ops",  hash: "ab17f3e", label: "feat(ops): terraform mod",  activateAt: 0.66 },
  { id: "d2", x: FEAT_X, y: 440, branch: "ops",  hash: "b442e51", label: "feat(ops): ci pipeline",    activateAt: 0.76 },
  { id: "m5", x: MAIN_X, y: 500, branch: "main", hash: "c0d3ed9", label: "merge: feature/devops",     activateAt: 0.90 },
  { id: "m6", x: MAIN_X, y: 560, branch: "main", hash: "e7a1b02", label: "release: v1.0.0",           activateAt: 0.99 },
];

// Static edges drawn at all times (the completed history)
const STATIC_EDGES: Array<{ d: string; branch: "main" | "ai" | "ops"; merged?: boolean }> = [
  // main trunk (top → bottom)
  { d: `M ${MAIN_X} 60  L ${MAIN_X} 120`, branch: "main" },
  { d: `M ${MAIN_X} 120 L ${MAIN_X} 280`, branch: "main" },
  { d: `M ${MAIN_X} 280 L ${MAIN_X} 340`, branch: "main" },
  { d: `M ${MAIN_X} 340 L ${MAIN_X} 500`, branch: "main" },
  { d: `M ${MAIN_X} 500 L ${MAIN_X} 560`, branch: "main" },
  // feature/ai branch: out, along, back
  { d: `M ${MAIN_X} 120 C ${MAIN_X} 155, ${FEAT_X} 135, ${FEAT_X} 170`, branch: "ai" },
  { d: `M ${FEAT_X} 170 L ${FEAT_X} 220`, branch: "ai" },
  { d: `M ${FEAT_X} 220 C ${FEAT_X} 255, ${MAIN_X} 245, ${MAIN_X} 280`, branch: "ai", merged: true },
  // feature/devops branch
  { d: `M ${MAIN_X} 340 C ${MAIN_X} 375, ${FEAT_X} 355, ${FEAT_X} 390`, branch: "ops" },
  { d: `M ${FEAT_X} 390 L ${FEAT_X} 440`, branch: "ops" },
  { d: `M ${FEAT_X} 440 C ${FEAT_X} 475, ${MAIN_X} 465, ${MAIN_X} 500`, branch: "ops", merged: true },
];

// Continuous runner journey (used with getPointAtLength)
const RUNNER_D =
  `M ${MAIN_X} 60 ` +
  `L ${MAIN_X} 120 ` +
  `C ${MAIN_X} 155, ${FEAT_X} 135, ${FEAT_X} 170 ` +
  `L ${FEAT_X} 220 ` +
  `C ${FEAT_X} 255, ${MAIN_X} 245, ${MAIN_X} 280 ` +
  `L ${MAIN_X} 340 ` +
  `C ${MAIN_X} 375, ${FEAT_X} 355, ${FEAT_X} 390 ` +
  `L ${FEAT_X} 440 ` +
  `C ${FEAT_X} 475, ${MAIN_X} 465, ${MAIN_X} 500 ` +
  `L ${MAIN_X} 560`;

const RUN_DURATION = 5200; // ms

const branchColor = (branch: "main" | "ai" | "ops", merged?: boolean) => {
  if (merged) return "var(--success)";
  if (branch === "ai") return "var(--accent)";
  if (branch === "ops") return "var(--accent)";
  return "var(--border-strong)";
};

export function HeroObject() {
  const runnerPathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1); // start in fully merged state
  const [runnerPt, setRunnerPt] = useState<{ x: number; y: number } | null>(null);
  const [replays, setReplays] = useState(0);
  const [hoveredCommit, setHoveredCommit] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

  // Trigger replay when user hovers the container (debounced by animation state)
  const startReplay = () => {
    if (rafRef.current) return;
    setReplays((n) => n + 1);
  };

  useEffect(() => {
    if (replays === 0) return;
    const start = performance.now();
    setProgress(0);
    const step = (now: number) => {
      const raw = Math.min(1, (now - start) / RUN_DURATION);
      // ease in/out, no bounce
      const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      setProgress(eased);

      const path = runnerPathRef.current;
      if (path) {
        const len = path.getTotalLength();
        const pt = path.getPointAtLength(eased * len);
        setRunnerPt({ x: pt.x, y: pt.y });
      }

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        // fade out runner
        setTimeout(() => setRunnerPt(null), 600);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [replays]);

  const isActivated = (c: Commit) => progress >= c.activateAt;
  const nearRunner = (c: Commit) => {
    if (!runnerPt) return 0;
    const dx = c.x - runnerPt.x;
    const dy = c.y - runnerPt.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return Math.max(0, 1 - dist / 80);
  };

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto flex w-full max-w-[420px] items-center justify-center"
      onMouseEnter={startReplay}
      aria-label="Git history"
    >
      {/* soft ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(280px 380px at 50% 50%, color-mix(in oklab, var(--accent) 6%, transparent), transparent 70%)",
        }}
      />

      <svg
        viewBox={`0 0 ${V_W} ${V_H}`}
        className="h-auto w-full"
        style={{ maxHeight: 620 }}
      >
        <defs>
          <filter id="runner-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Hidden runner path (used for point sampling) */}
        <path ref={runnerPathRef} d={RUNNER_D} fill="none" stroke="none" />

        {/* Labels */}
        <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="var(--muted-foreground)">
          <text x={MAIN_X} y={30} textAnchor="middle" fill="var(--accent)">HEAD</text>
          <text x={MAIN_X} y={598} textAnchor="middle">main</text>
          <text x={FEAT_X + 14} y={175} textAnchor="start">feature/ai</text>
          <text x={FEAT_X + 14} y={395} textAnchor="start">feature/devops</text>
        </g>

        {/* Static edges */}
        {STATIC_EDGES.map((e, i) => {
          const color = branchColor(e.branch, e.merged);
          const isMain = e.branch === "main";
          return (
            <path
              key={i}
              d={e.d}
              fill="none"
              stroke={color}
              strokeOpacity={isMain ? 0.55 : e.merged ? 0.55 : 0.6}
              strokeWidth={isMain ? 1.1 : 1.2}
              strokeLinecap="round"
            />
          );
        })}

        {/* Commits */}
        {COMMITS.map((c) => {
          const activated = isActivated(c);
          const proximity = nearRunner(c);
          const isFeature = c.branch !== "main";
          const baseColor = isFeature ? "var(--accent)" : "var(--foreground)";
          const idle = !runnerPt;
          const brightness = idle ? (isFeature ? 0.9 : 0.75) : Math.min(1, 0.55 + proximity * 0.6);
          const ringOpacity = idle ? 0.12 : 0.1 + proximity * 0.35;
          const isHover = hoveredCommit === c.id;
          return (
            <g
              key={c.id}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredCommit(c.id)}
              onMouseLeave={() => setHoveredCommit((v) => (v === c.id ? null : v))}
            >
              {/* larger hit target */}
              <circle cx={c.x} cy={c.y} r={14} fill="transparent" />
              <circle
                cx={c.x} cy={c.y} r={9}
                fill={baseColor}
                opacity={ringOpacity}
              />
              <circle
                cx={c.x} cy={c.y}
                r={activated ? 4 : 3.2}
                fill={activated ? baseColor : "var(--background)"}
                stroke={baseColor}
                strokeWidth={1}
                opacity={brightness}
                style={{ transition: "opacity 200ms ease, r 200ms ease" }}
              />
              {isHover && (
                <g style={{ pointerEvents: "none" }}>
                  <rect
                    x={c.x + (c.branch === "main" ? -132 : 16)}
                    y={c.y - 18}
                    width={116}
                    height={36}
                    rx={4}
                    fill="var(--panel)"
                    stroke="var(--border-strong)"
                    strokeWidth={0.8}
                  />
                  <text
                    x={c.x + (c.branch === "main" ? -124 : 24)}
                    y={c.y - 4}
                    fontFamily="JetBrains Mono, monospace"
                    fontSize={9}
                    fill="var(--accent)"
                  >
                    {c.hash}
                  </text>
                  <text
                    x={c.x + (c.branch === "main" ? -124 : 24)}
                    y={c.y + 9}
                    fontFamily="JetBrains Mono, monospace"
                    fontSize={8.5}
                    fill="var(--muted-foreground)"
                  >
                    {c.label.length > 18 ? c.label.slice(0, 17) + "…" : c.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Traveling runner */}
        {runnerPt && (
          <g style={{ pointerEvents: "none" }}>
            <circle cx={runnerPt.x} cy={runnerPt.y} r={12} fill="var(--accent)" opacity={0.18} />
            <circle cx={runnerPt.x} cy={runnerPt.y} r={5.5} fill="var(--accent)" filter="url(#runner-glow)" />
          </g>
        )}
      </svg>

      {/* Status pill */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        {runnerPt ? (
          <span>
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-accent align-middle" />
            replaying history
          </span>
        ) : (
          <span>
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full align-middle" style={{ background: "var(--success)" }} />
            merged successfully · hover to replay
          </span>
        )}
      </div>
    </div>
  );
}
