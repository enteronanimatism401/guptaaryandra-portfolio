import { useEffect, useState } from "react";

const LINES = [
  "BOOTING INFRASTRUCTURE...",
  "Loading Cloud Modules...",
  "Initializing Linux...",
  "Connecting AWS...",
  "Starting DevOps Pipeline...",
  "AI Runtime Ready",
];

export function BootSequence() {
  const [visible, setVisible] = useState<boolean | null>(null);
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("boot_seen");
    if (seen) {
      setVisible(false);
      return;
    }
    setVisible(true);
    sessionStorage.setItem("boot_seen", "1");
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (step >= LINES.length) {
      const t = setTimeout(() => setClosing(true), 380);
      const t2 = setTimeout(() => setVisible(false), 900);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 260 : 320);
    return () => clearTimeout(t);
  }, [visible, step]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-background"
      style={{
        opacity: closing ? 0 : 1,
        transition: "opacity 500ms ease",
      }}
    >
      <div className="bg-scanlines absolute inset-0 opacity-40" />
      <div className="relative w-full max-w-2xl px-8 font-mono text-sm">
        <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          system.boot
          <span className="ml-auto">v1.0.0</span>
        </div>
        <div className="space-y-1.5">
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
      </div>
    </div>
  );
}
