import { Section } from "../section";

const ITEMS = [
  {
    year: "2024 — now",
    role: "Diploma in Cloud Computing with AI",
    org: "Jetking Institute · Prayagraj",
    tag: "current",
    notes: ["AWS core services", "Linux administration", "Networking foundations"],
  },
  {
    year: "2023 — now",
    role: "Bachelor of Computer Applications",
    org: "Arunachal University of Studies",
    tag: "in-progress",
    notes: ["CS fundamentals", "Programming & OS"],
  },
  {
    year: "ongoing",
    role: "Self-learning · DevOps & Agentic AI",
    org: "Personal roadmap",
    tag: "24/7",
    notes: ["Docker · Kubernetes", "Terraform · Jenkins", "MCP · LangGraph"],
  },
  {
    year: "2025",
    role: "Hands-on AWS projects",
    org: "Portfolio deployments",
    tag: "shipped",
    notes: ["EC2 · S3 · CloudFront", "IAM · Route53", "Docker on EC2"],
  },
];

export function Experience() {
  return (
    <Section id="experience" label="02 · Experience" title="Education, projects, self-taught practice." meta="./log/experience">
      <div className="panel soft-shadow rounded-lg overflow-hidden">
        {ITEMS.map((it, i) => (
          <div
            key={i}
            className="grid gap-4 border-b border-border p-6 last:border-b-0 md:grid-cols-[140px_1fr_260px] reveal"
          >
            <div className="font-mono text-xs text-muted-foreground">{it.year}</div>
            <div>
              <div className="text-foreground">{it.role}</div>
              <div className="font-mono text-xs text-muted-foreground mt-0.5">{it.org}</div>
              <div className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
                <span className="h-1 w-1 rounded-full bg-accent" /> {it.tag}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {it.notes.map((n) => (
                <span key={n} className="rounded border border-border bg-panel-2 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {n}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
