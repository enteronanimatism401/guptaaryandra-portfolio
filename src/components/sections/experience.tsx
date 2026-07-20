import { useState } from "react";
import { Section } from "../section";

type NodeT = {
  name: string;
  desc?: string;
  children?: NodeT[];
};

type StatusKind = "completed" | "in-progress" | "ongoing" | "shipped";

type Entry = {
  timeline: string;
  role: string;
  org?: string;
  status: StatusKind;
  trees: NodeT[];
};

const ENTRIES: Entry[] = [
  {
    timeline: "2025 — 2026",
    role: "Diploma in Cloud Computing with AI",
    org: "Jetking Institute · Prayagraj",
    status: "completed",
    trees: [
      {
        name: "Cloud Computing",
        children: [
          {
            name: "AWS",
            children: [
              { name: "EC2", desc: "Elastic Compute Cloud" },
              { name: "S3", desc: "Simple Storage Service" },
              { name: "IAM", desc: "Identity & Access Management" },
              { name: "CloudFront", desc: "Content Delivery Network" },
              { name: "Route53", desc: "Managed DNS" },
            ],
          },
          {
            name: "Linux",
            children: [
              { name: "Ubuntu", desc: "Debian-based distro" },
              { name: "RHEL", desc: "Red Hat Enterprise Linux" },
              { name: "Bash", desc: "Shell scripting" },
            ],
          },
          {
            name: "Networking",
            children: [
              { name: "TCP/IP", desc: "Transport & internet layer" },
              { name: "DNS", desc: "Domain Name System" },
              { name: "Subnetting", desc: "IP range partitioning" },
            ],
          },
        ],
      },
    ],
  },
  {
    timeline: "2023 — Present",
    role: "Bachelor of Computer Applications",
    org: "Arunachal University of Studies",
    status: "in-progress",
    trees: [
      {
        name: "Computer Science",
        children: [
          { name: "Programming", desc: "Languages & paradigms" },
          { name: "Operating Systems", desc: "Processes, memory, IO" },
          { name: "DBMS", desc: "Database Management Systems" },
          { name: "Networking", desc: "Protocols & topologies" },
          { name: "Software Engineering", desc: "SDLC & design" },
        ],
      },
    ],
  },
  {
    timeline: "2026 — Present",
    role: "Self Learning",
    org: "DevOps · Cloud Engineering · Agentic AI",
    status: "ongoing",
    trees: [
      {
        name: "DevOps",
        children: [
          { name: "Docker", desc: "Container Runtime" },
          { name: "Kubernetes", desc: "Container Orchestration" },
          { name: "Terraform", desc: "Infrastructure as Code" },
          { name: "Jenkins", desc: "CI/CD Automation Server" },
          { name: "GitLab CI/CD", desc: "Pipeline Automation" },
          { name: "Ansible", desc: "Configuration Management" },
        ],
      },
      {
        name: "Agentic AI",
        children: [
          { name: "Python", desc: "Primary Language" },
          { name: "MCP", desc: "Model Context Protocol" },
          { name: "LangGraph", desc: "Agent Orchestration" },
          { name: "OpenAI API", desc: "LLM Interface" },
          { name: "AI Workflows", desc: "Automation Pipelines" },
        ],
      },
    ],
  },
  {
    timeline: "2026",
    role: "Hands-on AWS Projects",
    org: "Production deployments",
    status: "shipped",
    trees: [
      {
        name: "Production Deployments",
        children: [
          {
            name: "Static Website",
            children: [
              { name: "S3", desc: "Origin bucket" },
              { name: "CloudFront", desc: "Edge distribution" },
              { name: "IAM", desc: "Access policies" },
            ],
          },
          {
            name: "Docker Deployment",
            children: [
              { name: "EC2", desc: "Compute host" },
              { name: "Docker", desc: "Container runtime" },
              { name: "Nginx", desc: "Reverse proxy" },
            ],
          },
          {
            name: "DNS Configuration",
            children: [{ name: "Route53", desc: "Zone + records" }],
          },
        ],
      },
    ],
  },
];

function StatusBadge({ kind }: { kind: StatusKind }) {
  const map = {
    completed: { label: "COMPLETED", glyph: "✓", color: "var(--success)" },
    "in-progress": { label: "IN PROGRESS", glyph: "●", color: "var(--accent)" },
    ongoing: { label: "ONGOING", glyph: "●", color: "#6EA8FE" },
    shipped: { label: "SHIPPED", glyph: "✓", color: "var(--success)" },
  }[kind];
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em]"
      style={{ color: map.color }}
    >
      <span aria-hidden>{map.glyph}</span>
      {map.label}
    </span>
  );
}

/**
 * Recursive tree line renderer producing ASCII-style prefixes
 * (│  ├──  └──) with proper alignment.
 */
type Line = {
  key: string;
  prefix: string;
  connector: string;
  name: string;
  desc?: string;
  depth: number;
  isRoot: boolean;
};

function flattenTree(root: NodeT): Line[] {
  const out: Line[] = [];
  const walk = (node: NodeT, prefix: string, connector: string, depth: number, isRoot: boolean, path: string) => {
    out.push({
      key: path,
      prefix,
      connector,
      name: node.name,
      desc: node.desc,
      depth,
      isRoot,
    });
    const kids = node.children || [];
    kids.forEach((child, i) => {
      const last = i === kids.length - 1;
      const nextConnector = last ? "└── " : "├── ";
      const nextPrefix = isRoot ? "" : prefix + (connector.startsWith("└") ? "    " : "│   ");
      walk(child, nextPrefix, nextConnector, depth + 1, false, `${path}/${child.name}-${i}`);
    });
  };
  walk(root, "", "", 0, true, root.name);
  return out;
}

function DependencyTree({ root, active }: { root: NodeT; active: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [rootHover, setRootHover] = useState(false);
  const lines = flattenTree(root);

  return (
    <div className="font-mono text-[12px] leading-[1.85] select-none">
      {lines.map((ln, idx) => {
        const isHover = hovered === ln.key;
        const revealDelay = active ? idx * 55 : 0;
        const pulseActive = rootHover;
        return (
          <div
            key={ln.key}
            className="group flex items-start whitespace-pre"
            style={{
              opacity: active ? (isHover ? 1 : ln.isRoot ? 1 : 0.72) : 0,
              transform: active ? "translateX(0)" : "translateX(-4px)",
              transition: `opacity 380ms ease ${revealDelay}ms, transform 380ms ease ${revealDelay}ms`,
            }}
            onMouseEnter={() => {
              setHovered(ln.key);
              if (ln.isRoot) setRootHover(true);
            }}
            onMouseLeave={() => {
              setHovered((v) => (v === ln.key ? null : v));
              if (ln.isRoot) setRootHover(false);
            }}
          >
            {!ln.isRoot && (
              <span
                aria-hidden
                style={{
                  color: "var(--border-strong)",
                  opacity: pulseActive ? 0.9 : 0.55,
                  transition: "opacity 300ms ease",
                }}
              >
                {ln.prefix}
                {ln.connector}
              </span>
            )}
            <span
              style={{
                color: ln.isRoot ? "var(--accent)" : "var(--foreground)",
                opacity: ln.isRoot ? 1 : isHover ? 1 : 0.78,
                fontWeight: ln.isRoot ? 500 : 400,
                letterSpacing: ln.isRoot ? "0.04em" : "0",
                textTransform: ln.isRoot ? "uppercase" : "none",
                transition: "opacity 200ms ease, color 200ms ease",
              }}
            >
              {ln.name}
            </span>
            {ln.desc && isHover && !ln.isRoot && (
              <span
                className="ml-3 font-mono text-[10.5px] uppercase tracking-[0.18em]"
                style={{
                  color: "var(--muted-foreground)",
                  opacity: 0.9,
                  animation: "fade-in 220ms ease-out",
                }}
              >
                → {ln.desc}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Experience() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <Section
      id="experience"
      label="02 · Experience"
      title="Engineering logbook."
      meta="./log/experience"
    >
      <div className="relative">
        {/* vertical timeline rail */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px"
          style={{ background: "var(--border)" }}
        />

        <ul className="space-y-14">
          {ENTRIES.map((it, i) => {
            const active = activeIdx === i;
            return (
              <li
                key={i}
                className="reveal grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx((v) => (v === i ? null : v))}
                style={{
                  opacity: activeIdx === null || active ? 1 : 0.55,
                  transition: "opacity 300ms ease",
                }}
              >
                {/* left: meta */}
                <div className="relative pl-8">
                  <span
                    aria-hidden
                    className="absolute left-0 top-[9px] block h-3.5 w-3.5 rounded-full"
                    style={{
                      background: "var(--background)",
                      border: `1px solid ${active ? "var(--accent)" : "var(--border-strong)"}`,
                      boxShadow: active
                        ? "0 0 0 4px color-mix(in oklab, var(--accent) 14%, transparent)"
                        : "none",
                      transition: "box-shadow 260ms ease, border-color 260ms ease",
                    }}
                  />
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    {it.timeline}
                  </div>
                  <div className="mt-2 font-plex text-xl md:text-[22px] leading-snug text-foreground">
                    {it.role}
                  </div>
                  {it.org && (
                    <div className="mt-1 font-mono text-[12px] text-muted-foreground">
                      {it.org}
                    </div>
                  )}
                  <div className="mt-4">
                    <StatusBadge kind={it.status} />
                  </div>
                </div>

                {/* right: dependency tree(s) */}
                <div className="space-y-8 md:pl-4">
                  {it.trees.map((tree, ti) => (
                    <DependencyTree key={ti} root={tree} active />
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
