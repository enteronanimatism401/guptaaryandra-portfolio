import { useEffect, useState } from "react";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { HeroObject } from "./hero-object";

const MODULES = ["Cloud", "Linux", "DevOps", "AI"];
const NAME_LINES = ["ARYANDRA", "GUPTA"];
const NAME_TOTAL = NAME_LINES.reduce((s, w) => s + w.length, 0);

export function Hero() {
  const [step, setStep] = useState(0);
  const [modules, setModules] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const [letters, setLetters] = useState(0);
  const [nameDone, setNameDone] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setStep(1), 300));
    timers.push(window.setTimeout(() => setStep(2), 700));
    MODULES.forEach((m, i) => {
      timers.push(window.setTimeout(() => {
        setModules((prev) => [...prev, m]);
      }, 1000 + i * 260));
    });
    timers.push(window.setTimeout(() => setComplete(true), 1000 + MODULES.length * 260 + 200));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!complete) return;
    const id = window.setInterval(() => {
      setLetters((n) => {
        if (n >= NAME_TOTAL) {
          window.clearInterval(id);
          window.setTimeout(() => setNameDone(true), 500);
          return n;
        }
        return n + 1;
      });
    }, 70);
    return () => window.clearInterval(id);
  }, [complete]);

  return (
    <section id="top" className="relative border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-center">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-accent">●</span> SYSTEM STATUS
            </div>

            <div className="mt-6 font-mono text-sm text-muted-foreground space-y-1.5 min-h-[128px]">
              {step >= 1 && (
                <div className="animate-fade-up">
                  <span className="text-accent">$</span> INITIALIZING<span className="blink">_</span>
                </div>
              )}
              {step >= 2 && (
                <div className="animate-fade-up">
                  <span className="text-accent">$</span> Loading Modules...
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {modules.map((m) => (
                  <span
                    key={m}
                    className="animate-fade-up rounded border border-border bg-panel px-2 py-0.5 text-[11px] text-foreground"
                  >
                    <span className="text-success mr-1.5">ok</span>{m}
                  </span>
                ))}
              </div>
              {complete && (
                <div className="animate-fade-up pt-2">
                  <span className="text-success">✓</span> Completed
                </div>
              )}
            </div>

            <h1 className="hero-name mt-10 font-plex text-[44px] leading-[1.02] tracking-tight sm:text-[64px] md:text-[80px]">
              {NAME_LINES.map((word, wi) => {
                const offset = NAME_LINES.slice(0, wi).reduce((s, w) => s + w.length, 0);
                return (
                  <span key={wi} className="block">
                    {word.split("").map((ch, i) => {
                      const idx = offset + i;
                      const shown = idx < letters;
                      return (
                        <span
                          key={i}
                          className="inline-block"
                          style={{
                            opacity: shown ? 1 : 0,
                            filter: shown ? "blur(0)" : "blur(8px)",
                            transform: shown ? "translateY(0)" : "translateY(6px)",
                            transition: "opacity 380ms ease, filter 380ms ease, transform 380ms ease",
                          }}
                        >
                          {ch}
                        </span>
                      );
                    })}
                    {wi === NAME_LINES.length - 1 && (
                      <>
                        <span
                          className="text-accent inline-block"
                          style={{ opacity: nameDone ? 1 : 0, transition: "opacity 400ms ease" }}
                        >
                          .
                        </span>
                        {!nameDone && (
                          <span className="blink text-accent ml-1 inline-block">▍</span>
                        )}
                      </>
                    )}
                  </span>
                );
              })}
            </h1>

            <div
              className="mt-6 space-y-1 font-mono text-sm text-muted-foreground"
              style={{ opacity: nameDone ? 1 : 0, transition: "opacity 700ms ease 100ms" }}
            >
              <div><span className="text-foreground">›</span> Cloud Infrastructure Engineer</div>
              <div><span className="text-foreground">›</span> Future DevOps Engineer</div>
              <div><span className="text-foreground">›</span> Agentic AI Builder</div>
            </div>

            <div
              className="mt-10 flex flex-wrap items-center gap-3"
              style={{ opacity: nameDone ? 1 : 0, transition: "opacity 700ms ease 250ms" }}
            >
              <a href="#projects" className="btn-primary group inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 font-mono text-xs text-background">
                open projects <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#experience" className="btn-secondary inline-flex items-center gap-2 rounded-md border border-border-strong px-4 py-2.5 font-mono text-xs text-foreground">
                explore journey
              </a>
              <a href="/resume.pdf" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Download className="h-3 w-3" /> download resume
              </a>
            </div>

            <div
              className="mt-8 inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground"
              style={{ opacity: nameDone ? 1 : 0, transition: "opacity 700ms ease 350ms" }}
            >
              <MapPin className="h-3 w-3" /> Prayagraj, India
              <span className="mx-2 opacity-40">·</span>
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success" /> available
            </div>
          </div>

          {/* Interactive infrastructure topology */}
          <div className="relative">
            <HeroObject />
          </div>
        </div>
      </div>
    </section>
  );
}
