import { useEffect, useRef, useState } from "react";

/**
 * Git Branch Pipeline — futuristic, minimal, wireframe.
 * main branch with two feature branches (feature-ai, feature-devops)
 * merging back into main. Idle breathing animation; hover re-plays
 * the pipeline animation. Ends in merged state.
 */

type Commit = { id: string; x: number; y: number; branch: string; t: number };

const V_W = 560;
const V_H = 380;

const COMMITS: Commit[] = [
  { id: "m0", x: 60,  y: 100, branch: "main", t: 0.00 },
  { id: "m1", x: 130, y: 100, branch: "main", t: 0.06 },

  // feature-ai (upper)
  { id: "a1", x: 210, y: 40,  branch: "ai",   t: 0.20 },
  { id: "a2", x: 280, y: 40,  branch: "ai",   t: 0.30 },
  { id: "a3", x: 350, y: 40,  branch: "ai",   t: 0.40 },

  // main continues
  { id: "m2", x: 210, y: 100, branch: "main", t: 0.18 },
  { id: "m3", x: 280, y: 100, branch: "main", t: 0.26 },

  // feature-devops (lower)
  { id: "d1", x: 210, y: 170, branch: "ops",  t: 0.34 },
  { id: "d2", x: 280, y: 170, branch: "ops",  t: 0.44 },

  // merge point
  { id: "mg", x: 430, y: 100, branch: "merge", t: 0.72 },
  { id: "mh", x: 510, y: 100, branch: "main",  t: 0.86 },
];

// Edges with timing (t0 -> t1). Feature branches curve out from main and back in.
type Edge = { d: string; t0: number; t1: number; accent?: boolean; branch: string };
const EDGES: Edge[] = [
  // main baseline
  { d: `M 60 100 L 130 100`, t0: 0.00, t1: 0.06, branch: "main" },
  { d: `M 130 100 L 210 100`, t0: 0.06, t1: 0.18, branch: "main" },
  { d: `M 210 100 L 280 100`, t0: 0.18, t1: 0.26, branch: "main" },
  { d: `M 280 100 L 430 100`, t0: 0.26, t1: 0.72, branch: "main" },
  { d: `M 430 100 L 510 100`, t0: 0.72, t1: 0.86, branch: "main" },

  // feature-ai branch out
  { d: `M 130 100 C 170 100, 170 40, 210 40`, t0: 0.10, t1: 0.20, accent: true, branch: "ai" },
  { d: `M 210 40 L 280 40`, t0: 0.20, t1: 0.30, accent: true, branch: "ai" },
  { d: `M 280 40 L 350 40`, t0: 0.30, t1: 0.40, accent: true, branch: "ai" },
  // merge back
  { d: `M 350 40 C 400 40, 400 100, 430 100`, t0: 0.60, t1: 0.72, accent: true, branch: "ai" },

  // feature-devops branch out
  { d: `M 210 100 C 210 140, 170 170, 210 170`, t0: 0.28, t1: 0.34, branch: "ops" },
  { d: `M 210 170 L 280 170`, t0: 0.34, t1: 0.44, branch: "ops" },
  // merge back
  { d: `M 280 170 C 380 170, 400 100, 430 100`, t0: 0.60, t1: 0.72, branch: "ops" },
];

export function HeroObject() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<SVGSVGElement>(null);
  const [t, setT] = useState(1); // pipeline progress 0..1, start already merged
  const [hovering, setHovering] = useState(false);

  // Parallax
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      const px = (e.clientX - (r.left + r.width / 2)) / r.width;
      const py = (e.clientY - (r.top + r.height / 2)) / r.height;
      tx = Math.max(-1, Math.min(1, px)) * 8;
      ty = Math.max(-1, Math.min(1, py)) * 6;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);

  // Idle: play once on mount. On hover: replay.
  useEffect(() => {
    let raf = 0;
    const duration = 2600;
    const start = performance.now();
    setT(0);
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // ease out
      setT(1 - Math.pow(1 - p, 2.4));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [hovering]);

  const edgeDraw = (e: Edge) => {
    if (t <= e.t0) return 0;
    if (t >= e.t1) return 1;
    return (t - e.t0) / (e.t1 - e.t0);
  };

  return (
    <div
      ref={wrapRef}
      className="relative flex h-[420px] w-full items-center justify-center md:h-[480px]"
      onMouseEnter={() => setHovering((v) => !v)}
      aria-label="Git branch pipeline"
    >
      {/* soft ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(360px 260px at 50% 50%, color-mix(in oklab, var(--accent) 10%, transparent), transparent 70%)",
        }}
      />

      {/* breathing wrapper */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ animation: "hero-breathe 6s ease-in-out infinite" }}>
        <svg
          ref={innerRef}
          viewBox={`0 0 ${V_W} ${V_H}`}
          className="h-full w-full"
          style={{ willChange: "transform" }}
        >
          <defs>
            <filter id="pipe-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="pipe-accent" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="var(--accent)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Branch labels */}
          <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="var(--muted-foreground)">
            <text x="20" y="104" textAnchor="end">main</text>
            <text x="200" y="30" textAnchor="end">feature-ai</text>
            <text x="200" y="188" textAnchor="end">feature-devops</text>
            <text x="530" y="90" textAnchor="start" fill="var(--accent)">HEAD</text>
          </g>

          {/* Edges */}
          {EDGES.map((e, i) => {
            const p = edgeDraw(e);
            return (
              <path
                key={i}
                d={e.d}
                fill="none"
                stroke={e.accent ? "url(#pipe-accent)" : "var(--border-strong)"}
                strokeWidth={e.accent ? "1.4" : "1"}
                strokeOpacity={e.branch === "main" ? 0.9 : 1}
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - p}
                strokeLinecap="round"
              />
            );
          })}

          {/* Commit dots */}
          {COMMITS.map((c) => {
            const appear = t >= c.t;
            const isAccent = c.branch === "ai" || c.branch === "merge" || c.id === "mh";
            const r = c.branch === "merge" ? 5 : 3.2;
            return (
              <g
                key={c.id}
                style={{
                  opacity: appear ? 1 : 0,
                  transition: "opacity 200ms ease",
                }}
              >
                <circle cx={c.x} cy={c.y} r={r + 3} fill={isAccent ? "var(--accent)" : "var(--foreground)"} opacity="0.14" />
                <circle
                  cx={c.x} cy={c.y} r={r}
                  fill={isAccent ? "var(--accent)" : "var(--foreground)"}
                  filter="url(#pipe-glow)"
                >
                  <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur="3.4s"
                    repeatCount="indefinite"
                    begin={`${(c.t * 2)}s`}
                  />
                </circle>
              </g>
            );
          })}

          {/* HEAD marker box */}
          {t >= 0.86 && (
            <g style={{ animation: "hero-fade 400ms ease both" }}>
              <rect x="498" y="86" width="26" height="28" rx="3" fill="none" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="0.6" strokeDasharray="2 2" />
            </g>
          )}
        </svg>
      </div>

      {/* corner brackets */}
      <div className="pointer-events-none absolute inset-6 opacity-40">
        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-border-strong" />
        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-border-strong" />
        <span className="absolute left-0 bottom-0 h-3 w-3 border-l border-b border-border-strong" />
        <span className="absolute right-0 bottom-0 h-3 w-3 border-r border-b border-border-strong" />
      </div>

      {/* label */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        pipeline · {t >= 0.86 ? "merged" : "building"} · hover to replay
      </div>
    </div>
  );
}
