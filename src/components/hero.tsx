import { useEffect, useRef, useState } from "react";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { HeroObject } from "./hero-object";

const NAME = "ARYANDRA GUPTA";
const SCRAMBLE_WORDS = [
  "CLOUD ARCHITECT",
  "DEVOPS ENGINEER",
  "AGENTIC AI BUILDER",
  "ARYANDRA GUPTA",
];
const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#01ABCDEFGHJKMNPQRSTVWXYZ";

function useScramble() {
  const [text, setText] = useState(NAME);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    runningRef.current = false;
  };

  const scrambleTo = (target: string): Promise<void> =>
    new Promise((resolve) => {
      const from = text;
      const length = Math.max(from.length, target.length);
      const queue: Array<{ from: string; to: string; start: number; end: number; char?: string }> = [];
      for (let i = 0; i < length; i++) {
        const f = from[i] || "";
        const to = target[i] || "";
        const start = Math.floor(Math.random() * 8);
        const end = start + Math.floor(Math.random() * 12) + 6;
        queue.push({ from: f, to, start, end });
      }
      let frame = 0;
      const tick = () => {
        let output = "";
        let complete = 0;
        for (let i = 0; i < queue.length; i++) {
          const { from: f, to, start, end } = queue[i];
          if (frame >= end) {
            complete++;
            output += to;
          } else if (frame >= start) {
            if (!queue[i].char || Math.random() < 0.28) {
              queue[i].char = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            }
            output += `\u0000${queue[i].char}`; // marker for accent
          } else {
            output += f;
          }
        }
        setText(output);
        if (complete === queue.length) {
          resolve();
        } else {
          frame++;
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    });

  const play = async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    for (const word of SCRAMBLE_WORDS) {
      if (!runningRef.current) break;
      await scrambleTo(word);
      await new Promise((r) => setTimeout(r, 520));
    }
    runningRef.current = false;
  };

  useEffect(() => stop, []);

  return { text, play };
}

function ScrambleName() {
  const { text, play } = useScramble();
  // Render with accent scramble chars
  return (
    <h1
      className="hero-name font-plex text-[44px] leading-[1.02] tracking-tight sm:text-[64px] md:text-[80px]"
      onMouseEnter={play}
    >
      {Array.from(text).map((ch, i) => {
        if (ch === "\u0000") return null;
        const prev = text[i - 1];
        const isScramble = prev === "\u0000";
        return (
          <span
            key={i}
            className="inline-block"
            style={{ color: isScramble ? "var(--accent)" : undefined, transition: "color 120ms ease" }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </h1>
  );
}

const SUBTITLE = [
  "Building scalable cloud systems",
  "Automating everything worth repeating",
  "Engineering intelligent workflows",
];

export function Hero() {
  return (
    <section id="top" className="relative border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-accent">●</span> HEAD → main
            </div>

            <div className="mt-8">
              <ScrambleName />
            </div>

            <div className="mt-6 space-y-1 font-mono text-sm text-muted-foreground">
              {SUBTITLE.map((line) => (
                <div key={line}>
                  <span className="text-foreground">›</span> {line}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#projects" className="btn-primary group inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 font-mono text-xs text-background">
                open projects <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#experience" className="btn-secondary inline-flex items-center gap-2 rounded-md border border-border-strong px-4 py-2.5 font-mono text-xs text-foreground">
                explore journey
              </a>
              <a href="/resume.pdf" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
                <Download className="h-3 w-3" /> download resume
              </a>
            </div>

            <div className="mt-8 inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" /> Prayagraj, India
              <span className="mx-2 opacity-40">·</span>
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success" /> available
            </div>
          </div>

          <div className="relative">
            <HeroObject />
          </div>
        </div>
      </div>
    </section>
  );
}
