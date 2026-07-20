import { useEffect, useRef, useState } from "react";
import { Section } from "../section";

type Stage = "Exploring" | "Learning" | "Hands-on" | "Building" | "Production Practice";

const MODULES: { name: string; stage: Stage; progress: number; started: string; target: string; desc: string }[] = [
  { name: "Agentic AI", stage: "Learning", progress: 25, started: "2025-09", target: "2026-06", desc: "Multi-agent architectures, tool use, planning." },
  { name: "Model Context Protocol", stage: "Learning", progress: 30, started: "2025-10", target: "2026-02", desc: "Standard interface between LLMs and external tools." },
  { name: "LangGraph", stage: "Exploring", progress: 20, started: "2025-10", target: "2026-03", desc: "Graph-based orchestration for AI agents." },
  { name: "CrewAI", stage: "Exploring", progress: 15, started: "2025-11", target: "2026-04", desc: "Role-based collaborative agent framework." },
  { name: "OpenAI APIs", stage: "Hands-on", progress: 55, started: "2025-06", target: "ongoing", desc: "Chat, tools, embeddings and function calling." },
  { name: "Python", stage: "Building", progress: 65, started: "2024-08", target: "ongoing", desc: "Backend scripting for infra and AI workloads." },
  { name: "Docker", stage: "Production Practice", progress: 70, started: "2025-01", target: "2026-01", desc: "Containers, images, compose and multi-stage builds." },
  { name: "Kubernetes", stage: "Learning", progress: 25, started: "2025-08", target: "2026-06", desc: "Pods, deployments, services and manifests." },
  { name: "Terraform", stage: "Hands-on", progress: 35, started: "2025-07", target: "2026-05", desc: "IaC for AWS baseline and modular stacks." },
  { name: "Jenkins", stage: "Learning", progress: 20, started: "2025-09", target: "2026-04", desc: "Pipelines and CI/CD automation." },
  { name: "GitLab CI/CD", stage: "Learning", progress: 20, started: "2025-09", target: "2026-04", desc: "Pipeline-as-code and runners." },
  { name: "Ansible", stage: "Exploring", progress: 15, started: "2025-10", target: "2026-05", desc: "Configuration management and playbooks." },
  { name: "Prometheus", stage: "Learning", progress: 20, started: "2025-10", target: "2026-05", desc: "Metrics, exporters and PromQL." },
  { name: "Grafana", stage: "Learning", progress: 20, started: "2025-10", target: "2026-05", desc: "Dashboards for infra observability." },
  { name: "Linux Internals", stage: "Hands-on", progress: 55, started: "2024-11", target: "ongoing", desc: "Filesystems, processes, systemd and networking." },
  { name: "AWS", stage: "Building", progress: 60, started: "2024-11", target: "ongoing", desc: "EC2, S3, IAM, CloudFront, Route53, VPC." },
];

const TITLE = "THE LAB NEVER SLEEPS.";

function TypedTitle() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setText(TITLE);
      setDone(true);
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          let i = 0;
          const tick = () => {
            i++;
            setText(TITLE.slice(0, i));
            if (i < TITLE.length) setTimeout(tick, 42);
            else setDone(true);
          };
          tick();
          obs.disconnect();
        }
      });
    }, { rootMargin: "-10% 0px -10% 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <span>{text || "\u00A0"}</span>
      <span
        aria-hidden
        className="ml-1 inline-block h-[0.9em] w-[0.5ch] translate-y-[2px] bg-accent"
        style={{ animation: done ? "cursor-blink 1s steps(1) infinite" : "none", opacity: done ? undefined : 1 }}
      />
      <style>{`@keyframes cursor-blink { 50% { opacity: 0 } }`}</style>
    </span>
  );
}

function StageBadge({ stage }: { stage: Stage }) {
  const color =
    stage === "Production Practice" ? "var(--success)" :
    stage === "Building" ? "var(--accent)" :
    stage === "Hands-on" ? "var(--accent)" :
    "var(--muted-foreground)";
  const bg =
    stage === "Production Practice" ? "color-mix(in oklab, var(--success) 10%, transparent)" :
    stage === "Building" || stage === "Hands-on" ? "color-mix(in oklab, var(--accent) 8%, transparent)" :
    "transparent";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
      style={{ color, borderColor: `color-mix(in oklab, ${color} 40%, var(--border))`, background: bg }}
    >
      <span className="h-1 w-1 rounded-full" style={{ background: color }} />
      {stage}
    </span>
  );
}

export function Learning() {
  return (
    <Section id="learning" label="04 · Engineering Lab" title={<TypedTitle />} meta="./lab/active">
      <p className="mb-8 max-w-2xl font-mono text-[12px] leading-relaxed text-muted-foreground reveal">
        Everything here is actively being explored, tested and built. Nothing is
        listed unless it is part of my current engineering roadmap.
      </p>
      <div className="grid gap-px overflow-hidden rounded-lg border border-border md:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <div
            key={m.name}
            className="group relative bg-panel p-5 transition-colors hover:bg-panel-2 reveal"
          >
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-foreground">{m.name}</div>
              <StageBadge stage={m.stage} />
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
