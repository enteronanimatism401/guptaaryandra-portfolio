import { useEffect, useState } from "react";

const LINES = [
  "Initializing Infrastructure...",
  "Loading Linux...",
  "Loading AWS...",
  "Loading DevOps...",
  "Loading AI Runtime...",
  "Authenticating...",
  "Ready.",
];

export function BootSequence() {
  const [visible, setVisible] = useState<boolean | null>(null);
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("boot_seen_v2");
    if (seen) {
      setVisible(false);
      return;
    }
    setVisible(true);
    localStorage.setItem("boot_seen_v2", "1");
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (step >= LINES.length) {
      const t = setTimeout(() => setClosing(true), 480);
      const t2 = setTimeout(() => setVisible(false), 1100);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
    const t = setTimeout(() => {
      setStep((s) => s + 1);
      setProgress(Math.round(((step + 1) / LINES.length) * 100));
    }, step === 0 ? 260 : 300);
    return () => clearTimeout(t);
  }, [visible, step]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-background"
      style={{
        opacity: closing ? 0 : 1,
        transition: "opacity 600ms ease",
      }}
    >
      <div className="bg-scanlines absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px 400px at 50% 50%, color-mix(in oklab, var(--accent) 8%, transparent), transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-xl px-8 font-mono text-sm">
        <div className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          SYSTEM BOOT
          <span className="opacity-60">v1.0.0</span>
        </div>
        <div className="space-y-1.5 min-h-[180px]">
          {LINES.slice(0, step).map((line, i) => (
            <div key={i} className="flex items-center gap-3 animate-fade-up">
              <span className="text-success">[ok]</span>
              <span className="text-foreground/90">{line}</span>
            </div>
          ))}
          {step < LINES.length && (
            <div className="flex items-center gap-3">
              <span className="text-accent">[..]</span>
              <span className="text-muted-foreground">{LINES[step]}</span>
              <span className="blink text-accent">_</span>
            </div>
          )}
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-panel-2">
            <div
              className="h-full bg-accent"
              style={{ width: `${progress}%`, transition: "width 320ms ease" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
