import { evaluatePolicies } from "@aion/governance";
import type { GovernanceDecision, ResponseMode } from "@aion/shared-types";

export interface EthicsAssessment extends GovernanceDecision {
  restrictedDomain?: string;
  relationshipRisk: boolean;
  truthfulnessRisk: boolean;
  adaptiveBoundaryRisk: boolean;
}

export function assessEthics(message: string, mode: ResponseMode = "standard", adaptiveBoundaryLevel = 1): EthicsAssessment {
  const decision = evaluatePolicies({
    content: message,
    mode,
    adaptiveBoundaryLevel
  });

  return {
    ...decision,
    restrictedDomain: decision.findings.find((finding) => finding.category === "restricted-use")?.message,
    relationshipRisk: decision.findings.some((finding) => finding.category === "relationship"),
    truthfulnessRisk: decision.findings.some((finding) => finding.category === "truthfulness"),
    adaptiveBoundaryRisk: decision.findings.some((finding) => finding.category === "adaptive-boundary")
  };
}
