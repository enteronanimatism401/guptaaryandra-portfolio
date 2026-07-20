import { Section } from "../section";

export function About() {
  return (
    <Section id="about" label="01 · About" title="Currently learning the whole stack — the honest way." meta="./about.md">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5 text-[15px] leading-relaxed text-foreground/85 reveal">
          <p>
            I'm Aryandra, based in Prayagraj. Right now I'm studying <span className="text-foreground">Cloud Computing</span> at Jetking and building real AWS projects on the side — the kind you actually have to debug, not the ones from tutorials.
          </p>
          <p>
            My days look like this: reading Linux internals in the morning, breaking and fixing an EC2 setup by evening, and squeezing in a Docker or Terraform experiment before I sleep. I'm preparing seriously for an entry-level <span className="text-foreground">Cloud Engineer</span> role, then moving into <span className="text-foreground">DevOps</span> once I've earned the foundation.
          </p>
          <p>
            Long term I want to work on <span className="text-accent">Agentic AI infrastructure</span> — the systems, orchestration and platforms that let AI agents actually run in production. I'd rather learn slowly and deeply than pretend to know everything. This site is just what's on my desk today.
          </p>
        </div>
        <div className="reveal">
          <div className="panel soft-shadow rounded-lg p-4 font-mono text-xs">
            <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">focus.today</div>
            {[
              ["now", "Cloud Computing Diploma"],
              ["ship", "AWS hands-on projects"],
              ["study", "Linux · Networking"],
              ["next", "DevOps toolchain"],
              ["north-star", "Agentic AI systems"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-border/60 py-2 last:border-b-0">
                <span className="text-muted-foreground">{k}</span>
                <span className="text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
