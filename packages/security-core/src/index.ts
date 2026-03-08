export type SecuritySeverity = "info" | "warning" | "critical";

export interface SecurityEventShape {
  type: string;
  severity: SecuritySeverity;
  summary: string;
}

export const securityProfiles = [
  "standard",
  "elevated-privacy",
  "maximum-security",
  "local-focus",
  "minimal-retention"
] as const;
