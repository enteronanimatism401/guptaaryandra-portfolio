import { useEffect, useRef, type ReactNode } from "react";

export function Section({
  id,
  label,
  title,
  meta,
  children,
}: {
  id: string;
  label: string;
  title: ReactNode;
  meta?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal") || [];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "-10% 0px -10% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className="relative border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
        <div className="mb-10 flex items-baseline justify-between gap-6 reveal">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-accent mr-2">§</span>{label}
            </div>
            <h2 className="mt-3 font-plex text-3xl md:text-5xl tracking-tight">{title}</h2>
          </div>
          {meta && (
            <div className="hidden md:block font-mono text-[11px] text-muted-foreground">{meta}</div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
