import { ArrowRight, Download, MapPin } from "lucide-react";
import { HeroObject } from "./hero-object";

function ScrambleName() {
  return (
    <h1
      className="hero-name font-plex tracking-tight"
      style={{
        fontSize: "clamp(2.75rem, 7.5vw, 6.5rem)",
        lineHeight: 0.98,
        letterSpacing: "-0.02em",
      }}
    >
      <span className="block whitespace-nowrap">ARYANDRA</span>
      <span className="block whitespace-nowrap">GUPTA</span>
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
