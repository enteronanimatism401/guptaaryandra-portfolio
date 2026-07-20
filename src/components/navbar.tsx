import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, FileText, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const SECTIONS = [
  { id: "about", label: "README" },
  { id: "experience", label: "LOGBOOK" },
  { id: "projects", label: "DEPLOYMENTS" },
  { id: "learning", label: "LAB" },
  { id: "stack", label: "ECOSYSTEM" },
  { id: "contact", label: "CONNECT" },
];

const DURATION = 800;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function Navbar() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const rafRef = useRef<number | null>(null);

  const smoothScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetY = el.getBoundingClientRect().top + window.scrollY - 56;
    if (reduce) {
      window.scrollTo(0, targetY);
      return;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const startY = window.scrollY;
    const delta = targetY - startY;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      window.scrollTo(0, startY + delta * easeInOut(t));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else rafRef.current = null;
    };
    rafRef.current = requestAnimationFrame(step);
    if (history.replaceState) history.replaceState(null, "", `#${id}`);
  };

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    smoothScrollTo(id);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });

    // Intercept all in-page anchor clicks (e.g. hero buttons) for smooth scroll
    const docClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      const a = target?.closest("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      ev.preventDefault();
      smoothScrollTo(id);
    };
    document.addEventListener("click", docClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", docClick);
      obs.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: scrolled ? "color-mix(in oklab, var(--background) 70%, transparent)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px) saturate(140%)" : "none",
        transition: "background 300ms ease, border-color 300ms ease, backdrop-filter 300ms ease",
      }}
    >
      <div className="mx-auto grid h-14 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 md:px-10">
        <a href="#top" className="flex items-center gap-2 font-plex text-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-foreground">guptaaryandra</span>
          <span className="text-muted-foreground">@cloud:~$</span>
        </a>
        <nav className="nav-center hidden font-mono text-[12px] md:flex" data-scrolled={scrolled}>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-active={active === s.id}
              onClick={(e) => handleAnchor(e, s.id)}
            >
              {s.label}
            </a>
          ))}
        </nav>
        <div className="md:hidden" />

        <div className="flex items-center justify-end gap-2">
          <a
            href="https://github.com/guptaaryandra"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:border-accent hover:text-accent text-muted-foreground transition-all hover:-translate-y-0.5"
          >
            <Github className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://linkedin.com/in/gupta-aryandra/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:border-accent hover:text-accent text-muted-foreground transition-all hover:-translate-y-0.5"
          >
            <Linkedin className="h-3.5 w-3.5" />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            aria-label="Resume"
            className="hidden sm:flex h-8 items-center gap-1.5 rounded-md border border-border hover:border-accent px-2.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="h-3 w-3" />
            resume.pdf
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
