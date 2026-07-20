import { useEffect, useRef } from "react";

// Deterministic pseudo-random for stable SSR/client render
function seeded(n: number) {
  const x = Math.sin(n * 9973.13) * 43758.5453;
  return x - Math.floor(x);
}

const NODE_COUNT = 14;
const NODES = Array.from({ length: NODE_COUNT }).map((_, i) => {
  const ring = i < 6 ? 0 : 1;
  const idx = ring === 0 ? i : i - 6;
  const count = ring === 0 ? 6 : 8;
  const radius = ring === 0 ? 78 : 148;
  const angle = (idx / count) * Math.PI * 2 + (ring === 0 ? 0 : Math.PI / 8);
  const wobble = (seeded(i + 1) - 0.5) * 18;
  return {
    id: i,
    x: Math.cos(angle) * (radius + wobble),
    y: Math.sin(angle) * (radius + wobble),
    r: ring === 0 ? 3.2 : 2.4,
    accent: i % 5 === 0,
  };
});

// Build edges: hub-to-inner + inner-to-outer nearest
const EDGES: Array<[number, number]> = [];
NODES.forEach((n, i) => {
  if (i === 0) return;
  if (i < 6) EDGES.push([0, i]);
});
for (let i = 6; i < NODE_COUNT; i++) {
  // connect each outer to two nearest inner
  const dists = NODES.slice(1, 6)
    .map((n, k) => ({ k: k + 1, d: Math.hypot(n.x - NODES[i].x, n.y - NODES[i].y) }))
    .sort((a, b) => a.d - b.d);
  EDGES.push([dists[0].k, i]);
  if (dists[1]) EDGES.push([dists[1].k, i]);
}

const PARTICLES = Array.from({ length: 22 }).map((_, i) => ({
  id: i,
  x: (seeded(i * 3.1) - 0.5) * 420,
  y: (seeded(i * 7.7) - 0.5) * 420,
  s: 0.4 + seeded(i * 11.3) * 1.4,
  d: 4 + seeded(i * 5.5) * 6,
  accent: i % 6 === 0,
}));

export function HeroObject() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let angle = 0;
    const onMove = (e: MouseEvent) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const py = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      tx = Math.max(-1, Math.min(1, px)) * 14;
      ty = Math.max(-1, Math.min(1, py)) * 10;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      angle += 0.06;
      if (innerRef.current) {
        innerRef.current.style.transform =
          `translate3d(${cx}px, ${cy}px, 0) rotate(${angle * 0.05}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative flex items-center justify-center h-[420px] md:h-[520px] w-full"
      aria-hidden
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(320px 260px at 50% 50%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
        }}
      />
      {/* concentric rings */}
      <svg
        viewBox="-220 -220 440 440"
        className="absolute inset-0 h-full w-full opacity-40"
      >
        {[80, 150, 210].map((r) => (
          <circle
            key={r}
            cx="0"
            cy="0"
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeDasharray="2 4"
          />
        ))}
      </svg>

      <div ref={innerRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <svg viewBox="-220 -220 440 440" className="h-full w-full">
          <defs>
            <radialGradient id="hub-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.95" />
              <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Edges */}
          {EDGES.map(([a, b], i) => {
            const A = NODES[a];
            const B = NODES[b];
            return (
              <line
                key={i}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="var(--border-strong)"
                strokeWidth="0.6"
                opacity="0.7"
              >
                <animate
                  attributeName="opacity"
                  values="0.25;0.75;0.25"
                  dur={`${4 + (i % 5)}s`}
                  repeatCount="indefinite"
                  begin={`${(i % 7) * 0.3}s`}
                />
              </line>
            );
          })}

          {/* Hub aura */}
          <circle cx="0" cy="0" r="42" fill="url(#hub-grad)" />
          {/* Hub */}
          <circle
            cx="0"
            cy="0"
            r="5.5"
            fill="var(--accent)"
          />
          <circle
            cx="0"
            cy="0"
            r="9"
            fill="none"
            stroke="var(--accent)"
            strokeOpacity="0.5"
            strokeWidth="0.8"
          />

          {/* Nodes */}
          {NODES.slice(1).map((n) => (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r + 3}
                fill={n.accent ? "var(--accent)" : "var(--foreground)"}
                opacity="0.08"
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={n.accent ? "var(--accent)" : "var(--foreground)"}
              >
                <animate
                  attributeName="opacity"
                  values="0.55;1;0.55"
                  dur={`${3 + (n.id % 4)}s`}
                  repeatCount="indefinite"
                  begin={`${(n.id % 5) * 0.4}s`}
                />
              </circle>
            </g>
          ))}

          {/* Particles */}
          {PARTICLES.map((p) => (
            <circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={p.s}
              fill={p.accent ? "var(--accent)" : "var(--muted-foreground)"}
              opacity="0.5"
            >
              <animate
                attributeName="cy"
                values={`${p.y};${p.y - p.d};${p.y}`}
                dur={`${5 + (p.id % 5)}s`}
                repeatCount="indefinite"
                begin={`${(p.id % 4) * 0.6}s`}
              />
              <animate
                attributeName="opacity"
                values="0;0.7;0"
                dur={`${5 + (p.id % 5)}s`}
                repeatCount="indefinite"
                begin={`${(p.id % 4) * 0.6}s`}
              />
            </circle>
          ))}
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
        infra.topology · live
      </div>
    </div>
  );
}
