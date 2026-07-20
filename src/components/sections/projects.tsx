import { Section } from "../section";
import { ExternalLink, Github, FileText } from "lucide-react";

const PROJECTS = [
  {
    id: "001",
    title: "AWS Static Website",
    status: "SUCCESS",
    summary: "Static site delivered globally through S3, IAM policies and CloudFront CDN.",
    services: ["S3", "IAM", "CloudFront", "Route53"],
    links: { docs: "#", github: "#", live: "#" },
  },
  {
    id: "002",
    title: "Dockerized Nginx on EC2",
    status: "SUCCESS",
    summary: "Nginx container deployed on an Ubuntu EC2 instance with mapped ports and public exposure.",
    services: ["EC2", "Docker", "Nginx", "Ubuntu"],
    links: { docs: "#", github: "#", live: "#" },
  },
  {
    id: "003",
    title: "Route53 DNS Routing",
    status: "SUCCESS",
    summary: "Custom domain routing with hosted zones, A/CNAME records and TLS-ready endpoints.",
    services: ["Route53", "ACM", "CloudFront"],
    links: { docs: "#", github: "#", live: "#" },
  },
  {
    id: "004",
    title: "Terraform · AWS baseline",
    status: "COMING SOON",
    summary: "Infrastructure-as-Code baseline: VPC, subnets, IAM roles and a reusable module layout.",
    services: ["Terraform", "AWS", "IaC"],
    links: {},
  },
  {
    id: "005",
    title: "Agentic AI · MCP server",
    status: "COMING SOON",
    summary: "A small Model Context Protocol server exposing tools to an LLM agent orchestrator.",
    services: ["Python", "MCP", "LangGraph"],
    links: {},
  },
];

export function Projects() {
  return (
    <Section id="projects" label="03 · Projects" title="Deployment records, not marketing cards." meta="./deployments">
      <div className="panel soft-shadow rounded-lg overflow-hidden">
        <div className="hidden md:grid grid-cols-[80px_minmax(0,1.4fr)_120px_minmax(0,1fr)_180px] gap-4 border-b border-border bg-panel-2 px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <div>#</div>
          <div>deployment</div>
          <div>status</div>
          <div>services</div>
          <div className="text-right">artifacts</div>
        </div>
        {PROJECTS.map((p) => {
          const done = p.status === "SUCCESS";
          return (
            <div
              key={p.id}
              data-cursor="card"
              className="deploy-card grid gap-3 border-b border-border px-6 py-5 last:border-b-0 md:grid-cols-[80px_minmax(0,1.4fr)_120px_minmax(0,1fr)_180px] md:items-center reveal"
            >
              <div className="font-mono text-xs text-muted-foreground">#{p.id}</div>
              <div>
                <div className="text-foreground">{p.title}</div>
                <div className="mt-1 font-mono text-[12px] text-muted-foreground">{p.summary}</div>
              </div>
              <div>
                <span
                  className="inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                  style={{
                    color: done ? "var(--success)" : "var(--muted-foreground)",
                    borderColor: done ? "color-mix(in oklab, var(--success) 40%, transparent)" : "var(--border)",
                    background: done ? "color-mix(in oklab, var(--success) 8%, transparent)" : "transparent",
                  }}
                >
                  <span className="h-1 w-1 rounded-full" style={{ background: done ? "var(--success)" : "var(--muted-foreground)" }} />
                  {p.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.services.map((s) => (
                  <span key={s} className="rounded border border-border bg-panel-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-start gap-3 font-mono text-[11px] md:justify-end">
                {p.links.docs && (
                  <a href={p.links.docs} className="inline-flex items-center gap-1 text-muted-foreground hover:text-accent">
                    <FileText className="h-3 w-3" /> docs
                  </a>
                )}
                {p.links.github && (
                  <a href={p.links.github} className="inline-flex items-center gap-1 text-muted-foreground hover:text-accent">
                    <Github className="h-3 w-3" /> github
                  </a>
                )}
                {p.links.live && (
                  <a href={p.links.live} className="inline-flex items-center gap-1 text-muted-foreground hover:text-accent">
                    <ExternalLink className="h-3 w-3" /> live
                  </a>
                )}
                {!p.links.docs && <span className="text-muted-foreground/60">—</span>}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
