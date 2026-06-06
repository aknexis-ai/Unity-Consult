"use client";

import {
  Search, Layers, PenTool, Code2, ShieldCheck, Rocket, Target, FileText,
  ClipboardCheck, Send, Users, Settings, TrendingUp, Megaphone, Scale,
  Palette, Compass, ListChecks, FileCheck, Building2, CircleDot,
  type LucideIcon,
} from "lucide-react";

import { Stagger, StaggerChild } from "@/components/motion/aurora-motion";

const COLORS = ["#2F9E44", "#48CAE4", "#FFD166", "#8E7BFF", "#FF7B67", "#262121", "#ffbab9", "#C8B6FF"];

// phase keyword → icon (first match wins)
const MAP: Array<[string, LucideIcon]> = [
  ["discover", Search], ["research", Search], ["audit", ClipboardCheck], ["analy", Search],
  ["strateg", Target], ["plan", Compass], ["keyword", Target], ["architect", Layers],
  ["design", PenTool], ["brand", Palette], ["wireframe", PenTool], ["content", FileText],
  ["develop", Code2], ["build", Code2], ["implement", Settings], ["setup", Settings],
  ["config", Settings], ["draft", FileText], ["qa", ShieldCheck], ["test", ShieldCheck],
  ["review", FileCheck], ["submission", Send], ["submit", Send], ["filing", FileText],
  ["registrat", Building2], ["approval", FileCheck], ["launch", Rocket], ["deploy", Rocket],
  ["rollout", Rocket], ["onboard", Users], ["report", TrendingUp], ["optimiz", TrendingUp],
  ["campaign", Megaphone], ["compliance", Scale], ["delivery", ListChecks],
];

function iconFor(phase: string): LucideIcon {
  const k = phase.toLowerCase();
  for (const [key, icon] of MAP) if (k.includes(key)) return icon;
  return CircleDot;
}

export function ServiceWorkflow({ steps }: { steps: string[] }) {
  return (
    <Stagger className="au-flow" gap={0.09}>
      {steps.map((step, i) => {
        const Icon = iconFor(step);
        return (
          <StaggerChild
            key={step}
            className="au-step"
            style={{ ["--c" as string]: COLORS[i % COLORS.length], ["--d" as string]: `${i * 0.4}s` } as React.CSSProperties}
          >
            <span className="au-step__n" data-label={step} aria-label={step} role="img">
              <Icon size={24} strokeWidth={2} />
              <span className="au-step__badge">{i + 1}</span>
            </span>
          </StaggerChild>
        );
      })}
    </Stagger>
  );
}
