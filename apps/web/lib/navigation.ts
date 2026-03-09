import type { NavigationItem } from "@aion/shared-types";

export type SectionGroup = "Core Workspace" | "Reflection and AI" | "Governance and Operations";

export interface SectionDefinition extends NavigationItem {
  group: SectionGroup;
  status: string;
  nextStep: string;
  pillars: string[];
  related: string[];
}

export const groupMeta: Record<SectionGroup, { title: string; description: string }> = {
  "Core Workspace": {
    title: "Core Workspace",
    description: "Capture, structure, and everyday productivity."
  },
  "Reflection and AI": {
    title: "Reflection and AI",
    description: "Analysis, mirror work, and development with clear boundaries."
  },
  "Governance and Operations": {
    title: "Governance and Operations",
    description: "Security, privacy, legal context, and system control."
  }
};

export const sections: SectionDefinition[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Central overview for signals, sessions, and next steps.",
    group: "Core Workspace",
    status: "Live in the current MVP",
    nextStep: "Aggregate live data from more modules and later from Prisma.",
    pillars: ["Daily focus", "System status", "Security posture"],
    related: ["/journal", "/goals", "/governance"]
  },
  {
    href: "/journal",
    label: "Journal",
    description: "Free-form entries, reflections, and context for later analysis.",
    group: "Core Workspace",
    status: "API-first CRUD workspace is active",
    nextStep: "Deepen tags, search filters, and later analysis links.",
    pillars: ["Entries", "Tags", "Linking"],
    related: ["/diary", "/notes", "/analysis"]
  },
  {
    href: "/diary",
    label: "Diary",
    description: "Guided daily reflection with automatic prompts.",
    group: "Core Workspace",
    status: "Prompts and daily summary scaffold are ready",
    nextStep: "Connect calendar logic and automatic reviews to the timeline.",
    pillars: ["Daily picture", "Prompts", "Reviews"],
    related: ["/journal", "/growth", "/goals"]
  },
  {
    href: "/notes",
    label: "Notes",
    description: "Quick notes, loose thoughts, and prepared conversion into goals.",
    group: "Core Workspace",
    status: "Capture, categories, and tags are active",
    nextStep: "Add pinning, actions, and conversion into goals or journal entries.",
    pillars: ["Quick capture", "Categories", "Search"],
    related: ["/journal", "/goals", "/analysis"]
  },
  {
    href: "/goals",
    label: "Goals",
    description: "Goals, milestones, progress, and reminders.",
    group: "Core Workspace",
    status: "Core MVP area with status model is active",
    nextStep: "Expand the milestone editor, achievement log, and reminder jobs.",
    pillars: ["Open", "Active", "Achieved"],
    related: ["/diary", "/growth", "/notifications"]
  },
  {
    href: "/analysis",
    label: "Analysis",
    description: "Multi-layer evaluation of entries and timeline context.",
    group: "Reflection and AI",
    status: "Analysis reports and memory search are active",
    nextStep: "Introduce persistent analysis history and connect later model providers.",
    pillars: ["Observation", "Psychodynamics", "Development"],
    related: ["/journal", "/mirror", "/quantum"]
  },
  {
    href: "/mirror",
    label: "Mirror",
    description: "Confrontational mode for counter-perspective and self-review.",
    group: "Reflection and AI",
    status: "Mirror reports with disconfirming views are active",
    nextStep: "Refine role-based intensity and later governance hooks.",
    pillars: ["Projection", "Alternative view", "Next step"],
    related: ["/analysis", "/growth", "/governance"]
  },
  {
    href: "/growth",
    label: "Growth",
    description: "Ongoing development, maturity, and interventions over time.",
    group: "Reflection and AI",
    status: "Growth state and interventions are active",
    nextStep: "Add more history points and goal/diary correlations.",
    pillars: ["State", "Momentum", "Growth edge"],
    related: ["/goals", "/analysis", "/diary"]
  },
  {
    href: "/quantum",
    label: "Quantum Lens",
    description: "Quantum-inspired thinking paths without pseudoscientific claims.",
    group: "Reflection and AI",
    status: "Quantum lens reports are active",
    nextStep: "Extend linking with analysis and memory context.",
    pillars: ["State space", "Coherence", "Possibility space"],
    related: ["/analysis", "/mirror", "/growth"]
  },
  {
    href: "/browser",
    label: "Research",
    description: "Research, deep search, and source comparison inside AION.",
    group: "Reflection and AI",
    status: "Structure is in place, access comes later",
    nextStep: "Build search adapters and source maps.",
    pillars: ["Research", "Deep search", "Source map"],
    related: ["/analysis", "/quantum", "/media"]
  },
  {
    href: "/media",
    label: "Media",
    description: "Library for text, images, audio, and generated content.",
    group: "Reflection and AI",
    status: "Asset registry is prepared",
    nextStep: "Secure the upload and preview path.",
    pillars: ["Assets", "Search", "Versioning"],
    related: ["/browser", "/voice", "/avatar"]
  },
  {
    href: "/developer",
    label: "Developer",
    description: "Project management, code help, and later sandbox execution.",
    group: "Governance and Operations",
    status: "Workspace planned",
    nextStep: "Create project and file models.",
    pillars: ["Projects", "Files", "Refactoring"],
    related: ["/governance", "/security", "/browser"]
  },
  {
    href: "/voice",
    label: "Voice",
    description: "Direct voice dialogue with session memory.",
    group: "Reflection and AI",
    status: "Provider interfaces will follow",
    nextStep: "Integrate STT/TTS providers and the session timeline.",
    pillars: ["STT", "TTS", "Voice sessions"],
    related: ["/diary", "/media", "/notifications"]
  },
  {
    href: "/notifications",
    label: "Notifications",
    description: "Growth prompts, goal reminders, and incident alerts.",
    group: "Governance and Operations",
    status: "Opt-in settings and history are active",
    nextStep: "Connect real background jobs and email delivery.",
    pillars: ["Prompts", "Reminders", "Security alerts"],
    related: ["/goals", "/growth", "/security"]
  },
  {
    href: "/feedback",
    label: "Feedback",
    description: "Requests, improvements, bugs, and security reports.",
    group: "Governance and Operations",
    status: "Product maintenance is prepared",
    nextStep: "Implement a feedback form and backlog integration.",
    pillars: ["Feature", "Bug", "Security"],
    related: ["/changelog", "/governance", "/security"]
  },
  {
    href: "/changelog",
    label: "Changelog",
    description: "Transparent change history for users and project stewards.",
    group: "Governance and Operations",
    status: "Read tracking comes next",
    nextStep: "Store versioned changelog entries and present them clearly.",
    pillars: ["Releases", "Improvements", "Security updates"],
    related: ["/feedback", "/governance", "/rechtliches"]
  },
  {
    href: "/avatar",
    label: "Avatar",
    description: "Personal avatar with protected image handling.",
    group: "Governance and Operations",
    status: "Profile area is prepared",
    nextStep: "Connect uploads and style profiles.",
    pillars: ["Upload", "Generator", "Consent"],
    related: ["/settings", "/media", "/impressum"]
  },
  {
    href: "/security",
    label: "Security",
    description: "Sessions, risks, devices, and the incident center.",
    group: "Governance and Operations",
    status: "Visible security status is active",
    nextStep: "Expand detail views for incidents and user warnings.",
    pillars: ["Sessions", "Events", "Incidents"],
    related: ["/privacy", "/governance", "/notifications"]
  },
  {
    href: "/governance",
    label: "Governance",
    description: "Charter, policies, integrity checks, and bounded system rules.",
    group: "Governance and Operations",
    status: "Governance center with policy transparency is active",
    nextStep: "Deepen policy versioning and admin review.",
    pillars: ["Charter", "Policies", "Integrity"],
    related: ["/privacy", "/security", "/ethik"]
  },
  {
    href: "/privacy",
    label: "Privacy",
    description: "Privacy ledger, storage rules, and user control.",
    group: "Governance and Operations",
    status: "Privacy workspace is visible",
    nextStep: "Implement export and deletion flows.",
    pillars: ["Data categories", "Retention", "Consents"],
    related: ["/security", "/governance", "/settings"]
  },
  {
    href: "/ethik",
    label: "Ethics",
    description: "AION's core principles, risks, and safeguards.",
    group: "Governance and Operations",
    status: "Ethics and risk analysis is visible",
    nextStep: "Tie it to governance checks, release reviews, and product decisions.",
    pillars: ["Dignity", "Fairness", "Risk control"],
    related: ["/governance", "/privacy", "/rechtliches"]
  },
  {
    href: "/rechtliches",
    label: "Legal",
    description: "Ownership, license status, and free build access.",
    group: "Governance and Operations",
    status: "Ownership and license notices are visible",
    nextStep: "Add contributor agreements and external license review if needed.",
    pillars: ["Ownership", "License", "Build access"],
    related: ["/ethik", "/governance", "/impressum"]
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Profiles, agents, modes, security, and reminder settings.",
    group: "Governance and Operations",
    status: "Notification controls are integrated",
    nextStep: "Connect agent profiles and additional preferences.",
    pillars: ["Profile", "Agent", "Preferences"],
    related: ["/avatar", "/security", "/notifications"]
  }
];

export const sectionMap = Object.fromEntries(sections.map((section) => [section.href.slice(1), section]));
export const groupedSections = Object.fromEntries(
  Object.keys(groupMeta).map((group) => [group, sections.filter((section) => section.group === group)])
) as Record<SectionGroup, SectionDefinition[]>;
