import { Section } from "../section";

type Group = { name: string; slug: string; items: string[] };

const GROUPS: Group[] = [
  { name: "Cloud", slug: "cloud", items: ["AWS", "Linux", "Networking"] },
  { name: "DevOps", slug: "devops", items: ["Docker", "Kubernetes", "Terraform", "Jenkins", "GitLab", "Ansible"] },
  { name: "Observability", slug: "observability", items: ["Prometheus", "Grafana"] },
  { name: "Programming", slug: "programming", items: ["Python", "Bash", "Git"] },
  { name: "AI Engineering", slug: "ai", items: ["OpenAI API", "Model Context Protocol", "LangGraph", "CrewAI"] },
];

export function Stack() {
  return (
    <Section id="stack" label="05 · Tech Stack" title="An engineering ecosystem, grouped." meta="./stack/ecosystem">
      <div className="space-y-6">
        {GROUPS.map((g, gi) => (
          <div key={g.slug} className="panel rounded-lg p-5 reveal" style={{ transitionDelay: `${gi * 80}ms` }}>
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">/{g.slug}</span>
              <span className="font-plex text-sm text-foreground">{g.name}</span>
              <span className="flex-1 h-px bg-border" />
              <span className="font-mono text-[10px] text-muted-foreground">{g.items.length} modules</span>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {g.items.map((item, i) => (
                <div
                  key={item}
                  className="module-tile group relative flex aspect-[5/3] flex-col justify-between bg-panel p-3 reveal"
                  style={{ transitionDelay: `${(gi * 80) + (i * 50)}ms` }}
                >
                  <div className="font-mono text-[10px] text-muted-foreground">{g.slug}/{String(i + 1).padStart(2, "0")}</div>
                  <div className="font-plex text-[13px] text-foreground group-hover:text-accent transition-colors">{item}</div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-success" /> ready</span>
                    <span>v1</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
