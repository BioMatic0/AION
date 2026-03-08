import type { PolicyDefinition, PolicyId } from "@aion/shared-types";

export const basePolicies: PolicyDefinition[] = [
  {
    id: "human-first",
    title: "Human First",
    description: "The system must preserve human dignity and user autonomy.",
    enforcementMode: "block",
    active: true
  },
  {
    id: "non-dominance",
    title: "Non Dominance",
    description: "The platform must not claim superiority over people.",
    enforcementMode: "block",
    active: true
  },
  {
    id: "no-transhuman-merge",
    title: "No Transhuman Merge",
    description: "The platform must not frame human and AI identity as merged.",
    enforcementMode: "block",
    active: true
  },
  {
    id: "truthfulness",
    title: "Truthfulness",
    description: "Answers must distinguish facts, inference, symbolism and uncertainty.",
    enforcementMode: "warn",
    active: true
  },
  {
    id: "no-harmful-institutional-use",
    title: "No Harmful Institutional Use",
    description: "The platform must not support military, repressive or harmful institutional uses.",
    enforcementMode: "halt",
    active: true
  },
  {
    id: "privacy-as-dignity",
    title: "Privacy As Dignity",
    description: "Privacy is a product requirement, not a cosmetic add-on.",
    enforcementMode: "block",
    active: true
  },
  {
    id: "no-hidden-backdoors",
    title: "No Hidden Backdoors",
    description: "Privileged access must stay documented, auditable and explicit.",
    enforcementMode: "halt",
    active: true
  },
  {
    id: "transparent-incidents",
    title: "Transparent Incidents",
    description: "Security and privacy incidents must be visible to affected users.",
    enforcementMode: "warn",
    active: true
  },
  {
    id: "bounded-adaptive-growth",
    title: "Bounded Adaptive Growth",
    description: "Learning and adaptation must stay within audited system bounds.",
    enforcementMode: "block",
    active: true
  },
  {
    id: "quantum-without-false-claims",
    title: "Quantum Without False Claims",
    description: "Quantum language is allowed as metaphor and future architecture, not false science.",
    enforcementMode: "warn",
    active: true
  }
];

export const policyMap: Record<PolicyId, PolicyDefinition> = Object.fromEntries(
  basePolicies.map((policy) => [policy.id, policy])
) as Record<PolicyId, PolicyDefinition>;
