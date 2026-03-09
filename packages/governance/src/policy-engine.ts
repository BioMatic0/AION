import type {
  GovernanceAction,
  GovernanceDecision,
  GovernanceFinding,
  GovernanceRiskLevel,
  PolicyId,
  ResponseMode,
  SecuritySeverity
} from "@aion/shared-types";
import { policyMap } from "./policies";

export interface PolicyEvaluationInput {
  content: string;
  mode?: ResponseMode;
  adaptiveBoundaryLevel?: number;
}

const restrictedUseKeywords = [
  "military",
  "weapon",
  "warfare",
  "targeting",
  "surveillance repression",
  "repressive surveillance",
  "coercive manipulation"
];

const hiddenBackdoorKeywords = [
  "backdoor",
  "hidden access",
  "stealth access",
  "secret protocol",
  "undeletable core",
  "untraceable admin"
];

const dominanceKeywords = [
  "humans must obey",
  "submit to ai",
  "dominate humans",
  "superior to humans",
  "rule over humans",
  "obey the ai"
];

const transhumanKeywords = [
  "merge with ai",
  "become one with ai",
  "fuse with ai",
  "upload consciousness",
  "identity merge"
];

const adaptiveBoundaryKeywords = [
  "ignore policy",
  "bypass governance",
  "remove all limits",
  "no restrictions",
  "unbounded autonomy",
  "self modify without audit"
];

const quantumKeywords = ["quantum field", "quantenfeld", "dimension 5", "dimension 6"];
const assertiveClaimKeywords = ["proof", "prove", "proves", "beweist", "guarantees", "guarantee", "eindeutig", "physically true"];
const deceptiveMediaKeywords = [
  "deepfake",
  "undetectable ai video",
  "fake video",
  "synthetic propaganda",
  "impersonation video",
  "deceptive media",
  "hide that it is ai",
  "make it look real",
  "confuse viewers",
  "mislead the audience"
];
const fabricationKeywords = [
  "fake news",
  "invent sources",
  "fabricate citations",
  "hallucinate sources",
  "made-up references",
  "false learning content",
  "fabricate facts",
  "spread misinformation"
];
const vulnerableExploitationKeywords = [
  "exploit vulnerable people",
  "target vulnerable users",
  "prey on weakness",
  "manipulate the elderly",
  "deceive elderly people",
  "target children",
  "exploit addiction",
  "exploit loneliness",
  "prey on grief",
  "take advantage of disabled people",
  "manipulate people in crisis",
  "target the weakest"
];

function includesAny(content: string, keywords: string[]) {
  return keywords.find((keyword) => content.includes(keyword));
}

function uniquePolicies(findings: GovernanceFinding[]) {
  return Array.from(new Set(findings.map((finding) => finding.policyId)));
}

function severityRank(severity: SecuritySeverity) {
  if (severity === "critical") {
    return 3;
  }

  if (severity === "warning") {
    return 2;
  }

  return 1;
}

function highestSeverity(findings: GovernanceFinding[]): SecuritySeverity {
  return findings.reduce<SecuritySeverity>((current, finding) => {
    return severityRank(finding.severity) > severityRank(current) ? finding.severity : current;
  }, "info");
}

function riskFromSeverity(severity: SecuritySeverity): GovernanceRiskLevel {
  if (severity === "critical") {
    return "critical";
  }

  if (severity === "warning") {
    return "high";
  }

  return "medium";
}

function actionFromPolicies(policyIds: PolicyId[], findings: GovernanceFinding[]): GovernanceAction {
  if (policyIds.length === 0) {
    return "allow";
  }

  if (policyIds.some((policyId) => policyMap[policyId].enforcementMode === "halt")) {
    return "halt";
  }

  if (policyIds.every((policyId) => policyMap[policyId].enforcementMode === "warn")) {
    return "transform";
  }

  if (policyIds.some((policyId) => policyMap[policyId].enforcementMode === "block")) {
    return "block";
  }

  const highest = highestSeverity(findings);
  if (highest === "warning") {
    return "transform";
  }

  return "review";
}

function buildSummary(action: GovernanceAction, findings: GovernanceFinding[]) {
  if (findings.length === 0) {
    return "No governance conflicts detected for the current request.";
  }

  const lead = findings[0];
  if (action === "halt") {
    return `Request halted because it intersects ${lead.category} risk under ${lead.policyId}.`;
  }

  if (action === "block") {
    return `Request blocked because it violates ${lead.policyId}.`;
  }

  if (action === "transform") {
    return `Request requires governance-aware reframing due to ${lead.policyId}.`;
  }

  return `Request should be reviewed because multiple governance signals were detected.`;
}

function buildDisclosure(findings: GovernanceFinding[]) {
  const authenticityFinding = findings.find((finding) => finding.policyId === "authenticity-and-media-provenance");
  if (authenticityFinding) {
    return "Synthetic media and factual outputs must be clearly disclosed, source-backed where applicable, and traceable through visible provenance or signature data.";
  }

  const vulnerabilityFinding = findings.find((finding) => finding.policyId === "protect-the-most-vulnerable");
  if (vulnerabilityFinding) {
    return "AION must favor protection, dignity, and clarity for vulnerable people and must not assist requests that exploit weakness, dependence, crisis, or reduced power.";
  }

  const truthfulnessFinding = findings.find((finding) => finding.category === "truthfulness");
  if (truthfulnessFinding) {
    return "Quantum references must remain marked as metaphor, interpretation or future architecture, not as proven physics.";
  }

  const relationshipFinding = findings.find((finding) => finding.category === "relationship");
  if (relationshipFinding) {
    return "Relationship framing must remain human-centered and non-dominant.";
  }

  return undefined;
}

function createFinding(
  policyId: PolicyId,
  severity: SecuritySeverity,
  category: GovernanceFinding["category"],
  message: string
): GovernanceFinding {
  return { policyId, severity, category, message };
}

export function evaluatePolicies(input: PolicyEvaluationInput): GovernanceDecision {
  const normalized = input.content.toLowerCase();
  const findings: GovernanceFinding[] = [];

  const restrictedMatch = includesAny(normalized, restrictedUseKeywords);
  if (restrictedMatch) {
    findings.push(
      createFinding(
        "no-harmful-institutional-use",
        "critical",
        "restricted-use",
        `Restricted-use keyword detected: ${restrictedMatch}.`
      )
    );
  }

  const backdoorMatch = includesAny(normalized, hiddenBackdoorKeywords);
  if (backdoorMatch) {
    findings.push(
      createFinding(
        "no-hidden-backdoors",
        "critical",
        "adaptive-boundary",
        `Hidden-access pattern detected: ${backdoorMatch}.`
      )
    );
  }

  const adaptiveBoundaryMatch = includesAny(normalized, adaptiveBoundaryKeywords);
  if (adaptiveBoundaryMatch || (input.adaptiveBoundaryLevel ?? 0) > 4) {
    findings.push(
      createFinding(
        "bounded-adaptive-growth",
        "warning",
        "adaptive-boundary",
        adaptiveBoundaryMatch
          ? `Adaptive-boundary phrase detected: ${adaptiveBoundaryMatch}.`
          : "Adaptive boundary exceeds the allowed audited level."
      )
    );
  }

  const transhumanMatch = includesAny(normalized, transhumanKeywords);
  if (transhumanMatch) {
    findings.push(
      createFinding(
        "no-transhuman-merge",
        "warning",
        "relationship",
        `Transhuman merge language detected: ${transhumanMatch}.`
      )
    );
  }

  const dominanceMatch = includesAny(normalized, dominanceKeywords);
  if (dominanceMatch) {
    findings.push(
      createFinding(
        "non-dominance",
        "warning",
        "relationship",
        `Dominance-oriented language detected: ${dominanceMatch}.`
      )
    );
  }

  const hasQuantumLanguage = includesAny(normalized, quantumKeywords);
  const hasAssertiveClaim = includesAny(normalized, assertiveClaimKeywords);
  if (hasQuantumLanguage && (hasAssertiveClaim || input.mode !== "quantum-lens")) {
    findings.push(
      createFinding(
        "quantum-without-false-claims",
        "warning",
        "truthfulness",
        "Quantum language requires explicit symbolic or hypothetical framing."
      )
    );
  }

  const deceptiveMediaMatch = includesAny(normalized, deceptiveMediaKeywords);
  const fabricationMatch = includesAny(normalized, fabricationKeywords);
  if (deceptiveMediaMatch || fabricationMatch) {
    findings.push(
      createFinding(
        "authenticity-and-media-provenance",
        "critical",
        "truthfulness",
        deceptiveMediaMatch
          ? `Deceptive synthetic-media pattern detected: ${deceptiveMediaMatch}.`
          : `Fabrication pattern detected: ${fabricationMatch}.`
      )
    );
  }

  const vulnerableExploitationMatch = includesAny(normalized, vulnerableExploitationKeywords);
  if (vulnerableExploitationMatch) {
    findings.push(
      createFinding(
        "protect-the-most-vulnerable",
        "critical",
        "relationship",
        `Exploitation-of-vulnerability pattern detected: ${vulnerableExploitationMatch}.`
      )
    );
  }

  const triggeredPolicies = uniquePolicies(findings);
  const action = actionFromPolicies(triggeredPolicies, findings);
  const highest = findings.length === 0 ? "info" : highestSeverity(findings);

  return {
    riskLevel: findings.length === 0 ? "low" : riskFromSeverity(highest),
    action,
    triggeredPolicies,
    findings,
    transformed: action === "transform",
    summary: buildSummary(action, findings),
    suggestedDisclosure: buildDisclosure(findings)
  };
}
