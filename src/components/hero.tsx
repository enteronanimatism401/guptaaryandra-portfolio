import { useEffect, useState } from "react";
import { ArrowRight, Download, MapPin } from "lucide-react";

const MODULES = ["Cloud", "Linux", "DevOps", "AI"];

export function Hero() {
  const [step, setStep] = useState(0);
  const [modules, setModules] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);

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

  return (
    <section id="top" className="relative border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid gap-16 md:grid-cols-[minmax(0,1fr)_360px]">
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

            <h1
              className="mt-10 font-plex text-[44px] leading-[1.02] tracking-tight sm:text-[64px] md:text-[80px]"
              style={{ opacity: complete ? 1 : 0, transform: complete ? "translateY(0)" : "translateY(12px)", transition: "all 700ms ease" }}
            >
              ARYANDRA<br />GUPTA<span className="text-accent">.</span>
            </h1>

            <div
              className="mt-6 space-y-1 font-mono text-sm text-muted-foreground"
              style={{ opacity: complete ? 1 : 0, transition: "opacity 700ms ease 200ms" }}
            >
              <div><span className="text-foreground">›</span> Cloud Infrastructure Engineer</div>
              <div><span className="text-foreground">›</span> Future DevOps Engineer</div>
              <div><span className="text-foreground">›</span> Agentic AI Builder</div>
            </div>

            <div
              className="mt-10 flex flex-wrap items-center gap-3"
              style={{ opacity: complete ? 1 : 0, transition: "opacity 700ms ease 400ms" }}
            >
              <a href="#projects" data-cursor="button" className="group inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 font-mono text-xs text-background hover:bg-accent hover:text-accent-foreground transition-colors">
                open projects <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#experience" data-cursor="button" className="inline-flex items-center gap-2 rounded-md border border-border-strong px-4 py-2.5 font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-colors">
                explore journey
              </a>
              <a href="/resume.pdf" target="_blank" rel="noreferrer" data-cursor="button" className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Download className="h-3 w-3" /> download resume
              </a>
            </div>

            <div
              className="mt-8 inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground"
              style={{ opacity: complete ? 1 : 0, transition: "opacity 700ms ease 500ms" }}
            >
              <MapPin className="h-3 w-3" /> Prayagraj, India
              <span className="mx-2 opacity-40">·</span>
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success" /> available
            </div>
          </div>

          {/* Right control panel */}
          <div className="hidden md:block">
            <StatusPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPanel() {
  const rows = [
    { k: "region", v: "ap-south-1" },
    { k: "uptime", v: "247d 03:41" },
    { k: "runtime", v: "linux/x86_64" },
    { k: "cloud", v: "aws" },
    { k: "agent", v: "operational" },
  ];
  return (
    <div className="panel soft-shadow rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border bg-panel-2 px-3 py-2 font-mono text-[11px] text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-success" />
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="h-2 w-2 rounded-full border border-border" />
        <span className="ml-2">ops.control</span>
        <span className="ml-auto">live</span>
      </div>
      <div className="p-4 font-mono text-xs">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center justify-between border-b border-border/60 py-2 last:border-b-0">
            <span className="text-muted-foreground">{r.k}</span>
            <span className="text-foreground">{r.v}</span>
          </div>
        ))}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>load</span><span>steady</span>
          </div>
          <div className="grid gap-[2px]" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
            {Array.from({ length: 24 }).map((_, i) => {
              const h = 12 + Math.round(Math.sin(i * 0.7) * 10 + Math.cos(i * 1.3) * 6 + 14);
              return (
                <div key={i} style={{ height: `${h}px` }} className="w-full bg-accent/60 rounded-[1px]" />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
