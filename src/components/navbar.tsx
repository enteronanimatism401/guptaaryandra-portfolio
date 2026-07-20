import { useEffect, useState } from "react";
import { Github, Linkedin, FileText } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "learning", label: "Learning" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

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
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: scrolled ? "color-mix(in oklab, var(--background) 78%, transparent)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "background 300ms ease, border-color 300ms ease",
      }}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-8 px-6 md:px-10">
        <a href="#top" className="flex items-center gap-2 font-mono text-sm" data-cursor="link">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-foreground">aryandra</span>
          <span className="text-muted-foreground">@infra:~$</span>
        </a>
        <nav className="hidden items-center gap-6 font-mono text-[13px] text-muted-foreground md:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-active={active === s.id}
              className="nav-link hover:text-foreground transition-colors"
            >
              {s.label.toLowerCase()}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:border-border-strong text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:border-border-strong text-muted-foreground hover:text-foreground transition-colors"
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
