import { Section } from "../section";

const STACK = [
  "Linux", "AWS", "Docker", "Git", "GitHub", "Terraform",
  "Kubernetes", "Jenkins", "Ansible", "Python", "Prometheus", "Grafana", "GitLab",
];

export function Stack() {
  return (
    <Section id="stack" label="05 · Stack" title="Modules on the workbench." meta="./stack/modules">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {STACK.map((s, i) => (
          <div
            key={s}
            data-cursor="card"
            className="module-tile group relative flex aspect-[5/3] flex-col justify-between bg-panel p-4 reveal"
          >
            <div className="font-mono text-[10px] text-muted-foreground">module/{String(i + 1).padStart(2, "0")}</div>
            <div className="text-lg text-foreground group-hover:text-accent transition-colors">{s}</div>
            <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-success" /> ready</span>
              <span>v1</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
