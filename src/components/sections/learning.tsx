import { Section } from "../section";

const MODULES = [
  { name: "Agentic AI", progress: 25, started: "2025-09", target: "2026-06", desc: "Multi-agent architectures, tool use, planning." },
  { name: "Model Context Protocol", progress: 30, started: "2025-10", target: "2026-02", desc: "Standard interface between LLMs and external tools." },
  { name: "LangGraph", progress: 20, started: "2025-10", target: "2026-03", desc: "Graph-based orchestration for AI agents." },
  { name: "CrewAI", progress: 15, started: "2025-11", target: "2026-04", desc: "Role-based collaborative agent framework." },
  { name: "OpenAI APIs", progress: 55, started: "2025-06", target: "ongoing", desc: "Chat, tools, embeddings and function calling." },
  { name: "Python", progress: 65, started: "2024-08", target: "ongoing", desc: "Backend scripting for infra and AI workloads." },
  { name: "Docker", progress: 70, started: "2025-01", target: "2026-01", desc: "Containers, images, compose and multi-stage builds." },
  { name: "Kubernetes", progress: 25, started: "2025-08", target: "2026-06", desc: "Pods, deployments, services and manifests." },
  { name: "Terraform", progress: 35, started: "2025-07", target: "2026-05", desc: "IaC for AWS baseline and modular stacks." },
  { name: "Jenkins", progress: 20, started: "2025-09", target: "2026-04", desc: "Pipelines and CI/CD automation." },
  { name: "GitLab CI/CD", progress: 20, started: "2025-09", target: "2026-04", desc: "Pipeline-as-code and runners." },
  { name: "Ansible", progress: 15, started: "2025-10", target: "2026-05", desc: "Configuration management and playbooks." },
  { name: "Prometheus", progress: 20, started: "2025-10", target: "2026-05", desc: "Metrics, exporters and PromQL." },
  { name: "Grafana", progress: 20, started: "2025-10", target: "2026-05", desc: "Dashboards for infra observability." },
  { name: "Linux Internals", progress: 55, started: "2024-11", target: "ongoing", desc: "Filesystems, processes, systemd and networking." },
  { name: "AWS", progress: 60, started: "2024-11", target: "ongoing", desc: "EC2, S3, IAM, CloudFront, Route53, VPC." },
];

export function Learning() {
  return (
    <Section id="learning" label="04 · Active Modules" title="CURRENTLY COMPILING" meta="./modules/active">
      <div className="grid gap-px overflow-hidden rounded-lg border border-border md:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <div
            key={m.name}
            className="group relative bg-panel p-5 transition-colors hover:bg-panel-2 reveal"
            data-cursor="card"
          >
            <div className="flex items-baseline justify-between">
              <div className="text-foreground">{m.name}</div>
              <div className="font-mono text-[11px] text-accent">{m.progress}%</div>
            </div>
            <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-700"
                style={{ width: `${m.progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
              <span>started {m.started}</span>
              <span>target {m.target}</span>
            </div>
            <div className="pointer-events-none absolute inset-x-5 bottom-4 origin-bottom scale-y-0 rounded border border-border-strong bg-panel-2 p-2 font-mono text-[11px] text-muted-foreground opacity-0 transition-all duration-200 group-hover:scale-y-100 group-hover:opacity-100">
              {m.desc}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
