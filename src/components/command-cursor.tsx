import { useEffect, useRef, useState } from "react";

type Mode = "default" | "button" | "link" | "card";

const GLYPH: Record<Mode, string> = {
  default: ">",
  button: ">>",
  link: "//",
  card: "[ ]",
};

export function CommandCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!visible) setVisible(true);

      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest("[data-cursor='button'], button")) setMode("button");
      else if (el.closest("[data-cursor='card']")) setMode("card");
      else if (el.closest("a, [data-cursor='link']")) setMode("link");
      else setMode("default");
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    let raf = 0;
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.32;
      pos.current.y += (target.current.y - pos.current.y) * 0.32;
      trailPos.current.x += (target.current.x - trailPos.current.x) * 0.12;
      trailPos.current.y += (target.current.y - trailPos.current.y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.current.x}px, ${trailPos.current.y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [visible]);

  return (
    <>
      <div
        ref={trailRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block"
        style={{ opacity: visible ? 0.35 : 0, transition: "opacity 200ms" }}
      >
        <div
          className="font-mono text-[13px] leading-none"
          style={{ color: "var(--accent)", filter: "blur(3px)", transform: "translate(-2px,-6px)" }}
        >
          {GLYPH[mode]}
        </div>
      </div>
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms" }}
      >
        <div
          className="font-mono text-[13px] font-semibold leading-none"
          style={{
            color: "var(--accent)",
            transform: "translate(-2px,-6px)",
            textShadow: "0 0 12px color-mix(in oklab, var(--accent) 60%, transparent)",
            transition: "letter-spacing 160ms ease",
            letterSpacing: mode === "button" ? "-1px" : "0",
          }}
        >
          {GLYPH[mode]}
        </div>
      </div>
    </>
  );
}
